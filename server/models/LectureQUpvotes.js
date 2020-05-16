
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

  // analytics/aggregation
  getStudents(question_uid) {
    return this.mysql.query(
      `SELECT
        a.account_uid,
        b.email,
        b.first_name,
        b.last_name,
        b.photo
      FROM
        (SELECT account_uid, elapsed FROM lecture_q_upvotes WHERE question_uid = ?) a
      LEFT JOIN
        accounts b
      ON
        a.account_uid = b.uid`,
      [question_uid]
    );
  }
}

module.exports = LectureQUpvotes;
