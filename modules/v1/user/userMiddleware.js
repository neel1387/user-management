const jwt = require('../../../helper/jwt');
const logger = require('../../../helper/logger');
const { ERROR401 } = require('../../../constants/common');
const mongoose = require('mongoose');
const User = require('./userModel');
const Role = require('./roleModel');
const errorUtil = require('../../../helper/errorUtil');

const middleware = {};

middleware.isAuthenticatedUser = async (req, res, next) => {
  try {
    await middleware.authenticateUser(req, false, false);
    return next();
  } catch (err) {
    logger.error('[ERROR] From isAuthenticatedUser in userMiddleware', err);
    const { code, error, status } = errorUtil.generateError(err);
    return res.status(code).json({ error, code, status });
  }
};

middleware.isAuthenticatedGlobalManager = async (req, res, next) => {
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
    const result = jwt.decodeAuthToken(token);
    if (!result.userId) {
      throw authError;
    }
    const userId = result.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw authError;
    }
    const gloablRoleId = await Role.findOne({ role: "globalManager" });
    const condition = {
      _id: userId,
      "roles.roleId": gloablRoleId._id
    };

    const user = await User.findOne(condition);
    if (!user) {
      throw errorObj;
    }
    req.user = user;
    return next();
  } catch (err) {
    logger.error('[ERROR] From isAuthenticatedGlobalManager in userMiddleware', err);
    const { code, error, status } = errorUtil.generateError(err);
    return res.status(code).json({ error, code, status });
  }
};

middleware.isAuthenticatedAdminUser = async (req, res, next) => {
  try {
    await middleware.authenticateUser(req, true, false);
    return next();
  } catch (err) {
    logger.error('[ERROR] From isAuthenticatedAdminUser in userMiddleware', err);
    const { code, error, status } = errorUtil.generateError(err);
    return res.status(code).json({ error, code, status });
  }
};

middleware.isOptionalAuthenticated = async (req, res, next) => {
  try {
    await middleware.authenticateUser(req, false, true);
    return next();
  } catch (err) {
    logger.error('[ERROR] From isAuthenticatedAdminUser in userMiddleware', err);
    const { code, error, status } = errorUtil.generateError(err);
    return res.status(code).json({ error, code, status });
  }
};

middleware.authenticateUser = async (req, isAdmin, isOptional) => {
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
    if (!token && !isOptional) {
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

      if (isAdmin) {
        condition.roles = ["user", "admin"];
      }

      const user = await User.findOne(condition);
      if (!user) {
        throw errorObj;
      }
      req.user = user;
    }
    return req;
  } catch (err) {
    logger.error('[ERROR] From authenticateUser in userMiddleware', err);
    throw err;
  }
};

module.exports = middleware;