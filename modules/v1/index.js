const express = require('express');
const path = require('path');
const logger = require('../../helper/logger');
const { ERROR400 } = require('../../constants/common');

const router = express.Router();
const apiVersion = path.basename(__filename, '.js');

router.use((req, res, next) => {
  req.apiVersion = apiVersion;
  return next();
});

// Routes
router.use('/user', require('./user/userRoute'));
router.use('/collection', require('./collection/collectionRoute'));
router.use('/item', require('./item/itemRoute'));

router.all('/*', (req, res) => {
  logger.info('Error Log');
  return res.status(ERROR400.CODE).json({
    error: req.t(ERROR400.MESSAGE)
  });
});

module.exports = router;
