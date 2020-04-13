
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
  name: 'Arjun Patrawala',
  photo: 'https://asdfajsdfasdfjaskdfjasldf.com/fasdfasd/dfasdfasdf'
}
{
  type: 'student_leave',
  uid: 'JfdslFKjd82jSDF'
}
*/

class LectureManager {
  constructor(lecture_uid, mysql, teacherSocket) {
    this.lecture_uid = lecture_uid;
    this.mysql = mysql;
    this.teacherSocket = teacherSocket;
    
    this.studentScores = {};
    this.studentSockets = {};

    teacherSocket.onjson = data => {
      if (data.type === 'end_lecture') this.end();
    }
  }

  addStudent(student_uid, socket) {
    
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
      uid: student_uid
    });

    this.changeStudentScore(student_uid, 10); // set default value to 10
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

    await this.mysql.insert('lecture_log', {
      created_at: Date.now(),
      lecture_uid: this.lecture_uid,
      student_uid,
      value
    });

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
        s.terminate();
        return this.removeStudent(uid);
      }

      s.ping(() => {});
    });
  }

  end() {
    this.broadcastToStudents({ type: 'end_lecture' });
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
