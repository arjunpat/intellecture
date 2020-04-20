const fs = require('fs');
const { MYSQL_USER, MYSQL_PASS, MYSQL_HOST, MYSQL_DB } = process.env;

const MySQL = require('../lib/MySQL');
const Lectures = require('./Lectures');
const Classes = require('./Classes');
const LectureLog = require('./LectureLog');
const Accounts = require('./Accounts');

const mysql = new MySQL(
  MYSQL_USER,
  MYSQL_PASS,
  MYSQL_DB,
  MYSQL_HOST
);
mysql.init(fs.readFileSync(__dirname + '/../schema.sql').toString());

module.exports = {
  lectures: new Lectures(mysql),
  classes: new Classes(mysql),
  lectureLog: new LectureLog(mysql),
  accounts: new Accounts(mysql)
}