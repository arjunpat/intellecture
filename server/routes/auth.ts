import { Router } from 'express';
const router = Router();

import * as responses from '../lib/responses';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../lib/config';

import db from '../models';
import * as mw from '../middleware';

import { Request } from '../types';

import admin from 'firebase-admin';
admin.initializeApp({
  credential: admin.credential.cert(require('../../credentials/firebase.json')),
  databaseURL: 'https://intellecture-6b3e6.firebaseio.com'
});
// admin.auth().listUsers().then(res => console.log(JSON.parse(JSON.stringify(res)).users[2]))

const { NODE_ENV } = process.env;

const cookieOpts: any = {
  maxAge: 3 * (24 * 60 * 60 * 1000), // 3 days
  sameSite: (NODE_ENV === 'production') ? 'None' : undefined,
  secure: (NODE_ENV === 'production') ? true : undefined
}

router.post('/signin', async (req, res) => {
  let { firebase_token } = req.body;
  let uid;

  try {
    uid = (await admin.auth().verifyIdToken(firebase_token)).uid;
  } catch (e) {
    return res.send(responses.error('bad_token'));
  }
  
  let user: admin.auth.UserRecord = await admin.auth().getUser(uid);
  await db.accounts.createOrUpdate(
    uid,
    user.email || '',
    user.displayName?.split(' ')[0] || 'First Name',
    user.displayName?.split(' ')[1] || 'Last Name',
    user.photoURL || ''
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

  res.send(responses.success(await db.accounts.getBasicInfo(req.uid)));
});

router.get('/signout', mw.auth, (req, res) => {
  // remove cookie
  res.cookie('intell_', 'old', {
    maxAge: 0
  });

  res.send(responses.success());
});

export default router;
