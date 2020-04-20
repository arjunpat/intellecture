
class Lectures {
  constructor(mysql) {
    this.mysql = mysql;
  }

  createLecture(lecture_uid, class_uid, name) {
    return this.mysql.insert('lectures', {
      uid: lecture_uid,
      created_at: Date.now(),
      class_uid,
      name
    });
  }

  getOwner(lecture_uid) {
    return this.mysql.query(
      'SELECT owner_uid FROM classes WHERE uid in (SELECT class_uid FROM lectures WHERE uid = ?)',
      [lecture_uid]
    ).then(d => d[0] && d[0].owner_uid)
  }

  getLecture(lecture_uid) {
    return this.mysql.query(
      'SELECT uid, created_at, class_uid, name FROM lectures WHERE uid = ?', [lecture_uid]
    ).then(d => d[0]);
  }

  startLecture(lecture_uid, start_time) {
    return this.mysql.update('lectures', {
      start_time
    }, {
      uid: lecture_uid
    });
  }

  getUserLectures(class_uid) {
    return this.mysql.query('SELECT uid, created_at, name, start_time FROM lectures WHERE class_uid = ?', [ class_uid ]);
  }
}

module.exports = Lectures;