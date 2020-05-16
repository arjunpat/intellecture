const redis = require('redis');
const Lecture = require('./Lecture.js');
const { toLectureUid, toController } = require('../helpers');

const sub = redis.createClient(process.env.REDIS_URL);

const lectures = {};

const MAX_IDLE_MS = 10 * 60 * 1000; // 10 minutes

function removeLecture(lecture_uid) {
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

async function initLecture(lecture_uid) {
  let lecture = new Lecture(lecture_uid);
  await lecture.init();

  lectures[lecture_uid] = lecture;
  sub.subscribe(toController(lecture_uid));
}

module.exports = initLecture;
