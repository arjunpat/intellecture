import { Router } from 'express';
const router = Router();

import * as mw from '../middleware';
import * as helpers from '../lib/helpers';
import * as responses from '../lib/responses';

import db from '../models';

import { SERVER_NAME } from '../lib/config'
import { Request } from '../types';

router.use(mw.auth);

router.post('/create', async (req: Request, res) => {
  let { name, section } = req.body;

  let class_uid = helpers.genId(15);
  await db.classes.createClass(class_uid, req.uid, name || 'Untitled Class', section || 'Untitled Section');

  if (SERVER_NAME === 'prod') {
    db.accounts.getBasicInfo(req.uid).then(user => {
      helpers.messageSlack(`${user.first_name} ${user.last_name} (${user.email}) created a class: ${name} - ${section}`);
    })
  }

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
  let { class_uid, name, section } = req.body;
  if (!class_uid) return res.send(responses.error('missing_data'));

  // class ownership does not need to be checked because it is handled
  // by the sql

  await db.classes.rename(req.uid, class_uid, name || 'Untitled Class', section || 'Untitled Section');
  res.send(responses.success());
});

router.get('/mine', async (req: Request, res) => {
  res.send(responses.success(await db.classes.getUserClasses(req.uid)));
});

export default router;
