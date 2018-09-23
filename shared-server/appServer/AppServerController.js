const config = require('../others/Constants'); // get our config file
const tokenController = require('../auth/TokenController');
const model = require('./AppServerModels');
const crypto = require('crypto-js');
const logger =  require('../others/logger');


function getAllServers (req, res, next){
    var client = req.client;
    client.query("select * FROM server", (err, resp) => {
        if (err) {
            logger.error(__filename +' - '+'getAllServers,'+' - '+err.message);
            res.status(500).json({code: 500, message: err.message});
        } else {
            //res.status(200).send(model.getAllServers(resp));
            logger.info(__filename +' - '+'getAllServers, get all server with succes');
            res.status(200).send(resp.rows);
        }
        client.end();
    })   
}

function createServer (req, res, next){
    var client = req.client;
    var text = 'INSERT INTO server(createdBy, nameServer,_rev) VALUES($1,$2,$3) RETURNING *';
    var createdBy = req.body.createdBy || '';
    var name = req.body.name || '';

    if(createdBy == '' || name == ''){
        logger.warn(__filename +' - '+ 'createServer, missing parameters to create server');
        return res.status(400).json({code: 400, message: 'breach of preconditions (missing parameters)'});
    }

    var values = [createdBy,name,'NaN'];
    client.query(text, values, (err, resp) => {
        if (err) {
            logger.error(__filename +' - '+'createServer, '+ err.message);
            res.status(500).json({code: 500, message: err.message});
        } else {
            //create token
            var server_id = resp.rows[0].server_id;
            var tokenResponse= tokenController.createToken(server_id);
            var responseToSend = model.postCreateServer(resp,tokenResponse.token);

            text = 'UPDATE server SET jti=$1 Where server_id=$2';
            values=[tokenResponse.jti,server_id];
            client.query(text, values, (err, resp) => {
                if (err) {
                    logger.error(__filename +' - '+'createServer, '+ err.message);
                    res.status(500).json({code: 500, message: err.message});
                } else {
                    logger.info(__filename +' - '+ 'create server, server created successfully');
                    res.status(200).send(responseToSend);
                }
                client.end();
            })
        }
    })
}


function getSingleServer (req, res, next){
    var client = req.client;
    const text = 'SELECT * FROM server WHERE server_id=$1';
    client.query(text, [req.params.id], (err, resp) => {
        if (err) {
            logger.error(__filename +' - '+'getSingleServer, '+err.message);
            res.status(500).json({code: 500, message: err.message});
        } else {
            if(resp.rowCount == 0){
                logger.warn(__filename +' - '+'getSingleServer, no exist server');
                res.status(404).json({code: 404, message:'Servidor inexistente'});
            }else{
                logger.info(__filename +' - '+'getSingleServer, get server with success ');
                res.status(200).send(model.getSingleServer(resp));
            }
        }
        client.end();
    })
}


/*
function generate_rev(serverJson, callback){
    var server = JSON.stringify(serverJson);
    bcrypt.hash(server,8, function(err,hash) {
        if(err){
            callback(err);
        }
        else{
            callback(null,hash);
        }
    });
    
}
*/

