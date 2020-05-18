import db from '../../../models';
const pub = db.redis.conn;
import { genUnderstandingScore, toStudent, toTeacher } from '../helpers';
import { genId } from '../../../lib/helpers';
import extract from './extract';

const SCORE_UPDATE_MAX_INTERVAL = 1000;
const QUESTION_CAT_MAX_INTERVAL = 10000;

interface Question {
  uid: string,
  creator_uid: string,
  question: string
}

export default class Lecture {
  private lecture_uid: string;
  private questions: Question[] = [];
  private questionUpvotes: object = {};
  private scores: object = {};
  private lectureInfo: any;
  private timing: any;
  private ended: boolean = false;

  private timeoutScore: NodeJS.Timer | undefined;
  private timeoutQs: NodeJS.Timer | undefined;

  constructor(lecture_uid: string) {
    this.lecture_uid = lecture_uid;

    this.initTimings();
  }

  async readLectureInfo() {
    let data = await db.lectures.getLecture(this.lecture_uid);
    data.creator = await db.accounts.getBasicInfo(data.account_uid);
    return data;
  }

  async init() {
    await db.lectures.startLecture(this.lecture_uid, Date.now());
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
      case 'end': // end lecture
        this.end();
        break;
    }
  }

  async end() {
    await db.lectures.endLecture(this.lecture_uid, Date.now());
    this.blast({ type: 'end_lecture' });
    this.ended = true;
  }

  async upvoteQuestion(question_uid: string, suid: string) {
    if (typeof this.questionUpvotes[question_uid] !== 'number')
      return; // concerning??

    try {
      await db.lectureQUpvotes.add(question_uid, suid, this.elapsed());
      
      // db will error if already upvoted
      this.sendToTeachers({
        type: 'question_update',
        question_uid,
        upvotes: ++this.questionUpvotes[question_uid]
      });
    } catch (e) {}
  }

  async addQuestion(creator_uid: string, question: string) {
    let uid = genId(15);
    await db.lectureQs.add(
      uid,
      this.lecture_uid,
      this.elapsed(),
      creator_uid,
      question
    );
    this.questions.push({
      creator_uid,
      question,
      uid
    });
    this.questionUpvotes[uid] = 0;
    this.blast({
      type: 'new_question',
      question_uid: uid,
      creator_uid,
      question
    });
    this.updateTeachersQuestions();
  }

  async addStudent(student_uid) {
    this.sendToTeachers({
      type: 'student_join',
      ts: Date.now(),
      uid: student_uid,
      ...await db.accounts.getBasicInfo(student_uid)
    });
    this.scores[student_uid] = 5;
  }

  removeStudent(student_uid) {
    delete this.scores[student_uid];
    this.sendToTeachers({
      type: 'student_leave',
      ts: Date.now(),
      uid: student_uid
    });
    this.updateTeachers()
  }
  
  async updateStudentScore(student_uid: string, score: number) {
    await db.lectureLog.recordScoreChange(
      this.lecture_uid,
      this.elapsed(),
      student_uid,
      score
    );
    this.scores[student_uid] = score;
    this.updateTeachers();
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
    db.lectureUs.recordScoreChange(this.lecture_uid, this.elapsed(now), score);
    this.sendToTeachers({
      type: 'us_update',
      score
    });
    
    // recordkeeping / stats
    this.timing.lastTeacherUpdate = Date.now();
  }

  async updateTeachersQuestions() {
    // need at least 10 questions
    if (this.questions.length < 5 || this.timeoutQs) return;

    let now = Date.now();
    let lastUpdate = now - this.timing.lastQuesCategorization;
    if (lastUpdate < QUESTION_CAT_MAX_INTERVAL) {
      this.timeoutQs = setTimeout(() => {
        this.timeoutQs = undefined;
        this.updateTeachersQuestions()
      }, QUESTION_CAT_MAX_INTERVAL + 100 - lastUpdate);
      return;
    }

    let result = await extract(this.questions);
    this.sendToTeachers({
      type: 'ques_categor',
      categories: result.slice(0, 5)
    });

    this.timing.lastQuesCategorization = Date.now();
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

  blast(obj) {
    this.sendToStudents(obj);
    this.sendToTeachers(obj);
  }

  sendToTeachers(obj) {
    pub.publish(toTeacher(this.lecture_uid), JSON.stringify(obj));
  }

  sendToStudents(obj) {
    pub.publish(toStudent(this.lecture_uid), JSON.stringify(obj));
  }
}
