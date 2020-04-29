const redis = require('redis');

class Redis {
  constructor() {
    this.conn = redis.createClient({
      host: '127.0.0.1',
      password: undefined
    });
  }
}

module.exports = Redis;