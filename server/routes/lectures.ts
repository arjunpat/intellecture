import { Router } from 'express';
const router = Router();

import * as mw from '../middleware';
import * as responses from '../lib/responses';
import { Request } from '../types';

import { genId } from '../lib/helpers';
import db from '../models';

import live from './live/';
router.use('/live', live);

router.post('/create', mw.auth, async (req: Request, res) => {
  let { name, class_uid } = req.body;
  let resp = await db.classes.ownsClass(class_uid, req.uid);

  if (!resp)
    return res.send(responses.error());
  
  let lecture_uid = genId(20);
  await db.lectures.createLecture(lecture_uid, class_uid, name || 'Untitled Lecture');

  res.send(responses.success({
    lecture_uid
  }));
});

router.get('/by-class/:class_uid', mw.auth, async (req, res) => {
  res.send(responses.success(await db.lectures.getClassLectures(req.params.class_uid)));
});

router.get('/recent', mw.auth, async (req: Request, res) => {
  // gets up to four recent lectures from the past week; could return 0
  res.send(responses.success(await db.lectures.getRecentLectures(req.uid, 4)));
});

router.get('/exists/:join_code', mw.auth, async (req, res) => {
  let lecture_uid = await db.lectures.getLectureUidByJoinCode(req.params.join_code);

  if (lecture_uid) {
    return res.send(responses.success({
      exists: true,
      lecture_uid
    }));
  }

  res.send(responses.success({ exists: false }));
});

export default router;
