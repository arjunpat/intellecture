
// work-in-progress & not in use right now

class Socket {
  constructor(socket) {
    this.socket = socket;
    this.isAlive = true;

    socket.on('message', data => {
      this.onjson(JSON.parse(data));
    });

    socket.on('pong', () => this.isAlive = true);
  }

  send(obj) {
    this.socket.send(JSON.stringify(obj));
  }

  isOpen() {
    
  }

  isDone() {
    let rs = this.socket.readyState;
    return rs === 2 || rs === 3;
  }
}

module.exports = Socket;
