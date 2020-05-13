const redis = require('redis');
const pub = redis.createClient(process.env.REDIS_URL);
const sub = redis.createClient(process.env.REDIS_URL);

const { toController, toStudent, toLectureUid } = require('../helpers');

const lectures = {};
const Broadcaster = require('../Broadcaster');

function publish(lecture_uid, obj) {
  pub.publish(toController(lecture_uid), JSON.stringify(obj));
}

function removeLecture(lecture_uid) {
  console.log('(s) removing lecture', lecture_uid);
  sub.unsubscribe(toStudent(lecture_uid));
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

sub.on('message', (channel, msg) => {
  let lecture_uid = toLectureUid(channel);
  lectures[lecture_uid].sendAll(msg);
  
  let data = JSON.parse(msg);
  if (data.type === 'end_lecture') {
    lectures[lecture_uid].end();
    removeLecture(lecture_uid);
  }
});

async function handleStudent(lecture_uid, student_uid, socket) {
  socket.uid = student_uid;
  socket.on('close', () => {
    publish(lecture_uid, {
      type: 'sl', // student leave
      student_uid
    });
  });

  publish(lecture_uid, {
    type: 'sj', // student join
    student_uid
  });

  if (!lectures[lecture_uid]) {
    lectures[lecture_uid] = new Broadcaster(lecture_uid);
    sub.subscribe(toStudent(lecture_uid));
  }
  lectures[lecture_uid].add(socket);
}

module.exports = handleStudent;
