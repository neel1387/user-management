const { validationResult } = require('express-validator');
const { ERROR422 } = require('../constants/common');
const mongoose = require('mongoose');

const validateUtils = {};

validateUtils.validationHandler = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(ERROR422).json({ 
      error: result.errors[0].msg,
      code: ERROR422,
    });
  }
  return next();
};

const customValidators = {};

customValidators.isPositiveInt = (str) => {
  return !!(str && str > 0);
};

customValidators.isValidMongoID = (str) => {
  if (str) {
    return mongoose.Types.ObjectId.isValid(`${str}`);
  }
  return false;
};

customValidators.isValidMongoIDs = (str) => {
  if (str && Array.isArray(str) && str.length > 0) {
    // Here we use .every because it will break if validation goes fail
    return str.every((w) => { return customValidators.isValidMongoID(w); });
  }
  return false;
};

validateUtils.customValidators = customValidators;

module.exports = validateUtils;
