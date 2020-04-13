
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
  constructor(lecture_id, mysql, teacherSocket) {
    this.lecture_id = lecture_id;
    this.mysql = mysql;
    this.teacherSocket = teacherSocket;
    
    this.studentScores = {};
    this.studentSockets = {};

    teacherSocket.onjson = data => {
      if (data.type === 'end_lecture')
        this.broadcastToStudents({ type: 'end_lecture' });
    }
  }

  addStudent(student_uid, socket) {
    this.studentSockets[student_uid] = socket;

    socket.onjson = data => {
      // TODO write code to prevent abuse
      if (data.type === 'update_score' && typeof data.score === 'number')
        this.changeStudentScore(uid, data.score);
    }
  }
  
  async changeStudentScore(student_uid, value) {
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
      value: avg(Object.values(this.studentScores))
    });
  }

  cleanSockets() {

  }

  broadcastToStudents(data) {
    for (let each in this.studentSockets) {
      this.studentSockets[each].json(data);
    }
  }
}

module.exports = LectureManager;
