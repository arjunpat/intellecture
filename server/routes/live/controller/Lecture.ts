import db from '../../../models';
const { redis } = db;
import { genUnderstandingScore, toStudent, toTeacher } from '../helpers';
import { genId, genLectureJoinCode } from '../../../lib/helpers';
import extract from './extract';
import Questions from './Questions';
import { Question, Student , WS } from '../types';

const SCORE_UPDATE_MAX_INTERVAL = 1000;
const QUESTION_CAT_MAX_INTERVAL = 10000;

interface Last {
  q: {
    [key: string]: number
  }
}

export default class Lecture {
  private lecture_uid: string;
  private questions: Questions =  new Questions();
  private scores: { [key: string]: number } = {};
  private studentData: { [key: string]: Student } = {};
  private last: Last = { q: {} };
  private lectureInfo: any;
  private timing: any;
  public ended: boolean = false;

  private currentScore: number | null = null;

  private timeoutScore: NodeJS.Timer | undefined;
  private timeoutQs: NodeJS.Timer | undefined;

  constructor(lecture_uid: string) {
    this.lecture_uid = lecture_uid;

    this.initTimings();
  }

  async readLectureInfo() {
    let data = await db.lectures.getLecture(this.lecture_uid);
    if (data) data.creator = await db.accounts.getBasicInfo(data.account_uid);
    return data;
  }

  async init() {
    await db.lectures.startLecture(this.lecture_uid, Date.now(), genLectureJoinCode());
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
        this.addQuestion(data.student_uid, data.q);
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
      case 'end': // end lecture
        this.end();
        break;
    }
  }

  async end() {
    let now = Date.now();
    this.blast(<WS.EndLecture> { type: 'end_lecture' });
    this.ended = true;
    redis.endLecture(this.lecture_uid);
    
    let remainingStudents = Object.keys(this.scores);
    if (remainingStudents.length > 0)
      await db.lectureStudentLog.leaveBulk(this.lecture_uid, remainingStudents, this.elapsed(now));
    await db.lectures.endLecture(this.lecture_uid, now);
  }

  async upvoteQuestion(question_uid: string, student_uid: string) {
    if (this.questions.validUpvote(question_uid, student_uid)) {
      await db.lectureQUpvotes.add(question_uid, student_uid, this.elapsed());

      this.sendToTeachers(<WS.QuestionUpdate> {
        type: 'question_update',
        question_uid,
        upvotes: this.questions.upvote(question_uid, student_uid)
      });
    }
  }

  async addQuestion(creator_uid: string, question: string) {
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
      this.lecture_uid,
      elapsed,
      creator_uid,
      question
    );
    this.questions.add(q);
    this.blast(<WS.NewQuestion> {
      type: 'new_question',
      ...q
    });
    this.updateTeachersQuestions();
  }

  async addStudent(student_uid: string) {
    let elapsed = this.elapsed();
    await db.lectureStudentLog.join(this.lecture_uid, student_uid, elapsed);
    let stu: Student = {
      ...await db.accounts.getBasicInfo(student_uid),
      elapsed,
      uid: student_uid
    };
    this.sendToTeachers(<WS.StudentJoin> {
      type: 'student_join',
      ...stu
    });
    this.studentData[student_uid] = stu;
    this.updateStudentScore(student_uid, 5);
  }

  async removeStudent(student_uid: string) {
    let elapsed = this.elapsed();
    await db.lectureStudentLog.leave(this.lecture_uid, student_uid, elapsed);
    delete this.scores[student_uid];
    this.sendToTeachers(<WS.StudentLeave> {
      type: 'student_leave',
      uid: student_uid
    });
    this.updateTeachers()
  }
  
  async updateStudentScore(student_uid: string, score: number) {
    if (this.scores[student_uid] === score) return;

    await db.lectureLog.recordScoreChange(
      this.lecture_uid,
      this.elapsed(),
      student_uid,
      score
    );
    this.scores[student_uid] = score;
    this.updateTeachers();
  }

  kickStudent(student_uid: string, banned: boolean) {
    if (banned) redis.ban(this.lecture_uid, student_uid);
    this.sendToStudents(<WS.KickStudent> {
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
      db.lectureUs.recordScoreChange(this.lecture_uid, this.elapsed(now), score);
    this.sendToTeachers(<WS.UsUpdate> {
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
    this.sendToTeachers(<WS.QuesCategor> {
      type: 'ques_categor',
      categories: result.slice(0, 5)
    });

    this.timing.lastQuesCategorization = Date.now();
  }

  async dismissQuestion(question_uid: string) {
    await db.lectureQs.dismissQuestion(this.lecture_uid, question_uid);
    this.questions.dismiss(question_uid);
    this.blast(<WS.QuestionDismissed> {
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
      messages.push(<WS.StudentJoin> {
        type: 'student_join',
        ...this.studentData[student_uid]
      });

      // not live, per say
      if (typeof this.scores[student_uid] !== 'number') {
        messages.push(<WS.StudentLeave> {
          type: 'student_leave',
          uid: student_uid
        });
      }
    }

    // send nondismissed questions
    for (let each of this.questions.getNondismissed()) {
      messages.push(<WS.NewQuestion> {
        type: 'new_question',
        ...each
      });

      // question upvotes
      messages.push(<WS.QuestionUpdate> {
        type: 'question_update',
        question_uid: each.question_uid,
        upvotes: this.questions.getUpvoteCount(each.question_uid)
      });
    }

    // TODO above code can be optimized
    // waiting for feature set to be solidified
    // before optimizing
    if (messages.length !== 0)
      this.sendToTeachers(<WS.Bulk> {
        type: 'bulk',
        messages
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
    redis.conn.publish(toTeacher(this.lecture_uid), JSON.stringify(obj));
  }

  sendToStudents(obj: WS.Message) {
    redis.conn.publish(toStudent(this.lecture_uid), JSON.stringify(obj));
  }

  getSummary(): object {
    return {
      lectureInfo: this.lectureInfo,
      question_count: this.questions.count(),
      student_count: Object.keys(this.scores).length,
      ended: this.ended
    }
  }
}
