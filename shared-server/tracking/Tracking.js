var express = require('express');
var morgan = require('morgan');
var router = express.Router();
var db = require('./TrackingController');
var tokenController = require('../auth/TokenController');

var logger = require('../others/logger');
var bodyParser = require('body-parser');

router.use(morgan('combined',{stream : logger.stream}));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended:true
}));


//get single tracking of a particular server
router.get('/:tracking_id',tokenController.verifyToken,db.getInfoTracking);


//create tracking of a particular server
router.post('/',tokenController.verifyToken,db.createTracking);


module.exports = router;

