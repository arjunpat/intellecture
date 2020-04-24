const router = require('express').Router();

const responses = require('../lib/responses');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const db = require('../models');

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(require('../credentials/firebase.json')),
  databaseURL: 'https://intellecture-6b3e6.firebaseio.com'
});
// admin.auth().listUsers().then(res => console.log(JSON.parse(JSON.stringify(res)).users[2]))

router.post('/login', async (req, res) => {
  let { firebase_token } = req.body;
  let uid = (await admin.auth().verifyIdToken(firebase_token)).uid;

  if (!uid) {
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

  /*res.cookie('intell_', token, {
    maxAge: 5 * (24 * 60 * 60 * 1000)
  });*/
  
  res.send(responses.success({
    token
  }));
});


/* module.exports = (a) => {
  db = a;
  return router;
} */
module.exports = router;