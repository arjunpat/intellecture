import { Router } from 'express';
const router = Router();

import * as mw from '../../middleware';
import  * as responses from '../../lib/responses';

import { getPresentnessAndUnderstandingScores } from './helpers';
import { Request } from '../../types';
import db from '../../models';

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

router.use(mw.auth);

/* GENERAL LECTURE ANALYTICS */
router.get('/lecture/:lecture_uid/students', lecturePerms, ended, async (req, res) => {
  let { lecture_uid } = req.params;
  res.send(responses.success(await db.lectures.getStudents(lecture_uid)));
});

router.get('/lecture/:lecture_uid/general', lecturePerms, ended, async (req: Request, res) => {
  let { lecture_uid } = req.params;
  const log = await db.lectureStudentLog.getLecture(lecture_uid);
  const scoreLog = await db.lectureLog.getLecture(lecture_uid);
  
  res.send(responses.success(
    getPresentnessAndUnderstandingScores(req.lecture, log, scoreLog)
  ));
});

router.get('/lecture/:lecture_uid/question-counts', lecturePerms, ended, async (req: Request, res) => {
  let { lecture_uid } = req.params;
  res.send(responses.success(await db.lectureQs.getQuestionCountsByLectureUid(lecture_uid)));
});

router.get('/lecture/:lecture_uid/upvote-counts', lecturePerms, ended, async (req: Request, res) => {
  let { lecture_uid } = req.params;
  res.send(responses.success(await db.lectureQUpvotes.getUpvoteCountsByLectureUid(lecture_uid)));
});

router.get('/lecture/:lecture_uid/info', lecturePerms, ended, async (req: Request, res) => {
  res.send(responses.success(req.lecture)); // added by lecturePerms
});

router.get('/lecture/:lecture_uid/questions', lecturePerms, ended, async (req: Request, res) => {
  let { lecture_uid } = req.params;
  res.send(responses.success(await db.lectureQs.getQuestionsByLectureUid(lecture_uid)));
});

/* STUDENT ANALYTICS */
router.get('/lecture/:lecture_uid/student/:account_uid/scores', lecturePerms, ended, async (req: Request, res) => {
  let { lecture_uid, account_uid } = req.params;
  let data = await db.lectureLog.getByStudent(lecture_uid, account_uid);
  res.send(responses.success({
    elapsed: data.map(d => d.elapsed),
    score: data.map(d => d.score)
  }));
});

router.get('/lecture/:lecture_uid/student/:account_uid/upvotes', lecturePerms, ended, async (req: Request, res) => {
  let { lecture_uid, account_uid } = req.params;
  res.send(responses.success(await db.lectureQUpvotes.getByStudent(lecture_uid, account_uid)));
});

router.get('/lecture/:lecture_uid/student/:account_uid/questions', lecturePerms, ended, async (req: Request, res) => {
  let { lecture_uid, account_uid } = req.params;
  let data = await db.lectureQs.getQuestionsUidByUser(lecture_uid, account_uid);
  res.send(responses.success(data.map(d => d.uid)));
});

/* QUESTION ANALYTICS */
router.get('/lecture/:lecture_uid/question/:question_uid/upvotes', lecturePerms, async (req, res) => {
  let { question_uid, lecture_uid } = req.params;

  if (await db.lectureQs.getLectureUid(question_uid) === lecture_uid)
    return res.send(responses.success(await db.lectureQUpvotes.getStudents(question_uid)));

  res.send(responses.error('permissions'));
});

export default router;
