const router = require('express').Router();

const mw = require('../middleware');
const responses = require('../lib/responses');

const db = require('../models');

async function lecturePerms(req, res, next) {
  let { lecture_uid } = req.params;

  let lecture = await db.lectures.getLecture(lecture_uid);
  if (lecture && lecture.account_uid === req.uid)
    return next();
  return res.send(responses.error('permissions'));
}

router.get('/lecture/:lecture_uid/students', mw.auth, lecturePerms, async (req, res) => {
  let { lecture_uid } = req.params;

  res.send(responses.success(await db.lectures.getStudents(lecture_uid)));
});

router.get('/lecture/:lecture_uid/question/:question_uid/upvotes', mw.auth, lecturePerms, async (req, res) => {
  let { question_uid } = req.params;

  res.send(responses.success(await db.lectureQUpvotes.getStudents(question_uid)));
});

module.exports = router;
