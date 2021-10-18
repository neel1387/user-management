const l10n = require('jm-ez-l10n');
const { check } = require('express-validator');
const { customValidators } = require('../../../helper/validate');

const validationRules = {};

validationRules.createUserValidator = () => {
  return [
    check('email', l10n.t('ERR_EMAIL_REQUIRED')).exists({ checkFalsy: true }),
    check('parentId', l10n.t('ERR_PARENT_ID_REQUIRED')).exists({ checkFalsy: true }).custom((value) => { return customValidators.isValidMongoID(value); })
  ];
};

validationRules.editUserValidator = () => {
  return [
    check('userId', l10n.t('ERR_USER_ID_REQUIRED')).exists({ checkFalsy: true }).custom((value) => { return customValidators.isValidMongoID(value); }),
    check('email', l10n.t('ERR_EMAIL_REQUIRED')).exists({ checkFalsy: true }),
    check('parentId', l10n.t('ERR_PARENT_ID_REQUIRED')).exists({ checkFalsy: false }).custom((value) => { return !!value ? customValidators.isValidMongoID(value) : true })
  ];
};

validationRules.deleteUserValidator = () => {
  return [
    check('userId', l10n.t('ERR_USER_ID_REQUIRED')).exists({ checkFalsy: true }).custom((value) => { return customValidators.isValidMongoID(value); })
  ];
};

module.exports = validationRules;
