import { Router } from 'express';
const router = Router();

import * as responses from '../lib/responses';

import { getActiveLectures } from './live/controller';
router.get('/active-lectures', async (req, res) => {
  res.send(responses.success(getActiveLectures()));
});

export default router;