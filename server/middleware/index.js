const responses = require('../lib/responses');

module.exports = {
  auth: require('./auth'),
  websocket(req, res, next) {
    if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() !== 'websocket')
      return res.send(responses.error('not_websocket'));
    next();
  }
}
