const express = require('express');
const userCtr = require('./userController');
const userValidator = require('./userValidationRules');
const { validationHandler } = require('../../../helper/validate');
const userMiddleware = require('./userMiddleware');

const userRouter = express.Router();

// List of User
const listUser = [
    userMiddleware.isAuthenticatedUser,
    userCtr.listUser,
];
userRouter.get('/list', listUser);

// Login
const login = [
    userValidator.loginValidator(),
    validationHandler,
    userCtr.login,
];
userRouter.post('/login', login);

// Create User
const createUser = [
    userValidator.createUserValidator(),
    validationHandler,
    userMiddleware.isAuthenticatedGlobalManager,
    userCtr.createUser,
];
userRouter.post('/create', createUser);

// Edit User
const editUser = [
    userValidator.editUserValidator(),
    validationHandler,
    userMiddleware.isAuthenticatedGlobalManager,
    userCtr.editUser,
];
userRouter.put('/edit', editUser);

// Delete User
const deleteUser = [
    userValidator.deleteUserValidator(),
    validationHandler,
    userMiddleware.isAuthenticatedGlobalManager,
    userCtr.deleteUser,
];
userRouter.delete('/delete', deleteUser);

// Assign Group
const assignGroup = [
    userValidator.assignGroupValidator(),
    validationHandler,
    userMiddleware.isAuthenticatedGlobalManager,
    userCtr.assignGroup,
];
userRouter.post('/assignGroup', assignGroup);

// Revoke Group
const revokeGroup = [
    userValidator.revokeGroupGroupValidator(),
    validationHandler,
    userMiddleware.isAuthenticatedGlobalManager,
    userCtr.revokeGroup,
];
userRouter.post('/revokeGroup', revokeGroup);

module.exports = userRouter;
