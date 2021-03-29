import { Router } from 'express';
const router = Router();

import * as mw from '../middleware';
import * as responses from '../lib/responses';

import db from '../models';
import { Request } from '../types';

router.use(mw.auth);
const acceptableKeys = ['polls'];

router.get('/get/:key', async (req: Request, res) => {
  if (!acceptableKeys.includes(req.params.key))
    return res.send(responses.error('bad_key'));

  let value = await db.store.get(req.uid, req.params.key);

  if (!value)
    return res.send(responses.error('no_value'));

  res.send(responses.success(JSON.parse(value)));
});

router.post('/set/:key', async (req: Request, res) => {
  if (!acceptableKeys.includes(req.params.key))
    return res.send(responses.error('bad_key'));

  await db.store.set(req.uid, req.params.key, JSON.stringify(req.body.value));

  res.send(responses.success());
});

export default router;
