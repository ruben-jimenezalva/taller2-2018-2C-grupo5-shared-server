const config = require('../others/Constants');

function mockdelivery(){
    delivery = {
        "metadata": {
          "version": config.apiVersion
        },
        "cost": {
          "currency": "pesos",
          "value": 150
        }
      }
    return delivery;
}

module.exports = {
    mockdelivery:mockdelivery
}