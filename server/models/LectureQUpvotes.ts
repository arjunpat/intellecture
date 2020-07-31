import MySQL from '../lib/MySQL';

export default class LectureQUpvotes {
  private mysql: MySQL;

  constructor(mysql: MySQL) {
    this.mysql = mysql;
  }

  add(question_uid: string, account_uid: string, elapsed: number) {
    return this.mysql.insert('lecture_q_upvotes', {
      question_uid,
      account_uid,
      elapsed
    });
  }

  // analytics/aggregation
  getStudents(question_uid: string): object {
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

  getByStudent(lecture_uid: string, account_uid: string) {
    return this.mysql.query(
      'SELECT question_uid, elapsed FROM lecture_q_upvotes WHERE question_uid IN (SELECT uid FROM lecture_qs WHERE lecture_uid = ?) AND account_uid = ?',
      [lecture_uid, account_uid]
    );
  }

  getUpvoteCountsByLectureUid(lecture_uid: string) {
    return this.mysql.query(
      `SELECT
        account_uid,
        COUNT(question_uid)
      FROM lecture_q_upvotes
      WHERE
        question_uid IN (SELECT uid FROM lecture_qs WHERE lecture_uid = ?)
      GROUP BY account_uid`,
      [lecture_uid]
    ).then(res => {
      let data = {};
      for (let each of res)
        data[each.account_uid] = each['COUNT(question_uid)'];
      return data;
    });
  }
}
