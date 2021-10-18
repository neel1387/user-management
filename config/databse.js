const mongoose = require("mongoose");
const config = require("./config");
const logger = require('../helper/logger');

module.exports.connect = mongoose.connect(config.database.uri, config.database.options, (err) => {
	if (err) {
		logger.info('Error while connecting to database');
	} else {
		logger.info('Connected to database successfully');
	}
});
