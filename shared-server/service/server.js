'use strict';

const express = require('express');
const logger = require('../others/logger');
var AppServer = require('../appServer/AppServer');
var Payment = require('../payment/Payment');

// Constants
const PORT = process.env.PORT;

// App
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World..!');
});

app.use('/api/servers', AppServer);
app.use('/api/payments', Payment);

app.listen(PORT, () =>{
  var message = `App running on port ${PORT}`;
  logger.info(message);
});