var logger = require('../others/logger');
var model = require('./TrackingModels');
var connect = require('../service/Connect');


/**
 * return tracking created
 * @param {Object} data 
 */
function createTracking (data){
    var client = connect();
    var nameFunction = arguments.callee.name;

    var text = 'INSERT INTO tracking(status,server_fk) VALUES ($1,$2) RETURNING*';
    var values = [data.status,data.server_fk];

    var promise = new Promise(function(reject,resolve){
        client.query(text,values,(error,response)=>{
            if(error){
                logger.error(__filename,nameFunction,error);
                reject(error);
            }else{
                logger.info(__filename,nameFunction,'query insert tracking by server: '+data.server_fk+' executed successfully');
                resolve(response);
            }
            client.end();
        });
    });

    return promise;
}

/**
 * return particular tracking of a particular server
 * @param {Object} data 
 */
function getInfoMyTracking (data){
    var client = connect();
    var nameFunction = arguments.callee.name;
    var text = 'SELECT * FROM tracking WHERE tracking_id=$1 and server_fk=$2 ';

    var promise =  new Promise(function(reject,resolve){
        client.query(text,[data.tracking_id,data.server_fk],(error,response) =>{
            if(error){
                logger.error(__filename,nameFunction,error);
                reject(error);
            }else{
                logger.info(__filename,nameFunction,'query get tracking: '+data.tracking_id+' by server: '+data.server_fk+' executed successfully');
                resolve(response);
            }
            client.end();
        });
    });

    return promise;
}



/**
 * return particular tracking of any server
 * @param {Object} data 
 */
function getTracking (data){
    var client = connect();
    var nameFunction = arguments.callee.name;
    var text = 'SELECT * FROM tracking WHERE tracking_id=$1';

    var promise = new Promise(function(reject,resolve){
        client.query(text,[data.tracking_id],(error,response) =>{
            if(error){
                logger.error(__filename,nameFunction,error);
                reject(error);
            }else{
                logger.info(__filename,nameFunction,'query get tracking '+data.tracking_id+' by a user executed successfully');
                resolve(response);
            }
            client.end();
        });
    });
    
    return promise;
}

module.exports = {
    createTracking: createTracking,
    getInfoMyTracking: getInfoMyTracking,
    getTracking:getTracking
};
  