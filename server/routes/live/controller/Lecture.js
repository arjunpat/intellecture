const db = require('../../../models');
const { genUnderstandingScore, toStudent, toTeacher } = require('../helpers');

class Lecture {
  constructor(lecture_uid, pub) {
    this.lecture_uid = lecture_uid;
    this.pub = pub;

    this.questions = [];
    this.scores = {};

    this.initTimings();
  }

  async readLectureInfo() {
    let data = await db.lectures.getLecture(this.lecture_uid);
    data.creator = await db.accounts.getBasicInfo(data.owner_uid);
    return data;
  }

  async init() {
    await db.lectures.startLecture(this.lecture_uid, Date.now());
    this.lectureInfo = await this.readLectureInfo();
  }

  dispatch(data) {
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
      case 'end': // end lecture
        this.end();
        break;
    }
  }

  async end() {
    await db.lectures.endLecture(this.lecture_uid, Date.now());
    this.sendToTeachers({ type: 'end_lecture' });
    this.sendToStudents({ type: 'end_lecture' });
    this.ended = true;
  }

  async addQuestion(creator_uid, question) {
    await db.lectureQs.add(
      this.lecture_uid,
      this.elapsed(),
      creator_uid,
      question
    );
    this.questions.push({
      creator_uid,
      question
    });
    this.sendToTeachers({
      type: 'new_question',
      creator_uid,
      question
    });
  }

  async addStudent(student_uid) {
    this.sendToTeachers({
      type: 'student_join',
      uid: student_uid,
      ...await db.accounts.getBasicInfo(student_uid)
    });
    this.scores[student_uid] = 5;
  }

  removeStudent(student_uid) {
    delete this.scores[student_uid];
    this.sendToTeachers({
      type: 'student_leave',
      uid: student_uid
    });
    this.updateTeachers()
  }
  
  async updateStudentScore(student_uid, score) {
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
    if (typeof this.timeout === 'number') return;

    let now = Date.now();
    let lastUpdate = now - this.timing.lastTeacherUpdate;
    if (lastUpdate < 1000) {
      this.timeout = setTimeout(() => {
        this.timeout = undefined;
        this.updateTeachers()
      }, 1100 - lastUpdate);
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

  getScore() {
    return Math.round(genUnderstandingScore(Object.values(this.scores)));
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
      lastTeacherUpdate: now
    }
  }

  sendToTeachers(obj) {
    this.pub.publish(toTeacher(this.lecture_uid), JSON.stringify(obj));
  }

  sendToStudents(obj) {
    this.pub.publish(toStudent(this.lecture_uid), JSON.stringify(obj));
  }
}

module.exports = Lecture;
