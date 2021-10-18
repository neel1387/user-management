const express = require('express');
const collectionCtr = require('./collectionController');
const collectionValidator = require('./collectionValidationRules');
const { validationHandler } = require('../../../helper/validate');
const collectionMiddleware = require('./collectionMiddleware');

const collectionRouter = express.Router();

// List of Collection
const listCollection = [
  collectionCtr.listCollection,
];
collectionRouter.get('/list', listCollection);

// Create Collection
const createCollection = [
  collectionValidator.createCollectionValidator(),
  validationHandler,
  collectionCtr.createCollection,
];
collectionRouter.post('/create', createCollection);

// Edit Collection
const editCollection = [
  collectionValidator.editCollectionValidator(),
  validationHandler,
  collectionCtr.editCollection,
];
collectionRouter.put('/edit', editCollection);

// Delete Collection
const deleteCollection = [
  collectionValidator.deleteCollectionValidator(),
  validationHandler,
  collectionCtr.deleteCollection,
];
collectionRouter.delete('/delete', deleteCollection);

module.exports = collectionRouter;
