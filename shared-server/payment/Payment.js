var express = require('express');
var router = express.Router();
var db = require('./PaymentController');
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

//---   api used by AppServer
//create payment
router.post('/',TokenController.verifyToken, db.createPayment);



//---   api used by both

/**
 * get all payments
 * return all payments of a AppServer if a AppServer execute the query
 * return all payments if a Administrator execute execute the query
 */
router.get('/',TokenController.verifyToken,db.getMyPayments);

/**
 * get all paymethodsMethods
 * return all paymentsMethods of a AppServer if a AppServer execute the query
 * return all paymentsMethods if a Administrator execute execute the query
 */
router.get('/methods',TokenController.verifyToken, db.getPaymentMethods);

/**
 * get single payment
 * return payment if it belongs to AppServer that execute the query
 * return payment that belongs any Appserver if a Administrator execute the query
 */
router.get('/:transaction_id',TokenController.verifyToken, db.getSinglePayment); //-----------> (added)

module.exports = router;