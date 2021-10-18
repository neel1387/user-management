const logger = require('../../../helper/logger');
const commonConsts = require('../../../constants/common');
const utils = require('../../../helper/utils');
const User = require('./userModel');
const Collection = require('../collection/collectionModel');
const l10n = require('jm-ez-l10n');

const userUtils = {};

userUtils.listUser = async (obj) => {
    try {
        const { queryParams } = obj;
        const { limit, offset } = utils.validatePaginate(queryParams);
        const total =  await User.find().count();
        const users = await User.find().sort('-_id').limit(limit).skip(offset);
        return { total, users };
    } catch (error) {
        logger.error('[ERROR] From listUser in userUtils', error);
        throw error;
    }
};

userUtils.createUser = async (obj) => {
    try {
        const { body } = obj;
        const { name, parentId } = body;
        const isExist = await User.findOne({ name });
        if (isExist) {
            const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_USER_ALREADY_EXIST') };
            throw errorObj;
        }
        // Check existency of the collection
        const isParentIdExist = await Collection.findOne({ _id: parentId });
        if (!isParentIdExist) {
            const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_PARENT_NOT_FOUND') };
            throw errorObj;
        }
        // Check for is collection occupied for another item
        const isParentOccupied = await User.findOne({ parentId });
        if (isParentOccupied) {
            const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_PARENT_ALREADY_OCCPIED') };
            throw errorObj;
        }
        const UserInfo = await new User({ name, parentId }).save();
        return UserInfo._doc;
    } catch (error) {
        logger.error('[ERROR] From createUser in userUtils', error);
        throw error;
    }
};

userUtils.editUser = async (obj) => {
    try {
        const { body } = obj;
        const { name, userId, parentId } = body;
        const isExist = await User.findOne({ _id: userId });
        if (!isExist) {
            const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_USER_NOT_FOUND') };
            throw errorObj;
        }
        if (name) {
            // Check for item existency with same name
            const isExistWithSameName = await User.findOne({ _id: { $ne: userId }, name });
            if (isExistWithSameName) {
                const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_USER_ALREADY_EXIST') };
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
            const isParentOccupied = await User.findOne({ parentId, _id: { $ne: userId } });
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
        logger.error('[ERROR] From editUser in userUtils', error);
        throw error;
    }
};

userUtils.deleteUser = async (obj) => {
    try {
        const { body } = obj;
        const { userId } = body;
        const isExist = await User.findOne({ _id: userId });
        if (!isExist) {
            const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_USER_NOT_FOUND') };
            throw errorObj;
        }
        await User.remove({ _id: userId });
        return true;
    } catch (error) {
        logger.error('[ERROR] From deleteUser in userUtils', error);
        throw error;
    }
};

module.exports = userUtils;
