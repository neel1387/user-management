const logger = require('../../../helper/logger');
const commonConsts = require('../../../constants/common');
const utils = require('../../../helper/utils');
const Item = require('./itemModel');
const Collection = require('../collection/collectionModel');
const Role = require('../user/roleModel');
const Group = require('../group/groupModel');
const l10n = require('jm-ez-l10n');

const itemUtils = {};

itemUtils.listItem = async (obj) => {
    try {
        const { queryParams, user } = obj;
        const condition = [];
        const result = {
            items: [],
            total: 0,
        }
        const roleIds = user.roles.map((r) => { return r.roleId.toString(); });
        const globalRoleId = await Role.findOne({ role: "globalManager" });
        const globalRole = globalRoleId._id.toString();
        if (!roleIds.includes(globalRole)) {
            const roleDetails = await Role.find({ _id: { $in: roleIds } });
            const groupIds = roleDetails.filter((r) => { return r.groupId; }).map((r) => { return r.groupId });
            if (groupIds && groupIds.length) {
                const groupDetails = await Group.find({ _id: { $in: groupIds } });
                const collectionIds = [];
                groupDetails.forEach((g) => {
                    g.collectionIds.forEach((c) => {
                        collectionIds.push(c.collectionId);
                    })
                });
                condition.push({ $match: { parentId: { $in: collectionIds } } });
            } else {
                return result;
            }
        }
        const querying = [
            ...condition,
            {
                $lookup: {
                    from: "collections",
                    localField: "parentId",
                    foreignField: "_id",
                    as: "collection"
                }
            },
            {
                $unwind: {
                    path: '$collection',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "groups",
                    localField: "collection._id",
                    foreignField: "collectionIds.collectionId",
                    as: "group"
                }
            },
            {
                $unwind: {
                    path: '$group',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    _id: -1
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "collection._id": 1,
                    "collection.name": 1,
                    "group._id": 1,
                    "group.name": 1,
                }
            }
        ];
        const { page, limit } = utils.validatePaginate(queryParams, true);
        const options = { page, limit, allowDiskUse: true };
        const aggregate = Item.aggregate(querying).allowDiskUse(true);
        const items = await Item.aggregatePaginate(aggregate, options);
        if (items && items.totalDocs > 0) {
            result.items = items.docs;
            result.total = items.totalDocs;
        }
        return result;
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
