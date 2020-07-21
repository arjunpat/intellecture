import MySQL from '../lib/MySQL';

interface BasicAccountInfo {
  uid?: string,
  email: string,
  first_name: string,
  last_name: string,
  photo: string
}

export default class Accounts {
  private mysql: MySQL;

  constructor(mysql: MySQL) {
    this.mysql = mysql;
  }

  createOrUpdate(uid: string, email: string, first_name: string, last_name: string, photo: string) {
    return this.mysql.query(
      'INSERT INTO accounts (uid, created_at, email, first_name, last_name, photo) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE email = ?, first_name = ?, last_name = ?, photo = ?',
      [uid, Date.now(), email, first_name, last_name, photo, email, first_name, last_name, photo]
    );
  }

  getBasicInfo(uid: string): Promise<BasicAccountInfo> {
    return this.mysql.query('SELECT email, first_name, last_name, photo FROM accounts WHERE uid = ?', [uid]).then((d: BasicAccountInfo[]) => d[0]);
  }

  getUidByEmail(email: string) {
    return this.mysql.query('SELECT uid FROM accounts WHERE email = ?', [email]).then(d => d[0] && d[0].uid);
  }
}
