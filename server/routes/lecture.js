const router = require('express').Router();
const WebSocket = require('ws');

const mw = require('../middleware');
const responses = require('../lib/responses');

const wss = new WebSocket.Server({ noServer: true });
const LectureManager = require('../lib/LectureManager');

const db = require('../models');

function genLectureId(length) {
  let options = 'abcdefghijklmnopqrstuvwxyz';
  let id = '';

  for (let i = 0; i < length; i++)
    id += options[Math.floor(Math.random() * options.length)];

  return id;
}

router.post('/create', mw.auth, async (req, res) => {
  let { name, class_uid } = req.body;

  let resp = await db.classes.ownsClass(class_uid, req.uid);

  if (!resp) {
    return res.send(responses.error());
  }
  
  let lecture_uid = genLectureId(5);
  await db.lectures.createLecture(lecture_uid, class_uid, name || 'Untitled Lecture');

  res.send(responses.success({
    lecture_uid
  }));
});

router.get('/get/:class_uid', mw.auth, async (req, res) => {
  res.send(responses.success(await db.lectures.getUserLectures(req.params.class_uid)));
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

router.get('/live/:lecture_uid', mw.queryAuth, mw.auth, (req, res) => {
  if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() !== 'websocket')
    return res.send(responses.error('not_websocket'));

  let { lecture_uid } = req.params;
  
  wss.handleUpgrade(req, req.socket, req.ws.head, async socket => {
    jsonifySocket(socket);

    if (!lectures[lecture_uid]) {
      // TODO creating lecture, verify is teacher, record start time of lecture
      if (await db.lectures.getOwner(lecture_uid) !== req.uid)
        return res.send(responses.error('auth'));

      lectures[lecture_uid] = new LectureManager(lecture_uid, db, socket);
    } else {
      lectures[lecture_uid].addStudent(req.uid, socket);
    }
  });
});

router.get('/testing', (req, res) => {
  res.sendFile(__dirname + '/testing.html');
});

/* module.exports = (a) => {
  db = a;
  return router;
} */
module.exports = router;