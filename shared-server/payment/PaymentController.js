const model = require('./PaymentModels');
const logger =  require('../others/logger');

function getMyPayments (req, res, next){
    var client = req.client;
    var nameFunction = arguments.callee.name;
    client.query("select * FROM payment WHERE server_fk=$1",[req.id], (err, resp) => {
        if (err) {
            logger.error(__filename,nameFunction,err.message);
            res.status(500).json({code: 500, message: err.message});
        } else {
            res.status(200).send(model.getMyPayments(resp));
            //res.status(200).send(resp.rows);
            logger.info(__filename,nameFunction,'get all my payments with success');
        }
        client.end();
    })   
}
  
function createPayment (req, res, next){
    var nameFunction = arguments.callee.name;
    var client = req.client;
    var text1 = "INSERT INTO payment(currency,value,server_fk,expiration_month,expiration_year,method,number,type)";
    var text2 = "VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *";
    var currency = req.body.currency || '';
    var value = req.body.value || '';
    var server_fk = req.id;
    var expiration_month = req.body.paymentMethod.expiration_month || '';
    var expiration_year = req.body.paymentMethod.expiration_year || '';
    var method = req.body.paymentMethod.method || '';
    var number = req.body.paymentMethod.number || '';
    var type = req.body.paymentMethod.type || '';
    values = [currency,value,server_fk,expiration_month,expiration_year,method,number,type];
    client.query(text1+text2,values, (err, resp) => {
        if (err) {
            logger.error(__filename,nameFunction,err.message);
            res.status(500).json({code: 500, message: err.message});
        } else {
            res.status(201).send(model.postCreatePayment(resp));
            //res.status(200).send(resp.rows[0]);
            logger.info(__filename,nameFunction,'payment created with success');
        }
        client.end();
    })   
}
 

function getPaymentMethods (req, res, next){
    var client = req.client;
    var nameFunction = arguments.callee.name;
    client.query("select * FROM payment", (err, resp) => {
        if (err) {
            logger.error(__filename,nameFunction,err.message);
            res.status(500).json({code: 500, message: err.message});
        } else {
            res.status(200).send(model.getPaymentMethods(resp));
            //res.status(200).send(resp.rows);
            logger.info(__filename,nameFunction,'get all paymethods with success');
        }
        client.end();
    })   
}

module.exports = {
    getMyPayments: getMyPayments,
    createPayment: createPayment,
    getPaymentMethods: getPaymentMethods,
};