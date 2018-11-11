'use strict';

const app = require('./express');
const logger = require('../others/logger');

// Constants
const PORT = process.env.PORT;

app.listen(PORT, () =>{
  var message = `App running on port ${PORT}`;
  logger.info(message);
});
