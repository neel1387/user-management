const jwt = require('../../../helper/jwt');
const logger = require('../../../helper/logger');
const { ERROR401 } = require('../../../constants/common');
const mongoose = require('mongoose');
const User = require('../user/userModel');
const Role = require('../user/roleModel');
const errorUtil = require('../../../helper/errorUtil');

const middleware = {};

middleware.isAuthenticatedUser = async (req, res, next) => {
  try {
    await middleware.authenticateUser(req, false);
    return next();
  } catch (err) {
    logger.error('[ERROR] From isAuthenticatedUser in groupMiddleware', err);
    const { code, error, status } = errorUtil.generateError(err);
    return res.status(code).json({ error, code, status });
  }
};

middleware.isGroupAccess = async (req, res, next) => {
  try {
    const authError = {
      error: req.t('ERR_PERMISSION_ERROR'),
      code: ERROR401.CODE,
    };
    const errorObj = {
      error: req.t('ERR_USER_NO_GROUP_ACCESS'),
      code: ERROR401.CODE,
    };
    const token = req.headers.token || req.body.token || req.query.token || req.headers['x-access-token'];
    if (req.method === 'OPTIONS') {
      return next();
    }
    if (!token) {
      throw authError;
    }
    req.user = null;
    const result = jwt.decodeAuthToken(token);
    if (!result.userId) {
      throw authError;
    }
    const userId = result.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw authError;
    }
    const { groupId } = req.body;
    const globalRoleId = await Role.findOne({ role: "globalManager" });
    const condition = {
      _id: userId,
      "roles.roleId": globalRoleId._id
    };
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw errorObj;
    }
    const roleIds = user.roles.map((r) => { return r.roleId.toString(); });
    const globalRole = globalRoleId._id.toString();
    if (roleIds.includes(globalRole)) {
      return next()
    }
    if (groupId) {
      const groupRoles = await Role.findOne({ groupId, role: "manager" });
      if (groupRoles) {
        const roleids = [groupRoles._id, globalRoleId];
        condition["roles.roleId"] = { $in: roleids };
      } else {
        throw authError;
      }
    } else {
      condition["roles.roleId"] = globalRoleId._id;
    }
    req.user = user;
    return next();
  } catch (err) {
    logger.error('[ERROR] From isGroupAccess in groupMiddleware', err);
    const { code, error, status } = errorUtil.generateError(err);
    return res.status(code).json({ error, code, status });
  }
};

middleware.authenticateUser = async (req) => {
  try {
    const authError = {
      error: req.t('ERR_PERMISSION_ERROR'),
      code: ERROR401.CODE,
    };
    const errorObj = {
      error: req.t('ERR_USER_NO_ACCESS'),
      code: ERROR401.CODE,
    };
    const token = req.headers.token || req.body.token || req.query.token || req.headers['x-access-token'];
    if (req.method === 'OPTIONS') {
      return next();
    }
    if (!token) {
      throw authError;
    }
    req.user = null;
    if (token) {
      const result = jwt.decodeAuthToken(token);
      if (!result.userId) {
        throw authError;
      }
      const userId = result.userId;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw authError;
      }

      const condition = {
        _id: userId
      };

      const user = await User.findOne(condition);
      if (!user) {
        throw errorObj;
      }
      req.user = user;
    }
    return req;
  } catch (err) {
    logger.error('[ERROR] From authenticateUser in groupMiddleware', err);
    throw err;
  }
};

module.exports = middleware;