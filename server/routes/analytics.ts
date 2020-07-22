import { Router } from 'express';
const router = Router();

import * as mw from '../middleware';
import  * as responses from '../lib/responses';

import { sum, diff } from '../lib/helpers';
import { Request } from '../types';
import db from '../models';

async function lecturePerms(req, res, next) {
  let { lecture_uid } = req.params;

  let lecture = await db.lectures.getLecture(lecture_uid);
  if (lecture && lecture.account_uid === req.uid) {
    req.lecture = lecture;
    return next();
  }
  return res.send(responses.error('permissions'));
}

function ended(req, res, next) {
  if (typeof req.lecture.end_time === 'number') {
    return next();
  }
  res.send(responses.error('lecture_not_ended'));
}

/* GENERAL LECTURE ANALYTICS */
router.get('/lecture/:lecture_uid/students', mw.auth, lecturePerms, ended, async (req, res) => {
  let { lecture_uid } = req.params;
  res.send(responses.success(await db.lectures.getStudents(lecture_uid)));
});

router.get('/lecture/:lecture_uid/present', mw.auth, lecturePerms, ended, async (req: Request, res) => {
  let { lecture_uid } = req.params;
  const lectureLength = req.lecture.end_time - req.lecture.start_time;
  const log = await db.lectureStudentLog.getLecture(lecture_uid);

  let time = {};
  for (let i = 0; i < log.length; i++) {
    let uid = log[i].account_uid;
    if (!time[uid]) time[uid] = [];
    
    time[uid].push(log[i].elapsed);
  }

  let result = {};
  for (let each in time) {
    if (time[each].length % 2 !== 0) {
      console.error(Date.now() + ': (1) present parse error for lecture_uid ' + lecture_uid);
      time[each].push(req.lecture.end_time)
    }

    result[each] = sum(diff(time[each]));

    if (result[each] > lectureLength)
      console.error(Date.now() + ': (2) present parse error for lecture_uid ' + lecture_uid);
  }
  
  res.send(responses.success(result));
});

router.get('/lecture/:lecture_uid/question-counts', mw.auth, lecturePerms, ended, async (req: Request, res) => {
  let { lecture_uid } = req.params;
  res.send(responses.success(await db.lectureQs.getQuestionCountsByLectureUid(lecture_uid)));
});

router.get('/lecture/:lecture_uid/info', mw.auth, lecturePerms, ended, async (req: Request, res) => {
  res.send(responses.success(req.lecture)); // added by lecturePerms
});

router.get('/lecture/:lecture_uid/questions', mw.auth, lecturePerms, ended, async (req: Request, res) => {
  let { lecture_uid } = req.params;
  res.send(responses.success(await db.lectureQs.getQuestionsByLectureUid(lecture_uid)));
});

/* STUDENT ANALYTICS */
router.get('/lecture/:lecture_uid/student/:account_uid/scores', mw.auth, lecturePerms, ended, async (req: Request, res) => {
  let { lecture_uid, account_uid } = req.params;
  let data = await db.lectureLog.getByStudent(lecture_uid, account_uid);
  res.send(responses.success({
    elapsed: data.map(d => d.elapsed),
    score: data.map(d => d.score)
  }));
});

router.get('/lecture/:lecture_uid/student/:account_uid/upvotes', mw.auth, lecturePerms, ended, async (req: Request, res) => {
  let { lecture_uid, account_uid } = req.params;
  res.send(responses.success(await db.lectureQUpvotes.getByStudent(lecture_uid, account_uid)));
});

router.get('/lecture/:lecture_uid/student/:account_uid/questions', mw.auth, lecturePerms, ended, async (req: Request, res) => {
  let { lecture_uid, account_uid } = req.params;
  let data = await db.lectureQs.getQuestionsUidByUser(lecture_uid, account_uid);
  res.send(responses.success(data.map(d => d.uid)));
});

/* QUESTION ANALYTICS */
router.get('/lecture/:lecture_uid/question/:question_uid/upvotes', mw.auth, lecturePerms, async (req, res) => {
  let { question_uid, lecture_uid } = req.params;

  if (await db.lectureQs.getLectureUid(question_uid) === lecture_uid)
    return res.send(responses.success(await db.lectureQUpvotes.getStudents(question_uid)));

  res.send(responses.error('permissions'));
});

export default router;
