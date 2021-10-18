const l10n = require('jm-ez-l10n');
const { check } = require('express-validator');
const { customValidators } = require('../../../helper/validate');

const validationRules = {};

validationRules.createGroupValidator = () => {``
  return [
    check('name', l10n.t('ERR_GROUP_NAME_REQUIRED')).exists({ checkFalsy: true }),
    check('collectionIds', l10n.t('ERR_COLLECTION_ID_REQUIRED')).exists({ checkFalsy: true }).custom((value) => { return customValidators.isValidMongoIDs(value); })
  ];
};

validationRules.editGroupValidator = () => {
  return [
    check('groupId', l10n.t('ERR_GROUP_ID_REQUIRED')).exists({ checkFalsy: true }).custom((value) => { return customValidators.isValidMongoID(value); }),
    check('name', l10n.t('ERR_GROUP_NAME_REQUIRED')).exists({ checkFalsy: false }),
    check('collectionIds', l10n.t('ERR_COLLECTION_ID_REQUIRED')).exists({ checkFalsy: false }).custom((value) => { return !!value ? customValidators.isValidMongoIDs(value) : true })
  ];
};

validationRules.deleteGroupValidator = () => {
  return [
    check('groupId', l10n.t('ERR_GROUP_ID_REQUIRED')).exists({ checkFalsy: true }).custom((value) => { return customValidators.isValidMongoID(value); })
  ];
};

module.exports = validationRules;
