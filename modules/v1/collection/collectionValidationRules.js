const l10n = require('jm-ez-l10n');
const { check } = require('express-validator');
const modelConsts = require('../../../constants/model');
const { customValidators } = require('../../../helper/validate');

const validationRules = {};

validationRules.createMenteeValidator = () => {
  return [
    check('name', l10n.t('ERR_NAME_REQUIRED')).exists({ checkFalsy: true }),
    check('email', l10n.t('ERR_EMAIL_REQUIRED')).isEmail(),
    check('password', l10n.t('ERR_PASSWORD_REQUIRED')).isString().custom((value) => { return customValidators.isValidPassword(value); }),
  ];
};

validationRules.loginValidator = () => {
  return [
    check('email', l10n.t('ERR_EMAIL_REQUIRED')).isEmail(),
    check('password', l10n.t('ERR_PASSWORD_REQUIRED')).exists({ checkFalsy: true }).isString(),
  ];
};

validationRules.resendOTPValidator = () => {
  return [
    check('email', l10n.t('ERR_EMAIL_REQUIRED')).isEmail(),
  ];
};

validationRules.otpVerifyValidator = () => {
  return [
    check('email', l10n.t('ERR_EMAIL_REQUIRED')).isEmail(),
    check('otp', l10n.t('ERR_OTP_REQUIRED')).isString().isLength({ min: 6, max: 6 }),
  ];
};

validationRules.forgetPasswordValidator = () => {
  return [
    check('email', l10n.t('ERR_EMAIL_REQUIRED')).isEmail(),
  ];
};

validationRules.resetPasswordValidator = () => {
  return [
    check('password', l10n.t('ERR_PASSWORD_REQUIRED')).isString().custom((value) => { return customValidators.isValidPassword(value); }),
    check('resetToken', l10n.t('ERR_RESET_TOKEN_REQUIRED')).exists({ checkFalsy: true }),
  ];
};

validationRules.changePasswordValidator = () => {
  return [
    check('password', l10n.t('ERR_PASSWORD_REQUIRED')).exists({ checkFalsy: true }).isString(),
    check('newPassword', l10n.t('ERR_PASSWORD_REQUIRED')).isString().custom((value) => { return customValidators.isValidPassword(value); }),
  ];
};

validationRules.editProfileValidator = () => {
  return [
    check('name', l10n.t('ERR_NAME_REQUIRED')).optional().exists({ checkFalsy: true }),
    check('email', l10n.t('ERR_EMAIL_REQUIRED')).optional().isEmail(),
    check('phone', l10n.t('ERR_PHONE_REQUIRED')).optional().exists({ checkFalsy: true }).isString(),
    check('notificationPref', l10n.t('ERR_INVALID_BOOL')).optional().custom((value) => { return customValidators.isValidBool(value); }),
    check('cost', l10n.t('ERR_COST_REQUIRED')).optional().custom((value) => { return customValidators.isPositiveInt(value); }),
    check('inPersonCost', l10n.t('ERR_INPERSON_COST_REQUIRED')).optional().custom((value) => { return customValidators.isPositiveInt(value); }),
  ];
};

validationRules.socialLogin = () => {
  return [
    check('name', l10n.t('ERR_NAME_REQUIRED')).optional().exists({ checkFalsy: true }).isString(),
    check('email', l10n.t('ERR_EMAIL_REQUIRED')).optional().isEmail(),
    check('profilePic', l10n.t('ERR_PROFILEPIC_REQUIRED')).optional().exists({ checkFalsy: true }).isString(),
    check('socialPlatform', l10n.t('ERR_SOCIAL_PLATFORM_REQUIRED')).isIn(modelConsts.user.socialPlatform),
    check('socialToken', l10n.t('ERR_SOCIAL_TOKEN_REQUIRED')).isString().isLength({ min: 5, max: 5000 }),
  ];
};

validationRules.costChangeRequestValidator = () => {
  return [
    check('cost', l10n.t('ERR_COST_REQUIRED')).custom((value) => { return customValidators.isPositiveInt(value); }),
    check('costType', l10n.t('ERR_INVALID_COSTTYPE')).isIn(modelConsts.user.costType),
  ];
};

validationRules.mentorDetailValidator = () => {
  return [
    check('mentorId', l10n.t('ERR_MENTORID_REQUIRED')).custom((value) => { return customValidators.isPositiveInt(value); }),
  ];
};

validationRules.addSlotValidator = () => {
  return [
    check('slots', l10n.t('ERR_SLOT_REQUIRED')).isArray(modelConsts.user.mentor.sessionTypes),
    check('slots.*.startDate', l10n.t('ERR_STARTTIME_REQUIRED')).exists({ checkFalsy: true }).isString(),
    check('slots.*.sessionType', l10n.t('ERR_INVALID_SESSIONTYPE')).isIn(modelConsts.user.mentor.sessionTypes),
  ];
};

