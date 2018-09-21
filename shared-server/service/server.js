'use strict';

const express = require('express');
var AppServer = require('../appServer/AppServer');
const logger = require('../others/logger');

// Constants
const PORT = process.env.PORT;

// App
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World..!');
});

app.use('/api/servers', AppServer);

app.listen(PORT, () =>{
  var message = `App running on port ${PORT}`;
  logger.info(message);
});
        
