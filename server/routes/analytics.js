const router = require('express').Router();

const mw = require('../middleware');
const responses = require('../lib/responses');

const db = require('../models');

req.use('/lecture/', async (req, res) => {
  let { lecture_uid } = req.params;

  let lecture = await db.lectures.getLecture(lecture_uid);
  if (lecture.owner_uid === req.uid)
    next();
  return res.send(responses.error('permissions'));
});

router.get('/lecture/students/:lecture_uid', async (req, res) => {
  let { lecture_uid } = req.params;

  res.send(responses.success(await db.lectures.getStudents(lecture_uid)));
});

module.exports = router;
