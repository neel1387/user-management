const express = require('express');
const groupCtr = require('./groupController');
const groupValidator = require('./groupValidationRules');
const groupMiddleware = require('./groupMiddleware');
const { validationHandler } = require('../../../helper/validate');

const groupRouter = express.Router();

// List of Group
const listGroup = [
    groupCtr.listGroup,
    groupMiddleware.isAuthenticatedUser,
];
groupRouter.get('/list', listGroup);

// Create Group
const createGroup = [
    groupValidator.createGroupValidator(),
    validationHandler,
    groupMiddleware.isAuthenticatedUser,
    groupCtr.createGroup,
];
groupRouter.post('/create', createGroup);

// Edit Group
const editGroup = [
    groupValidator.editGroupValidator(),
    validationHandler,
    groupMiddleware.isGroupAccess,
    groupCtr.editGroup,
];
groupRouter.put('/edit', editGroup);

// Delete Group
const deleteGroup = [
    groupValidator.deleteGroupValidator(),
    validationHandler,
    groupMiddleware.isGroupAccess,
    groupCtr.deleteGroup,
];
groupRouter.delete('/delete', deleteGroup);

module.exports = groupRouter;
