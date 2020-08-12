import mysql from 'mysql';

export default class MySQL {
  // private conn: mysql.Connection;
  private conn: mysql.Pool;
  private hitsCounter: object;

  constructor(user: string, password: string, database: string, host: string, hitsCounter: object) {
    //this.conn = mysql.createConnection(creds);
    this.conn = mysql.createPool({
      connectionLimit: 10,
      user,
      password,
      database,
      host
    });
    this.hitsCounter = hitsCounter;
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
    let loggable = sql.replace(/\r?\n|\r|\t|\s+/g, ' ').replace(/\r?\n|\r|\t|\s+/g, ' ');

    if (!this.hitsCounter[loggable]) {
      this.hitsCounter[loggable] = {
        count: 0,
        totalMs: 0
      };
    }

    this.hitsCounter[loggable].count++;
    return new Promise((resolve, reject) => {
      let start = process.hrtime();
      this.conn.query(sql, vals, (err, res: any) => {
        if (err)
          reject(err);
        
        let end = process.hrtime(start);
        this.hitsCounter[loggable].totalMs += end[1] / 1000000;
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
      whereString += `${key} = ? AND `;
      values.push(where[key])
    }

    setString = setString.substring(0, setString.length - 2);
    whereString = whereString.substring(0, whereString.length - 5);

    return this.query(`UPDATE ${table} SET ${setString} WHERE ${whereString}`, values);
  }
}
