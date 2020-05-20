import { Router } from 'express';
const router = Router();

import * as mw from '../middleware';
import * as responses from '../lib/responses';
import { Request } from '../types';

import { genLectureJoinCode } from '../lib/helpers';
import db from '../models';

import live from './live/';
router.use('/live', live);

router.post('/create', mw.auth, async (req: Request, res) => {
  let { name, class_uid } = req.body;

  let resp = await db.classes.ownsClass(class_uid, req.uid);

  if (!resp)
    return res.send(responses.error());
  
  let lecture_uid = genLectureJoinCode();
  await db.lectures.createLecture(lecture_uid, class_uid, name || 'Untitled Lecture');

  res.send(responses.success({
    lecture_uid
  }));
});

router.get('/get/:class_uid', mw.auth, async (req, res) => {
  res.send(responses.success(await db.lectures.getClassLectures(req.params.class_uid)));
});

router.get('/exists/:lecture_uid', mw.auth, async (req, res) => {
  let lecture = await db.lectures.getLecture(req.params.lecture_uid);

  res.send(responses.success({
    exists: lecture && typeof lecture.start_time === 'number' && typeof lecture.end_time !== 'number' 
  }));
});

export default router;
