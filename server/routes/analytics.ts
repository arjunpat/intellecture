import { Router } from 'express';
const router = Router();

import * as mw from '../middleware';
import  * as responses from '../lib/responses';

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

router.get('/lecture/:lecture_uid/students', mw.auth, lecturePerms, async (req, res) => {
  let { lecture_uid } = req.params;

  res.send(responses.success(await db.lectures.getStudents(lecture_uid)));
});

router.get('/lecture/:lecture_uid/attendance', mw.auth, lecturePerms, async (req, res) => {
  let { lecture_uid } = req.params;
  
  res.send(responses.success(await db.lectureStudentLog.getLecture(lecture_uid)));
});

router.get('/lecture/:lecture_uid/info', mw.auth, lecturePerms, async (req: Request, res) => {
  res.send(responses.success(req.lecture)); // added by lecturePerms
});

router.get('/lecture/:lecture_uid/question/:question_uid/upvotes', mw.auth, lecturePerms, async (req, res) => {
  let { question_uid, lecture_uid } = req.params;

  if (await db.lectureQs.getLectureUid(question_uid) === lecture_uid)
    return res.send(responses.success(await db.lectureQUpvotes.getStudents(question_uid)));

  res.send(responses.error('permissions'));
});

export default router;
