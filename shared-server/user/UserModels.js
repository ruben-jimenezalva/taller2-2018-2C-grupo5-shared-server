const config = require('../others/Constants'); // get our config file

function loginResponse(token){
    login = {
        "metadata": {
          "version": config.apiVersion,
        },
        "token": {
          "expiresAt": config.expireTime,
          "token": token
        }
    };
    return login;
}

module.exports = {
    loginResponse:loginResponse
}