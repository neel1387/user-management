const errorUtil = require('../../../helper/errorUtil');
const collectionUtils = require('./collectionUtils');
const logger = require('../../../helper/logger');
const responseBuilder = require('../../../helper/responseBuilder');

const { STANDARD } = require('../../../constants/common');

const collectionCtr = {};

// Create/Complete User Profile 
collectionCtr.createMentee = async (req, res) => {
  try {
    const result = await collectionUtils.createMentee(req.body);
    const data = responseBuilder.successWithData(result);
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main createMentee API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

collectionCtr.login = async (req, res) => {
  try {
    const result = await collectionUtils.login(req.body);
    const data = responseBuilder.successWithData({ ...result, msg: req.t('MSG_USER_LOGIN_SUCCESS') });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main login API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};


module.exports = collectionCtr;
