import fs from 'fs';
import { MYSQL_USER, MYSQL_PASS, MYSQL_HOST, MYSQL_DB } from '../lib/config';

import MySQL from '../lib/MySQL';

import Classes from './Classes';
import Accounts from './Accounts';
import Feedback from './Feedback';
import Lectures from './Lectures';

import LectureLog from './LectureLog';
import LectureQs from './LectureQs';
import LectureUs from './LectureUs';
import LectureQUpvotes from './LectureQUpvotes';
import LectureStudentLog from './LectureStudentLog';
import Polls from './Polls';
import PollResponses from './PollResponses';

import Redis from '../lib/Redis';
const redis = new Redis();

const hitsCounter: {
  [key: string]: {
    totalMs: number,
    count: number
  }
} = {};

const mysql = new MySQL(MYSQL_USER, MYSQL_PASS, MYSQL_DB, MYSQL_HOST, hitsCounter);
mysql.init(fs.readFileSync(__dirname + '/../../schema.sql').toString());

export default {
  classes: new Classes(mysql),
  feedback: new Feedback(mysql),
  accounts: new Accounts(mysql),
  lectures: new Lectures(mysql, redis),
  lectureLog: new LectureLog(mysql),
  lectureQs: new LectureQs(mysql),
  lectureUs: new LectureUs(mysql),
  lectureQUpvotes: new LectureQUpvotes(mysql),
  lectureStudentLog: new LectureStudentLog(mysql),
  polls: new Polls(mysql),
  pollResponses: new PollResponses(mysql),
  redis,
  hitsCounter,
};
