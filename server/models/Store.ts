import MySQL from '../lib/MySQL';

export default class Store {
  private mysql: MySQL;

  constructor(mysql: MySQL) {
    this.mysql = mysql;
  }

  set(account_uid: string, key: string, value: string) {
    return this.mysql.query('INSERT INTO store (account_uid, store_key, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value=?', [account_uid, key, value, value]);
  }

  get(account_uid: string, key: string) {
    return this.mysql.query('SELECT value FROM store WHERE account_uid = ? AND store_key = ?', [account_uid, key]).then((d: any[]) => {
      if (d.length === 1) {
        return d[0].value;
      }
      return false;
    });
  }
}
