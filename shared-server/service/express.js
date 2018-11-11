
const express = require('express');
var AppServer = require('../appServer/AppServer');
var Payment = require('../payment/Payment');
var Tracking = require('../tracking/Tracking');
var User = require('../user/User');
var Delivery = require('../delivery/Delivery');
var cors = require('cors');

// App
const app = express();

//Enable Alls CORS Request
app.use(cors());

app.use('/api/servers', AppServer);
app.use('/api/payments', Payment);
app.use('/api/trackings', Tracking);
app.use('/api/user', User);
app.use('/api/deliveries/estimate', Delivery);

module.exports = app;