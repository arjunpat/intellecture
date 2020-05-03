const redis = require('redis');
const pub = redis.createClient();
const sub = redis.createClient();

const lectures = {};
const TeacherLectureManager = require('./TeacherLectureManager');

function removeLecture(lecture_uid) {
  console.log('(t) removing lecture', lecture_uid);
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
    case 'ssu':
      lectures[lecture_uid].updateStudentScore(data.student_uid, data.score);
      break;
    case 'sj':
      lectures[lecture_uid].addStudent(data.student_uid);
      break;
    case 'sl':
      lectures[lecture_uid].removeStudent(data.student_uid);
      break;
    case 'end':
      lectures[lecture_uid].end();
      removeLecture(lecture_uid);
      break;
  }
});

function publish(lecture_uid, obj) {
  pub.publish(lecture_uid, JSON.stringify(obj));
}

async function handleTeacher(lecture_uid, teacher_uid, socket) {
  // init socket
  socket.uid = teacher_uid;

  // (create and) add to TeacherLectureManager
  if (!lectures[lecture_uid])
    lectures[lecture_uid] = new TeacherLectureManager(lecture_uid);
  lectures[lecture_uid].addTeacher(socket);

  socket.onjson = data => {
    if (data.type === 'end_lecture') {
      publish(lecture_uid, { type: 'end' });
    }
  }

  sub.subscribe(lecture_uid);
}

module.exports = handleTeacher;
