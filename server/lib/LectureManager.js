
function avg(arr) {
  let sum = 0;
  for (let each of arr) sum += each;
  return sum / arr.length;
}

class LectureManager {
  constructor(lecture_id, mysql, teacherWS) {
    this.lecture_id = lecture_id;
    this.mysql = mysql;
    this.teacherWS = teacherWS;

    this.students = {};
  }

  async studentChanged(student_uid, value) {
    this.students[student_uid] = value;

    await this.mysql.insert('lecture_log', {
      created_at: Date.now(),
      lecture_uid: this.lecture_uid,
      student_uid,
      value
    });

    this.updateTeacher();
  }

  updateTeacher() {
    this.teacherWS.send({
      type: 'us_update', // understanding score update
      value: avg(Object.values(this.students))
    });
  }
}

module.exports = LectureManager;
