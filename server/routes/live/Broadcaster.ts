import db from '../../models';
import { Socket } from '../../types';

function old(socket: Socket): boolean {
  return socket.readyState === 2 || socket.readyState === 3 || !socket.isAlive;
}

class Broadcaster {
  private lecture_uid: string;
  private sockets: Socket[];
  private lectureInfo;

  constructor(lecture_uid) {
    this.lecture_uid = lecture_uid;
    this.sockets = [];
    this.init();
  }

  async readLectureInfo() {
    let data = await db.lectures.getLecture(this.lecture_uid);
    data.creator = await db.accounts.getBasicInfo(data.account_uid);
    return data;
  }

  async init() {
    this.lectureInfo = await this.readLectureInfo();
    this.sendAll(JSON.stringify(this.getLectureInfo()));
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

  add(socket: Socket) {
    socket.on('pong', () => socket.isAlive = true);
    socket.isAlive = true;
    this.sockets.push(socket);
    if (this.lectureInfo)
      socket.json(this.getLectureInfo());
  }

  sendAll(txt: string) {
    for (let s of this.sockets) {
      if (s.readyState === 1) {
        s.send(txt);
      }
    }
  }

  // this method is called (at max) every 10 seconds
  prune() {
    for (let i = 0; i < this.sockets.length; i++) {
      let socket = this.sockets[i];

      if (old(socket)) {
        console.log('removing listener', socket.uid);
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
