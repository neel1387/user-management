const express = require('express');
const itemCtr = require('./itemController');
const itemValidator = require('./itemValidationRules');
const { validationHandler } = require('../../../helper/validate');

const itemRouter = express.Router();

// List of Item
const listItem = [
    itemCtr.listItem,
];
itemRouter.get('/list', listItem);

// Create Item
const createItem = [
    itemValidator.createItemValidator(),
    validationHandler,
    itemCtr.createItem,
];
itemRouter.post('/create', createItem);

// Edit Item
const editItem = [
    itemValidator.editItemValidator(),
    validationHandler,
    itemCtr.editItem,
];
itemRouter.put('/edit', editItem);

// Delete Item
const deleteItem = [
    itemValidator.deleteItemValidator(),
    validationHandler,
    itemCtr.deleteItem,
];
itemRouter.delete('/delete', deleteItem);

module.exports = itemRouter;
