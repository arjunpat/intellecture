
class LectureLog {
  constructor(mysql) {
    this.mysql = mysql;
  }

  recordScoreChange(lecture_uid, elapsed, student_uid, score) {
    return this.mysql.insert('lecture_log', {
      lecture_uid,
      elapsed,
      account_uid: student_uid,
      score
    });
  }
}

module.exports = LectureLog;