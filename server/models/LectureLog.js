
class LectureLog {
  constructor(mysql) {
    this.mysql = mysql;
  }

  recordScoreChange(lecture_uid, student_uid, value) {
    return this.mysql.insert('lecture_log', {
      created_at: Date.now(),
      lecture_uid,
      account_uid: student_uid,
      value
    });
  }
}

module.exports = LectureLog;