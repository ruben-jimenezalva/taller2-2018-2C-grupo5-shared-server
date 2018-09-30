'use strict'
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('../others/logger');
const tokenController = require('../auth/TokenController');
const db = require('./UserController');


router.use(morgan('combined', { stream : logger.stream}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true}));

//login user api/user/login
router.post('/login',db.login);

//register  user/api/user/register
router.post('/register',db.register);


module.exports = router;