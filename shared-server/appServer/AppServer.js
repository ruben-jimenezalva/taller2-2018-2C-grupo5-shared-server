var express = require('express');
var router = express.Router();
var db = require('./AppServerController');
var bodyParser = require('body-parser');
var TokenController = require('../auth/TokenController');
var morgan = require('morgan');
var logger = require('../others/logger');

router.use(morgan('combined', { stream: logger.stream }));

//start body-parser configuration
router.use(bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


//--- api used by AppServer and admin

//reset token of app server
router.post('/:id',TokenController.invalidateToken,db.resetTokenServer);

//create a app server
router.post('/', db.createServer);

//update a app server
router.put('/:id',TokenController.verifyToken,db.updateServer);

//get all app servers
router.get('/',TokenController.verifyToken,db.getAllServers);

//get single app server
router.get('/:id',TokenController.verifyToken, db.getSingleServer);

//delete a app server
router.delete('/:id',TokenController.verifyToken,db.removeTrackings,db.removePayments,TokenController.invalidateToken, db.removeServer);


//api used by admin
router.get('/ping/:url',TokenController.verifyToken, db.getSingleServer);


module.exports = router;