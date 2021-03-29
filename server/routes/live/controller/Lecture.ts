import db from '../../../models';
import { genUnderstandingScore, toStudent, toTeacher } from '../helpers';
import { genId, genLectureJoinCode } from '../../../lib/helpers';
import extract from './extract';
import Questions from './Questions';
import Poll from './Poll';
import { Question, Student, WS } from '../types';

const SCORE_UPDATE_MAX_INTERVAL = 1000;
const QUESTION_CAT_MAX_INTERVAL = 10000;

interface Last {
  q: {
    [key: string]: number
  }
}

export default class Lecture {
  private uid: string;
  private questions: Questions = new Questions();
  private polls: Poll[] = [];
  private scores: { [key: string]: number } = {};
  private studentData: { [key: string]: Student } = {};
  private last: Last = { q: {} };
  private lectureInfo: any;
  private timing: any;
  public ended: boolean = false;

  private currentScore: number | null = null;

  private timeoutScore: NodeJS.Timer | undefined;
  private timeoutQs: NodeJS.Timer | undefined;

  private tsEnableIndividualScores: number = -99999;

  constructor(lecture_uid: string) {
    this.uid = lecture_uid;

    this.initTimings();
  }

  async readLectureInfo() {
    let data = await db.lectures.getLecture(this.uid);
    if (data) data.creator = await db.accounts.getBasicInfo(data.account_uid);
    return data;
  }

  async init() {
    await db.lectures.startLecture(this.uid, Date.now(), genLectureJoinCode());
    this.lectureInfo = await this.readLectureInfo();
  }

  dispatch(data: any) {
    if (this.ended)
      return;

    this.timing.lastMsg = Date.now();

    switch (data.type) {
      case 'ssu': // student score update
        this.updateStudentScore(data.student_uid, data.score);
        break;
      case 'sj': // student join
        this.addStudent(data.student_uid);
        break;
      case 'sl': // student leave
        this.removeStudent(data.student_uid);
        break;
      case 'q': // question
        this.createQuestion(data.student_uid, data.q);
        break;
      case 'qu': // question upvote
        this.upvoteQuestion(data.question_uid, data.student_uid);
        break;
      case 'bns': // ban student
        this.kickStudent(data.student_uid, data.banned);
        break;
      case 'qds': // question dismissed
        this.dismissQuestion(data.question_uid);
        break;
      case 'tj': // teacher join
        this.teacherJoined();
        break;
      case 'crp': // create poll
        this.createPoll(data.prompt, data.options);
        break;
      case 'pv': // poll vote
        this.voteOnPoll(data.poll_uid, data.student_uid, data.choice);
        break;
      case 'ep': // end poll
        this.endPoll(data.poll_uid);
        break;
      case 'act': // active
        // do nothing; just send a message
        break;
      case 'eis': // enable individual scores
        this.enableIndividualScores();
        break;
      case 'rst': // reset
        this.sendToStudents(<WS.ResetScores> { type: 'reset_scores' });
        break;
      case 'spr':
        this.sharePollResults(data.poll_uid);
        break;
      case 'end': // end lecture
        this.end();
        break;
    }
  }

  async end() {
    let now = Date.now();
    this.blast(<WS.EndLecture>{ type: 'end_lecture' });
    this.ended = true;
    db.redis.endLecture(this.uid);

    let remainingStudents = Object.keys(this.scores);
    if (remainingStudents.length > 0)
      await db.lectureStudentLog.leaveBulk(this.uid, remainingStudents, this.elapsed(now));
    await db.lectures.endLecture(this.uid, now);
  }

  async upvoteQuestion(question_uid: string, student_uid: string) {
    if (this.questions.validUpvote(question_uid, student_uid)) {
      await db.lectureQUpvotes.add(question_uid, student_uid, this.elapsed());

      this.sendToTeachers(<WS.QuestionUpdate>{
        type: 'question_update',
        question_uid,
        upvotes: this.questions.upvote(question_uid, student_uid)
      });
    }
  }

  async createPoll(prompt: string, options: string[]) {
    // check if poll is currently running
    if (this.polls.some(e => e.isRunning()))
      return;

    let uid = genId(20);
    let elapsed = this.elapsed();
    await db.polls.create(uid, this.uid, elapsed, prompt, options);
    this.polls.push(new Poll(uid, elapsed, prompt, options));

    this.blast(<WS.NewPoll>{
      type: 'new_poll',
      poll_uid: uid,
      prompt,
      options,
      elapsed
    });
  }

