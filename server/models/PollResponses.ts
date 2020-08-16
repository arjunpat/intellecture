import MySQL from '../lib/MySQL';

export default class PollResponses {
  private mysql: MySQL;

  constructor(mysql: MySQL) {
    this.mysql = mysql;
  }

  create(poll_uid: string, account_uid: string, choice: number, elapsed: number) {
    return this.mysql.insert('poll_responses', {
      poll_uid,
      account_uid,
      choice,
      elapsed
    });
  }
}

