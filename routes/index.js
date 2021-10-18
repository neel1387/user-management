const express = require('express');

const router = express.Router();

router.use('/', require('../modules'));

module.exports = router;
