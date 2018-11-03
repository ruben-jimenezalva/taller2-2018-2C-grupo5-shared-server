const logger =  require('../others/logger');
var connect = require('../service/Connect');

function getMyPayments(data){
    var client = connect();
    var nameFunction = arguments.callee.name;
    var text = "select * FROM payment WHERE server_fk=$1";

    var promise = new Promise(function(reject,resolve){
        client.query(text,[data.id], (error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error)
            } else {
                var message = 'query get all payments of the server: '+data.id+' executed with success';
                logger.info(__filename,nameFunction,message);
                resolve(response);
            }
            client.end();
        });   
    });

    return promise;
}


function getAllPayments(){
    var client = connect();
    var nameFunction = arguments.callee.name;
    var text = "select * FROM payment";

    var promise = new Promise(function(reject,resolve){
        client.query(text, (error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error)
            } else {
                logger.info(__filename,nameFunction,'query get all payments executed with success');
                resolve(response);
            }
            client.end();
        });   
    });

    return promise;
}


function createPayment(data){
    var nameFunction = arguments.callee.name;
    var client = connect();
    var text1 = "INSERT INTO payment(currency,value,server_fk,expiration_month,expiration_year,method,number,type,status)";
    var text2 = "VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *";
    var currency = data.currency || '';
    var value = data.value || '';
    var server_fk = data.server_fk;
    var expiration_month = data.expiration_month || '';
    var expiration_year = data.expiration_year || '';
    var method = data.method || '';
    var number = data.number || '';
    var type = data.type || '';
    var status = data.status;
    values = [currency,value,server_fk,expiration_month,expiration_year,method,number,type,status];

    var promise = new Promise(function(reject,resolve){
        client.query(text1+text2,values, (error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error);
            } else {
                logger.info(__filename,nameFunction,'query create payment executed with success');
                resolve(response);
            }
            client.end();
        }); 
    });  

    return promise;
}

function getAllPaymentMethods(){
    var client = connect();
    var nameFunction = arguments.callee.name;

    var promise = new Promise(function(reject,resolve){
        client.query("select distinct method FROM payment", (error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error);
            } else {
                logger.info(__filename,nameFunction,'query get all paymethods executed with success');
                resolve(response);
            }
            client.end();
        }); 
    });
  
    return promise;
}


function getMyPaymentMethods(data){
    var client = connect();
    var nameFunction = arguments.callee.name;

    var promise = new Promise(function(reject,resolve){
        client.query("select distinct method FROM payment WHERE server_fk=$1", [data.id],(error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error);
            } else {
                logger.info(__filename,nameFunction,'query get all paymethods  of the server: '+data.id+' with success');
                resolve(response);
            }
            client.end();
        }); 
    });
  
    return promise;
}


/**
 * methods added
 * return single payment of the particular server
 * @param {Object} data 
 */
function getMySinglePayment(data){
    var client = connect();
    var nameFunction = arguments.callee.name;
    var text = "select * FROM payment WHERE server_fk=$1 and transaction_id=$2";

    var promise = new Promise(function(reject,resolve){
        client.query(text,[data.server_fk,data.transaction_id], (error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error)
            } else {
                var message = 'query get my single payment of the server: '+data.id+' executed with success';
                logger.info(__filename,nameFunction,message);
                resolve(response);
            }
            client.end();
        });   
    });

    return promise;
}


/**
 * methods added
 * return single payment of any server
 * @param {Object} data 
 */
function getSinglePayment(data){
    var client = connect();
    var nameFunction = arguments.callee.name;
    var text = "select * FROM payment WHERE transaction_id=$1";

    var promise = new Promise(function(reject,resolve){
        client.query(text, [data.transaction_id], (error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error)
            } else {
                logger.info(__filename,nameFunction,'query get Single payment executed with success');
                resolve(response);
            }
            client.end();
        });   
    });

    return promise;
}


function updateStatusPayment(data){
    var nameFunction = arguments.callee.name;
    var client = connect();
    var text = 'UPDATE payment SET status=$1 WHERE transaction_id=$2 Returning*';

    var promise = new Promise(function(reject,resolve){
        client.query(text,[data.status,data.transaction_id], (error,response) =>{
            if(error){
                logger.error(__filename,nameFunction,error);
                reject(error)
            }else{
                logger.info(__filename,nameFunction,'query update payment executed with success');
                resolve(response);
            }
            client.end();
        });
    });

    return promise;
}


module.exports = {
    getMyPayments: getMyPayments,
    getAllPayments:getAllPayments,
    createPayment: createPayment,
    getAllPaymentMethods:getAllPaymentMethods,
    getMyPaymentMethods:getMyPaymentMethods,
    getMySinglePayment:getMySinglePayment,  //method added
    getSinglePayment:getSinglePayment,      //method added
    updateStatusPayment:updateStatusPayment //method added
};