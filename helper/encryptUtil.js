const crypto = require('crypto');
const logger = require('./logger');
const bcrypt = require('bcrypt');

const algorithm = 'aes-256-ctr';
const key = process.env.ENCRYPTION_KEY; // Key length should be 32 only
const inputEncoding = 'utf8';
const outputEncoding = 'hex';

const encryptUtil = {};

encryptUtil.encrypt = (text) => {
  try {
    const string = typeof text === 'string' ? text : JSON.stringify(text);
    const iv = Buffer.from(crypto.randomBytes(16));
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let crypted = cipher.update(string, inputEncoding, outputEncoding);
    crypted += cipher.final(outputEncoding);
    return `${iv.toString('hex')}:${crypted.toString()}`;
  } catch (err) {
    logger.error('[ERROR] From encrypt in encryptUtils', err);
    throw err;
  }
};

encryptUtil.decrypt = (text) => {
  try {
    const textParts = text.split(':');
    // extract the IV from the first half of the text
    const IV = Buffer.from(textParts.shift(), outputEncoding);
    // extract the encrypted text without the IV
    const encryptedText = Buffer.from(textParts.join(':'), outputEncoding);
    // decipher the string
    const decipher = crypto.createDecipheriv(algorithm, key, IV);
    let decrypted = decipher.update(encryptedText, outputEncoding, inputEncoding);
    decrypted += decipher.final(inputEncoding);
    return decrypted.toString();
  } catch (err) {
    logger.error('[ERROR] From decrypt in encryptUtils', err);
    throw err;
  }
};

encryptUtil.oneWayEncrypt = async (text) => {
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND, 10));
    const encoded = await bcrypt.hash(text, salt);
    return { encoded, salt };
  } catch (err) {
    logger.error('[ERROR] From oneWayEncrypt in encryptUtils', err);
    throw err;
  }
};

encryptUtil.validateBcryptHash = async (text, hash) => {
  try {
    const isExactMatch = await bcrypt.compare(text, hash);
    return isExactMatch;
  } catch (err) {
    logger.error('[ERROR] From validateBcryptHash in encryptUtils', err);
    throw err;
  }
};

module.exports = encryptUtil;
