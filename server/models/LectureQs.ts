import MySQL from '../lib/MySQL';

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

  // specific methods
  getQuestions(lecture_uid: string) {
    return this.mysql.query(
      'SELECT uid, account_uid, elapsed, question FROM lecture_qs WHERE lecture_uid = ?',
      [lecture_uid]
    );
  }

  getQuestionsAfter(lecture_uid: string, elapsed: number) {
    return this.mysql.query(
      'SELECT uid, account_uid, elapsed, question FROM lecture_qs WHERE lecture_uid = ? AND elapsed > ?',
      [lecture_uid, elapsed]
    );
  }

  getLectureUid(question_uid: string) {
    return this.mysql.query(
      `SELECT lecture_uid FROM lecture_qs WHERE uid = ?`,
      [question_uid]
    );
  }
}
