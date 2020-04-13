const router = require('express').Router();

const responses = require('../lib/responses');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

let mysql;

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(require('../credentials/firebase.json')),
  databaseURL: 'https://intellecture-6b3e6.firebaseio.com'
});
// admin.auth().listUsers().then(res => console.log(JSON.parse(JSON.stringify(res)).users[2]))

router.post('/login', async (req, res) => {
  let { firebase_token } = req.body;
  let uid = (await admin.auth().verifyIdToken(firebase_token)).uid;
  
  // check if in database
  let resp = await mysql.query('SELECT uid FROM accounts WHERE uid = ?', [ uid ]);
  
  if (resp.length === 0) {
    let user = await admin.auth().getUser(uid);
    await mysql.insert('accounts', {
      uid,
      created_at: Date.now(),
      email: user.email,
      first_name: user.displayName.split(' ')[0],
      last_name: user.displayName.split(' ')[1],
      photo: user.photoURL
    });
  }

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


module.exports = (a) => {
  mysql = a;
  return router;
}
