const errorUtil = require('../../../helper/errorUtil');
const collectionUtils = require('./collectionUtils');
const logger = require('../../../helper/logger');
const responseBuilder = require('../../../helper/responseBuilder');

const { STANDARD } = require('../../../constants/common');

const collectionCtr = {};

collectionCtr.listCollection = async (req, res) => {
  try {
    const result = await collectionUtils.listCollection({ queryParams: req.query, user: req.user });
    const data = responseBuilder.successWithData({ result });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main listCollection API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

collectionCtr.createCollection = async (req, res) => {
  try {
    const result = await collectionUtils.createCollection({ body: req.body, user: req.user });
    const data = responseBuilder.successWithData({ ...result, msg: req.t('MSG_COLLECTION_CREATED') });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main createCollection API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

collectionCtr.editCollection = async (req, res) => {
  try {
    const result = await collectionUtils.editCollection({ body: req.body, user: req.user });
    const data = responseBuilder.successWithData({ ...result, msg: req.t('MSG_COLLECTION_UPDATED') });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main editCollection API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

collectionCtr.editCollection = async (req, res) => {
  try {
    const result = await collectionUtils.editCollection({ body: req.body, user: req.user });
    const data = responseBuilder.successWithData({ ...result, msg: req.t('MSG_COLLECTION_UPDATED') });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main editCollection API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

collectionCtr.deleteCollection = async (req, res) => {
  try {
    await collectionUtils.deleteCollection({ body: req.body, user: req.user });
    const data = responseBuilder.successWithData({ msg: req.t('MSG_COLLECTION_DELETED') });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main deleteCollection API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

module.exports = collectionCtr;
