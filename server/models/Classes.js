
class Classes {
  constructor(mysql) {
    this.mysql = mysql;
  }

  ownsClass(class_uid, user_uid) {
    return this.mysql.query(
      'SELECT uid FROM classes WHERE uid = ? AND account_uid = ?',
      [class_uid, user_uid]
    ).then(d => d.length === 1);
  }

  createClass(class_uid, account_uid, name) {
    return this.mysql.insert('classes', {
      uid: class_uid,
      created_at: Date.now(),
      account_uid,
      name
    });
  }

  getUserClasses(account_uid) {
    return this.mysql.query('SELECT uid, created_at, name FROM classes WHERE account_uid = ?', [account_uid]);
  }
}

module.exports = Classes;