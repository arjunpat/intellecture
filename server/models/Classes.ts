import MySQL from '../lib/MySQL';

export default class Classes {
  private mysql: MySQL;

  constructor(mysql: MySQL) {
    this.mysql = mysql;
  }

  ownsClass(class_uid: string, user_uid: string) {
    return this.mysql.query(
      'SELECT uid FROM classes WHERE uid = ? AND account_uid = ?',
      [class_uid, user_uid]
    ).then((d: any[]) => d.length === 1);
  }

  createClass(class_uid: string, account_uid: string, name: string, section: string) {
    return this.mysql.insert('classes', {
      uid: class_uid,
      created_at: Date.now(),
      account_uid,
      name,
      section
    });
  }

  getUserClasses(account_uid: string): any {
    return this.mysql.query(
      `SELECT
        a.uid,
        a.created_at,
        a.name,
        a.section,
        (SELECT COUNT(*) FROM lectures b WHERE b.class_uid = a.uid) as lecture_count
      FROM
        classes a
      WHERE account_uid = ?`,
      [account_uid]
    );
  }

  deleteClass(account_uid: string, class_uid: string) {
    return this.mysql.query('DELETE FROM classes WHERE account_uid = ? AND uid = ?', [account_uid, class_uid]);
  }

  rename(account_uid: string, class_uid: string, name: string, section) {
    return this.mysql.update('classes', {
      name,
      section
    }, {
      account_uid,
      uid: class_uid
    });
  }
}
