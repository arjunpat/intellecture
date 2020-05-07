const db = require('../../models');

class StudentLectureManager {
  constructor(lecture_uid) {
    this.lecture_uid = lecture_uid;
    this.sockets = [];
    this.init();
  }

  async init() {
    let lectureInfo = await db.lectures.getLecture(this.lecture_uid);
    lectureInfo.creator = await db.accounts.getBasicInfo(lectureInfo.owner_uid);
    this.lectureInfo = lectureInfo;
    this.sendToStudents(this.getLectureInfo());
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

  addStudent(socket) {
    socket.on('pong', () => socket.isAlive = true);
    socket.isAlive = true;
    this.sockets.push(socket);
    if (this.lectureInfo)
      socket.json(this.getLectureInfo());
  }

  sendToStudents(obj) {
    for (let s of this.sockets) {
      if (s.readyState === 1) {
        s.json(obj);
      }
    }
  }

  prune() {
    for (let i = 0; i < this.sockets.length; i++) {
      let socket = this.sockets[i];

      if (socket.readyState === 2 || socket.readyState === 3 || !socket.isAlive) {
        console.log('(s) removing', socket.uid);
        socket.terminate();
        this.sockets.splice(i, 1);
        i--;
      } else {
        socket.isAlive = false;
        socket.ping(() => {});
      }
    }

    this.done = this.sockets.length === 0;
  }

  end() {
    this.sendToStudents({
      type: 'end_lecture'
    });

    for (let s of this.sockets) s.close();
  }
}

module.exports = StudentLectureManager;
