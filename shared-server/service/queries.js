
//ya no sirve se tiene que mover

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