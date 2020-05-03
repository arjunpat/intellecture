const responses = require('../lib/responses');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  try {
    let contents = jwt.verify(req.cookies.intell_, JWT_SECRET);
    req.uid = contents.uid;
    next();
  } catch (e) {
    res.send(responses.error('cookie'));
  }
}
