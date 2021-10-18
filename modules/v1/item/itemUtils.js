const logger = require('../../../helper/logger');
const commonConsts = require('../../../constants/common');
const utils = require('../../../helper/utils');
const Item = require('./itemModel');
const Collection = require('../collection/collectionModel');
const l10n = require('jm-ez-l10n');

const itemUtils = {};

itemUtils.listItem = async (obj) => {
    try {
        const { queryParams } = obj;
        const { limit, offset } = utils.validatePaginate(queryParams);
        const items = await Item.find().sort('-_id').limit(limit).skip(offset);
        return items;
    } catch (error) {
        logger.error('[ERROR] From listItem in itemUtils', error);
        throw error;
    }
};

itemUtils.createItem = async (obj) => {
    try {
        const { body } = obj;
        const { name, parentId } = body;
        const isExist = await Item.findOne({ name });
        if (isExist) {
            const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_ITEM_ALREADY_EXIST') };
            throw errorObj;
        }
        // Check existency of the collection
        const isParentIdExist = await Collection.findOne({ _id: parentId });
        if (!isParentIdExist) {
            const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_PARENT_NOT_FOUND') };
            throw errorObj;
        }
        // Check for is collection occupied for another item
        const isParentOccupied = await Item.findOne({ parentId });
        if (isParentOccupied) {
            const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_PARENT_ALREADY_OCCPIED') };
            throw errorObj;
        }
        const ItemInfo = await new Item({ name, parentId }).save();
        return ItemInfo._doc;
    } catch (error) {
        logger.error('[ERROR] From createItem in itemUtils', error);
        throw error;
    }
};

itemUtils.editItem = async (obj) => {
    try {
        const { body } = obj;
        const { name, itemId, parentId } = body;
        const isExist = await Item.findOne({ _id: itemId });
        if (!isExist) {
            const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_ITEM_NOT_FOUND') };
            throw errorObj;
        }
        if (name) {
            // Check for item existency with same name
            const isExistWithSameName = await Item.findOne({ _id: { $ne: itemId }, name });
            if (isExistWithSameName) {
                const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_ITEM_ALREADY_EXIST') };
                throw errorObj;
            }
            isExist.name = name;
        }
        if (parentId) {
            // Check for parent existency if need to update
            const isParentIdExist = await Collection.findOne({ _id: parentId });
            if (!isParentIdExist) {
                const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_PARENT_NOT_FOUND') };
                throw errorObj;
            }
            // Check for is collection occupied for another item
            const isParentOccupied = await Item.findOne({ parentId, _id: { $ne: itemId } });
            if (isParentOccupied) {
                const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_PARENT_ALREADY_OCCPIED') };
                throw errorObj;
            }
            isExist.parentId = parentId;
        }
        isExist.updatedAt = new Date();
        await isExist.save();
        return isExist._doc;
    } catch (error) {
        logger.error('[ERROR] From editItem in itemUtils', error);
        throw error;
    }
};

itemUtils.deleteItem = async (obj) => {
    try {
        const { body } = obj;
        const { itemId } = body;
        const isExist = await Item.findOne({ _id: itemId });
        if (!isExist) {
            const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_ITEM_NOT_FOUND') };
            throw errorObj;
        }
        await Item.remove({ _id: itemId });
        return true;
    } catch (error) {
        logger.error('[ERROR] From deleteItem in itemUtils', error);
        throw error;
    }
};

module.exports = itemUtils;
