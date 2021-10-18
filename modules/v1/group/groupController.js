const errorUtil = require('../../../helper/errorUtil');
const groupUtils = require('./groupUtils');
const logger = require('../../../helper/logger');
const responseBuilder = require('../../../helper/responseBuilder');

const { STANDARD } = require('../../../constants/common');

const groupCtr = {};

groupCtr.listGroup = async (req, res) => {
  try {
    const result = await groupUtils.listGroup({ queryParams: req.query, user: req.user });
    const data = responseBuilder.successWithData({ result });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main listGroup API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

groupCtr.createGroup = async (req, res) => {
  try {
    const result = await groupUtils.createGroup({ body: req.body, user: req.user });
    const data = responseBuilder.successWithData({ ...result, msg: req.t('MSG_GROUP_CREATED') });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main createGroup API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

groupCtr.editGroup = async (req, res) => {
  try {
    const result = await groupUtils.editGroup({ body: req.body, user: req.user });
    const data = responseBuilder.successWithData({ ...result, msg: req.t('MSG_GROUP_UPDATED') });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main editGroup API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

groupCtr.deleteGroup = async (req, res) => {
  try {
    await groupUtils.deleteGroup({ body: req.body, user: req.user });
    const data = responseBuilder.successWithData({ msg: req.t('MSG_GROUP_DELETED') });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main deleteGroup API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

module.exports = groupCtr;
