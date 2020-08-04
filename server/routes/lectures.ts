import { Router } from 'express';
const router = Router();

import * as mw from '../middleware';
import * as responses from '../lib/responses';
import { Request } from '../types';

import { SERVER_NAME } from '../lib/config'
import { genId, messageSlack } from '../lib/helpers';
import db from '../models';

import live from './live/';
router.use('/live', live);
router.use(mw.auth);

router.post('/create', async (req: Request, res) => {
  let { name, class_uid } = req.body;
  let resp = await db.classes.ownsClass(class_uid, req.uid);
  if (!resp) return res.send(responses.error());

  let lecture_uid = genId(20);
  await db.lectures.createLecture(
    lecture_uid,
    class_uid,
    name || 'Untitled Lecture'
  );

  if (SERVER_NAME === 'prod') {
    db.accounts.getBasicInfo(req.uid).then(user => {
      messageSlack(`${user.first_name} ${user.last_name} (${user.email}) created a lecture: ${name}`);
    })
  }

  res.send(
    responses.success({
      lecture_uid,
    })
  );
});

router.get('/by-class/:class_uid', async (req, res) => {
  res.send(
    responses.success(await db.lectures.getClassLectures(req.params.class_uid))
  );
});

router.get('/recent', async (req: Request, res) => {
  // gets up to four recent lectures from the past week; could return 0
  res.send(responses.success(await db.lectures.getRecentLectures(req.uid, 4)));
});

router.get('/exists/:join_code', async (req, res) => {
  let lecture_uid = await db.lectures.getLectureUidByJoinCode(
    req.params.join_code
  );

  if (lecture_uid) {
    return res.send(
      responses.success({
        exists: true,
        lecture_uid,
      })
    );
  }

  res.send(responses.success({ exists: false }));
});

export default router;
