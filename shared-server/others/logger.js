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
  

  var logger = {

      log: function(level, message) {
            winstonLogger.log(level,message,{timestamp: new Date()});
      },
      error: function(file,nameFunction,message) {
            var data = {timestamp: new Date(), file:file, function:nameFunction};
            winstonLogger.error(message,data);
      },
      warn: function(file,nameFunction,message) {
            var data = {timestamp: new Date(), file:file, function:nameFunction};
            winstonLogger.warn(message,data);
      },
      verbose: function(file,nameFunction,message) {
            var data = {timestamp: new Date(), file:file, function:nameFunction};
            winstonLogger.verbose(message,data);
      },
      info: function(file,nameFunction,message) {
            var data = {timestamp: new Date(), file:file, function:nameFunction};
            winstonLogger.info(message,data);
      },
      debug: function(file,nameFunction,message) {
            var data = {timestamp: new Date(), file:file, function:nameFunction};
            winstonLogger.debug(message,data);
      },
  };


  logger.stream = {
      write: function (message, encoding) {
          winstonLogger.info(message);
      },
  };

module.exports = logger;