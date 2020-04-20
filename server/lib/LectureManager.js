
function avg(arr) {
  let sum = 0;
  for (let each of arr) sum += each;
  return sum / arr.length;
}

/*
student to server
{
  type: 'update_score'
  score: 9
}

teacher to sever 
{
  type: 'end_lecture'
}

server to student
{
  type: 'end_lecture'
}

server to teacher
{
  type: 'us_update',
  value: 6.23
}
{
  type: 'student_join',
  uid: 'JfdslFKjd82jSDF',
  email: 'asdfjlsadf@asdf.com',
  first_name: 'Arjun',
  last_name: 'Patrawala',
  photo: 'https://asdfajsdfasdfjaskdfjasldf.com/fasdfasd/dfasdfasdf'
}
{
  type: 'student_leave',
  uid: 'JfdslFKjd82jSDF'
}

server to all
{
  type: 'lecture_info,
  class_uid: "00H1h5QWWHtRThQ",
  created_at: 1587421189708,
  name: "Testing",
  uid: "rcusl"
}
*/

class LectureManager {
  constructor(lecture_uid, db, teacherSocket) {
    this.lecture_uid = lecture_uid;
    this.db = db;
    this.teacherSocket = teacherSocket;
    
    this.studentScores = {};
    this.studentSockets = {};

    teacherSocket.onjson = data => {
      if (data.type === 'end_lecture') this.end();
    }

    this.init();
  }

  async init() {
    this.startTime = Date.now();

    await this.db.lectures.startLecture(this.lecture_uid, this.startTime);

    this.lectureData = {
      type: 'lecture_info',
      ...await this.db.lectures.getLecture(this.lecture_uid)
    }
    this.teacherSocket.json(this.lectureData);
  }

  async addStudent(student_uid, socket) {
    // new takes priority
    if (this.studentSockets[student_uid]) {
      this.studentSockets[student_uid].terminate();
    }

    // init student
    this.studentSockets[student_uid] = socket;

    socket.onjson = data => {
      // TODO write code to prevent abuse
      if (data.type === 'update_score' && typeof data.score === 'number')
        this.changeStudentScore(student_uid, data.score);
    }

    socket.isAlive = true;
    socket.on('pong', () => socket.isAlive = true);
    socket.on('close', () => this.removeStudent(student_uid));

    // tell teacher that student has joined
    // TODO finish api
    this.teacherSocket.json({
      type: 'student_join',
      uid: student_uid,
      ...await this.db.accounts.basicInfo(student_uid)
    });

    socket.json(this.lectureData);

    this.changeStudentScore(student_uid, 5); // set default value to 5
  }

  removeStudent(student_uid) {
    delete this.studentScores[student_uid];
    delete this.studentSockets[student_uid];
    this.teacherSocket.json({
      type: 'student_leave',
      uid: student_uid
    });
    this.updateTeacher();

    console.log('removed user', student_uid);
  }
  
  async changeStudentScore(student_uid, value) {
    if (value < 1 || value > 10 || !Number.isInteger(value))
      return;

    this.studentScores[student_uid] = value;

    await this.db.lectureLog.recordScoreChange(this.lecture_uid, Date.now() - this.startTime, student_uid, value);
    this.updateTeacher();
  }

  updateTeacher() {
    this.teacherSocket.json({
      type: 'us_update', // understanding score update
      value: avg(Object.values(this.studentScores)) || 10
    });
  }

  broadcastToStudents(data) {
    this.forEachStudent(s => s.json(data));
  }

  cleanSockets() {
    this.forEachStudent((s, uid) => {

      if (!s.isAlive || (s.readyState !== 0 && s.readyState !== 1)) { // not OPENING or OPEN
        console.log('readyState', s.readyState);
        this.studentSockets[student_uid].terminate();
        return this.removeStudent(uid);
      }

      s.ping(() => {});
    });
  }

  end() {
    this.broadcastToStudents({ type: 'end_lecture' });
    this.db.lectures.endLecture(this.lecture_uid, Date.now());
    this.teacherSocket.close();
    this.forEachStudent(s => s.close());

    // close any lingering connections after 10 seconds
    setTimeout(() => {
      this.forEachStudent(s => s.terminate());
      this.teacherSocket.terminate();

      this.done = true;
    }, 10000);
  }

  forEachStudent(func) {
    for (let uid in this.studentSockets) {
      func(this.studentSockets[uid], uid);
    }
  }
}

module.exports = LectureManager;
