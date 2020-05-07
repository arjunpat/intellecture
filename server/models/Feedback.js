
class Accounts {
  constructor(mysql) {
    this.mysql = mysql;
  }

  create(account_uid, ts, stars) {
    return this.mysql.query(
      'INSERT INTO feedback (account_uid, ts, stars) VALUES (?, ?, ?)',
      [account_uid, ts, stars]
    );
  }

  update(account_uid, ts, stars, comments, tech_stars, diff_stars, helpful_stars) {
    return this.mysql.query(
      'UPDATE feedback SET stars = ?, comments = ?, tech_stars = ?, diff_stars = ?, helpful_stars = ? WHERE account_uid = ? AND ts = ?',
      [stars, comments, tech_stars, diff_stars, helpful_stars, account_uid, ts]
    );
  }
}

module.exports = Accounts;
