
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

}

module.exports = Accounts;