  async voteOnPoll(poll_uid: string, student_uid: string, choice: number) {
    let poll = this.polls.find(e => e.getUid() === poll_uid);
    if (poll && poll.vote(student_uid, choice)) {
      await db.pollResponses.create(poll_uid, student_uid, choice, this.elapsed());

      this.sendToTeachers(<WS.PollUpdate>{
        type: 'poll_update',
        poll_uid,
        counts: poll.getVoterSummary()
      });
    }
  }

  endPoll(poll_uid: string) {
    let poll = this.polls.find(e => e.getUid() === poll_uid);
    if (poll && poll.isRunning()) {
      poll.end();

      this.blast(<WS.EndPoll>{
        type: 'end_poll',
        poll_uid
      });
    }
  }

  sharePollResults(poll_uid: string) {
    let poll = this.polls.find(e => e.getUid() === poll_uid);
    if (poll && !poll.isRunning()) {
      this.sendToStudents(<WS.PollResult>{
        type: 'poll_result',
        poll_uid: poll.getUid(),
        prompt: poll.getPrompt(),
        options: poll.getOptions(),
        counts: poll.getVoterSummary()
      });
    }
  }

  async createQuestion(creator_uid: string, question: string) {
    let elapsed = this.elapsed();
    if (elapsed - this.last.q[creator_uid] < 10000) { // 10 second cooldown
      return;
    }
    this.last.q[creator_uid] = elapsed;
    let q: Question = {
      creator_uid,
      question,
      question_uid: genId(15),
      elapsed
    };

    await db.lectureQs.add(
      q.question_uid,
      this.uid,
      elapsed,
      creator_uid,
      question
    );
    this.questions.add(q);
    this.blast(<WS.NewQuestion>{
      type: 'new_question',
      ...q
    });
    this.updateTeachersQuestions();
  }

  async addStudent(student_uid: string) {
    let elapsed = this.elapsed();
    await db.lectureStudentLog.join(this.uid, student_uid, elapsed);
    let stu: Student = {
      ...await db.accounts.getBasicInfo(student_uid),
      elapsed,
      uid: student_uid
    };
    this.sendToTeachers(<WS.StudentJoin>{
      type: 'student_join',
      ...stu
    });
    this.studentData[student_uid] = stu;
    this.updateStudentScore(student_uid, 5);
  }

  async removeStudent(student_uid: string) {
    let elapsed = this.elapsed();
    await db.lectureStudentLog.leave(this.uid, student_uid, elapsed);
    delete this.scores[student_uid];
    this.sendToTeachers(<WS.StudentLeave>{
      type: 'student_leave',
      uid: student_uid
    });
    this.updateTeachers()
  }

  async updateStudentScore(student_uid: string, score: number) {
    if (this.scores[student_uid] === score) return;
    let elapsed = this.elapsed();
    await db.lectureLog.recordScoreChange(
      this.uid,
      elapsed,
      student_uid,
      score
    );
    this.scores[student_uid] = score;

    this.updateTeachers();
    if (this.tsEnableIndividualScores + 30000 > elapsed)
      this.sendToTeachers(<WS.IndivScores>{
        type: 'indiv_scores',
        scores: {
          [student_uid]: score
        }
      });
  }

  kickStudent(student_uid: string, banned: boolean) {
    if (banned) db.redis.ban(this.uid, student_uid);
    this.sendToStudents(<WS.KickStudent>{
      to: student_uid,
      type: 'kick_student'
    });
  }

  updateTeachers() {
    // wait before updating the teacher
    if (this.timeoutScore) return;

    let now = Date.now();
    let lastUpdate = now - this.timing.lastTeacherUpdate;
    if (lastUpdate < SCORE_UPDATE_MAX_INTERVAL) {
      this.timeoutScore = setTimeout(() => {
        this.timeoutScore = undefined;
        this.updateTeachers()
      }, SCORE_UPDATE_MAX_INTERVAL + 100 - lastUpdate);
      return;
    }

    let score = this.getScore();
    if (this.currentScore !== score)
      db.lectureUs.recordScoreChange(this.uid, this.elapsed(now), score);
    this.sendToTeachers(<WS.UsUpdate>{
      type: 'us_update',
      score
    });

    // recordkeeping / stats
    this.timing.lastTeacherUpdate = Date.now();
    this.currentScore = score;
  }

