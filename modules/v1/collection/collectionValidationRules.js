const l10n = require('jm-ez-l10n');
const { check } = require('express-validator');
const { customValidators } = require('../../../helper/validate');

const validationRules = {};

validationRules.createCollectionValidator = () => {
  return [
    check('name', l10n.t('ERR_COLLECTION_NAME_REQUIRED')).exists({ checkFalsy: true })
  ];
};

validationRules.editCollectionValidator = () => {
  return [
    check('name', l10n.t('ERR_COLLECTION_NAME_REQUIRED')).exists({ checkFalsy: true }),
    check('collectionId', l10n.t('ERR_COLLECTION_ID_REQUIRED')).exists({ checkFalsy: true }).custom((value) => { return customValidators.isValidMongoID(value); })
  ];
};

validationRules.deleteCollectionValidator = () => {
  return [
    check('collectionId', l10n.t('ERR_COLLECTION_ID_REQUIRED')).exists({ checkFalsy: true }).custom((value) => { return customValidators.isValidMongoID(value); })
  ];
};

module.exports = validationRules;
