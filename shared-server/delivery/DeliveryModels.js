const config = require('../others/Constants');

function mockdelivery(TOTALCOST,MESSAGE,ADITIONAL_MESSAGE){
    delivery = {
        "metadata": {
          "version": config.apiVersion
        },
        "cost": {
          "currency": "pesos",
          "value": TOTALCOST,
          "message": MESSAGE,
          "aditionals":ADITIONAL_MESSAGE
        }
      }
    return delivery;
}

module.exports = {
    mockdelivery:mockdelivery
}