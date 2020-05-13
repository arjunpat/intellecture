const db = require('../../../models');
const { genUnderstandingScore, toStudent, toTeacher } = require('../helpers');

class Lecture {
  constructor(lecture_uid, pub) {
    this.lecture_uid = lecture_uid;
    this.pub = pub;

    this.questions = [];
    this.scores = {};

    this.last = Date.now();
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

    this.last = Date.now();
    
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
      Date.now() - this.lectureInfo.start_time,
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
      Date.now() - this.lectureInfo.start_time,
      student_uid,
      score
    );
    this.scores[student_uid] = score;
    this.updateTeachers();
  }

  updateTeachers() {
    this.sendToTeachers({
      type: 'us_update',
      score: genUnderstandingScore(Object.values(this.scores))
    });
  }

  sendToTeachers(obj) {
    this.pub.publish(toTeacher(this.lecture_uid), JSON.stringify(obj));
  }

  sendToStudents(obj) {
    this.pub.publish(toStudent(this.lecture_uid), JSON.stringify(obj));
  }
}

module.exports = Lecture;
