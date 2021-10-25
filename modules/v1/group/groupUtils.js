const logger = require('../../../helper/logger');
const commonConsts = require('../../../constants/common');
const modelConsts = require('../../../constants/model');
const utils = require('../../../helper/utils');
const Group = require('./groupModel');
const Collection = require('../collection/collectionModel');
const User = require('../user/userModel');
const Role = require('../user/roleModel');
const mongoose = require('mongoose');
const l10n = require('jm-ez-l10n');
const _ = require('lodash');

const groupUtils = {};

groupUtils.listGroup = async (obj) => {
    try {
        const { queryParams, user } = obj;
        const condition = [];
        const result = {
            groups: [],
            total: 0,
        };
        const roleIds = user.roles.map((r) => { return r.roleId.toString(); });
        const globalRoleId = await Role.findOne({ role: "globalManager" });
        const globalRole = globalRoleId._id.toString();
        if (!roleIds.includes(globalRole)) {
            const roleDetails = await Role.find({ _id: { $in: roleIds } });
            const groupIds = roleDetails.filter((r) => { return r.groupId; }).map((r) => { return r.groupId });
            if (groupIds && groupIds.length) {
                condition.push({ $match: { _id: { $in: groupIds } } });
            } else {
                return result;
            }
        }
        const querying = [
            ...condition,
            {
                $lookup: {
                    from: "roles",
                    localField: "_id",
                    foreignField: "groupId",
                    as: "groupRoles"
                }
            },
            {
                $lookup: {
                    from: "collections",
                    localField: "collectionIds.collectionId",
                    foreignField: "_id",
                    as: "collection"
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
                    "groupRoles._id": 1,
                    "groupRoles.role": 1,
                }
            }
        ];
        const { page, limit } = utils.validatePaginate(queryParams, true);
        const options = { page, limit, allowDiskUse: true };
        const aggregate = Group.aggregate(querying).allowDiskUse(true);
        const groups = await Group.aggregatePaginate(aggregate, options);
        if (groups && groups.totalDocs > 0) {
            result.groups = groups.docs;
            result.total = groups.totalDocs;
        }
        return result;
    } catch (error) {
        logger.error('[ERROR] From listGroup in groupUtils', error);
        throw error;
    }
};

groupUtils.createGroup = async (obj) => {
    try {
        const { body, user } = obj;
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
        const groupId = GroupInfo._doc._id;
        const { groupRoles } = modelConsts;
        const rolesObj = groupRoles.map((g) => {
            return { role: g, groupId };
        });
        await Role.insertMany(rolesObj);
        // Assign a manager role to the group creator 
        const managerRole = await Role.findOne({ groupId, role: "manager" });
        await User.update({ _id: mongoose.Types.ObjectId(user._id) }, { $push: { roles: { roleId: mongoose.Types.ObjectId(managerRole._id) } } });
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
        const getRoles = await Role.find({ groupId: mongoose.Types.ObjectId(groupId) });
        const roleIds = getRoles.map((g) => { return g._id; });
        const userRoles = [];
        const groupRoles = [];
        roleIds.forEach((r) => {
            const updateUser = User.updateMany({ "roles.roleId": mongoose.Types.ObjectId(r) }, { $pull: { "roles": { roleId: mongoose.Types.ObjectId(r) } } });
            userRoles.push(updateUser);
        });
        await Promise.all(userRoles);
        roleIds.forEach((r) => {
            const deleteGroupRole = Role.remove({ _id: mongoose.Types.ObjectId(r) });;
            groupRoles.push(deleteGroupRole);
        });
        await Promise.all(groupRoles);
        await Group.remove({ _id: groupId });
        return true;
    } catch (error) {
        logger.error('[ERROR] From deleteGroup in groupUtils', error);
        throw error;
    }
};

module.exports = groupUtils;