validationRules.editSlotValidator = () => {
  return [
    check('slotId', l10n.t('ERR_SLOTID_REQUIRED')).custom((value) => { return customValidators.isPositiveInt(value); }),
    check('date', l10n.t('ERR_INVALID_DATE')).optional().custom((value) => {
      return customValidators.isNotPreviousDate(value);
    }),
    check('sessionType', l10n.t('ERR_INVALID_SESSIONTYPE')).optional().isIn(modelConsts.user.mentor.sessionTypes),
    check('startTime', l10n.t('ERR_STARTTIME_REQUIRED')).optional().exists({ checkFalsy: true }).isString(),
    check('endTime', l10n.t('ERR_ENDTIME_REQUIRED')).optional().exists({ checkFalsy: true }).isString(),
  ];
};

validationRules.deleteSlotValidator = () => {
  return [
    check('slotId', l10n.t('ERR_SLOTID_REQUIRED')).custom((value) => { return customValidators.isPositiveInt(value); }),
  ];
};

validationRules.buySubscriptionValidator = () => {
  return [
    check('receipt', l10n.t('ERR_RECEIPT_REQUIRED')).isString(),
    check('password', l10n.t('ERR_APPLE_PASSWORD_REQUIRED')).isString(),
    check('subscriptionId', l10n.t('ERR_SUBSCRIPTIONID_REQUIRED')).custom((value) => { return customValidators.isPositiveInt(value); }),
    check('mode', l10n.t('ERR_MODE_REQUIRED')).isIn(modelConsts.userSubscription.inAppMode),
  ];
};

validationRules.bookSessionValidator = () => {
  return [
    check('slotId', l10n.t('ERR_SLOTID_REQUIRED')).custom((value) => { return customValidators.isPositiveInt(value); }),
    check('token', l10n.t('ERR_TOKEN_REQUIRED')).isString(),
  ];
};

validationRules.availableSlotsValidator = () => {
  return [
    check('date', l10n.t('ERR_INVALID_DATE')).custom((value) => {
      return customValidators.isValidUTCDate(value);
    }),
    check('mentorId', l10n.t('ERR_MENTORID_REQUIRED')).custom((value) => { return customValidators.isPositiveInt(value); }),
  ];
};

validationRules.mySessionsValidator = () => {
  return [
    check('date', l10n.t('ERR_INVALID_DATE')).custom((value) => {
      return customValidators.isValidUTCDate(value);
    }),
  ];
};

validationRules.actionSessionValidator = () => {
  return [
    check('sessionId', l10n.t('ERR_SESSIONID_REQUIRED')).custom((value) => { return customValidators.isPositiveInt(value); }),
    check('isAccepted', l10n.t('ERR_INVALID_BOOL')).custom((value) => { return customValidators.isValidBool(value); }),
    check('reason', l10n.t('ERR_REASON_REQUIRED')).optional().isString().isLength({ min: 6, max: 139 }),
  ];
};

validationRules.updateNotificationPrefValidator = () => {
  return [
    check('isAllow', l10n.t('ERR_INVALID_BOOL')).custom((value) => { return customValidators.isValidBool(value); }),
  ];
};

validationRules.cancelSessionValidator = () => {
  return [
    check('sessionId', l10n.t('ERR_SESSIONID_REQUIRED')).custom((value) => { return customValidators.isPositiveInt(value); }),
    check('reason', l10n.t('ERR_REASON_REQUIRED')).optional().isString().isLength({ min: 6, max: 139 }),
  ];
};

validationRules.startSessionValidator = () => {
  return [
    check('sessionId', l10n.t('ERR_SESSIONID_REQUIRED')).custom((value) => { return customValidators.isPositiveInt(value); }),
  ];
};

validationRules.getTokenValidator = () => {
  return [
    check('sessionId', l10n.t('ERR_SESSIONID_REQUIRED')).custom((value) => { return customValidators.isPositiveInt(value); }),
  ];
};

validationRules.stopSessionValidator = () => {
  return [
    check('sessionId', l10n.t('ERR_SESSIONID_REQUIRED')).custom((value) => { return customValidators.isPositiveInt(value); }),
  ];
};

validationRules.mentorSessionsValidator = () => {
  return [
    check('date', l10n.t('ERR_INVALID_DATE')).custom((value) => {
      return customValidators.isValidUTCDate(value);
    }),
  ];
};

validationRules.slotHideUnHideValidator = () => {
  return [
    check('slotId', l10n.t('ERR_SLOTID_REQUIRED')).custom((value) => { return customValidators.isPositiveInt(value); }),
    check('isHide', l10n.t('ERR_INVALID_BOOL')).custom((value) => { return customValidators.isValidBool(value); }),
  ];
};

module.exports = validationRules;
