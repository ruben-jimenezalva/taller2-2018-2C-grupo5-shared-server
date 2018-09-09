
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
  var createdBy = req.body.createdBy || '';
  var name = req.body.name || '';

  if(createdBy == '' || name == ''){
    return res.json({code: 400, data: 'Incumplimiento de precondiciones (parámetros faltantes)'});
  }

  const values = [createdBy,name];
  //res.json({code: 201, data: req.body.createdBy, data2: req.body.name})
  client.query(text, values, (err, resp) => {
    if (err) {
      res.json({code: 500, data: err.message});
    } else {
      res.json({code: 201, data: resp.rows});
    }
  })
}

function getSingleServer (req, res, next){
  var client = new Client();
  client.connect((err) => {
    if (err) {
      res.json({code: 500, data: err.message});
    }
  })

  const text = 'SELECT * FROM Servers WHERE server_id=$1';
  
  client.query(text, [req.params.id], (err, resp) => {
    if (err) {
      res.json({code: 500, data: err.message});
    } else {
      if(resp.rows == ''){
        res.json({code: 404, data:'Servidor inexistente'});
      }else{
        res.json({code: 200, data: resp.rows});
      }
    }
  })
}

function updateServer (req, res, next){
  res.send('updateServer\n');
}


function removeServer (req, res, next){
  var client = new Client();
  client.connect((err) => {
    if (err) {
      res.json({code: 500, data: err.message});
    }
  })

  const text = 'DELETE FROM Servers WHERE server_id=$1';
  


  //falta corregir
  client.query(text, [req.params.id], (err, resp) => {
    if (err) {
      res.json({code: 500, data: err.message});
    } else {
      if(resp.count == '0'){
        res.json({code: resp.count, data:'No existe el recurso solicitado'});
      }else{
        res.json({code: resp.count, data: 'Baja correcta'});
      }
    }
  })
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