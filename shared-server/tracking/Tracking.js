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


//---   api used by AppServer

//create tracking of a particular server
router.post('/',tokenController.verifyToken,db.createTracking);



//---   api used by both

/**
 * get single tracking
 * return tracking if it belongs to AppServer that execute the query
 * return payment that belongs any Appserver if a Administrator execute the query
 */
router.get('/:tracking_id',tokenController.verifyToken,db.getInfoTracking);


/**
 * get all trackings
 * return all trackings of the AppServer that execute the query
 * return all trackings of any AppServer if a Administrator execute the query
 */
//router.get('/',tokenController.verifyToken,db.createTracking);//-------------> (added)


module.exports = router;
