const winston = require('winston');
const moment = require('moment');

const timestampFormat = () => { return moment().format('YYYY-MM-DD hh:mm:ss'); };

const logger = new (winston.createLogger)({
  transports: [
      new (winston.transports.Console)({
          format: winston.format.combine(
             winston.format.colorize(),
             winston.format.simple(),
          ),
          timestamp: timestampFormat,
          prettyPrint: true,
          level: 'info'
      })
  ]
});

module.exports = logger;