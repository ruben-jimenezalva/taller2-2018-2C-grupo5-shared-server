var express = require('express');
var router = express.Router();
var db = require('./AppServerController');
var bodyParser = require('body-parser');
var connect_db = require('../service/Connect');
var TokenController = require('../auth/TokenController');

//start body-parser configuration
router.use(bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//get all app servers
router.get('/',connect_db,TokenController.verifyToken,db.getAllServers);

//create a app server
router.post('/',connect_db, db.createServer,db.saveToken);

//get single app server
router.get('/:id',connect_db,TokenController.verifyToken, db.getSingleServer);

//update a app server
router.put('/:id',connect_db,TokenController.verifyToken, db.updateServer);

//delete a app server
router.delete('/:id',connect_db,TokenController.verifyToken,db.deleteToken, db.removeServer);

//reset token of app server
router.post('/:id',connect_db, db.resetTokenServer);

module.exports = router;