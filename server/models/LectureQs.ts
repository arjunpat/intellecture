import MySQL from '../lib/MySQL';
import LectureUs from './LectureUs';

export default class LectureQs {
  private mysql: MySQL;

  constructor(mysql: MySQL) {
    this.mysql = mysql;
  }

  add(uid: string, lecture_uid: string, elapsed: number, student_uid: string, question: string) {
    return this.mysql.insert('lecture_qs', {
      uid,
      lecture_uid,
      elapsed,
      account_uid: student_uid,
      question
    });
  }

  dismissQuestion(lecture_uid: string, question_uid: string) {
    return this.mysql.update('lecture_qs', {
      dismissed: true
    }, {
      lecture_uid,
      uid: question_uid
    });
  }

  // specific methods
  getQuestions(lecture_uid: string) {
    return this.mysql.query(
      'SELECT uid, account_uid, elapsed, question FROM lecture_qs WHERE lecture_uid = ?',
      [lecture_uid]
    );
  }

  getNondismissedQuestionsAfter(lecture_uid: string, elapsed: number) {
    return this.mysql.query(
      'SELECT uid, account_uid, elapsed, question FROM lecture_qs WHERE lecture_uid = ? AND elapsed > ? AND dismissed IS NOT TRUE',
      [lecture_uid, elapsed]
    );
  }

  getLectureUid(question_uid: string) {
    return this.mysql.query(
      `SELECT lecture_uid FROM lecture_qs WHERE uid = ?`,
      [question_uid]
    ).then(d => d && d[0].lecture_uid)
  }

  getQuestionsAndUpvotesByUser(lecture_uid: string, account_uid: string) {
    return this.mysql.query(
      `SELECT
        uid,
        elapsed,
        question,
        (SELECT COUNT(*) FROM lecture_q_upvotes WHERE question_uid = uid) as upvotes
      FROM
        lecture_qs
      WHERE lecture_uid = ? AND account_uid = ?
      ORDER BY elapsed DESC`,
      [lecture_uid, account_uid]
    );
  }

  getQuestionsUidByUser(lecture_uid: string, account_uid: string) {
    return this.mysql.query(
      'SELECT uid FROM lecture_qs WHERE lecture_uid = ? AND account_uid = ?',
      [lecture_uid, account_uid]
    );
  }

  getQuestionsByLectureUid(lecture_uid: string) {
    return this.mysql.query(
      `SELECT
        uid as question_uid,
        account_uid as creator_uid,
        elapsed,
        question,
        (SELECT COUNT(*) FROM lecture_q_upvotes WHERE question_uid = uid) as upvotes
      FROM
        lecture_qs
      WHERE lecture_uid = ?
      ORDER BY elapsed DESC`,
      [lecture_uid]
    );
  }

  getQuestionCountsByLectureUid(lecture_uid: string) {
    return this.mysql.query(
      'SELECT account_uid, COUNT(uid) FROM lecture_qs WHERE lecture_uid = ? GROUP BY account_uid',
      [lecture_uid]
    ).then(res => {
      let data = {};
      for (let each of res)
        data[each.account_uid] = each['COUNT(uid)'];
      return data;
    });
  }
}
