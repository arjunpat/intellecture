const router = require('express').Router();

const responses = require('../lib/responses');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const db = require('../models');
const mw = require('../middleware');

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(require('../credentials/firebase.json')),
  databaseURL: 'https://intellecture-6b3e6.firebaseio.com'
});
// admin.auth().listUsers().then(res => console.log(JSON.parse(JSON.stringify(res)).users[2]))

const cookieOpts = {
    maxAge: 3 * (24 * 60 * 60 * 1000), // 3 days
    sameSite: 'None',
    secure: true
}

router.post('/login', async (req, res) => {
  let { firebase_token } = req.body;
  let uid;

  try {
    uid = (await admin.auth().verifyIdToken(firebase_token)).uid;
  } catch (e) {
    return res.send(responses.error('bad_token'));
  }
  
  let user = await admin.auth().getUser(uid);
  await db.accounts.createOrUpdate(
    uid,
    user.email,
    user.displayName.split(' ')[0],
    user.displayName.split(' ')[1],
    user.photoURL
  );

  let token = jwt.sign({
    iat: Date.now(),
    uid
  }, JWT_SECRET);

  res.cookie('intell_', token, cookieOpts);
  
  res.send(responses.success());
});

router.get('/profile', mw.auth, async (req, res) => {
  let token = jwt.sign({
    iat: Date.now(),
    uid: req.uid
  }, JWT_SECRET);

  res.cookie('intell_', token, cookieOpts);

  res.send(responses.success(await db.accounts.getBasicInfo(req.uid)));
});

router.get('/logout', mw.auth, (req, res) => {
  // remove cookie
  res.cookie('intell_', 'old', {
    maxAge: 0
  });

  res.send(responses.success());
});

module.exports = router;
