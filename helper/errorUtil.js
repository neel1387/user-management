const errorUtil = {};
const l10n = require('jm-ez-l10n');

errorUtil.generateError = (obj) => {
  const newObj = { ...obj };
  newObj.code = (obj && obj.code && typeof obj.code === 'number' && obj.code > 99 && obj.code < 600) ? obj.code : 500;
  newObj.error = (obj && obj.error && typeof obj.error === 'string') ? obj.error : l10n.t('ERR_INTERNAL_SERVER');
  return newObj;
};

module.exports = errorUtil;
