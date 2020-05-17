import redis from 'redis';
import { REDIS_URL } from './config';

const KEY_EXPIRE = 60 * 60; // 1 hour

export default class Redis {
  public conn: redis.RedisClient;

  constructor() {
    this.conn = redis.createClient(REDIS_URL);
  }

  set(key: string, obj: object) {
    return new Promise((resolve, reject) => {
      this.conn.set(key, JSON.stringify(obj), 'EX', KEY_EXPIRE, (a) => {
        resolve();
      });
    });
  }

  get(key: string) {
    return new Promise((resolve, reject) => {
      this.conn.get(key, (err, val) => {
        if (err)
          reject(err);
        else
          resolve(JSON.parse(val));
      });
    });
  }

  del(key: string) {
    return new Promise((resolve, reject) => {
      this.conn.del(key, () => {
        resolve();
      });
    });
  }

  setLecture(lecture_uid: string, obj: object) {
    return this.set('lecture:' + lecture_uid, obj);
  }

  getLecture(lecture_uid: string) {
    return this.get('lecture:' + lecture_uid);
  }

  delLecture(lecture_uid: string) {
    return this.del('lecture:' + lecture_uid);
  }
}
