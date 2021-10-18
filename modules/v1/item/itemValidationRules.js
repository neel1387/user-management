const l10n = require('jm-ez-l10n');
const { check } = require('express-validator');
const { customValidators } = require('../../../helper/validate');

const validationRules = {};

validationRules.createItemValidator = () => {
  return [
    check('name', l10n.t('ERR_ITEM_NAME_REQUIRED')).exists({ checkFalsy: true }),
    check('parentId', l10n.t('ERR_PARENT_ID_REQUIRED')).exists({ checkFalsy: true }).custom((value) => { return customValidators.isValidMongoID(value); })
  ];
};

validationRules.editItemValidator = () => {
  return [
    check('itemId', l10n.t('ERR_ITEM_ID_REQUIRED')).exists({ checkFalsy: true }).custom((value) => { return customValidators.isValidMongoID(value); }),
    check('name', l10n.t('ERR_ITEM_NAME_REQUIRED')).exists({ checkFalsy: false }),
    check('parentId', l10n.t('ERR_PARENT_ID_REQUIRED')).exists({ checkFalsy: false }).custom((value) => { return !!value ? customValidators.isValidMongoID(value) : true })
  ];
};

validationRules.deleteItemValidator = () => {
  return [
    check('itemId', l10n.t('ERR_ITEM_ID_REQUIRED')).exists({ checkFalsy: true }).custom((value) => { return customValidators.isValidMongoID(value); })
  ];
};

module.exports = validationRules;
