var express = require('express');
var router = express.Router();
var db = require('./AppServerController');
var bodyParser = require('body-parser');
var connect_db = require('../service/Connect');
var verifyToken = require('../auth/VerifyToken');

//start body-parser configuration
router.use(bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
/*
//Application Servers
router.get('/',connect_db,db.getAllServers);
router.post('/',connect_db, db.createServer);
router.get('/:id',connect_db, db.getSingleServer);
router.put('/:id',connect_db, db.updateServer);
router.delete('/:id',connect_db, db.removeServer);
router.post('/:id',connect_db, db.resetTokenServer);
*/

//Application Servers with token
router.get('/',connect_db,verifyToken,db.getAllServers);
router.post('/',connect_db, db.createServer);
router.get('/:id',connect_db,verifyToken, db.getSingleServer);
router.put('/:id',connect_db,verifyToken, db.updateServer);
router.delete('/:id',connect_db,verifyToken, db.removeServer);
router.post('/:id',connect_db, db.resetTokenServer);

module.exports = router;