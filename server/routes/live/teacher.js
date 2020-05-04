const redis = require('redis');
const pub = redis.createClient(process.env.REDIS_URL);
const sub = redis.createClient(process.env.REDIS_URL);

const db = require('../../models');

const lectures = {};
const TeacherLectureManager = require('./TeacherLectureManager');

function publish(lecture_uid, obj) {
  pub.publish(lecture_uid, JSON.stringify(obj));
}

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
    case 'ssu': // student score update
      lectures[lecture_uid].updateStudentScore(data.student_uid, data.score);
      break;
    case 'sj': // student join
      lectures[lecture_uid].addStudent(data.student_uid);
      break;
    case 'sl': // student leave
      lectures[lecture_uid].removeStudent(data.student_uid);
      break;
    case 'q': // question
      lectures[lecture_uid].addQuestion(data.student_uid, data.q);
      break;
    case 'end': // end lecture
      lectures[lecture_uid].end();
      removeLecture(lecture_uid);
      break;
  }
});

async function handleTeacher(lecture_uid, teacher_uid, socket) {
  // init socket
  socket.uid = teacher_uid;

  // (create and) add to TeacherLectureManager
  if (!lectures[lecture_uid])
    lectures[lecture_uid] = new TeacherLectureManager(lecture_uid);
  lectures[lecture_uid].addTeacher(socket);

  socket.onjson = async data => {
    if (data.type === 'end_lecture') {
      await db.lectures.endLecture(lecture_uid, Date.now());
      publish(lecture_uid, { type: 'end' });
    }
  }

  sub.subscribe(lecture_uid);
}

module.exports = handleTeacher;
