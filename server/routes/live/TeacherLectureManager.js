function getUS(arr) {
  let sum = 0;
  for (let each of arr) sum += each;
  return (sum / arr.length) * 10;
}

const db = require('../../models');

class TeacherLectureManager {
  constructor(lecture_uid) {
    this.scores = {};
    this.lecture_uid = lecture_uid;
    this.teachers = [];
    this.init();
  }
  
  async init() {
    this.lectureInfo = await db.lectures.getLecture(this.lecture_uid);

    let { uid, start_time, class_name, lecture_name } = this.lectureInfo;
    /* this.sendToTeachers({
      uid,
      start_time,
      class_name,
      lecture_name
    }); */
    this.sendToTeachers(this.lectureInfo);
  }

  addTeacher(socket) {
    socket.on('pong', () => socket.isAlive = true);
    socket.isAlive = true;
    this.teachers.push(socket);
  }

  async addStudent(student_uid) {
    this.sendToTeachers({
      type: 'student_join',
      uid: student_uid,
      ...await db.accounts.basicInfo(student_uid)
    });
    this.scores[student_uid] = 5;
  }

  removeStudent(student_uid) {
    delete this.scores[student_uid];
    this.updateTeachers()
  }

  async updateStudentScore(student_uid, score) {
    this.scores[student_uid] = score;
    await db.lectureLog.recordScoreChange(
      this.lecture_uid,
      Date.now() - this.lectureInfo.start_time,
      student_uid,
      score
    );
    this.updateTeachers();
  }

  updateTeachers() {
    this.sendToTeachers({
      type: 'us_update',
      value: getUS(Object.values(this.scores))
    });
  }

  sendToTeachers(obj) {
    this.forEach(socket => {
      if (socket.readyState === 1) {
        socket.json(obj);
      }
    });
  }

  forEach(func) {
    for (let i = 0; i < this.teachers.length; i++) {
      func(this.teachers[i]);
    }
  }

  prune() {
    for (let i = 0; i < this.teachers.length; i++) {
      let socket = this.teachers[i];
      if (socket.readyState === 2 || socket.readyState === 3 || !socket.isAlive) {
        console.log('removing', socket.uid);
        socket.terminate();
        this.teachers.splice(i, 1);
        i--;
      } else {
        socket.isAlive = false;
        socket.ping(() => { });
      }
    }
  }
}

module.exports = TeacherLectureManager;