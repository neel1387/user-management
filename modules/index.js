const express = require('express');

const router = express.Router();

// To manage versioning in API's
router.use('/v1', require('./v1'));

module.exports = router;
