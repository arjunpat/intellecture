const router = require('express').Router();
const WebSocket = require('ws');

const mw = require('../../middleware');
const wss = new WebSocket.Server({ noServer: true });

const db = require('../../models');

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

const handleTeacher = require('./teacher');
router.get('/teacher/:lecture_uid', mw.queryAuth, mw.auth, mw.websocket, async (req, res) => {
  let { lecture_uid } = req.params;

  let socket = await handleUpgrade(req);

  let lecture = await db.lectures.getLecture(lecture_uid);
  if (lecture.owner_uid !== req.uid) {
    socket.json({
      type: 'error',
      error: 'permissions'
    });
    return socket.terminate();
  }

  if (typeof lecture.start_time === 'number') {
    socket.json({
      type: 'error',
      error: 'already_started'
    });
    return socket.terminate();
  }

  await db.lectures.startLecture(lecture_uid, Date.now());
  handleTeacher(lecture_uid, req.uid, socket);
});

const handleStudent = require('./student');
router.get('/student/:lecture_uid', mw.queryAuth, mw.auth, mw.websocket, async (req, res) => {
  let { lecture_uid } = req.params;

  let socket = await handleUpgrade(req);

  let lecture = await db.lectures.getLecture(lecture_uid);
  if (typeof lecture.start_time !== 'number') {
    socket.json({
      type: 'error',
      error: 'lecture_not_initialized'
    });
    return socket.terminate();
  }

  if (typeof lecture.end_time === 'number') {
    socket.json({
      type: 'error',
      error: 'already_ended'
    });
    return socket.terminate();
  }

  // handle case that lecture ends before student initialized
  handleStudent(lecture_uid, req.uid, socket);
});

module.exports = router;
