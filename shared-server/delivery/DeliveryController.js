const model = require('./DeliveryModels');
const logger =  require('../others/logger');


function calculateDelivery (req, res, next){
    var nameFunction = arguments.callee.name;

    //load the value of the rules

    //call the engine

    //send response


    logger.info(__filename,nameFunction,"send mock response of the delivery");
    res.status(200).send(model.mockdelivery());
}

module.exports = {
    calculateDelivery:calculateDelivery
}