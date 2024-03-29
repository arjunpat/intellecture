import MySQL from '../lib/MySQL';

export default class LectureUs {
  private mysql: MySQL;

  constructor(mysql: MySQL) {
    this.mysql = mysql;
  }

  recordScoreChange(lecture_uid: string, elapsed: number, score: number | null) {
    return this.mysql.insert('lecture_us', {
      lecture_uid,
      elapsed,
      score
    });
  }

  getByLectureUid(lecture_uid: string) {
    return this.mysql.query('SELECT elapsed, score FROM lecture_us WHERE lecture_uid = ?', [lecture_uid]);
  }
}