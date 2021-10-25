const express = require('express');
const itemCtr = require('./itemController');
const itemValidator = require('./itemValidationRules');
const { validationHandler } = require('../../../helper/validate');
const itemMiddleware = require('./itemMiddleware');

const itemRouter = express.Router();

// List of Item
const listItem = [
    itemMiddleware.isAuthenticatedUser,
    itemCtr.listItem,
];
itemRouter.get('/list', listItem);

// Create Item
const createItem = [
    itemValidator.createItemValidator(),
    validationHandler,
    itemMiddleware.isAuthenticatedUser,
    itemCtr.createItem,
];
itemRouter.post('/create', createItem);

// Edit Item
const editItem = [
    itemValidator.editItemValidator(),
    validationHandler,
    itemMiddleware.isItemAccess,
    itemCtr.editItem,
];
itemRouter.put('/edit', editItem);

// Delete Item
const deleteItem = [
    itemValidator.deleteItemValidator(),
    validationHandler,
    itemMiddleware.isItemAccess,
    itemCtr.deleteItem,
];
itemRouter.delete('/delete', deleteItem);

module.exports = itemRouter;
