const logger = require('../../../helper/logger');
const commonConsts = require('../../../constants/common');
const utils = require('../../../helper/utils');
const encryptUtil = require('../../../helper/encryptUtil');
const mongoose = require('mongoose');
const jwt = require('../../../helper/jwt');
const User = require('./userModel');
const Role = require('./roleModel');
const l10n = require('jm-ez-l10n');

const userUtils = {};

userUtils.listUser = async (obj) => {
    try {
        const { queryParams } = obj;
        const { limit, offset } = utils.validatePaginate(queryParams);
        const total = await User.find().count();
        const users = await User.find().sort('-_id').limit(limit).skip(offset);
        return { total, users };
    } catch (error) {
        logger.error('[ERROR] From listUser in userUtils', error);
        throw error;
    }
};

userUtils.login = async (obj) => {
    try {
        const { body } = obj;
        const { password } = body;
        const email = body.email.toLowerCase();
        const user = await User.findOne({ email });
        if (!user) {
            const errorObj = { code: 400, error: l10n.t('ERR_CREDENTIAL_NOT_MATCHED') };
            throw errorObj;
        }
        const isExactMatch = await encryptUtil.validateBcryptHash(password, user.password);
        if (!isExactMatch) {
            const errorObj = { code: 400, error: l10n.t('ERR_CREDENTIAL_NOT_MATCHED') };
            throw errorObj;
        }
        const token = jwt.getAuthToken({ userId: user._id });
        const result = {
            token,
            user: {
                userId: user._id,
                email: user.email,
            },
        };
        return result;
    } catch (error) {
        logger.error('[ERROR] From login in userUtils', error);
        throw error;
    }
};

userUtils.createUser = async (obj) => {
    try {
        const { body } = obj;
        const { email, password } = body;
        const isExist = await User.findOne({ email });
        if (isExist) {
            const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_USER_ALREADY_EXIST') };
            throw errorObj;
        }
        const { encoded: encPassword } = await encryptUtil.oneWayEncrypt(password);
        const UserInfo = await new User({ email, password: encPassword }).save();
        delete UserInfo._doc.password
        return UserInfo._doc;
    } catch (error) {
        logger.error('[ERROR] From createUser in userUtils', error);
        throw error;
    }
};

userUtils.editUser = async (obj) => {
    try {
        const { body } = obj;
        const { email, password, userId } = body;
        const isExist = await User.findOne({ _id: mongoose.Types.ObjectId(userId) });
        if (!isExist) {
            const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_USER_NOT_FOUND') };
            throw errorObj;
        }
        if (email) {
            // Check existance of email with same email
            const isExistWithSameEmail = await User.findOne({ _id: { $ne: userId }, email });
            if (isExistWithSameEmail) {
                const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_USER_ALREADY_EXIST') };
                throw errorObj;
            }
            isExist.email = email;
        }
        if (password) {
            const { encoded: encPassword } = await encryptUtil.oneWayEncrypt(password);
            isExist.password = encPassword;
        }
        isExist.updatedAt = new Date();
        await isExist.save();
        delete isExist._doc.password;
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

userUtils.assignGroup = async (obj) => {
    try {
        const { body } = obj;
        const { userId, roleId } = body;
        const isUserExist = await User.findOne({ _id: mongoose.Types.ObjectId(userId) });
        if (!isUserExist) {
            const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_USER_NOT_FOUND') };
            throw errorObj;
        }
        const isRoleExist = await Role.findOne({ _id: mongoose.Types.ObjectId(roleId) });
        if (!isRoleExist) {
            const errorObj = { code: commonConsts.ERROR400.CODE, error: l10n.t('ERR_USER_ROLE_NOT_FOUND') };
            throw errorObj;
        }
        const isRoleAlreadyAssigned = await User.findOne({ _id: mongoose.Types.ObjectId(userId), "roles.roleId": mongoose.Types.ObjectId(roleId) });
        if (isRoleAlreadyAssigned) {
            logger.info('You have already assigned this role');  
            return true;
        }
        await User.update({ _id: mongoose.Types.ObjectId(userId) }, { $push: { roles: { roleId: mongoose.Types.ObjectId(roleId) } } });
        return true;
    } catch (error) {
        logger.error('[ERROR] From editUser in userUtils', error);
        throw error;
    }
};

module.exports = userUtils;
