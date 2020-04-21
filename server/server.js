require('dotenv').config()
const http = require('http');
const express = require('express');
const helmet = require('helmet');

const app = express();
const server = http.createServer(app);


server.on('upgrade', (req, socket, head) => {
  let res = new http.ServerResponse(req)
  res.assignSocket(socket)
  req.ws = { head };
  
  res.on('finish', () => res.socket.destroy())
  app(req, res)
});

app.use(express.json());
app.use(helmet());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'content-type,authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.headers.origin)
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

  next();
});
app.use('/auth', require('./routes/auth'));
app.use('/lecture', require('./routes/lecture'));
app.use('/class', require('./routes/classes'));

app.all('*', (req, res) => {
  res.send({
    success: false,
    error: 'not_found'
  });
});

let listener = server.listen(process.env.PORT, () => {
  console.log('Server started', listener.address().port);
});
