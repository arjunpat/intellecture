const redis = require('redis');
const pub = redis.createClient();
const sub = redis.createClient();

const db = require('../../models');

const SocketsManager = require('./SocketsManager');
const socketsManager = new SocketsManager();

setInterval(() => {
  socketsManager.prune();
}, 10000);

function publish(lecture_uid, obj) {
  pub.publish(lecture_uid, JSON.stringify(obj));
}

sub.on('message', (lecture_uid, message) => {
  let data = JSON.parse(message);

  switch (data.type) {
    case 'ssu':

      break;
  }
});

async function handleTeacher(lecture_uid, teacher_uid, socket) {

}

module.exports = handleTeacher;
