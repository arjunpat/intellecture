const router = require('express').Router();

const mw = require('../middleware');
const responses = require('../lib/responses');

const db = require('../models');

async function lecturePerms(req, res, next) {
  let { lecture_uid } = req.params;
  console.log(lecture_uid);

  let lecture = await db.lectures.getLecture(lecture_uid);
  if (lecture.account_uid === req.uid)
    return next();
  return res.send(responses.error('permissions'));
}

router.get('/lecture/students/:lecture_uid', mw.auth, lecturePerms, async (req, res) => {
  let { lecture_uid } = req.params;

  res.send(responses.success(await db.lectures.getStudents(lecture_uid)));
});

module.exports = router;
