const jwt = require('jsonwebtoken');
const logger = require('./logger');

const jwtUtil = {};

jwtUtil.getAuthToken = (data) => {
  const encoded = jwt.sign(data, process.env.JWT_PRIVATE_KEY, { expiresIn: '24h' });
  return encoded;
};

jwtUtil.decodeAuthToken = (token) => {
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      return decoded;
    } catch (err) {
      logger.debug('Token Verification issue', token);
      logger.error(err);
      return false;
    }
  }
  return false;
};

module.exports = jwtUtil;
