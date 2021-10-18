const errorUtil = require('../../../helper/errorUtil');
const userUtils = require('./userUtils');
const logger = require('../../../helper/logger');
const responseBuilder = require('../../../helper/responseBuilder');

const { STANDARD } = require('../../../constants/common');

const userCtr = {};

// Create/Complete User Profile 
userCtr.createMentee = async (req, res) => {
  try {
    const result = await userUtils.createMentee(req.body);
    const data = responseBuilder.successWithData(result);
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main createMentee API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

userCtr.login = async (req, res) => {
  try {
    const result = await userUtils.login(req.body);
    const data = responseBuilder.successWithData({ ...result, msg: req.t('MSG_USER_LOGIN_SUCCESS') });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main login API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};


module.exports = userCtr;
