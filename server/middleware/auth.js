const responses = require('../lib/responses');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  try {
    let token = req.headers.authorization.split(' ')[1];
    let contents = jwt.verify(token, JWT_SECRET);
    req.uid = contents.uid;
    next();
  } catch (e) {
    console.log(e);
    res.send(responses.error('bad_token'));
  }
}