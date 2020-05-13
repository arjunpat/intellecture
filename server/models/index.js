const fs = require('fs');
const { MYSQL_USER, MYSQL_PASS, MYSQL_HOST, MYSQL_DB } = process.env;

const MySQL = require('../lib/MySQL');

const Lectures = require('./Lectures');
const Classes = require('./Classes');
const Accounts = require('./Accounts');
const Feedback = require('./Feedback');

const LectureLog = require('./LectureLog');
const LectureQs = require('./LectureQs');
const LectureUs = require('./LectureUs');

const Redis = require('../lib/Redis');
const redis = new Redis();

const mysql = new MySQL(
  MYSQL_USER,
  MYSQL_PASS,
  MYSQL_DB,
  MYSQL_HOST
);
mysql.init(fs.readFileSync(__dirname + '/../schema.sql').toString());

module.exports = {
  classes: new Classes(mysql),
  feedback: new Feedback(mysql),
  accounts: new Accounts(mysql),
  lectures: new Lectures(mysql, redis),
  lectureLog: new LectureLog(mysql),
  lectureQs: new LectureQs(mysql),
  lectureUs: new LectureUs(mysql),
  redis
}
