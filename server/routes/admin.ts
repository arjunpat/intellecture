import { Router } from 'express';
const router = Router();

import db from '../models';

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../lib/config";

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

router.get('/impersonate/:email', async (req, res) => {
  let uid = await db.accounts.getUidByEmail(req.params.email);
  if (!uid) return res.send(responses.error());

  let token = jwt.sign({
    iat: Date.now(),
    uid
  }, JWT_SECRET);

  res.cookie('intell_', token, {
    maxAge: (15 * 60 * 1000), // 15 min
    sameSite: 'none',
    secure: true,
  });
  
  res.send(responses.success());
});

export default router;
