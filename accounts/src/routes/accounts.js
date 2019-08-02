/* eslint-disable func-names */

import express from 'express';
import { unlockAccount } from '../services/accounts';

const router = express.Router({ mergeParams: true });

router.post('/unlock', async function(req, res, next) {
  const { address, password } = req.body;

  try {
    await unlockAccount(address, password);
    res.data = { message: 'Unlocked' };
    next();
  } catch (err) {
    next(err);
  }
});

export default router;
