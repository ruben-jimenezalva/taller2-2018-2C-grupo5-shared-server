const connect = require('../service/Connect');
const logger =  require('../others/logger');

function getTokensOfBlackList(data){
    client = connect();
    var nameFunction = arguments.callee.name;
    var text = 'SELECT * FROM blackListToken where jti=$1';

    var promise = new Promise(function(reject,resolve){
        client.query(text,[data.jti],(error, response) => {
            if(error){
                logger.error(__filename,nameFunction,error);
                reject(error);
            }else{
                logger.info(__filename,nameFunction,'query get tokens blackList was executed successfully');
                resolve(response);
            }
            client.end();  
        });
    });
    return promise;
}


function addTokenBlackList(data){
    client = connect();
    var nameFunction = arguments.callee.name;

    promise = new Promise(function(reject,resolve){
        client.query('INSERT INTO blackListToken(jti) values($1)',[data.jti],(error, response) => {
            if(error){
                logger.error(__filename,nameFunction,error);    
                reject(error);
            }else{
                logger.info(__filename,nameFunction,'query add token to blakList was executed successfully'); 
                resolve(response);
            }
            client.end();
        });
    });

    return promise;
}

module.exports = {
    getTokensOfBlackList:getTokensOfBlackList,
    addTokenBlackList:addTokenBlackList
}