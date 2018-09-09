var express = require('express');
var router = express.Router();
var db = require('../service/queries.js');
var bodyParser = require('body-parser');

//start body-parser configuration
router.use(bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


//User
router.post('/token',db.createToken);

//Application Servers
router.get('/servers', db.getAllServers);
router.post('/servers', db.createServer);
router.get('/servers/:id', db.getSingleServer);
router.put('/servers/:id', db.updateServer);
router.delete('/servers/:id', db.removeServer);
router.post('/servers/:id', db.resetTokenServer);

//Payment
router.get('/payment', db.getMyPayments);
router.post('/payment', db.createPayment);
router.get('/payment/methods', db.getAvaliblePaymentMethods);

//Tracking
router.post('/tracking', db.createTracking);
router.get('/tracking/:id', db.getInfoTracking);

/*
//Delivery
router.post('/delivery/estimate', function(req, res) {
    res.send('delivery estimate');
});
*/
module.exports = router;