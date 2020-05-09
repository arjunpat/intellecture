
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

  startLecture(uid, start_time) {
    return this.mysql.update('lectures', {
      start_time
    }, {
      uid
    });
  }

  endLecture(uid, end_time) {
    return this.mysql.update('lectures', {
      end_time
    }, {
      uid
    });
  }

  endLecture(lecture_uid, end_time) {
    return this.mysql.update('lectures', {
      end_time
    }, {
      uid: lecture_uid
    });
  }


  // analytics/aggregation
  getClassLectures(class_uid) {
    return this.mysql.query('SELECT uid, name, start_time, end_time FROM lectures WHERE class_uid = ?', [ class_uid ]);
  }

  getStudents(lecture_uid) {
    return this.mysql.query(
      `SELECT
        a.account_uid,
        b.email,
        b.first_name,
        b.last_name,
        b.photo
      FROM
        (SELECT DISTINCT account_uid FROM lecture_log WHERE lecture_uid = ?) a
      LEFT JOIN
        accounts b
      ON
        a.account_uid = b.uid`,
      [lecture_uid]
    );
  }

  getFullLog(lecture_uid) {
    return this.mysql.query(
      'SELECT elapsed AS ts, account_uid AS uid, value AS val FROM lecture_log WHERE lecture_uid = ?',
      [lecture_uid]
    );
  }
}

module.exports = Lectures;
