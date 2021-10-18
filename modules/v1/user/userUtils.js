const l10n = require('jm-ez-l10n');
const logger = require('../../../helper/logger');
const jwt = require('../../../helper/jwt');
const commonConsts = require('../../../constants/common');
const modelConsts = require('../../../constants/model');
const encryptUtil = require('../../../helper/encryptUtil');
const moment = require('moment');

const userUtils = {};

// userUtils.isExist = async (obj) => {
//   try {
//     const condition = { isDeleted: false };
//     Object.assign(condition, obj);
//     const params = ['id'];
//     const querying = {
//       attributes: params,
//       where: condition,
//     };
//     const result = await Model.user.findAndCountAll(querying);
//     return !!result.count;
//   } catch (error) {
//     logger.error('[ERROR] From isExist in userUtils', error);
//     throw error;
//   }
// };

// userUtils.login = async (obj) => {
//   try {
//     const { password } = obj;
//     const email = obj.email.toLowerCase();
//     const verified = `${modelConsts.status.emailStatus.verified}`;
//     const joins = [
//       {
//         model: Model.category,
//         required: false,
//         where: {
//           isDeleted: false,
//         },
//         attributes: ['id', 'name'],
//       },
//     ];     
//     const params = ['id', 'name', 'email', 'phone', 'gender', 'dob', 'profilePic', 'password',
//       'isMentor', 'emailStatus', 'isSocialLogin', 'subscriptionStatus', 
//       'notificationPref', 'cost', 'inPersonCost', 'biography', 'philosophy', 'quote'];
//     const condition = {
//       email: email, isActive: true, isDeleted: false, isSocialLogin: false,
//     };
//     const querying = {
//       attributes: params,
//       include: joins,
//       where: condition,
//     };
//     const user = await Model.user.findOne(querying);
//     if (!user) {
//       const errorObj = { code: 400, error: l10n.t('ERR_CREDENTIAL_NOT_MATCHED') };
//       throw errorObj;
//     }
//     const isExactMatch = await encryptUtil.validateBcryptHash(password, user.password);
//     if (!isExactMatch) {
//       const errorObj = { code: 400, error: l10n.t('ERR_CREDENTIAL_NOT_MATCHED') };
//       throw errorObj;
//     }
//     const token = jwt.getAuthToken({ userId: user.id });
//     const result = {
//       token,
//       user: {
//         userId: user.id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         gender: user.gender,
//         dob: user.dob,
//         profilePic: user.profilePic,
//         isVerified: user.emailStatus === verified,
//         isSocialLogin: !!user.isSocialLogin,
//         isMentor: user.isMentor,
//         subscriptionStatus: user.subscriptionStatus,
//         notificationPref: user.notificationPref,
//         cost: user.cost,
//         inPersonCost: user.inPersonCost,
//         biography: user.biography || null,
//         philosophy: user.philosophy || null,
//         quote: user.quote || null,
//         category: user.category && user.category.name ? user.category.name : null,
//       },
//     };
//     return result;
//   } catch (error) {
//     logger.error('[ERROR] From login in userUtils', error);
//     throw error;
//   }
// };

// userUtils.myProfile = async (obj) => {
//   try {
//     const { user } = obj;
//     const {
//       id, name, email, phone, deviceToken, dob, profilePic, isMentor,
//       gender, isSocialLogin, subscriptionStatus, notificationPref,
//       biography, philosophy, quote, cost, inPersonCost,
//     } = user;
//     const verified = `${modelConsts.status.emailStatus.verified}`;
//     const userProfile = {
//       userId: id,
//       name,
//       email,
//       phone,
//       gender,
//       deviceToken,
//       dob,
//       profilePic,
//       isVerified: user.emailStatus === verified,
//       isSocialLogin,
//       isMentor,
//       subscriptionStatus,
//       notificationPref,
//       biography: biography || null,
//       philosophy: philosophy || null,
//       quote: quote || null,
//       cost: cost || null,
//       inPersonCost: inPersonCost || null,
//       category: user.category && user.category.name ? user.category.name : null,
//     };
//     return userProfile;
//   } catch (error) {
//     logger.error('[ERROR] From myProfile in userUtils', error);
//     throw error;
//   }
// };

// userUtils.changePassword = async (obj) => {
//   try {
//     const { user, password, newPassword } = obj;
//     const params = ['id', 'email', 'password'];
//     const condition = {
//       id: user.id, isDeleted: false,
//     };
//     const querying = {
//       attributes: params,
//       where: condition,
//     };
//     const result = await Model.user.findOne(querying);
//     if (!result) {
//       const errorObj = { code: 400, error: l10n.t('ERR_USER_NOT_FOUND') };
//       throw errorObj;
//     }
//     const isExactMatch = await encryptUtil.validateBcryptHash(password, result.password);
//     if (!isExactMatch) {
//       const errorObj = { code: 400, error: l10n.t('ERR_OLD_PASSWORD_INCORRECT') };
//       throw errorObj;
//     }
//     const { encoded: encPassword } = await encryptUtil.oneWayEncrypt(newPassword);
//     const updateObj = {
//       password: encPassword,
//       updatedAt: new Date(),
//     };
//     const cond = { where: { id: result.id } };
//     await Model.user.update(updateObj, cond);
//     return true;
//   } catch (error) {
//     logger.error('[ERROR] From changePassword in userUtils', error);
//     throw error;
//   }
// };

