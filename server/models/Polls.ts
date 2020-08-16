import MySQL from '../lib/MySQL';

export default class Polls {
  private mysql: MySQL;

  constructor(mysql: MySQL) {
    this.mysql = mysql;
  }

  create(uid: string, lecture_uid: string, elapsed: number, prompt: string, options: string[]) {
    return this.mysql.insert('polls', {
      uid,
      lecture_uid,
      elapsed,
      prompt,
      options: JSON.stringify(options)
    });
  }
}

