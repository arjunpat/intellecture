import db from '../../models';
import { Socket } from '../../types';

function old(socket: Socket): boolean {
  return socket.readyState === 2 || socket.readyState === 3 || !socket.isAlive;
}

interface Question {
  question_uid: string,
  creator_uid: string,
  question: string
}

class Broadcaster {
  private lecture_uid: string;
  private sockets: Socket[] = [];
  private questions: Question[] = [];
  private lectureInfo;

  constructor(lecture_uid: string) {
    this.lecture_uid = lecture_uid;
    this.init();
  }

  async init() {
    this.lectureInfo = await this.readLectureInfo();
    await this.readQuestions();
    this.sendAll(JSON.stringify(this.getLectureInfo()));
  }

  dispatch(msg: any): string | void {
    this.sendAll(msg);
  
    let data = JSON.parse(msg);
    switch (data.type) {
      case 'new_question':
        this.questions.push({
          question_uid: data.question_uid,
          creator_uid: data.creator_uid,
          question: data.question
        });
        break;
      case 'end_lecture':
        return 'end';
    }
  }

  getLectureInfo() {
    let { uid, start_time, class_name, lecture_name, creator } = this.lectureInfo;
    return {
      type: 'lecture_info',
      uid,
      start_time,
      class_name,
      lecture_name,
      creator,
      questions: this.questions
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

  async readLectureInfo() {
    let data = await db.lectures.getLecture(this.lecture_uid);
    data.creator = await db.accounts.getBasicInfo(data.account_uid);
    return data;
  }

  async readQuestions() {
    let qs = await db.lectureQs.getQuestions(this.lecture_uid);
    qs = qs.map(({ account_uid, uid, question }) => {
      return {
        creator_uid: account_uid,
        question_uid: uid,
        question
      }
    });

    this.questions = [...this.questions, ...qs]; // in case already has questions
  }

  isEmpty(): boolean {
    return this.sockets.length === 0;
  }

  end() {
    for (let s of this.sockets) s.close();
  }
}

export default Broadcaster;
