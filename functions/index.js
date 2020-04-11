const functions = require('firebase-functions')
const responses = require('./responses.js');

/* const express = require('express');
const cors = require('cors');

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.get('/change/:lecture_id', (req, res) => {
  let lecture_id = req.params.lecture_id;

  res.send(lecture_id);
});

app.get('/classes/create', (req, res) => {
  
}); */


// exports.api = functions.https.onRequest(app);


// https://firebase.google.com/docs/functions/callable
exports.createClass = functions.https.onCall((data, context) => {
  if (!context.auth) return responses.error('no_auth');

  let email = context.auth.token.email;

  functions.firestore.collection('classes').add({
    created_at: firebase.firestore.Timestamp.fromDate(new Date()),
    name: data.name || 'Untitled Class',
    creator_email: email
  });
});