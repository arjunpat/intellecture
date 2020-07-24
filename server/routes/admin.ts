import { Router } from 'express';
const router = Router();

import db from '../models';

import * as mw from '../middleware';
import * as responses from '../lib/responses';
import { ADMIN_EMAILS } from '../lib/config';
import { Request } from '../types';

router.use(mw.auth);

router.use(async (req: Request, res, next) => {
  let user = await db.accounts.getBasicInfo(req.uid);
  if (ADMIN_EMAILS.includes(user.email)) {
    return next();
  }
  return res.send(responses.error('permissions'));
});

import { getActiveLectures } from './live/controller';
router.get('/active-lectures', (req, res) => {
  res.send(responses.success(getActiveLectures()));
});

export default router;