const express = require('express');
const userCtr = require('./userController');
const userValidator = require('./userValidationRules');
const { validationHandler } = require('../../../helper/validate');
const userMiddleware = require('./userMiddleware');

const userRouter = express.Router();

// List of User
const listUser = [
    userCtr.listUser,
];
userRouter.get('/list', listUser);

// Login
const login = [
    itemValidator.loginValidator(),
    validationHandler,
    userCtr.login,
];
userRouter.post('/create', login);

// Create User
const createUser = [
    itemValidator.createUserValidator(),
    validationHandler,
    userCtr.createUser,
];
userRouter.post('/create', createUser);

// Edit User
const editUser = [
    itemValidator.editUserValidator(),
    validationHandler,
    userCtr.editUser,
];
userRouter.put('/edit', editUser);

// Delete User
const deleteUser = [
    itemValidator.deleteUserValidator(),
    validationHandler,
    userCtr.deleteUser,
];
userRouter.delete('/delete', deleteUser);

module.exports = userRouter;
