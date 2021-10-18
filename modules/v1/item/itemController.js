const errorUtil = require('../../../helper/errorUtil');
const itemUtils = require('./itemUtils');
const logger = require('../../../helper/logger');
const responseBuilder = require('../../../helper/responseBuilder');

const { STANDARD } = require('../../../constants/common');

const itemCtr = {};

itemCtr.listItem = async (req, res) => {
  try {
    const result = await itemUtils.listItem({ queryParams: req.query, user: req.user });
    const data = responseBuilder.successWithData({ result });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main listItem API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

itemCtr.createItem = async (req, res) => {
  try {
    const result = await itemUtils.createItem({ body: req.body, user: req.user });
    const data = responseBuilder.successWithData({ ...result, msg: req.t('MSG_ITEM_CREATED') });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main createItem API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

itemCtr.editItem = async (req, res) => {
  try {
    const result = await itemUtils.editItem({ body: req.body, user: req.user });
    const data = responseBuilder.successWithData({ ...result, msg: req.t('MSG_ITEM_UPDATED') });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main editItem API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

itemCtr.deleteItem = async (req, res) => {
  try {
    await itemUtils.deleteItem({ body: req.body, user: req.user });
    const data = responseBuilder.successWithData({ msg: req.t('MSG_ITEM_DELETED') });
    return res.status(STANDARD.SUCCESS).json(data);
  } catch (err) {
    logger.error('[ERROR] From Main deleteItem API catch', err);
    const { code, error } = errorUtil.generateError(err);
    return res.status(code).json({ error, code });
  }
};

module.exports = itemCtr;
