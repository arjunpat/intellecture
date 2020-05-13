const db = require('../../models');

class Broadcaster {
  constructor(lecture_uid) {
    this.lecture_uid = lecture_uid;
    this.sockets = [];
    this.init();
  }

  async readLectureInfo() {
    let data = await db.lectures.getLecture(this.lecture_uid);
    data.creator = await db.accounts.getBasicInfo(a.owner_uid);
    return data;
  }

  async init() {
    this.lectureInfo = await this.readLectureInfo();
    this.sendAll(this.getLectureInfo());
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

  add(socket) {
    socket.on('pong', () => socket.isAlive = true);
    socket.isAlive = true;
    this.sockets.push(socket);
    if (this.lectureInfo)
      socket.json(this.getLectureInfo());
  }

  sendAll(txt) {
    for (let s of this.sockets) {
      if (s.readyState === 1) {
        s.send(txt);
      }
    }
  }

  static old(socket) {
    return socket.readyState === 2 || socket.readyState === 3 || !socket.isAlive;
  }

  // this method is called (at max) every 10 seconds
  prune() {
    for (let i = 0; i < this.sockets.length; i++) {
      let socket = this.sockets[i];

      if (this.old(socket)) {
        console.log('(s) removing', socket.uid);
        socket.terminate();
        this.sockets.splice(i, 1);
        i--;
      } else {
        socket.isAlive = false;
        socket.ping(() => {});
      }
    }
  }

  isEmpty() {
    return this.sockets.length === 0;
  }

  end() {
    for (let s of this.sockets) s.close();
  }
}

module.exports = Broadcaster;
