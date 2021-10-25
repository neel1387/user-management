const errorUtil = require('../../../helper/errorUtil');
const userUtils = require('./userUtils');
const logger = require('../../../helper/logger');
const responseBuilder = require('../../../helper/responseBuilder');

const { STANDARD } = require('../../../constants/common');

const userCtr = {};

userCtr.listUser = async (req, res) => {
  try {
    const result = await userUtils.listUser({ queryParams: req.query, user: req.user });
    const data = responseBuilder.successWithData({ result });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main listUser API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

userCtr.login = async (req, res) => {
  try {
    const result = await userUtils.login({ body: req.body });
    const data = responseBuilder.successWithData({ ...result, msg: req.t('MSG_USER_LOGIN_SUCCESS') });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main login API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

userCtr.createUser = async (req, res) => {
  try {
    const result = await userUtils.createUser({ body: req.body, user: req.user });
    const data = responseBuilder.successWithData({ ...result, msg: req.t('MSG_USER_CREATED') });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main createUser API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

userCtr.editUser = async (req, res) => {
  try {
    const result = await userUtils.editUser({ body: req.body, user: req.user });
    const data = responseBuilder.successWithData({ ...result, msg: req.t('MSG_USER_UPDATED') });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main editUser API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

userCtr.deleteUser = async (req, res) => {
  try {
    await userUtils.deleteUser({ body: req.body, user: req.user });
    const data = responseBuilder.successWithData({ msg: req.t('MSG_USER_DELETED') });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main deleteUser API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

userCtr.assignGroup = async (req, res) => {
  try {
    const result = await userUtils.assignGroup({ body: req.body, user: req.user });
    const data = responseBuilder.successWithData({ ...result, msg: req.t('MSG_USER_GROUP_ASSSIGNED') });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main assignGroup API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

module.exports = userCtr;
