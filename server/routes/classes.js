const router = require('express').Router();

const mw = require('../middleware');
const helpers = require('../lib/helpers');
const responses = require('../lib/responses');

const db = require('../models');

router.post('/create', mw.auth, async (req, res) => {
  let { name } = req.body;

  let class_uid = helpers.genId(10);
  await db.classes.createClass(class_uid, req.uid, name || 'Untitled Class');

  res.send(responses.success({
    class_uid
  }));
});

module.exports = router;