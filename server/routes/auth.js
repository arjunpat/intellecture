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

// admin.auth().verifyIdToken('eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjMGMzNWZlYjBjODIzYjQyNzdkZDBhYjIwNDQzMDY5ZGYzMGZkZWEiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQXJqdW4gUGF0cmF3YWxhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdoMWhpN0x4UEYwd0ZDOE9NMWp3TDQwVElUMnR1UWs1SkxQeVdHMnhnIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2ludGVsbGVjdHVyZS02YjNlNiIsImF1ZCI6ImludGVsbGVjdHVyZS02YjNlNiIsImF1dGhfdGltZSI6MTU4NjcxODY2MywidXNlcl9pZCI6InJVSnlQMzE3aXVaRXJObGhybm55bjhlVDd1WTIiLCJzdWIiOiJyVUp5UDMxN2l1WkVyTmxocm5ueW44ZVQ3dVkyIiwiaWF0IjoxNTg2NzE4NzQxLCJleHAiOjE1ODY3MjIzNDEsImVtYWlsIjoiYWpwYXQxMjM0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTAzMDk2ODA0MTgyMDEwOTUyMTQwIl0sImVtYWlsIjpbImFqcGF0MTIzNEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.jfovUq6kvGNUPz7mj_HhUi2OKC3XdGf9Mq0GArbA8pY6EVsDSKESdIPNZK1xk0LK4IM9hYfM4Vxw7E-bcvq5FjlZcIl_XqoJP9BLLMrqLRPSMxfM263K3ttJc5fBoh5PY0sP2nDnxNlC-_-x1QKdWgyFzoxm7oX66b0szgm2JUyyNUuTxk-EByDf9cMBBcgTUnWuqdPT80LUim3w3OqXMhs94aWJ-q07TXKHHygcOYbEwWU_v6I4YNClk5bJeEvR_-VmIxuhU8uZa3-IWIcrFGZlTvBZWxHqG4GKhPOPFvN0XlKblVUGJGBMNtJsS8A2Eoc_ncDMGs_4DUevdsKz9w').then(a => console.log(a));
// admin.auth().getUser('rUJyP317iuZErNlhrnnyn8eT7uY2').then(d => console.log(d));


module.exports = (a) => {
  mysql = a;
  return router;
}
