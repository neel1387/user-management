const express = require('express');
const userCtr = require('./userController');
const userValidator = require('./userValidationRules');
const { validationHandler } = require('../../../helper/validate');
const userMiddleware = require('./userMiddleware');

const userRouter = express.Router();

// Create Mentee
// const createMentee = [
//   userValidator.createMenteeValidator(),
//   validationHandler,
//   userCtr.createMentee,
// ];
// userRouter.post('/create', createMentee);

// const login = [
//   userValidator.loginValidator(),
//   validationHandler,
//   userCtr.login,
// ];
// userRouter.post('/login', login);

module.exports = userRouter;
