const redis = require('redis');
const pub = redis.createClient(process.env.REDIS_URL);
const sub = redis.createClient(process.env.REDIS_URL);

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

async function handleStudent(lecture_uid, student_uid, socket) {
  sub.subscribe(lecture_uid);

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

  if (!lectures[lecture_uid])
    lectures[lecture_uid] = new StudentLectureManager(lecture_uid);
  lectures[lecture_uid].addStudent(socket);
}

module.exports = handleStudent;
