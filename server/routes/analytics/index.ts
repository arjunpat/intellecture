import { Router } from 'express';
const router = Router();

import * as mw from '../../middleware';
import  * as responses from '../../lib/responses';

import { getStats, getIncorrect, genStudentIntervals } from './helpers';
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
    res.set('Cache-Control', 'max-age=3600'); // 1 hour
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

router.get('/lecture/:lecture_uid/stats', lecturePerms, ended, async (req: Request, res) => {
  let { lecture_uid } = req.params;
  const [ log, scoreLog, question_counts, upvote_counts ] = await Promise.all([
    db.lectureStudentLog.getLecture(lecture_uid),
    db.lectureLog.getLecture(lecture_uid),
    db.lectureQs.getQuestionCountsByLectureUid(lecture_uid),
    db.lectureQUpvotes.getUpvoteCountsByLectureUid(lecture_uid)
  ]);

  res.send(responses.success({
    ...getStats(req.lecture, log, scoreLog),
    question_counts,
    upvote_counts
  }));
});

router.get('/lecture/:lecture_uid/info', lecturePerms, ended, async (req: Request, res) => {
  res.send(responses.success(req.lecture)); // added by lecturePerms
});

router.get('/lecture/:lecture_uid/questions', lecturePerms, ended, async (req: Request, res) => {
  let { lecture_uid } = req.params;
  res.send(responses.success(await db.lectureQs.getQuestionsByLectureUid(lecture_uid)));
});

router.get('/lecture/:lecture_uid/scores', lecturePerms, ended, async (req: Request, res) => {
  let { lecture_uid } = req.params;
  let vals = await db.lectureUs.getByLectureUid(lecture_uid);
  res.send(responses.success({
    elapsed: vals.map(e => e.elapsed),
    score: vals.map(e => e.score)
  }));
});

/* STUDENT ANALYTICS */
router.get('/lecture/:lecture_uid/student/:account_uid/intervals', lecturePerms, ended, async (req: Request, res) => {
  let { lecture_uid, account_uid } = req.params;


  let log = await db.lectureStudentLog.getStudent(lecture_uid, account_uid);
  let scoreLog = await db.lectureLog.getByStudent(lecture_uid, account_uid);

  // add account_uid to make it a Status/Score
  log = log.map(e => { return { ...e, account_uid }; });
  scoreLog = scoreLog.map(e => { return { ...e, account_uid }; });
  let combined = [...log, ...scoreLog];
  combined.sort((a, b) => a.elapsed - b.elapsed);

  if (getIncorrect(combined).size !== 0) {
    console.error('(4) parse error for student', account_uid, 'in lecture', lecture_uid);
    return res.send(responses.error('data_error'));
  }

  res.send(responses.success(
    genStudentIntervals(combined)
  ));
});

router.get('/lecture/:lecture_uid/student/:account_uid/upvotes', lecturePerms, ended, async (req: Request, res) => {
  let { lecture_uid, account_uid } = req.params;
  res.send(responses.success(await db.lectureQUpvotes.getByStudent(lecture_uid, account_uid)));
});

/* QUESTION ANALYTICS */
router.get('/lecture/:lecture_uid/question/:question_uid/upvotes', lecturePerms, async (req, res) => {
  let { question_uid, lecture_uid } = req.params;

  if (await db.lectureQs.getLectureUid(question_uid) === lecture_uid)
    return res.send(responses.success(await db.lectureQUpvotes.getStudentUpvoters(question_uid)));

  res.send(responses.error('permissions'));
});

export default router;
