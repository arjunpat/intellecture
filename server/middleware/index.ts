import { Response, NextFunction } from 'express';
import { Request } from '../types';
import * as responses from '../lib/responses';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../lib/config';

export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    let contents: any = jwt.verify(req.cookies.intell_, JWT_SECRET);
    req.uid = contents.uid;
    next();
  } catch (e) {
    res.send(responses.error('cookie'));
  }
}

export function websocket(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() !== 'websocket')
  return res.send(responses.error('not_websocket'));
    next();
}