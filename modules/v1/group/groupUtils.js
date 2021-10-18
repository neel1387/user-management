const logger = require('../../../helper/logger');
const commonConsts = require('../../../constants/common');
const utils = require('../../../helper/utils');
const Group = require('./groupModel');
const Collection = require('../collection/collectionModel');
const l10n = require('jm-ez-l10n');
const _ = require('lodash');

const groupUtils = {};

groupUtils.listGroup = async (obj) => {
    try {
        const { queryParams } = obj;
        const { limit, offset } = utils.validatePaginate(queryParams);
        const total =  await Group.find().count();
        const groups = await Group.find().sort('-_id').limit(limit).skip(offset);
        return { total, groups };
    } catch (error) {
        logger.error('[ERROR] From listGroup in groupUtils', error);
        throw error;
    }
};

groupUtils.createGroup = async (obj) => {
    try {
        const { body } = obj;
        const { name, collectionIds } = body;
        const isExist = await Group.findOne({ name });
        if (isExist) {
            const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_GROUP_ALREADY_EXIST') };
            throw errorObj;
        }
        const filteredCollection = _.uniqBy(collectionIds);
        const isCollectionExist = await Collection.find({ _id: { $in: filteredCollection } });
        if (isCollectionExist && isCollectionExist.length !== filteredCollection.length) {
            const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_COLLECTION_NOT_FOUND') };
            throw errorObj;
        }
        // Check for is collection occupied for another group
        const isCollectionOccupied = await Group.find({ "collectionIds.collectionId": { $in: filteredCollection } });
        if (isCollectionOccupied.length) {
            const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_COLLECTION_ALREADY_OCCPIED') };
            throw errorObj;
        }
        const groupObj = {
            name,
            collectionIds: filteredCollection.map((w) => { return { collectionId: w } })
        }
        const GroupInfo = await new Group(groupObj).save();
        return GroupInfo._doc;
    } catch (error) {
        logger.error('[ERROR] From createGroup in groupUtils', error);
        throw error;
    }
};

groupUtils.editGroup = async (obj) => {
    try {
        const { body } = obj;
        const { name, groupId, collectionIds } = body;
        const isExist = await Group.findOne({ _id: groupId });
        if (!isExist) {
            const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_GROUP_NOT_FOUND') };
            throw errorObj;
        }
        if (name) {
            // Check for item existency with same name
            const isExistWithSameName = await Group.findOne({ _id: { $ne: groupId }, name });
            if (isExistWithSameName) {
                const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_GROUP_ALREADY_EXIST') };
                throw errorObj;
            }
            isExist.name = name;
        }
        if (collectionIds) {

            const filteredCollection = _.uniqBy(collectionIds);
            // Check for collection existency if need to update
            const isCollectionExist = await Collection.find({ _id: { $in: filteredCollection } });
            if (isCollectionExist && isCollectionExist.length !== filteredCollection.length) {
                const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_COLLECTION_NOT_FOUND') };
                throw errorObj;
            }
            // Check for is collection occupied for another group
            const isCollectionOccupied = await Group.find({ _id: { $ne: groupId }, "collectionIds.collectionId": { $in: filteredCollection } });
            if (isCollectionOccupied.length) {
                const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_COLLECTION_ALREADY_OCCPIED') };
                throw errorObj;
            }
            isExist.collectionIds = filteredCollection.map((w) => { return { collectionId: w } })
        }
        isExist.updatedAt = new Date();
        await isExist.save();
        return isExist._doc;
    } catch (error) {
        logger.error('[ERROR] From editGroup in groupUtils', error);
        throw error;
    }
};

groupUtils.deleteGroup = async (obj) => {
    try {
        const { body } = obj;
        const { groupId } = body;
        const isExist = await Group.findOne({ _id: groupId });
        if (!isExist) {
            const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_GROUP_NOT_FOUND') };
            throw errorObj;
        }
        await Group.remove({ _id: groupId });
        return true;
    } catch (error) {
        logger.error('[ERROR] From deleteGroup in groupUtils', error);
        throw error;
    }
};

module.exports = groupUtils;
