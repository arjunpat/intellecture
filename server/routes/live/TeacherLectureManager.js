const db = require('../../models');
const { genUnderstandingScore } = require('../../lib/helpers');

class TeacherLectureManager {
  constructor(lecture_uid) {
    this.scores = {};
    this.lecture_uid = lecture_uid;
    this.teachers = [];
    this.questions = [];
    this.init();
  }
  
  async init() {
    let lectureInfo = await db.lectures.getLecture(this.lecture_uid);
    lectureInfo.creator = await db.accounts.getBasicInfo(lectureInfo.owner_uid);
    this.lectureInfo = lectureInfo;
    this.sendToTeachers(this.getLectureInfo());
  }

  addQuestion(creator_uid, question) {
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

  getLectureInfo() {
    let { uid, start_time, class_name, lecture_name, creator } = this.lectureInfo;
    return {
      type: 'lecture_info',
      uid,
      start_time,
      class_name,
      lecture_name,
      creator
    }
  }

  addTeacher(socket) {
    socket.on('pong', () => socket.isAlive = true);
    socket.isAlive = true;
    this.teachers.push(socket);
    if (this.lectureInfo)
      socket.json(this.getLectureInfo());
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
    this.scores[student_uid] = score;
    this.updateTeachers();
  }

  updateTeachers() {
    this.sendToTeachers({
      type: 'us_update',
      value: genUnderstandingScore(Object.values(this.scores))
    });
  }

  sendToTeachers(obj) {
    for (let s of this.teachers)
      if (s.readyState === 1)
        s.json(obj);
  }

  end() {
    this.sendToTeachers({ type: 'end_lecture' });
    for (let s of this.teachers) s.close();
  }

  prune() {
    for (let i = 0; i < this.teachers.length; i++) {
      let socket = this.teachers[i];
      if (socket.readyState === 2 || socket.readyState === 3 || !socket.isAlive) {
        console.log('(t) removing', socket.uid);
        socket.terminate();
        this.teachers.splice(i, 1);
        i--;
      } else {
        socket.isAlive = false;
        socket.ping(() => { });
      }
    }

    this.done = this.teachers.length === 0;
  }
}

module.exports = TeacherLectureManager;
