import { Router } from 'express';
const router = Router();

import * as responses from '../lib/responses';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../lib/config';

import db from '../models';
import * as mw from '../middleware';
import { validateGoogleAccessToken, genId } from '../lib/helpers';

import { Request } from '../types';
const { NODE_ENV } = process.env;

const cookieOpts: any = {
  maxAge: 3 * (24 * 60 * 60 * 1000), // 3 days
  sameSite: (NODE_ENV === 'production') ? 'None' : undefined,
  secure: (NODE_ENV === 'production') ? true : undefined
}

router.post('/google-signin', async (req, res) => {
  let user = await validateGoogleAccessToken(req.body.google_access_token);
  if (!user) return res.send(responses.error('bad_token'));

  let uid = await db.accounts.getUidByEmail(user.email);
  if (!uid) uid = genId(28); // new account

  await db.accounts.createOrUpdate(
    uid,
    user.email,
    user.given_name,
    user.family_name,
    user.picture
  );

  let token = jwt.sign({
    iat: Date.now(),
    uid
  }, JWT_SECRET);

  res.cookie('intell_', token, cookieOpts);
  res.send(responses.success());
});

router.get('/profile', mw.auth, async (req: Request, res) => {
  let token = jwt.sign({
    iat: Date.now(),
    uid: req.uid
  }, JWT_SECRET);

  res.cookie('intell_', token, cookieOpts);

  res.send(responses.success({
    uid: req.uid,
    ...await db.accounts.getBasicInfo(req.uid),
  }));
});

router.get('/signout', mw.auth, (req, res) => {
  // remove cookie
  res.cookie('intell_', 'old', {
    maxAge: 0
  });

  res.send(responses.success());
});

export default router;
