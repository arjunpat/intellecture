import MySQL from '../lib/MySQL';
import Redis from '../lib/Redis';

export default class Lectures {
  private mysql: MySQL;
  private redis: Redis;

  constructor(mysql: MySQL, redis: Redis) {
    this.mysql = mysql;
    this.redis = redis;
  }

  createLecture(lecture_uid: string, class_uid: string, name: string) {
    return this.mysql.insert('lectures', {
      uid: lecture_uid,
      created_at: Date.now(),
      class_uid,
      name
    });
  }

  async getLecture(lecture_uid: string) {
    let d: any = await this.redis.getLecture(lecture_uid);
    if (d) return d;

    d = await this.mysql.query(
      `SELECT
        a.uid,
        a.created_at,
        a.class_uid,
        a.name as lecture_name,
        a.start_time,
        a.end_time,
        b.account_uid,
        b.name as class_name
      FROM
        (SELECT uid, created_at, class_uid, name, start_time, end_time FROM lectures WHERE uid = ?) a
      LEFT JOIN
        classes b
      ON
        a.class_uid = b.uid`,
      [lecture_uid]
    );

    if (d.length === 1) {
      await this.redis.setLecture(lecture_uid, d[0]);
      return d[0];
    }
    return false;
  }

  async startLecture(lecture_uid: string, start_time: number) {
    await this.mysql.update('lectures', {
      start_time
    }, {
      uid: lecture_uid
    });
    await this.redis.delLecture(lecture_uid);
  }

  async endLecture(lecture_uid: string, end_time: number) {
    await this.mysql.update('lectures', {
      end_time
    }, {
      uid: lecture_uid
    });
    await this.redis.delLecture(lecture_uid);
  }

  // analytics/aggregation
  getClassLectures(class_uid: string) {
    return this.mysql.query('SELECT uid, name, start_time, end_time FROM lectures WHERE class_uid = ?', [ class_uid ]);
  }

  getStudents(lecture_uid: string): object {
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
}
