const logger =  require('../others/logger');
const connect = require('../service/Connect');

function getAllServers (){
    var client = connect();
    var nameFunction = arguments.callee.name;

    var promise = new Promise(function(reject,resolve){
        client.query("select * FROM server", (error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error);
            } else {
                logger.info(__filename,nameFunction,'query get all server was executed successfully');
                resolve(response);
            }
            client.end();
        });

    });
    
    return promise;
}

function createServer (data){
    var nameFunction = arguments.callee.name;
    var client = connect();
    var values = [data.server_id,data.createdBy,data.name,'NaN',data.jti,data.url];
    var text = 'INSERT INTO server(server_id,createdBy, nameServer,_rev,jti,url) VALUES($1,$2,$3,$4,$5,$6) RETURNING *';

    var promise = new Promise(function(reject,resolve){
        client.query(text, values, (error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error);
            } else {
                logger.info(__filename,nameFunction,'query create server with data '+data.createdBy+' , '+data.name+' was executed succesfully');
                resolve(response);
            }
            client.end();
        });
    });

    return promise;
}


function updateJtiServer(data){
    var nameFunction = arguments.callee.name;
    var client = connect();
    text = 'UPDATE server SET jti=$1 Where server_id=$2';
    values=[data.jti,data.server_id];

    var promise = new Promise(function(reject,resolve){
        client.query(text, values, (error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error);
            } else {
                logger.info(__filename,nameFunction,'query update jti with server_id: '+data.server_id+' was executed successfully');
                resolve(response);
            }
            client.end();
        });
    })

    return promise;
}


function getSingleServer (data){
    var nameFunction = arguments.callee.name;
    var client = connect();
    const text = 'SELECT * FROM server WHERE server_id=$1';

    var promise = new Promise(function(reject, resolve){
        client.query(text, [data.server_id], (error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error);
            } else {
                logger.info(__filename,nameFunction,'query get single server with server_id: '+data.server_id+' was executed successfully ');
                resolve(response);
            }
            client.end();
        })
    });

    return promise;
}


function updateServer (data){
    var nameFunction = arguments.callee.name;
    var client = connect();
    values = [data.name,data._rev,data.server_id];
    text = 'UPDATE server SET nameServer=$1, _rev=$2 WHERE server_id=$3 RETURNING *';

    var promise = new Promise(function(reject, resolve){
        client.query(text, values, (error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error);
            } else {
                logger.info(__filename,nameFunction,'query update server with server_id: '+ data.server_id+ ' was executed successfully');
                resolve(response);
            }
            client.end();
        })
    })

    return promise;
}


/**token was invalidated previously */
function removeServer (data){
    var client = connect();
    var nameFunction = arguments.callee.name;    
    const text = 'DELETE FROM server WHERE server_id=$1 RETURNING *';

    var promise = new Promise(function(reject, resolve){
        client.query(text, [data.server_id], (error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error);
            }else {
                logger.info(__filename,nameFunction,'query remove server with server_id: '+data.server_id+' was executed successfully'); 
                resolve(response);                   
            }
            client.end();
        });
    });

    return promise;
}


/**token was invalidated previously */
function resetTokenServer (data){
    var nameFunction = arguments.callee.name;
    var client = connect();
    values = [data.jti,data.server_id];
    text = 'UPDATE server SET jti=$1 WHERE server_id=$2 RETURNING *';

    var promise = new Promise(function(reject, resolve){
        client.query(text,values,(error, response) => {
            if (error){
                logger.error(__filename,nameFunction,error);
                reject(error);                                                
            }else{
                logger.info(__filename,nameFunction,'query update token (reset) with server_id: '+data.server_id+' was executed successfully');                                                   
                resolve(response);
            }
            client.end();
        });
    });

    return promise;
}



function updateLastConnection(serverid){
    var nameFunction = arguments.callee.name;
    var client = connect();
    var text = 'UPDATE server SET lastConnection=NOW() WHERE server_id=$1';

    client.query(text,[data.serverid],(error,response)=>{
        if(error){
            logger.error(__filename,nameFunction,error);
            reject(error);
        }else{
            logger.info(__filename,nameFunction,'update lastConnection of server: '+data.server_id+' succesfully');     
            resolve(response);    
        }
        client.end();
    });
    return promise;
}





function removeTrackings (data){
    var client = connect();
    const text = 'DELETE FROM tracking WHERE server_fk=$1 RETURNING *';
    var server_id = data.server_id;
    var nameFunction = arguments.callee.name;

    var promise = new Promise(function(reject, resolve){
        client.query(text, [server_id], (error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error);
            }else {
                var message = response.rowCount+' query remove Trackings of server: '+data.server_id+' was executed successfully'
                logger.info(__filename,nameFunction,message);   
                resolve(response);  
            }
            client.end();
        });
    });

    return promise;
}

function removePayments (data){
    var client = connect();
    const text = 'DELETE FROM payment WHERE server_fk=$1 RETURNING *';
    var server_id = data.server_id;
    var nameFunction = arguments.callee.name;

    var promise = new Promise(function(reject, resolve){
        client.query(text, [server_id], (error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error);
            }else {
                var message = response.rowCount+' query remove payments of server:'+server_id+' was executed successfully'
                logger.info(__filename,nameFunction,message);   
                resolve(response);
            }
            client.end();
        });
    });

    return promise;
}



module.exports = {
    getAllServers: getAllServers,
    createServer: createServer,
    getSingleServer: getSingleServer,
    updateServer: updateServer,
    removeServer: removeServer,
    resetTokenServer: resetTokenServer,
    removeTrackings:removeTrackings,
    removePayments:removePayments,
    updateLastConnection:updateLastConnection,
    updateJtiServer:updateJtiServer
};