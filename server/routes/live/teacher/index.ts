import redis from 'redis';
import db from '../../../models';
import { REDIS_URL } from '../../../lib/config';

const pub = db.redis.conn;
const sub = redis.createClient(REDIS_URL);

import { toController, toTeacher, toLectureUid } from '../helpers';
import { Socket } from '../../../types';

import Broadcaster from '../Broadcaster';
const lectures: { [key: string]: Broadcaster; } = {};

function publish(lecture_uid: string, obj: object) {
  pub.publish(toController(lecture_uid), JSON.stringify(obj));
}

function removeLecture(lecture_uid: string) {
  console.log('(t) removing lecture', lecture_uid);
  sub.unsubscribe(toTeacher(lecture_uid));
  delete lectures[lecture_uid];
}

setInterval(() => {
  for (let lecture_uid in lectures) {
    if (lectures[lecture_uid].isEmpty()) {
      removeLecture(lecture_uid);
    } else {
      lectures[lecture_uid].prune();
    }
  }
}, 10000);

sub.on('message', (channel: string, msg: string) => {
  let lecture_uid = toLectureUid(channel);
  let res = lectures[lecture_uid].dispatch(msg);

  if (res === 'end') {
    lectures[lecture_uid].end();
    removeLecture(lecture_uid);
  }
});

export default async function handleTeacher(lecture_uid: string, teacher_uid: string, socket: Socket) {
  // init socket
  socket.uid = teacher_uid;

  if (!lectures[lecture_uid]) {
    lectures[lecture_uid] = new Broadcaster(lecture_uid);
    sub.subscribe(toTeacher(lecture_uid));
  }
  lectures[lecture_uid].add(socket);

  publish(lecture_uid, {
    type: 'tj' // teacher join
  });
}
