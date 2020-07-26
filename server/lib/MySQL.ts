import mysql from 'mysql';

export default class MySQL {
  // private conn: mysql.Connection;
  private conn: mysql.Pool;

  constructor(user: string, password: string, database: string, host: string) {
    let creds = { user, password, database, host };
    //this.conn = mysql.createConnection(creds);
    this.conn = mysql.createPool({
      connectionLimit: 10,
      user,
      password,
      database,
      host
    });
  }

  init(sql: string) {
    let split: string[] = sql.split(';').map(e => e.trim());

    for (let i = 0; i < split.length; i++) {
      if (!split[i])
        continue;

      this.query(split[i], []).then(val => {
        // console.log(val)
      }).catch(err => {
        console.log(err);
        process.exit(1);
      });
    }
  }

  query(sql: string, vals: any[]): Promise<any> {
    // let loggable = sql.replace(/\r?\n|\r|\t|\s+/g, ' ');
    return new Promise((resolve, reject) => {
      this.conn.query(sql, vals, (err, res: any) => {
        if (err)
          reject(err);

        resolve(res);
      });
    });
  }

  insert(table: string, obj: object) {
    let values: string[] = [];
    let questions = '';
    let keys = '';

    for (let key in obj) {
      keys += key + ', ';
      questions += '?, ';
      values.push(obj[key]);
    }

    keys = keys.substring(0, keys.length - 2);
    questions = questions.substring(0, questions.length - 2);

    return this.query(`INSERT INTO ${table} (${keys}) VALUES (${questions})`, values);
  }

  update(table: string, set: object, where: object) {
    let values: string[] = [];
    let setString = '';
    let whereString = '';

    for (let key in set) {
      setString += `${key} = ?, `;
      values.push(set[key]);
    }

    for (let key in where) {
      whereString += `${key} = ? AND`;
      values.push(where[key])
    }

    setString = setString.substring(0, setString.length - 2);
    whereString = whereString.substring(0, whereString.length - 4);

    return this.query(`UPDATE ${table} SET ${setString} WHERE ${whereString}`, values);
  }
}
