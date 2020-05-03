const router = require('express').Router();
const WebSocket = require('ws');
const redis = require('redis');

const pub = redis.createClient(process.env.REDIS_URL);
const mw = require('../../middleware');
const wss = new WebSocket.Server({ noServer: true });

const { handleUpgrade } = require('./helpers');
const db = require('../../models');

const handleTeacher = require('./teacher');
router.get('/teacher/:lecture_uid', mw.websocket, mw.auth, async (req, res) => {
  let { lecture_uid } = req.params;

  let socket = await handleUpgrade(wss, req);

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
router.get('/student/:lecture_uid', mw.websocket, mw.auth, async (req, res) => {
  let { lecture_uid } = req.params;

  let socket = await handleUpgrade(wss, req);

  let lecture = await db.lectures.getLecture(lecture_uid);
  if (!lecture) {
    socket.json({
      type: 'error',
      error: 'does_not_exist'
    });
    return socket.terminate();
  }

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
