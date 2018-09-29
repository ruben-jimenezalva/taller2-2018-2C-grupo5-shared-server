'use strict'
var express = require('express');
var router = express.router();
bodyParser = require('body-parser');
morgan = require('morgan');
logger = require('../others/logger');

router.use(morgan('combined', { stream : logger.stream}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true}));

var tokenController = require('../auth/TokenController');
var db = require('./UserController');


router.post('/',tokenController.verifyToken,db.login);

