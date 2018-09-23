'use strict';

const winston = require('winston');
var appRoot = require('app-root-path');

const winstonLogger = winston.createLogger({
    transports: [
      new winston.transports.File({
        level: 'debug',
        filename: `${appRoot}/logs/all-logs.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
        timestamp: true,
      }),
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        timestamp: true,
      })
    ],
    exitOnError: false
  });
  
  winstonLogger.stream = {
      write: function (message, encoding) {
          winstonLogger.info(message);
      },
  };
  
  var logger = {
      log: function(level, message) {
          winstonLogger.log(level,message,{timestamp: new Date()});
      },
      error: function(message) {
          winstonLogger.error(message,{timestamp: new Date()});
      },
      warn: function(message) {
          winstonLogger.warn(message,{timestamp: new Date()});
      },
      verbose: function(message) {
          winstonLogger.verbose(message,{timestamp: new Date()});
      },
      info: function(message) {
          winstonLogger.info(message,{timestamp: new Date()});
      },
      debug: function(message) {
          winstonLogger.debug(message,{timestamp: new Date()});
      },
  };

module.exports = logger;