import { Router } from 'express';
const router = Router();

import * as mw from '../middleware';
import * as helpers from '../lib/helpers';
import * as responses from '../lib/responses';

import db from '../models';

import { Request } from '../types';

router.use(mw.auth);

router.post('/create', async (req: Request, res) => {
  let { name } = req.body;

  let class_uid = helpers.genId(15);
  await db.classes.createClass(class_uid, req.uid, name || 'Untitled Class');

  res.send(responses.success({
    class_uid
  }));
});

router.get('/mine', async (req: Request, res) => {
  res.send(responses.success(await db.classes.getUserClasses(req.uid)));
});

export default router;