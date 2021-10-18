const express = require('express');
const { ERROR400 } = require('../constants/common');

const router = express.Router();

router.use('/', require('../modules'));

router.all('/*', (req, res) => {
    return res.status(ERROR400.CODE).json({ error: req.t(ERROR400.MESSAGE) });
});

module.exports = router;
