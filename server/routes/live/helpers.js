function jsonifySocket(socket) {
  /* socket.on('message', data => {
    try {
      socket.onjson(JSON.parse(data));
    } catch (e) { console.log(e); }
  }); */

  socket.json = obj => socket.send(JSON.stringify(obj));
}

function handleUpgrade(wss, req) {
  return new Promise((resolve, reject) => {
    wss.handleUpgrade(req, req.socket, req.ws.head, s => {
      jsonifySocket(s);
      resolve(s);
    });
  });
}

function toController(lecture_uid) {
  return lecture_uid + ':ctl';
}

function toStudent(lecture_uid) {
  return lecture_uid + ':s';
}

function toTeacher(lecture_uid) {
  return lecture_uid + ':t'
}

function toLectureUid(channel) {
  return channel.split(':')[0];
}

function genUnderstandingScore(arr) {
  let sum = 0;
  for (let each of arr) sum += each;
  return (sum / arr.length) * 10;
}

module.exports = {
  handleUpgrade,
  jsonifySocket,
  toController,
  toStudent,
  toTeacher,
  toLectureUid,
  genUnderstandingScore
}
