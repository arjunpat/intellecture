import MySQL from '../lib/MySQL';

export default class Accounts {
  private mysql: MySQL;

  constructor(mysql: MySQL) {
    this.mysql = mysql;
  }

  create(account_uid: string, ts: number, stars: number) {
    return this.mysql.query(
      'INSERT INTO feedback (account_uid, ts, stars) VALUES (?, ?, ?)',
      [account_uid, ts, stars]
    );
  }

  update(account_uid: string, ts: number, stars: number | null, comments: string | null, tech_comments: string | null, diff_stars: number | null, helpful_stars: number | null) {
    return this.mysql.query(
      `UPDATE
        feedback
      SET
        stars = COALESCE(?, stars),
        comments = COALESCE(?, comments),
        tech_comments = COALESCE(?, tech_comments),
        diff_stars = COALESCE(?, diff_stars),
        helpful_stars = COALESCE(?, helpful_stars)
      WHERE
        account_uid = ? AND ts = ?`,
      [stars, comments, tech_comments, diff_stars, helpful_stars, account_uid, ts]
    );
  }
}

