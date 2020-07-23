import db from '../../models';
import { Socket } from '../../types';

function old(socket: Socket): boolean {
  return socket.readyState === 2 || socket.readyState === 3 || !socket.isAlive;
}

class Broadcaster {
  private lecture_uid: string;
  private sockets: Socket[] = [];
  private lectureInfo;

  constructor(lecture_uid: string) {
    this.lecture_uid = lecture_uid;
    this.init();
  }

  async init() {
    this.lectureInfo = await this.readLectureInfo();
    this.sendAll(JSON.stringify(this.getLectureInfo()));
  }

  dispatch(msg: any): string | void {
    let data = JSON.parse(msg);

    if (data.to) {
      this.send(data.to, msg);
    } else {
      this.sendAll(msg);
      switch (data.type) {
        // ... more cases could be included
        case 'end_lecture':
          return 'end';
      }
    }
  }

  getLectureInfo() {
    let { uid, start_time, class_name, lecture_name, creator, join_code } = this.lectureInfo;
    return {
      type: 'lecture_info',
      uid,
      start_time,
      class_name,
      lecture_name,
      creator,
      join_code
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
      s.send(txt);
    }
  }

  send(account_uid: string, txt: string) {
    // O(n) rn, hashmap could impove to O(1)
    // but not worth the hassle/memory use bc so infrequent
    for (let s of this.sockets) {
      if (s.uid === account_uid) {
        s.send(txt);
        return; // only one
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

  async readLectureInfo() {
    let data = await db.lectures.getLecture(this.lecture_uid);
    data.creator = await db.accounts.getBasicInfo(data.account_uid);
    return data;
  }

  isEmpty(): boolean {
    return this.sockets.length === 0;
  }

  end() {
    for (let s of this.sockets) s.close();
  }
}

export default Broadcaster;
