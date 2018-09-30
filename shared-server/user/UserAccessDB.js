const connect = require('../service/Connect');
const logger = require('../others/logger');

/** return unsername and password crypto*/
function getSingleUser(data){
    var nameFunction = arguments.callee.name;
    var text = 'SELECT * FROM users WHERE username=$1';
    var client = connect();

    var promise = new Promise(function(reject,resolve){
        client.query(text,[data.username],(error,response) =>{
            if(error){
                logger.error(__filename,nameFunction,error);
                reject(error);
            }else{
                logger.info(__filename,nameFunction,'query select single user: '+data.username+' was executed successfully');
                resolve(response);
            }
            client.end();
        });
    });

    return promise;
}

function register(data){
    var nameFunction = arguments.callee.name;
    var text = 'INSERT INTO users(username,password) VALUES ($1,$2)';
    var values = [data.username,data.password]
    var client = connect();

    var promise = new Promise(function(reject,resolve){
        client.query(text,values,(error,response) =>{
            if(error){
                logger.error(__filename,nameFunction,error);
                reject(error);
            }else{
                logger.info(__filename,nameFunction,'query insert user: '+data.username+' was executed successfully');
                resolve(response);
            }
            client.end();
        });
    });

    return promise;
}

module.exports = {
    getSingleUser:getSingleUser,
    register:register
}