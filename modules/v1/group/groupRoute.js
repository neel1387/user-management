const express = require('express');
const groupCtr = require('./groupController');
const groupValidator = require('./groupValidationRules');
const { validationHandler } = require('../../../helper/validate');

const groupRouter = express.Router();

// List of Group
const listGroup = [
    groupCtr.listGroup,
];
groupRouter.get('/list', listGroup);

// Create Group
const createGroup = [
    groupValidator.createGroupValidator(),
    validationHandler,
    groupCtr.createGroup,
];
groupRouter.post('/create', createGroup);

// Edit Group
const editGroup = [
    groupValidator.editGroupValidator(),
    validationHandler,
    groupCtr.editGroup,
];
groupRouter.put('/edit', editGroup);

// Delete Group
const deleteGroup = [
    groupValidator.deleteGroupValidator(),
    validationHandler,
    groupCtr.deleteGroup,
];
groupRouter.delete('/delete', deleteGroup);

module.exports = groupRouter;
