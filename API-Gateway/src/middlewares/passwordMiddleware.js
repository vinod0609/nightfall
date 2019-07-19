const crypto = require('crypto');
const accounts = require('../rest/accounts');

const CRYPT_SECRET = 'secret';

const encryptPassword = function (password) {
  const cipher = crypto.createCipher('aes-128-cbc', CRYPT_SECRET);
  let crypted = cipher.update(password, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

const decryptPassword = function (passwordHash) {
  const decipher = crypto.createDecipher('aes-128-cbc', CRYPT_SECRET);
  let decrpted = decipher.update(passwordHash, 'hex', 'utf8');
  decrpted += decipher.final('utf8');
  return decrpted;
};

const unlockAccount = async function (req, res, next) {
  if (!req.user) return next();
  const { address, password } = req.user;
  try {
    await accounts.unlockAccount({ address, password });
  } catch (error) {
    return next(error);
  }
  return next();
};

module.exports = {
  unlockAccount,
  encryptPassword,
  decryptPassword,
};
