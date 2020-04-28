const responses = require('../lib/responses');

module.exports = {
  auth: require('./auth'),
  queryAuth(req, res, next) {
    if (!req.query.access_token || req.query.access_token.includes(' '))
      res.send(responses.error('missing_auth'));
    
    req.headers.authorization = 'Bearer ' + req.query.access_token;
    next();
  },
  websocket(req, res, next) {
    if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() !== 'websocket')
      return res.send(responses.error('not_websocket'));
    next();
  }
}
