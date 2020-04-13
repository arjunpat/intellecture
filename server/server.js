require('dotenv').config()
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);

const MySQL = require('./lib/MySQL');
const WebSocket = require('ws');
// const wss = new WebSocket.Server({ server });

const {
  MYSQL_USER,
  MYSQL_PASS,
  MYSQL_HOST,
  MYSQL_DB,
  PORT
} = process.env;

const mysql = new MySQL(
  MYSQL_USER,
  MYSQL_PASS,
  MYSQL_DB,
  MYSQL_HOST
);

server.on('upgrade', (req, socket, head) => {
  let res = new http.ServerResponse(req)
  res.assignSocket(socket)
  req.ws = { head };

  res.on('finish', () => res.socket.destroy())
  app(req, res)
});

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.headers.origin)
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

  next();
});
app.use('/auth', require('./routes/auth')(mysql));
app.use('/lecture', require('./routes/lecture')(mysql));

app.all('*', (req, res) => {
  res.send({
    success: false,
    error: 'not_found'
  });
});

let listener = server.listen(PORT, () => {
  console.log('Server started', listener.address().port);
});
