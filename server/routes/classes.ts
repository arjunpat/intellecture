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

router.post('/delete', async (req: Request, res) => {
  let { class_uid } = req.body;
  if (!class_uid) return res.send(responses.error('missing_data'));
  
  // class ownership does not need to be checked because it is handled
  // by the sql

  await db.classes.deleteClass(req.uid, class_uid);
  res.send(responses.success());
});

router.post('/rename', async (req: Request, res) => {
  let { class_uid, name } = req.body;
  if (!class_uid) return res.send(responses.error('missing_data'));

  // class ownership does not need to be checked because it is handled
  // by the sql

  await db.classes.rename(req.uid, class_uid, name || 'Untitled Class');
  res.send(responses.success());
});

router.get('/mine', async (req: Request, res) => {
  res.send(responses.success(await db.classes.getUserClasses(req.uid)));
});

export default router;
