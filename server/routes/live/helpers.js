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

module.exports = { handleUpgrade, jsonifySocket };
