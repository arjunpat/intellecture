
class StudentLectureManager {
  constructor() {
    this.sockets = [];
  }

  addStudent(socket) {
    socket.on('pong', () => socket.isAlive = true);
    socket.isAlive = true;
    this.sockets.push(socket);
  }

  sendToStudents(obj) {
    for (let s of this.sockets) {
      if (s.readyState === 1) {
        s.json(obj);
      }
    }
  }

  prune() {
    for (let i = 0; i < this.sockets.length; i++) {
      let socket = this.sockets[i];

      if (socket.readyState === 2 || socket.readyState === 3 || !socket.isAlive) {
        console.log('(s) removing', socket.uid);
        socket.terminate();
        this.sockets.splice(i, 1);
        i--;
      } else {
        socket.isAlive = false;
        socket.ping(() => {});
      }
    }

    this.done = this.sockets.length === 0;
  }

  end() {
    this.sendToStudents({
      type: 'end_lecture'
    });

    for (let s of this.sockets) s.close();
  }
}

module.exports = StudentLectureManager;