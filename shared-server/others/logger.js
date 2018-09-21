'use strict';

const winston = require('winston');
const getNamespace = require('continuation-local-storage').getNamespace;
var appRoot = require('app-root-path');

console.log(`${appRoot}/logs/all-logs.log`);

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
        timestamp: true
      }),
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        timestamp: true
      })
    ],
    exitOnError: false
  });
  
  winstonLogger.stream = {
      write: function (message, encoding) {
          winstonLogger.info(message);
      }
  };
  
  
  // Wrap Winston logger to print reqId in each log
  var formatMessage = function(message) {
      var myRequest = getNamespace('my request');
      message = myRequest && myRequest.get('reqId') ? message + " reqId: " + myRequest.get('reqId') : message;
      return message;
  };
  
  var logger = {
      log: function(level, message) {
          winstonLogger.log(level, formatMessage(message));
      },
      error: function(message) {
          winstonLogger.error(formatMessage(message));
      },
      warn: function(message) {
          winstonLogger.warn(formatMessage(message));
      },
      verbose: function(message) {
          winstonLogger.verbose(formatMessage(message));
      },
      info: function(message) {
          winstonLogger.info(formatMessage(message));
      },
      debug: function(message) {
          winstonLogger.debug(formatMessage(message));
      },
  };
  
  module.exports = logger;