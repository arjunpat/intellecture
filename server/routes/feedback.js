const router = require('express').Router();

const mw = require('../middleware');
const helpers = require('../lib/helpers');
const responses = require('../lib/responses');

const db = require('../models');

function isValidStars(value) {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 && value <= 5;
}

router.post('/create', mw.auth, async (req, res) => {
  let { stars } = req.body;

  if (!isValidStars(stars))
    return res.send(responses.error('misisng stars'))

  let id = Date.now();
  await db.feedback.create(req.uid, id, stars);

  res.send(responses.success({ id }));
});

router.post('/update', mw.auth, async (req, res) => {
  let { id, stars, comments, tech_comments, diff_stars, helpful_stars } = req.body;

  if (typeof id !== 'number' || Date.now() - id > 30 * 60 * 1000) // 30 minutes
    return res.send(responses.error());
    
  await db.feedback.update(
    req.uid,
    id,
    isValidStars(stars) ? stars : null,
    typeof comments === 'string' ? comments : null,
    typeof tech_comments === 'string' ? tech_comments : null,
    isValidStars(diff_stars) ? diff_stars : null,
    isValidStars(helpful_stars) ? helpful_stars : null
  );

  res.send(responses.success());
});

module.exports = router;
