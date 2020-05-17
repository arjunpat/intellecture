import { Router } from 'express';
import WebSocket from 'ws';
const router = Router();

import * as responses from '../../lib/responses';
import * as mw from '../../middleware';
const wss = new WebSocket.Server({ noServer: true });

import { handleUpgrade, toController } from './helpers';
import { Request } from '../../types';

import db from '../../models';

function publish(lecture_uid: string, obj: object) {
  db.redis.conn.publish(toController(lecture_uid), JSON.stringify(obj));
}

import handleTeacher from './teacher/';
import initLecture from './controller';
router.get('/teacher/:lecture_uid', mw.websocket, mw.auth, async (req: Request, res) => {
  let { lecture_uid } = req.params;

  let socket = await handleUpgrade(wss, req);

  let lecture = await db.lectures.getLecture(lecture_uid);
  if (lecture.account_uid !== req.uid) {
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

  await initLecture(lecture_uid);
  handleTeacher(lecture_uid, req.uid, socket);
});

import handleStudent from './student/';
router.get('/student/:lecture_uid', mw.websocket, mw.auth, async (req: Request, res) => {
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

  // TODO handle case that lecture ends before student initialized
  handleStudent(lecture_uid, req.uid, socket);
});


async function attachLecture(req, res, next) {
  let { lecture_uid } = req.params;
  let lecture = await db.lectures.getLecture(lecture_uid);

  if (
    lecture
    && typeof lecture.start_time === 'number'
    && typeof lecture.end_time !== 'number'
  ) {
    req.lecture = lecture;
    return next();
  }
  res.send(responses.error());
}

function isValidScore(value) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 10;
}

router.post('/student/:lecture_uid/score', mw.auth, attachLecture, async (req: Request, res) => {
  if (!isValidScore(req.body.score))
    return res.send(responses.error());

  publish(req.params.lecture_uid, {
    type: 'ssu', // student score update
    student_uid: req.uid,
    score: req.body.score
  });

  res.send(responses.received());
});

router.post('/student/:lecture_uid/question', mw.auth, attachLecture, async (req: Request, res) => {
  // basic question test stuff
  let { question } = req.body;

  if (typeof question !== 'string') {
    return res.send(responses.error());
  }

  if (/(\r\n|\r|\n)/.test(question)) {
    return res.send(responses.error('newline_not_allowed'));
  }

  publish(req.params.lecture_uid, {
    type: 'q', // question
    student_uid: req.uid,
    q: req.body.question
  });

  res.send(responses.received());
});

router.post('/student/:lecture_uid/upvote', mw.auth, attachLecture, async (req: Request, res) => {
  if (!req.body.question_uid)
    return res.send(responses.error());
  
  publish(req.params.lecture_uid, {
    type: 'qu', // question upvote
    student_uid: req.uid,
    question_uid: req.body.question_uid
  });
  
  res.send(responses.received());
});

router.post('/teacher/:lecture_uid/end', mw.auth, attachLecture, async (req: Request, res) => {
  if (req.lecture.account_uid !== req.uid) {
    return res.send(responses.error('permissions'));
  }

  publish(req.params.lecture_uid, { type: 'end' });
  res.send(responses.received());
});

export default router;
