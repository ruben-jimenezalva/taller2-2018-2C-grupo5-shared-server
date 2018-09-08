
const {Client} = require('pg');
const client = new Client();

client.connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
})

// add query functions
function createToken (req, res, next){
  res.send('screateTokken\n');
}

function getAllServers (req, res, next){

  var client = new Client();
  client.connect((err) => {
    if (err) {
      res.json({code: 500, data: err.message});
    }
  })

  client.query('SELECT * FROM servers', (err, resp) => {
    if (err) {
      res.json({code: 500, data: err.message});
    } else {
      res.json({code: 200, data: resp.rows});
    }
  }) 

}

function createServer (req, res, next){
  var client = new Client();
  client.connect((err) => {
    if (err) {
      res.json({code: 500, data: err.message});
    }
  })

  const text = 'INSERT INTO Servers(createdBy, nameServer) VALUES($1, $2) RETURNING *';
  const values = ['brianc', 'sasd'];
  client.query(text, values, (err, resp) => {
    if (err) {
      res.json({code: 500, data: err.message});
    } else {
      res.json({code: 200, data: resp.rows});
    }
  })
}

function getSingleServer (req, res, next){
  res.send('getSingleServer\n');
}

function updateServer (req, res, next){
  res.send('updateServer\n');
}

function removeServer (req, res, next){
  res.send('removeServer\n');
}

function resetTokenServer (req, res, next){
  res.send('resetTokenServer\n');
}

function getMyPayments (req, res, next){
  res.send('getMyPaymentsssssssssssssss\n');
}

function createPayment (req, res, next){
  res.send('createPayment\n');
}

function getAvaliblePaymentMethods (req, res, next){
  res.send('getAvaliblePaymentMethods\n');
}

function createTracking (req, res, next){
  res.send('createTracking\n');
}

function getInfoTracking (req, res, next){
  res.send('getInfoTracking\n');
}


module.exports = {
  createToken: createToken,
  getAllServers: getAllServers,
  createServer: createServer,
  getSingleServer: getSingleServer,
  updateServer: updateServer,
  removeServer: removeServer,
  resetTokenServer: resetTokenServer,
  getMyPayments: getMyPayments,
  createPayment: createPayment,
  getAvaliblePaymentMethods: getAvaliblePaymentMethods,
  createTracking: createTracking,
  getInfoTracking: getInfoTracking,
};