function updateServer (req, res, next){

    var client = req.client;
    var _rev = req.body._rev || '';
    var name = req.body.name || '';

    if(_rev == '' || name == ''){
        logger.warn(__filename +' - '+'updateServer missing parameteres');
        return res.status(400).json({code: 400, message: 'breach preconditions (missing parameters)'});
    }

    var text = 'SELECT * FROM server WHERE server_id=$1';
    client.query(text,[req.params.id],(err,resp)=>{
        if(err){
            logger.error(__filename +' - '+'updateServer,'+' - '+err.message);
            res.status(500).json({code: 500, message:error.message});
        }else{
            if(resp.rows == ''){
                logger.warn(__filename +' - '+'updateServer, nonexistent server');
                res.status(404).json({code: 404, message:'nonexistent server'});
            }else{

                if(resp.rows[0]._rev != _rev){
                    logger.warn(__filename +' - '+'updateServer, Conflict _rev is incorrect');
                    res.status(409).json({code: 409, message:'Conflict _rev is incorrect'});
                }else{
                    var hash = crypto.MD5(JSON.stringify(resp.rows[0]));
                    var new_rev = hash.toString(crypto.enc.hex);
                
                    text = 'UPDATE server SET nameServer=$1, _rev=$2 WHERE server_id=$3 RETURNING *';
                    client.query(text, [name,new_rev,req.params.id], (err, response) => {
                        if (err) {
                            logger.error(__filename +' - '+'updateServer ,'+err.message);
                            res.status(500).json({code: 500, message: err.message});
                        } else {
                            logger.info(__filename +' - '+'updateServer, update server with success');
                            res.status(200).json(model.getSingleServer(response));
                        }
                        client.end();
                    })
                }
            }
    
        }
    })
}


function removeServer (req, res, next){
    var client = req.client;
    const text = 'DELETE FROM server WHERE server_id=$1 RETURNING *';
    var server_id = req.params.id;

    client.query(text, [server_id], (err, resp) => {
        if (err) {
            logger.error(__filename +' - '+'removeServer, ' +err.message);
            res.status(500).json({code: 500, message: err.message});
        }else {
            if(resp.rowCount == 0){
                logger.warn(__filename +' - '+'removeServer, not exist the requested resource');
                res.status(410).json({code:404, message:'not exist the requested resource'});
            }else{
                responseInvalidToken = tokenController.invalidateToken(resp.rows[0].jti,client);
                if (responseInvalidToken < 0){
                    logger.error(__filename +' - '+'removeServer, Unexpected error to invalidate token');                    
                    return res.status(500).json({code: 500, message:'Unexpected error'});
                }else
                    logger.info(__filename +' - '+'removeServer, server was removed with success');                    
                    res.status(203).json({code:203, message:'el registro fue eliminado'});
            }
        }
        client.query(() =>{client.end()});
    })
}


function resetTokenServer (req, res, next){

    var client = req.client;
    var text = 'SELECT * FROM server WHERE server_id=$1';
    var server_id = req.params.id;

    client.query(text, [server_id], (err, resp) => {
        if (err) {
            logger.info(__filename +' - '+'resetTokenServer, ' + err.message);                            
            return res.status(500).json({code: 500, message: err.message});
        } else {
            if(resp.rowCount == 0){
                logger.warn(__filename +' - '+'resetTokenServer, nonexistent server');                                   
                return res.status(404).json({code: 404, message:'nonexistent server'});
            }else{
                var server = resp.rows[0];
                responseInvalidToken = tokenController.invalidateToken(server.jti,client);
                if (responseInvalidToken < 0){
                    logger.error(__filename +' - '+'resetTokenServer, Unexpected error to invalidate token');                                                   
                    return res.status(500).json({code: 500, message:'Unexpected error'});
                }else{
                    var tokenResponse = tokenController.createToken(server_id);
                    //update jti
                    text = 'UPDATE server SET jti=$1 WHERE server_id=$2 RETURNING *';
                    values = [tokenResponse.jti,server_id];
                    client.query(text,values,(err, resp) => {
                        if(err){
                            logger.error(__filename +' - '+'resetTokenServer, '+err.message);                                                   
                        }
                        else{
                            logger.info(__filename +' - '+'resetTokenServer, token reset successfully');                                                   
                            res.status(201).send(model.postCreateServer(resp,tokenResponse.token));
                        }
                        client.end();
                    });
                }
            }
        }
    })
}



module.exports = {
    getAllServers: getAllServers,
    createServer: createServer,
    getSingleServer: getSingleServer,
    updateServer: updateServer,
    removeServer: removeServer,
    resetTokenServer: resetTokenServer,
};