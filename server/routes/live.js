const router = require('express').Router();
const WebSocket = require('ws');

const mw = require('../middleware');
const responses = require('../lib/responses');

const wss = new WebSocket.Server({ noServer: true });
const LectureManager = require('../lib/LectureManager');

const db = require('../models');

let lectures = {};
// loop through connections to see if still awake
setInterval(() => {
  for (let each in lectures) {
    if (lectures[each].done === true) {
      console.log('deleting', each);
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

function handleUpgrade(req) {
  return new Promise((resolve, reject) => {
    wss.handleUpgrade(req, req.socket, req.ws.head, s => {
      jsonifySocket(s);
      resolve(s);
    });
  });
}

router.get('/teacher/:lecture_uid', mw.queryAuth, mw.auth, mw.websocket, async (req, res) => {
  let { lecture_uid } = req.params;

  let socket = await handleUpgrade(req);

  if (lectures[lecture_uid] || await db.lectures.getOwner(lecture_uid) !== req.uid) {
    socket.json({
      type: 'error',
      error: 'permissions'
    });
    return socket.terminate();
  }
  
  lectures[lecture_uid] = new LectureManager(lecture_uid, db, socket);
});

router.get('/student/:lecture_uid', mw.queryAuth, mw.auth, mw.websocket, async (req, res) => {
  let { lecture_uid } = req.params;
  
  let socket = await handleUpgrade(req);
  
  if (!lectures[lecture_uid]) {
    socket.json({
      type: 'error',
      error: 'lecture_not_initialized'
    });
    return socket.terminate();
  }
  
  lectures[lecture_uid].addStudent(req.uid, socket);
});

module.exports = router;
