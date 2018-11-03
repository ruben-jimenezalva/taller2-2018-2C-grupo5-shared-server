'use strict';

const express = require('express');
const logger = require('../others/logger');
var AppServer = require('../appServer/AppServer');
var Payment = require('../payment/Payment');
var Tracking = require('../tracking/Tracking');
var User = require('../user/User');
var Delivery = require('../delivery/Delivery');
var cors = require('cors');

// Constants
const PORT = process.env.PORT;

// App
const app = express();

//Enable Alls CORS Request
app.use(cors());


app.get('/', (req, res) => {
  res.status(200).send({code:200, message:'Hello World..!'});
});

app.use('/api/servers', AppServer);
app.use('/api/payments', Payment);
app.use('/api/trackings', Tracking);
app.use('/api/user', User);
app.use('/api/deliveries/estimate', Delivery);

app.listen(PORT, () =>{
  var message = `App running on port ${PORT}`;
  logger.info(message);
});
