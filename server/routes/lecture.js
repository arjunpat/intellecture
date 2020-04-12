const router = require('express').Router();
const WebSocket = require('ws');
let mysql;

// loop through connections to see if still awake
let lectures = {};

function genLectureId(length) {
  let options = 'abcdefghijklmnopqrstuvwxyz';
  let id = '';

  for (let i = 0; i < length; i++)
    id += options[Math.floor(Math.random() * options.length)];

  return id;
}

router.post('/create', (req, res) => {
  // let { name, }
});

module.exports = (a) => {
  mysql = a;
  return router;
}
