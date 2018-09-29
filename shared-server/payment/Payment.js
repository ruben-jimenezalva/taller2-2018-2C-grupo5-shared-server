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

//get my payments
router.get('/',TokenController.verifyToken,db.getMyPayments);

//create a app server
router.post('/',TokenController.verifyToken, db.createPayment);

//get sall paymethods
router.get('/methods',TokenController.verifyToken, db.getPaymentMethods);

module.exports = router;