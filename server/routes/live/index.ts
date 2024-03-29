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
import { initLecture } from './controller';
router.get('/teacher/:lecture_uid', mw.websocket, mw.auth, async (req: Request, res) => {
  let { lecture_uid } = req.params;

  let socket = await handleUpgrade(wss, req);

  let lecture = await db.lectures.getLecture(lecture_uid);
  if (!lecture) return res.send(responses.error());
  if (lecture.account_uid !== req.uid) {
    socket.json({
      type: 'error',
      error: 'permissions'
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

  if (typeof lecture.start_time !== 'number') {
    // lecture hasn't started
    await initLecture(lecture_uid);
  }

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

  if (await db.redis.isBanned(lecture_uid, req.uid)) {
    socket.json({
      type: 'error',
      error: 'banned'
    });
    return socket.close();
  }

  let status = await db.lectureStudentLog.getStudentStatus(lecture_uid, req.uid);
  if (status && status === 'j') {
    socket.json({
      type: 'error',
      error: 'already_joined'
    });
    return socket.close();
  }

  // TODO handle case that lecture ends before student initialized
  handleStudent(lecture_uid, req.uid, socket);
});

function ownsLecture(req, res, next) {
  if (req.lecture.account_uid !== req.uid)
    return res.send(responses.error('permissions'));
  next();
}

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

async function joinedLecture(req, res, next) {
  let { lecture_uid } = req.params;

  let status = await db.lectureStudentLog.getStudentStatus(lecture_uid, req.uid);
  if (!status || status === 'l')
    return res.send(responses.error('not_joined_lecture'));
  
  next();
}

function isValidScore(value) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 10;
}

router.post('/student/:lecture_uid/score', mw.auth, attachLecture, joinedLecture, async (req: Request, res) => {
  let { lecture_uid } = req.params;
  
  if (!isValidScore(req.body.score))
    return res.send(responses.error());

  publish(lecture_uid, {
    type: 'ssu', // student score update
    student_uid: req.uid,
    score: req.body.score
  });

  res.send(responses.received());
});

router.get('/student/:lecture_uid/questions', mw.auth, attachLecture, async (req: Request, res) => {
  if (typeof req.query.after !== 'string')
    return res.send(responses.error());

  let elapsed = parseInt(req.query.after)
  
  if (isNaN(elapsed) || elapsed < 0)
    return res.send(responses.error());
  
  let qs = await db.lectureQs.getNondismissedQuestionsAfter(req.params.lecture_uid, elapsed);

  res.send(responses.success(qs.map(({ account_uid, uid, question, elapsed }) => {	
    return {	
      creator_uid: account_uid,
      question_uid: uid,
      question,
      elapsed
    }	
  })));
});

router.get('/student/:lecture_uid/questions/mine', mw.auth, attachLecture, joinedLecture, async (req: Request, res) => {
  let qs = await db.lectureQs.getQuestionsAndUpvotesByUser(req.params.lecture_uid, req.uid);

  res.send(responses.success(qs.map(({ uid, elapsed, question, upvotes }) => {
    return {
      question_uid: uid,
      elapsed,
      question,
      upvotes
    }
  })));
});

router.post('/student/:lecture_uid/question', mw.auth, attachLecture, joinedLecture, (req: Request, res) => {
  // basic question test stuff
  let { question } = req.body;

  if (typeof question !== 'string') {
    return res.send(responses.error());
  }

  /* if (/(\r\n|\r|\n)/.test(question)) {
    return res.send(responses.error('newline_not_allowed'));
  } */

  publish(req.params.lecture_uid, {
    type: 'q', // question
    student_uid: req.uid,
    q: req.body.question
  });

  res.send(responses.received());
});

router.post('/student/:lecture_uid/upvote', mw.auth, attachLecture, joinedLecture, (req: Request, res) => {
  if (!req.body.question_uid)
    return res.send(responses.error());
  
  publish(req.params.lecture_uid, {
    type: 'qu', // question upvote
    student_uid: req.uid,
    question_uid: req.body.question_uid
  });
  
  res.send(responses.received());
});

router.post('/student/:lecture_uid/poll-vote', mw.auth, attachLecture, joinedLecture, (req: Request, res) => {
  let { poll_uid, choice } = req.body;
  if (!poll_uid || !Number.isInteger(choice))
    return res.send(responses.error());
  
  publish(req.params.lecture_uid, {
    type: 'pv',
    student_uid: req.uid,
    poll_uid,
    choice,
  });

  res.send(responses.received());
});

router.post('/teacher/:lecture_uid/end', mw.auth, attachLecture, ownsLecture, (req: Request, res) => {
  publish(req.params.lecture_uid, { type: 'end' });
  res.send(responses.received());
});

router.post('/teacher/:lecture_uid/kick', mw.auth, attachLecture, ownsLecture, (req: Request, res) => {
   if (typeof req.body.student_uid !== 'string')
    return res.send(responses.error('missing_data'));

  publish(req.params.lecture_uid, {
    type: 'bns',
    student_uid: req.body.student_uid,
    banned: !!req.body.banned
  });
  res.send(responses.received());
});

router.post('/teacher/:lecture_uid/dismiss', mw.auth, attachLecture, ownsLecture, (req, res) => {
  if (typeof req.body.question_uid !== 'string')
    return res.send(responses.error('missing_data'));
  
  publish(req.params.lecture_uid, {
    type: 'qds',
    question_uid: req.body.question_uid
  });
  res.send(responses.received());
});

router.post('/teacher/:lecture_uid/poll', mw.auth, attachLecture, ownsLecture, (req, res) => {
  let { prompt, options } = req.body;

  if (!(options instanceof Array) || options.length >= 100 || !options.every(e => typeof e === 'string') || typeof prompt !== 'string') {
    return res.send(responses.error());
  }

  publish(req.params.lecture_uid, {
    type: 'crp',
    prompt,
    options
  });
  
  res.send(responses.received());
});

router.post('/teacher/:lecture_uid/end-poll', mw.auth, attachLecture, ownsLecture, (req: Request, res) => {
  publish(req.params.lecture_uid, {
    type: 'ep',
    poll_uid: req.body.poll_uid
  });

  res.send(responses.received());
});

router.post('/teacher/:lecture_uid/share-poll-results', mw.auth, attachLecture, ownsLecture, (req: Request, res) => {
  publish(req.params.lecture_uid, {
    type: 'spr',
    poll_uid: req.body.poll_uid
  });

  res.send(responses.received());
});

const actionMap = {
  'active': 'act',
  'reset-scores': 'rst',
  'enable-individual-scores': 'eis'
};
router.post('/teacher/:lecture_uid/:action', mw.auth, attachLecture, ownsLecture, (req, res) => {
  let action = actionMap[req.params.action];

  if (!action)
    return res.send(responses.error('action_not_supported'));

  publish(req.params.lecture_uid, { type: action });
  res.send(responses.received());
});

export default router;
