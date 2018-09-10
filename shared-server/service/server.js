/*'use strict';

const express = require('express');
var birds = require('../service/birds.js');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

app.get('/', (req, res) => {
  res.send('Nodejs: Hello World!\n');
});

app.use('/api', birds);
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

*/

'use strict';

const express = require('express');
var AppServer = require('../appServer/AppServer');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

app.get('/', (req, res) => {
  res.send('Nodejs: Hello World!\n');
});

app.use('/api/servers', AppServer);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
