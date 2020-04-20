
class Classes {
  constructor(mysql) {
    this.mysql = mysql;
  }

  ownsClass(class_uid, user_uid) {
    return this.mysql.query(
      'SELECT COUNT(*) FROM classes WHERE uid = ? AND owner_uid = ?',
      [class_uid, user_uid]
    ).then(d => d.length === 1);
  }

  createClass(class_uid, owner_uid, name) {
    return this.mysql.insert('classes', {
      uid: class_uid,
      created_at: Date.now(),
      owner_uid,
      name
    });
  }
}

module.exports = Classes;