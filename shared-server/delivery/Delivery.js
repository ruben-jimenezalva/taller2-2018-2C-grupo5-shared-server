var express = require('express');
var router = express.Router();
var db = require('./DeliveryController');
var db = require('./DeliveryController');
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

// deliveries/estimate
//router.post('/',TokenController.verifyToken, db.calculateDelivery);
router.post('/', db.calculateDistanceDuration, db.calculateDelivery);
router.put('/', db.updateDataRules);
router.get('/', db.getDataRules);

module.exports = router;