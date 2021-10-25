const logger = require('../../../helper/logger');
const commonConsts = require('../../../constants/common');
const utils = require('../../../helper/utils');
const Collection = require('./collectionModel');
const Group = require('../group/groupModel');
const Role = require('../user/roleModel');
const l10n = require('jm-ez-l10n');

const collectionUtils = {};

collectionUtils.listCollection = async (obj) => {
  try {
    const { queryParams, user } = obj;
    const condition = [];
    const result = {
      collections: [],
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
        condition._id = { $in: collectionIds };
        condition.push({ $match: { _id: { $in: collectionIds } } });
      } else {
        return result;
      }
    }
    const querying = [
      ...condition,
      {
        $lookup: {
          from: "groups",
          localField: "_id",
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
        $lookup: {
          from: "items",
          localField: "_id",
          foreignField: "parentId",
          as: "item"
        }
      },
      {
        $unwind: {
          path: '$item',
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
          "group._id": 1,
          "group.name": 1,
          "item._id": 1,
          "item.name": 1,
        }
      }
    ];
    const { page, limit } = utils.validatePaginate(queryParams, true);
    const options = { page, limit, allowDiskUse: true };
    const aggregate = Collection.aggregate(querying).allowDiskUse(true);
    const collections = await Collection.aggregatePaginate(aggregate, options);
    if (collections && collections.totalDocs > 0) {
      result.collections = collections.docs;
      result.total = collections.totalDocs;
    }
    return result;
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
