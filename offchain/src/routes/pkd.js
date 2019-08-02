/* eslint-disable func-names */

import express from 'express';
import {
  setZkpPublicKey,
  setWhisperPublicKey,
  setPublicKeys,
  setName,
  getZkpPublicKeyFromName,
  getWhisperPublicKeyFromName,
  getNames,
  getNameFromAddress,
  getAddressFromName,
  isNameInUse,
} from '../pkd-controller';

const router = express.Router();

router.get('/name/exists', async function(req, res, next) {
  try {
    res.data = await isNameInUse(req.query.name);
    next();
  } catch (err) {
    next(err);
  }
});

router
  .route('/name')
  .post(async function(req, res, next) {
    const { name } = req.body;
    const { address } = req.headers;

    try {
      await setName(name, address);
      res.data = { message: 'Name Added.' };
      next();
    } catch (err) {
      next(err);
    }
  })
  .get(async function(req, res, next) {
    const { address } = req.headers;

    try {
      res.data = await getNameFromAddress(address);
      next();
    } catch (err) {
      next(err);
    }
  });

router.post('/set-all-publickey', async function(req, res, next) {
  const { pk, whisper_pk: whisperPk } = req.body;
  const { address } = req.headers;

  try {
    await setPublicKeys([whisperPk, pk], address);
    res.data = { message: 'Keys Added.' };
    next();
  } catch (err) {
    next(err);
  }
});

router
  .route('/zkp-publickey')
  .post(async function(req, res, next) {
    const { pk } = req.body;
    const { address } = req.headers;

    try {
      await setZkpPublicKey(pk, address);
      res.data = { message: 'Keys Added.' };
      next();
    } catch (err) {
      next(err);
    }
  })
  .get(async function(req, res, next) {
    const { name } = req.query;

    try {
      res.data = await getZkpPublicKeyFromName(name);
      next();
    } catch (err) {
      next(err);
    }
  });

router
  .route('/whisperkey')
  .post(async function(req, res, next) {
    const { whisper_pk: whisperPk } = req.body;
    const { address } = req.headers;

    try {
      await setWhisperPublicKey(whisperPk, address);
      res.data = { message: 'Keys Added.' };
      next();
    } catch (err) {
      next(err);
    }
  })
  .get(async function(req, res, next) {
    const { name } = req.query;

    try {
      res.data = await getWhisperPublicKeyFromName(name);
      next();
    } catch (err) {
      next(err);
    }
  });

router.get('/address', async function(req, res, next) {
  const { name } = req.query;

  try {
    res.data = await getAddressFromName(name);
    next();
  } catch (err) {
    next(err);
  }
});

router.get('/names', async function(req, res, next) {
  try {
    res.data = await getNames();
    next();
  } catch (err) {
    next(err);
  }
});

export default router;
