import redis from 'redis';
import Lecture from './Lecture.js';
import { toLectureUid, toController } from '../helpers';
import { REDIS_URL } from '../../../lib/config';

const sub = redis.createClient(REDIS_URL);
const MAX_IDLE_MS = 10 * 60 * 1000; // 10 minutes
const lectures: { [key: string]: Lecture; } = {};

function removeLecture(lecture_uid: string) {
  console.log('(c) removing lecture', lecture_uid);
  sub.unsubscribe(toController(lecture_uid));
  delete lectures[lecture_uid];
}

setInterval(() => {
  const now = Date.now();

  for (let lecture_uid in lectures) {
    let lecture = lectures[lecture_uid];

    if (lecture.ended) {
      removeLecture(lecture_uid);
    } else if (lecture.idleTime(now) > MAX_IDLE_MS) {
      lecture.end();
    }
    
  }
}, 10000);

sub.on('message', (channel, msg) => {
  let lecture_uid = toLectureUid(channel);
  let data = JSON.parse(msg);

  lectures[lecture_uid].dispatch(data);
});

export async function initLecture(lecture_uid) {
  let lecture = new Lecture(lecture_uid);
  await lecture.init();

  lectures[lecture_uid] = lecture;
  sub.subscribe(toController(lecture_uid));
}

export function getActiveLectures() {
  let res: object[] = [];
  for (let each in lectures)
    res.push(lectures[each].getLectureInfo());
  return res;
}
