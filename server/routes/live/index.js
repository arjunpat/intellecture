const router = require('express').Router();
const WebSocket = require('ws');
const redis = require('redis');

const pub = redis.createClient(process.env.REDIS_URL);
const responses = require('../../lib/responses');
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
    return socket.close();
  }

  if (typeof lecture.start_time === 'number') {
    socket.json({
      type: 'error',
      error: 'already_started'
    });
    return socket.close();
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
    return socket.close();
  }

  if (typeof lecture.start_time !== 'number') {
    socket.json({
      type: 'error',
      error: 'lecture_not_initialized'
    });
    return socket.close();
  }

  if (typeof lecture.end_time === 'number') {
    socket.json({
      type: 'error',
      error: 'already_ended'
    });
    return socket.close();
  }

  // handle case that lecture ends before student initialized
  handleStudent(lecture_uid, req.uid, socket);
});

router.post('/teacher/:lecture_uid/end', mw.auth, async (req, res) => {
  let { lecture_uid } = req.params;

  let lecture = await db.lectures.getLecture(lecture_uid);
  if (lecture.owner_uid !== req.uid) {
    res.send(responses.error('permissions'));
  }

  pub.publish(lecture_uid, JSON.stringify({ type: 'end' }));
  await db.lectures.endLecture(lecture_uid, Date.now());

  res.send(responses.success());
});

router.post('/student/:lecture_uid/question', mw.auth, async (req, res) => {
  let { lecture_uid } = req.params;
  let lecture = await db.lectures.getLecture(lecture_uid);

  if (
    !lecture
    || typeof lecture.start_time !== 'number'
    || typeof lecture.end_time === 'number'
    || typeof req.body.question !== 'string'
  )
    return res.send(responses.error());

  let elapsed = Date.now() - lecture.start_time;
  await db.lectureQs.add(lecture_uid, elapsed, req.uid, req.body.question);

  pub.publish(lecture_uid, JSON.stringify({
    type: 'q', // question
    student_uid: req.uid,
    q: req.body.question
  }));

  res.send(responses.success());
});

function isValidScore(value) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 10;
}

router.post('/student/:lecture_uid/score', mw.auth, async (req, res) => {
  let { lecture_uid } = req.params;
  let lecture = await db.lectures.getLecture(lecture_uid);

  if (
    !lecture
    || typeof lecture.start_time !== 'number'
    || typeof lecture.end_time === 'number'
    || !isValidScore(req.body.score)
  ) {
    return res.send(responses.error());
  }

  let { start_time } = lecture;
  await db.lectureLog.recordScoreChange(
    lecture_uid,
    Date.now() - start_time,
    req.uid,
    req.body.score
  );

  pub.publish(lecture_uid, JSON.stringify({
    type: 'ssu', // student score update
    student_uid: req.uid,
    score: req.body.score
  }));

  res.send(responses.success());
});

module.exports = router;
