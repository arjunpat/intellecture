require('dotenv').config()
import http from 'http';
import express from 'express';
import helmet from 'helmet';

const app: express.Application = express();
const server: http.Server = http.createServer(app);

server.on('upgrade', (req: any, socket: any, head: any) => {
  let res = new http.ServerResponse(req);
  res.assignSocket(socket);
  req.ws = { head };

  app(req, res)
});

app.use(express.json());
app.use(require('cookie-parser')());
app.use(helmet());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'content-type,authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.headers.origin)
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

  next();
});

import auth from './routes/auth';
import lectures from './routes/lectures';
import classes from './routes/classes';
import feedback from './routes/feedback';
import analytics from './routes/analytics';
import admin from './routes/admin';
import store from './routes/store';

app.use('/auth', auth);
app.use('/lectures', lectures);
app.use('/classes', classes);
app.use('/feedback', feedback);
app.use('/analytics', analytics);
app.use('/admin', admin);
app.use('/store', store);

app.all('*', (_, res) => {
  res.send({
    success: false,
    error: 'not_found'
  });
});

server.listen(process.env.PORT, () => {
  console.log('Server started', process.env.PORT);
});
