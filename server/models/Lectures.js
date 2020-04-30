
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

  getLecture(lecture_uid) {

    return this.mysql.query(
      `SELECT
        a.uid,
        a.created_at,
        a.class_uid,
        a.name as lecture_name,
        a.start_time,
        a.end_time,
        b.owner_uid,
        b.name as class_name
      FROM
        (SELECT uid, created_at, class_uid, name, start_time, end_time FROM lectures WHERE uid = ?) a
      LEFT JOIN
        classes b
      ON
        a.class_uid = b.uid`,
      [lecture_uid]
    ).then(d => d.length === 1 && d[0]);
  }

  startLecture(lecture_uid, start_time) {
    return this.mysql.update('lectures', {
      start_time
    }, {
      uid: lecture_uid
    });
  }

  endLecture(lecture_uid, end_time) {
    return this.mysql.update('lectures', {
      end_time
    }, {
      uid: lecture_uid
    });
  }

  getClassLectures(class_uid) {
    return this.mysql.query('SELECT uid, created_at, name, start_time FROM lectures WHERE class_uid = ?', [ class_uid ]);
  }
}

module.exports = Lectures;