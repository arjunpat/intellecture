
function avg(arr) {
  let sum = 0;
  for (let each of arr) sum += each;
  return sum / arr.length;
}

class LectureManager {
  constructor(lecture_id, mysql, teacher_uid) {
    this.lecture_id = lecture_id;
    this.mysql = mysql;
    this.teacher_uid = teacher_uid;

    this.studentScores = {};
    this.sockets = {};
  }

  addSocket(uid, socket) {
    this.sockets[uid] = socket;

    socket.on('message', data => {
      this.broadcast(data);
    })
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
    this.sockets[this.teacher_uid].send({
      type: 'us_update', // understanding score update
      value: avg(Object.values(this.studentScores))
    });
  }

  broadcast(data) {
    for (let each in this.sockets) {
      this.sockets[each].send(data);
    }
  }
}

module.exports = LectureManager;
