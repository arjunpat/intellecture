require('dotenv').config()
const express = require('express');
const app = express();
const admin = require('firebase-admin');
const MySQL = require('./lib/MySQL');

const {
  MYSQL_USER,
  MYSQL_PASS,
  MYSQL_HOST,
  MYSQL_DB,
  PORT
} = process.env;

admin.initializeApp({
  credential: admin.credential.cert(require('./credentials/firebase.json')),
  databaseURL: 'https://intellecture-6b3e6.firebaseio.com'
});
admin.auth().listUsers().then(res => console.log(JSON.parse(JSON.stringify(res)).users[0]))

const mysql = new MySQL(
  MYSQL_USER,
  MYSQL_PASS,
  MYSQL_DB,
  MYSQL_HOST
);

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.headers.origin)
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

  next();
});

app.all('*', (req, res) => {
  res.send({
    success: false,
    error: 'not_found'
  });
});

app.listen(PORT, () => {
  console.log('Server started');
});
