const redis = require('redis');
const pub = redis.createClient(process.env.REDIS_URL);
const sub = redis.createClient(process.env.REDIS_URL);

const db = require('../../models');

const lectures = {};
const StudentLectureManager = require('./StudentLectureManager');

function publish(lecture_uid, obj) {
  pub.publish(lecture_uid, JSON.stringify(obj));
}

function removeLecture(lecture_uid) {
  console.log('(s) removing lecture', lecture_uid);
  sub.unsubscribe(lecture_uid);
  delete lectures[lecture_uid];
}

setInterval(() => {
  for (let lecture_uid in lectures) {
    if (lectures[lecture_uid].done) {
      removeLecture(lecture_uid);
    } else {
      lectures[lecture_uid].prune();
    }
  }
}, 10000);

sub.on('message', (lecture_uid, message) => {
  let data = JSON.parse(message);
  
  switch (data.type) {
    case 'end':
      lectures[lecture_uid].end();
      removeLecture(lecture_uid);
      break;
  }
});

function isValidScore(value) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 10;
}

async function handleStudent(lecture_uid, student_uid, socket) {
  sub.subscribe(lecture_uid);

  socket.uid = student_uid;
  socket.onjson = data => {
    if (data.type === 'update_score' && isValidScore(data.score))
      publish(lecture_uid, {
        type: 'ssu', // student score update
        student_uid,
        score: data.score
      });
  }

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

  if (!lectures[lecture_uid])
    lectures[lecture_uid] = new StudentLectureManager(lecture_uid);
  lectures[lecture_uid].addStudent(socket);

  let { uid, start_time, class_name, lecture_name } = await db.lectures.getLecture(lecture_uid);
  socket.json({
    type: 'lecture_info',
    uid,
    start_time,
    class_name,
    lecture_name
  });
}

module.exports = handleStudent;
