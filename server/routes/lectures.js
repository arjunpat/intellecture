const router = require('express').Router();

const mw = require('../middleware');
const responses = require('../lib/responses');

const db = require('../models');

function genLectureId(length) {
  let options = 'abcdefghijklmnopqrstuvwxyz';
  let id = '';

  for (let i = 0; i < length; i++)
    id += options[Math.floor(Math.random() * options.length)];

  return id;
}

router.use('/live', require('./live/'));

router.post('/create', mw.auth, async (req, res) => {
  let { name, class_uid } = req.body;

  let resp = await db.classes.ownsClass(class_uid, req.uid);

  if (!resp)
    return res.send(responses.error());
  
  let lecture_uid = genLectureId(5);
  await db.lectures.createLecture(lecture_uid, class_uid, name || 'Untitled Lecture');

  res.send(responses.success({
    lecture_uid
  }));
});

router.get('/get/:class_uid', mw.auth, async (req, res) => {
  res.send(responses.success(await db.lectures.getClassLectures(req.params.class_uid)));
});

router.get('/exists/:lecture_uid', mw.auth, async (req, res) => {
  let lecture = await db.lectures.getLecture(req.params.lecture_uid);

  res.send(responses.success({
    exists: lecture && typeof lecture.start_time === 'number' && typeof lecture.end_time !== 'number' 
  }));
});

router.get('/testing', (req, res) => {
  res.sendFile(__dirname + '/testing.html');
});

module.exports = router;