// userUtils.editProfile = async (obj) => {
//   try {
//     const { user, body } = obj;
//     const {
//       name, phone, gender, dob, deviceToken, profilePic,
//       biography, philosophy, quote, cost, inPersonCost, notificationPref,
//     } = body;
//     const verified = `${modelConsts.status.emailStatus.verified}`;
//     const email = obj.body.email ? obj.body.email.toLowerCase() : null;
//     // const formattedPhone = phone ? new PhoneNumber(`${phone}`).getNumber('e164') : null;
//     const updateObj = {
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       gender: user.gender,
//       dob: user.dob,
//       deviceToken: user.deviceToken,
//       profilePic: user.profilePic,
//       biography: user.biography,
//       philosophy: user.philosophy,
//       quote: user.quote,
//       cost: user.cost,
//       inPersonCost: user.inPersonCost,
//       notificationPref: user.notificationPref,
//     };
//     if (email && email !== user.email) {
//       const cond = {
//         id: {
//           [Op.ne]: user.id,
//         },
//         isDeleted: false,
//         email,
//         isSocialLogin: false,
//       };
//       const isEmailTaken = await userUtils.isExist(cond);
//       if (isEmailTaken) {
//         const errorObj = { code: 400, error: l10n.t('ERR_EMAIL_ALREADY_EXIST') };
//         throw errorObj;
//       }
//       updateObj.email = email;
//     }
//     if (phone && phone !== user.phone) {
//       const cond = {
//         id: {
//           [Op.ne]: user.id,
//         },
//         isDeleted: false,
//         phone: phone, // Will replace it with formattedPhone
//       };
//       const isPhoneTaken = await userUtils.isExist(cond);
//       if (isPhoneTaken) {
//         const errorObj = { code: 400, error: l10n.t('ERR_PHONE_ALREADY_EXIST') };
//         throw errorObj;
//       }
//       updateObj.phone = phone; // Will replace it with formattedPhone
//     }
//     if (name) {
//       updateObj.name = name;
//     }
//     if (gender !== undefined) {
//       if (gender) {
//         const genders = modelConsts.user.gender.enums.map((m) => { return m.key; });
//         const isValid = genders.includes(gender);
//         if (!isValid) {
//           const errorObj = { code: 422, error: l10n.t('ERR_GENDER_REQUIRED') };
//           throw errorObj;
//         }
//       } 
//       updateObj.gender = gender || null;
//     }
//     if (dob !== undefined) {
//       if (dob) {
//         const isValid = moment(dob, 'MM/DD/YYYY', true).isValid();
//         if (!isValid) {
//           const errorObj = { code: 422, error: l10n.t('ERR_DOB_REQUIRED') };
//           throw errorObj;
//         }
//       }
//       updateObj.dob = dob || null;
//     }
//     if (notificationPref !== undefined) {
//       updateObj.notificationPref = notificationPref;
//     }
//     if (deviceToken) {
//       updateObj.deviceToken = deviceToken;
//     }
//     if (profilePic !== undefined) {
//       updateObj.profilePic = profilePic || null;
//     }
//     if (user.isMentor) {
//       if (biography !== undefined) {
//         updateObj.biography = biography || null;
//       }
//       if (philosophy !== undefined) {
//         updateObj.philosophy = philosophy || null;
//       }
//       if (quote !== undefined) {
//         updateObj.quote = quote || null;
//       }
//     }
//     if (user.isMentor && cost && +user.cost !== cost) {
//       updateObj.cost = cost;
//     }
//     if (user.isMentor && inPersonCost && +user.inPersonCost !== inPersonCost) {
//       updateObj.inPersonCost = inPersonCost;
//     }
//     updateObj.updatedAt = new Date();
//     const cond = { where: { id: user.id, isDeleted: false } };
//     await Model.user.update(updateObj, cond);
//     if (user.isMentor && cost && (+user.cost !== +cost)) {
//       const costObj = { 
//         user,
//         oldCost: +user.cost,
//         newCost: cost,
//         costType: `${modelConsts.user.costType.inApp}`,
//       };
//       await userUtils.updateCostOfSlots(costObj);
//       await userUtils.addCostChangeEntry(costObj);
//     }
//     if (user.isMentor && inPersonCost && (+user.inPersonCost !== +inPersonCost)) {
//       const costObj = { 
//         user,
//         oldCost: +user.inPersonCost,
//         newCost: inPersonCost,
//         costType: `${modelConsts.user.costType.inPerson}`,
//       };
//       await userUtils.updateCostOfSlots(costObj);
//       await userUtils.addCostChangeEntry(costObj);
//     }
//     const res = { ...updateObj };
//     res.userId = user.id;
//     res.isVerified = user.emailStatus === verified;
//     res.isSocialLogin = user.isSocialLogin;
//     res.isMentor = user.isMentor;
//     res.category = user.isMentor ? user.category.name : null;
//     return { user: res };
//   } catch (error) {
//     logger.error('[ERROR] From editProfile in userUtils', error);
//     throw error;
//   }
// };

module.exports = userUtils;
