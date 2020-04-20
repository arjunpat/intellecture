const responses = require('../lib/responses');

module.exports = {
  auth: require('./auth'),
  queryAuth(req, res, next) {
    if (!req.query.access_token || req.query.access_token.includes(' '))
      res.send(responses.error('missing_auth'));
    
    req.headers.authorization = 'Bearer ' + req.query.access_token;
    next();
  }
}