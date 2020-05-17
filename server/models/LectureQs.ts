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
}
