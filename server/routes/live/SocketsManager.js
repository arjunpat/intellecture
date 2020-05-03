
class SocketsManager {
  constructor() {
    this.obj = {};
  }

  addSocket(lecture_uid, socket) {
    if (this.obj[lecture_uid] instanceof Array) {
      this.obj[lecture_uid].push(socket);
    }

    socket.on('pong', () => socket.isAlive = true);
  }

  prune() {
    for (let lecture_uid in this.obj) {
      let sockets = this.obj[lecture_uid];
      for (let i = 0; i < sockets.length; i++) {
        if (socket.readyState === 2 || socket.readyState === 3 || !socket.isAlive) {
          console.log('removing', socket.uid);
          socket.terminate();
          this.obj[lecture_uid].splice(i, 1);
          i--;
        } else {
          socket.isAlive = false;
          socket.ping(() => {});
        }
      }

      if (sockets.length === 0) {
        delete this.obj[lecture_uid];
        console.log('removing lecture', lecture_uid);
      }
    }
  }

  forEach(lecture_uid, func) {
    if (!(this.obj[lecture_uid] instanceof Array))
      return false;

    if (this.obj[lecture_uid].length === 0) {
      delete this.obj[lecture_uid];
      return false;
    }
    
    for (let i = 0; i < this.obj[lecture_uid].length; i++) {
      func(this.obj[lecture_uid][i]);
    }
  }
}

module.exports = SocketsManager;