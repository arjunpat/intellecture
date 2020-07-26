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

  createClass(class_uid: string, account_uid: string, name: string) {
    return this.mysql.insert('classes', {
      uid: class_uid,
      created_at: Date.now(),
      account_uid,
      name
    });
  }

  getUserClasses(account_uid: string): any {
    return this.mysql.query('SELECT uid, created_at, name FROM classes WHERE account_uid = ?', [account_uid]);
  }
}
