
class LectureUs {
  constructor(mysql) {
    this.mysql = mysql;
  }

  recordScoreChange(lecture_uid, elapsed, score) {
    return this.mysql.insert('lecture_us', {
      lecture_uid,
      elapsed,
      score
    });
  }
}

module.exports = LectureUs;