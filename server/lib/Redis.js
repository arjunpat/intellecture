const redis = require('redis');

const KEY_EXPIRE = 60 * 60; // 1 hour

class Redis {
  constructor() {
    this.conn = redis.createClient(process.env.REDIS_URL);
  }

  set(key, obj) {
    return new Promise((resolve, reject) => {
      this.conn.set(key, JSON.stringify(obj), 'EX', KEY_EXPIRE, (a) => {
        resolve();
      });
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.conn.get(key, (err, val) => {
        if (err)
          reject(err);
        else
          resolve(JSON.parse(val));
      });
    });
  }

  del(key) {
    return new Promise((resolve, reject) => {
      this.conn.del(key, () => {
        resolve();
      });
    });
  }

  setLecture(lecture_uid, obj) {
    return this.set('lecture:' + lecture_uid, obj);
  }

  getLecture(lecture_uid) {
    return this.get('lecture:' + lecture_uid);
  }

  delLecture(lecture_uid) {
    return this.del('lecture:' + lecture_uid);
  }
}

module.exports = Redis;
