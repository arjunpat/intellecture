const router = require('express').Router();
const WebSocket = require('ws');

const responses = require('../lib/responses');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const wss = new WebSocket.Server({ noServer: true });
const LectureManager = require('../lib/LectureManager');

let mysql;

function genLectureId(length) {
  let options = 'abcdefghijklmnopqrstuvwxyz';
  let id = '';

  for (let i = 0; i < length; i++)
    id += options[Math.floor(Math.random() * options.length)];

  return id;
}

router.all('*', (req, res, next) => {
  req.uid = 'your_mom_' + Math.round(Math.random() * 1000);
  return next();
  try {
    let token = req.headers.authorization.split(' ')[1];
    let contents = jwt.verify(token, JWT_SECRET);
    req.uid = contents.uid;
    next();
  } catch (e) {
    console.log(e);
    res.send(responses.error('bad_token'));
  }
});

router.post('/create', async (req, res) => {
  let { name, class_uid } = req.body;

  let resp = await mysql.query('SELECT owner_uid FROM classes WHERE uid = ?', [class_uid]);

  if (resp.length === 0)
    return res.send(responses.error('no_class_exists'));
  
  if (resp[0].owner_uid !== req.uid)
    return res.send(responses.error('permissions'));
  
  let lecture_uid = genLectureId(5);
  await mysql.insert('lectures', {
    uid: lecture_uid,
    created_at: Date.now(),
    class_uid,
    name: name || 'Untitled Lecture'
  });

  res.send(responses.success({
    lecture_uid
  }));
});


let lectures = {};
// loop through connections to see if still awake
setInterval(() => {
  for (let each in lectures) {
    if (lectures[each].done === true) {
      delete lectures[each];
    } else {
      lectures[each].cleanSockets();
    }
  }
}, 10000);


function jsonifySocket(socket) {
  socket.on('message', data => {
    try {
      socket.onjson(JSON.parse(data));
    } catch (e) { console.log(e); }
  });

  socket.json = obj => socket.send(JSON.stringify(obj));
}

router.get('/live/:lecture_uid', (req, res) => {
  if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() !== 'websocket')
    return res.send(responses.error('not_websocket'));

  let { lecture_uid } = req.params;
  
  wss.handleUpgrade(req, req.socket, req.ws.head, socket => {

    jsonifySocket(socket);

    if (!lectures[lecture_uid]) {
      // TODO creating lecture, verify is teacher, record start time of lecture
      lectures[lecture_uid] = new LectureManager(lecture_uid, mysql, socket);
    } else {
      lectures[lecture_uid].addStudent(req.uid, socket);
    }
    
  });
});

router.get('/testing', (req, res) => {
  res.sendFile(__dirname + '/testing.html');
});

module.exports = (a) => {
  mysql = a;
  return router;
}
