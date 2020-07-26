import MySQL from '../lib/MySQL';

export default class LectureStudentLog {
  private mysql: MySQL;

  constructor(mysql: MySQL) {
    this.mysql = mysql;
  }

  join(lecture_uid: string, account_uid: string, elapsed: number) {
    return this.add(lecture_uid, account_uid, elapsed, 'j');
  }

  leave(lecture_uid: string, account_uid: string, elapsed: number) {
    return this.add(lecture_uid, account_uid, elapsed, 'l');
  }

  leaveBulk(lecture_uid: string, account_uids: string[], elapsed: number) {
    return this.bulkAdd(lecture_uid, account_uids, elapsed, 'l');
  }

  getStudentStatus(lecture_uid: string, account_uid: string) {
    return this.mysql.query(
      'SELECT status FROM lecture_student_log WHERE lecture_uid = ? AND account_uid = ? ORDER BY elapsed DESC LIMIT 1',
      [lecture_uid, account_uid]
    ).then(d => d.length === 1 && d[0].status)
  }

  add(lecture_uid: string, account_uid: string, elapsed: number, status: string) {
    return this.mysql.insert('lecture_student_log', {
      lecture_uid,
      account_uid,
      elapsed,
      status
    });
  }

  getLecture(lecture_uid: string) {
    return this.mysql.query('SELECT account_uid, elapsed, status FROM lecture_student_log WHERE lecture_uid = ?', [lecture_uid]);
  }

  bulkAdd(lecture_uid: string, account_uids: string[], elapsed: number, status: string) {
    // https://stackoverflow.com/questions/8899802/how-do-i-do-a-bulk-insert-in-mysql-using-node-js
    return this.mysql.query(
      'INSERT INTO lecture_student_log (lecture_uid, account_uid, elapsed, status) VALUES ?',
      [ account_uids.map(e => [lecture_uid, e, elapsed, status]) ]
    );
  }
}
