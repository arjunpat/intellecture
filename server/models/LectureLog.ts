import MySQL from '../lib/MySQL';

export default class LectureLog {
  private mysql: MySQL;
  
  constructor(mysql: MySQL) {
    this.mysql = mysql;
  }

  recordScoreChange(lecture_uid: string, elapsed: number, student_uid: string, score: number) {
    return this.mysql.insert('lecture_log', {
      lecture_uid,
      elapsed,
      account_uid: student_uid,
      score
    });
  }

  getByStudent(lecture_uid: string, account_uid: string) {
    return this.mysql.query(
      'SELECT elapsed, score FROM lecture_log WHERE lecture_uid = ? AND account_uid = ?',
      [lecture_uid, account_uid]
    );
  }
}
