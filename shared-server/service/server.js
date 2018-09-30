'use strict';

const express = require('express');
const logger = require('../others/logger');
var AppServer = require('../appServer/AppServer');
var Payment = require('../payment/Payment');
var Tracking = require('../tracking/Tracking');
var User = require('../user/User');

// Constants
const PORT = process.env.PORT;

// App
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World..!');
});

app.use('/api/servers', AppServer);
app.use('/api/payments', Payment);
app.use('/api/tracking', Tracking);
app.use('/api/user', User);

app.listen(PORT, () =>{
  var message = `App running on port ${PORT}`;
  logger.info(message);
});