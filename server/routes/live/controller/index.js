const redis = require('redis');
const Lecture = require('./Lecture');
const { toLectureUid, toController } = require('../helpers');

const sub = redis.createClient(process.env.REDIS_URL);
const pub = redis.createClient(process.env.REDIS_URL);

const lectures = {};

function removeLecture(lecture_uid) {
  console.log('(c) removing lecture', lecture_uid);
  sub.unsubscribe(toController(lecture_uid));
  delete lectures[lecture_uid];
}

setTimeout(() => {
  for (let lecture_uid in lectures)
    if (lectures[lecture_uid].ended)
      removeLecture(lecture_uid);
}, 10000);

sub.on('message', (channel, msg) => {
  let lecture_uid = toLectureUid(channel);
  let data = JSON.parse(msg);

  lectures[lecture_uid].dispatch(data);
});

async function initLecture(lecture_uid) {
  lectures[lecture_uid] = new Lecture(lecture_uid, pub);
  await lectures[lecture_uid].init();
  sub.subscribe(toController(lecture_uid));
}

module.exports = initLecture;