  async updateTeachersQuestions() {
    // need at least 5 questions
    let qs = this.questions.getNondismissed();
    if (qs.length < 5 || this.timeoutQs) return;

    let now = Date.now();
    let lastUpdate = now - this.timing.lastQuesCategorization;
    if (lastUpdate < QUESTION_CAT_MAX_INTERVAL) {
      this.timeoutQs = setTimeout(() => {
        this.timeoutQs = undefined;
        this.updateTeachersQuestions()
      }, QUESTION_CAT_MAX_INTERVAL + 100 - lastUpdate);
      return;
    }

    let result = await extract(qs);
    this.sendToTeachers(<WS.QuesCategor>{
      type: 'ques_categor',
      categories: result.slice(0, 5)
    });

    this.timing.lastQuesCategorization = Date.now();
  }

  async dismissQuestion(question_uid: string) {
    await db.lectureQs.dismissQuestion(this.uid, question_uid);
    this.questions.dismiss(question_uid);
    this.blast(<WS.QuestionDismissed>{
      type: 'question_dismissed',
      question_uid
    });
  }

  teacherJoined() {
    // understanding score and questions
    this.updateTeachers();
    this.updateTeachersQuestions();

    // generate update bulk message
    let messages: WS.Message[] = [];

    // send all students
    // must send ALL students so that
    // teacher page can relate to questions
    for (let student_uid in this.studentData) {
      messages.push(<WS.StudentJoin>{
        type: 'student_join',
        ...this.studentData[student_uid]
      });

      // not live, per say
      if (typeof this.scores[student_uid] !== 'number') {
        messages.push(<WS.StudentLeave>{
          type: 'student_leave',
          uid: student_uid
        });
      }
    }

    // send nondismissed questions
    for (let each of this.questions.getNondismissed()) {
      messages.push(<WS.NewQuestion>{
        type: 'new_question',
        ...each
      });

      // question upvotes
      messages.push(<WS.QuestionUpdate>{
        type: 'question_update',
        question_uid: each.question_uid,
        upvotes: this.questions.getUpvoteCount(each.question_uid)
      });
    }

    // send all polls
    for (let each of this.polls) {
      messages.push(<WS.NewPoll>{
        type: 'new_poll',
        poll_uid: each.getUid(),
        prompt: each.getPrompt(),
        options: each.getOptions(),
        elapsed: each.getElapsed()
      });

      messages.push(<WS.PollUpdate>{
        type: 'poll_update',
        poll_uid: each.getUid(),
        counts: each.getVoterSummary()
      });

      if (!each.isRunning()) {
        messages.push(<WS.EndPoll>{
          type: 'end_poll',
          poll_uid: each.getUid()
        })
      }
    }

    // TODO above code can be optimized
    // waiting for feature set to be solidified
    // before optimizing
    if (messages.length !== 0)
      this.sendToTeachers(<WS.Bulk>{
        type: 'bulk',
        messages
      });
  }

  enableIndividualScores() {
    this.tsEnableIndividualScores = this.elapsed();
    this.sendToTeachers(<WS.IndivScores>{
      type: 'indiv_scores',
      scores: this.scores
    });
  }

  getScore() {
    let score = Math.round(genUnderstandingScore(Object.values(this.scores)));
    return isNaN(score) ? null : score;
  }

  elapsed(now = Date.now()) {
    return now - this.lectureInfo.start_time;
  }

  idleTime(now = Date.now()) {
    return now - this.timing.lastMsg;
  }

  initTimings(now = Date.now()) {
    this.timing = {
      lastMsg: now,
      lastTeacherUpdate: now,
      lastQuesCategorization: now
    }
  }

  blast(obj: WS.Message) {
    this.sendToStudents(obj);
    this.sendToTeachers(obj);
  }

  sendToTeachers(obj: WS.Message) {
    db.redis.conn.publish(toTeacher(this.uid), JSON.stringify(obj));
  }

  sendToStudents(obj: WS.Message) {
    db.redis.conn.publish(toStudent(this.uid), JSON.stringify(obj));
  }

  getSummary(): object {
    return {
      lectureInfo: this.lectureInfo,
      question_count: this.questions.count(),
      student_count: Object.keys(this.scores).length,
      poll_count: this.polls.length,
      ended: this.ended
    }
  }

  getNumberOfActiveStudents() {
    return Object.keys(this.scores).length;
  }
}
