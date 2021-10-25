const l10n = require('jm-ez-l10n');
const { check } = require('express-validator');
const { customValidators } = require('../../../helper/validate');

const validationRules = {};

validationRules.loginValidator = () => {
  return [
    check('email', l10n.t('ERR_EMAIL_REQUIRED')).isEmail(),
    check('password', l10n.t('ERR_PASSWORD_REQUIRED')).exists({ checkFalsy: true }).isString(),
  ];
};

validationRules.createUserValidator = () => {
  return [
    check('email', l10n.t('ERR_EMAIL_REQUIRED')).exists({ checkFalsy: true }),
    check('password', l10n.t('ERR_PASSWORD_REQUIRED')).exists({ checkFalsy: true }).isString(),
  ];
};

validationRules.editUserValidator = () => {
  return [
    check('userId', l10n.t('ERR_USER_ID_REQUIRED')).exists({ checkFalsy: true }).custom((value) => { return customValidators.isValidMongoID(value); }),
    check('email', l10n.t('ERR_EMAIL_REQUIRED')).exists({ checkFalsy: true }),
    check('password', l10n.t('ERR_PASSWORD_REQUIRED')).exists({ checkFalsy: false }).isString(),
  ];
};

validationRules.deleteUserValidator = () => {
  return [
    check('userId', l10n.t('ERR_USER_ID_REQUIRED')).exists({ checkFalsy: true }).custom((value) => { return customValidators.isValidMongoID(value); })
  ];
};

validationRules.assignGroupValidator = () => {
  return [
    check('userId', l10n.t('ERR_USER_ID_REQUIRED')).exists({ checkFalsy: true }).custom((value) => { return customValidators.isValidMongoID(value); }),
    check('roleId', l10n.t('ERR_ROLE_ID_REQUIRED')).exists({ checkFalsy: true }).custom((value) => { return customValidators.isValidMongoID(value); })
  ];
};

validationRules.revokeGroupGroupValidator = () => {
  return [
    check('userId', l10n.t('ERR_USER_ID_REQUIRED')).exists({ checkFalsy: true }).custom((value) => { return customValidators.isValidMongoID(value); }),
    check('roleId', l10n.t('ERR_ROLE_ID_REQUIRED')).exists({ checkFalsy: true }).custom((value) => { return customValidators.isValidMongoID(value); })
  ];
};

module.exports = validationRules;
