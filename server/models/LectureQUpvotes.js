
class LectureQUpvotes {
  constructor(mysql) {
    this.mysql = mysql;
  }

  add(question_uid, account_uid, elapsed) {
    return this.mysql.insert('lecture_q_upvotes', {
      question_uid,
      account_uid,
      elapsed
    });
  }
}

module.exports = LectureQUpvotes;
