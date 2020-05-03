const redis = require('redis');
const pub = redis.createClient();
const sub = redis.createClient();

const db = require('../../models');

const SocketsManager = require('./SocketsManager');
const socketsManager = new SocketsManager();

setInterval(() => {
  socketsManager.prune();
}, 10000);

// TODO figure out when to unsub from channel

function publish(lecture_uid, obj) {
  pub.publish(lecture_uid, JSON.stringify(obj));
}

sub.on('message', (lecture_uid, message) => {
  let data = JSON.parse(message);

  if (data.type === 'end') {
    socketsManager.forEach(lecture_uid, socket => {
      socket.json({
        type: 'end_lecture'
      });
      socket.close();
    });
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

  socketsManager.addSocket(lecture_uid, socket);

  publish(lecture_uid, {
    type: 'sj', // student join
    student_uid
  });

  let { uid, start_time, class_name, lecture_name} = await db.lectures.getLecture(lecture_uid);
  socket.json({
    type: 'lecture_info',
    uid,
    start_time,
    class_name,
    lecture_name
  });
}

module.exports = handleStudent;