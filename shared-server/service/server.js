'use strict';

const express = require('express');
var birds = require('../service/birds.js');
//var bodyParser = require('body-parser');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
/*
//start body-parser configuration
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
*/
app.get('/', (req, res) => {
  res.send('Nodejs: Hello World!\n');
});

app.use('/api', birds);
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

