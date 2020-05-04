
class Accounts {
  constructor(mysql) {
    this.mysql = mysql;
  }

  createOrUpdate(uid, email, first_name, last_name, photo) {
    return this.mysql.query(
      'INSERT INTO accounts (uid, created_at, email, first_name, last_name, photo) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE email = ?, first_name = ?, last_name = ?, photo = ?',
      [uid, Date.now(), email, first_name, last_name, photo, email, first_name, last_name, photo]
    );
  }

  getBasicInfo(uid) {
    return this.mysql.query('SELECT email, first_name, last_name, photo FROM accounts WHERE uid = ?', [uid]).then(d => d[0]);
  }
}

module.exports = Accounts;
