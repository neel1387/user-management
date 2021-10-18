const logger = require('../../../helper/logger');
const commonConsts = require('../../../constants/common');
const utils = require('../../../helper/utils');
const Collection = require('./collectionModel');
const l10n = require('jm-ez-l10n');

const collectionUtils = {};

collectionUtils.listCollection = async (obj) => {
    try {
      const { queryParams } = obj;
      const { limit, offset } = utils.validatePaginate(queryParams);
      const total =  await Collection.find().count();
      const collections = await Collection.find().sort('-_id').limit(limit).skip(offset);
      return { total, collections };
    } catch (error) {
      logger.error('[ERROR] From listCollection in collectionUtils', error);
      throw error;
    }
  };

collectionUtils.createCollection = async (obj) => {
  try {
    const { body } = obj;
    const { name } = body;
    const isExist = await Collection.findOne({ name });
    if (isExist) {
       const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_COLLECTION_ALREADY_EXIST') };
      throw errorObj;
    }
    const collectionInfo = await new Collection({ name }).save();
    return collectionInfo._doc;
  } catch (error) {
    logger.error('[ERROR] From createCollection in collectionUtils', error);
    throw error;
  }
};

collectionUtils.editCollection = async (obj) => {
    try {
      const { body } = obj;
      const { name, collectionId } = body;
      const isExist = await Collection.findOne({ _id: collectionId });
      if (!isExist) {
         const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_COLLECTION_NOT_FOUND') };
        throw errorObj;
      }
      const isExistWithSameName = await Collection.findOne({ _id: { $ne: collectionId }, name });
      if (isExistWithSameName) {
         const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_COLLECTION_ALREADY_EXIST') };
        throw errorObj;
      }
      isExist.name = name;
      isExist.updatedAt = new Date();
      await isExist.save();
      return isExist._doc;
    } catch (error) {
      logger.error('[ERROR] From editCollection in collectionUtils', error);
      throw error;
    }
};

collectionUtils.deleteCollection = async (obj) => {
    try {
      const { body } = obj;
      const { collectionId } = body;
      const isExist = await Collection.findOne({ _id: collectionId });
      if (!isExist) {
         const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_COLLECTION_NOT_FOUND') };
        throw errorObj;
      }
      await Collection.remove({ _id: collectionId });
      return true;
    } catch (error) {
      logger.error('[ERROR] From deleteCollection in collectionUtils', error);
      throw error;
    }
};

module.exports = collectionUtils;
