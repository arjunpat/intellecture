
class LectureQs {
  constructor(mysql) {
    this.mysql = mysql;
  }

  add(lecture_uid, elapsed, student_uid, question) {
    return this.mysql.insert('lecture_qs', {
      lecture_uid,
      elapsed,
      account_uid: student_uid,
      question
    });
  }
}

module.exports = LectureQs;