const redis = require('redis');
const sub = redis.createClient(process.env.REDIS_URL);

const { toTeacher, toLectureUid } = require('../helpers');

const lectures = {};
const Broadcaster = require('../Broadcaster');

function removeLecture(lecture_uid) {
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

sub.on('message', (channel, msg) => {
  let lecture_uid = toLectureUid(channel);
  lectures[lecture_uid].sendAll(msg);
  
  let data = JSON.parse(msg);
  if (data.type === 'end_lecture') {
    lectures[lecture_uid].end();
    removeLecture(lecture_uid);
  }
});

async function handleTeacher(lecture_uid, teacher_uid, socket) {
  // init socket
  socket.uid = teacher_uid;

  if (!lectures[lecture_uid]) {
    lectures[lecture_uid] = new Broadcaster(lecture_uid);
    sub.subscribe(toTeacher(lecture_uid));
  }
  lectures[lecture_uid].add(socket);
}

module.exports = handleTeacher;