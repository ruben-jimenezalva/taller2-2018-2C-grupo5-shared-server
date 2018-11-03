const model = require('./PaymentModels');
const logger =  require('../others/logger');
var db = require('./PaymentAccessDB');
var statusDefault = require('../others/Constants');

function getMyPayments (req, res, next){
    var nameFunction = arguments.callee.name;
    var res_get;
    var messageLog;

    if (req.username){
        var res_get = db.getAllPayments();
        messageLog = 'get all payments with success for user: '+req.username;
    }else{
        var data_get = {};
        data_get.id = req.id;
        var res_get = db.getMyPayments(data_get);
        messageLog = 'get all payments of the server: '+req.id+' with success';
    }

    res_get.then(
        function(error){
            logger.error(__filename,nameFunction,error.message);
            res.status(500).json({code: 500, message: error.message});
        },
        function(response){
            res.status(200).send(model.getMyPayments(response));
            logger.info(__filename,nameFunction,messageLog);
        }
    );
}
  
function createPayment (req, res, next){
    var nameFunction = arguments.callee.name;
    var data_create = {};

    //possible validation
    data_create.status = req.body.status || statusDefault.PAYMENT_PENDING;
    data_create.currency = req.body.currency || '';
    data_create.value = req.body.value || '';
    data_create.server_fk = req.id;
    data_create.expiration_month = req.body.paymentMethod.expiration_month || '';
    data_create.expiration_year = req.body.paymentMethod.expiration_year || '';
    data_create.method = req.body.paymentMethod.method || '';
    data_create.number = req.body.paymentMethod.number || '';
    data_create.type = req.body.paymentMethod.type || '';


    res_create = db.createPayment(data_create);
    res_create.then(
        function(error){
            logger.error(__filename,nameFunction,error.message);
            res.status(500).json({code: 500, message: error.message});
        },
        function(response){
            res.status(201).send(model.singlePayment(response));
            logger.info(__filename,nameFunction,'payment created by server: '+req.id+' with success');
        }
    );
}
 

function getPaymentMethods (req, res, next){
    var nameFunction = arguments.callee.name;
    var res_get;

    if (req.username){
        res_get = db.getAllPaymentMethods();
        messageLog = 'get all paymentMethods with success for user: '+req.username;
    }else{
        var data_get = {};
        data_get.id = req.id; 
        res_get = db.getMyPaymentMethods(data_get);
        messageLog = 'get all paymentMethods with success for server: '+req.id;
    }

    res_get.then(
        function(error){
            logger.error(__filename,nameFunction,error.message);
            res.status(500).json({code: 500, message: error.message});
        },
        function(response){
            res.status(200).send(model.getPaymentMethods(response));
            logger.info(__filename,nameFunction,messageLog);
        }
    );  
}



/**
 * method added
 */
function getSinglePayment (req, res, next){
    var nameFunction = arguments.callee.name;
    var res_get;
    var messageLog;
    var data_get = {};
    data_get.transaction_id = req.params.transaction_id;

    if (req.username){
        res_get = db.getSinglePayment(data_get);
        messageLog = 'get single payment with success for user: '+req.username;
    }else{
        data_get.server_fk = req.id;
        res_get = db.getMySinglePayment(data_get);
        messageLog = 'get single payment of the server: '+req.id+' with success';
    }

    res_get.then(
        function(error){
            logger.error(__filename,nameFunction,error.message);
            res.status(500).json({code: 500, message: error.message});
        },
        function(response){
            if(response.rowCount == 0){
                logger.warn(__filename,nameFunction,'not exists payment: '+data_get.transaction_id);
                res.status(404).json({code:404, message:'not exists payment'});
            }else{
                logger.info(__filename,nameFunction,messageLog);
                res.status(200).send(model.singlePayment(response));
            }
        }
    );
}




/**
 * method added
 */
function updateStatusPayment (req, res, next){

    if (req.username){
        var nameFunction = arguments.callee.name;
        var res_upd;
        var data_upd = {};
        data_upd.transaction_id = req.params.transaction_id;
        data_upd.status= req.body.status || '';

        //validar si se encuentra entre los estados posibles...

        if (data_upd.status === ''){
            res.status(500).json({code:500, message:'missing parameters to update'})
        }else{
            res_upd = db.updateStatusPayment(data_upd);
            res_upd.then(
                function(error){
                    logger.error(__filename,nameFunction,error.message);
                    res.status(500).json({code: 500, message: error.message});
                },
                function(response){
                    if(response.rowCount == 0){
                        logger.warn(__filename,nameFunction,'not exists payment: '+data_upd.transaction_id);
                        res.status(404).json({code:404, message:'not exists payment'});
                    }else{
                        logger.info(__filename,nameFunction,'the payment: '+data_upd.transaction_id+' was updated');
                        res.status(200).send(model.singlePayment(response));
                    }
                }
            );
        }
    }
}



module.exports = {
    getMyPayments: getMyPayments,
    createPayment: createPayment,
    getPaymentMethods: getPaymentMethods,
    getSinglePayment:getSinglePayment,       //method added
    updateStatusPayment:updateStatusPayment,       //method added
};