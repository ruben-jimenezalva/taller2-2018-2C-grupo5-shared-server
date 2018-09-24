const config = require('../others/Constants'); // get our config file
const tokenController = require('../auth/TokenController');
const model = require('./AppServerModels');
const crypto = require('crypto-js');
const logger =  require('../others/logger');



function getAllServers (req, res, next){
    var client = req.client;
    var nameFunction = arguments.callee.name;

    client.query("select * FROM server", (err, resp) => {
        if (err) {
            logger.error(__filename,nameFunction,err.message);
            res.status(500).json({code: 500, message: err.message});
        } else {
            logger.info(__filename,nameFunction,'get all server with succes');
            res.status(200).send(model.getAllServers(resp));
            //res.status(200).send(resp.rows);
        }
        client.end();
    })   
}

function createServer (req, res, next){
    var client = req.client;
    var text = 'INSERT INTO server(createdBy, nameServer,_rev) VALUES($1,$2,$3) RETURNING *';
    var createdBy = req.body.createdBy || '';
    var name = req.body.name || '';
    var nameFunction = arguments.callee.name;

    if(createdBy == '' || name == ''){
        logger.warn(__filename,nameFunction,'missing parameters to create server');
        client.end();
        return res.status(400).json({code: 400, message: 'breach of preconditions (missing parameters)'});
    }

    var values = [createdBy,name,'NaN'];
    client.query(text, values, (err, resp) => {
        if (err) {
            logger.error(__filename,nameFunction,err.message);
            res.status(500).json({code: 500, message: err.message});
            client.end();
        } else {
            //create token
            var server_id = resp.rows[0].server_id;
            var tokenResponse= tokenController.createToken(server_id);
            var responseToSend = model.postCreateServer(resp,tokenResponse.token);

            text = 'UPDATE server SET jti=$1 Where server_id=$2';
            values=[tokenResponse.jti,server_id];
            client.query(text, values, (err, resp) => {
                if (err) {
                    logger.error(__filename,nameFunction,err.message);
                    res.status(500).json({code: 500, message: err.message});
                } else {
                    logger.info(__filename,nameFunction,'server created successfully');
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
    var nameFunction = arguments.callee.name;
    client.query(text, [req.params.id], (err, resp) => {
        if (err) {
            logger.error(__filename,nameFunction,err.message);
            res.status(500).json({code: 500, message: err.message});
        } else {
            if(resp.rowCount == 0){
                logger.warn(__filename,nameFunction,'no exist server');
                res.status(404).json({code: 404, message:'Servidor inexistente'});
            }else{
                logger.info(__filename,nameFunction,'get server with success ');
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
    var nameFunction = arguments.callee.name;

    if(_rev == '' || name == ''){
        logger.warn(__filename,nameFunction,'missing parameteres');
        client.end();
        return res.status(400).json({code: 400, message: 'breach preconditions (missing parameters)'});
    }

    var text = 'SELECT * FROM server WHERE server_id=$1';
    client.query(text,[req.params.id],(err,resp)=>{
        if(err){
            logger.error(__filename,nameFunction,err.message);
            res.status(500).json({code: 500, message:error.message});
            client.end();            
        }else{
            if(resp.rows == ''){
                logger.warn(__filename,nameFunction,'nonexistent server');
                res.status(404).json({code: 404, message:'nonexistent server'});
                client.end();
            }else{

                if(resp.rows[0]._rev != _rev){
                    logger.warn(__filename,nameFunction,'Conflict _rev is incorrect');
                    res.status(409).json({code: 409, message:'Conflict _rev is incorrect'});
                    client.end();
                }else{
                    var hash = crypto.MD5(JSON.stringify(resp.rows[0]));
                    var new_rev = hash.toString(crypto.enc.hex);
                
                    text = 'UPDATE server SET nameServer=$1, _rev=$2 WHERE server_id=$3 RETURNING *';
                    client.query(text, [name,new_rev,req.params.id], (err, response) => {
                        if (err) {
                            logger.error(__filename,nameFunction,err.message);
                            res.status(500).json({code: 500, message: err.message});
                        } else {
                            logger.info(__filename,nameFunction,'server update with success');
                            res.status(200).json(model.getSingleServer(response));
                        }
                        client.end();
                    })
                }
            }
    
        }
    })
}


/**token was invalidated previously */
function removeServer (req, res, next){
    var client = req.client;
    const text = 'DELETE FROM server WHERE server_id=$1 RETURNING *';
    var server_id = req.params.id;
    var nameFunction = arguments.callee.name;

    client.query(text, [server_id], (err, resp) => {
        if (err) {
            logger.error(__filename,nameFunction,err.message);
            res.status(500).json({code: 500, message: err.message});
        }else {
            if(resp.rowCount == 0){
                logger.warn(__filename,nameFunction,'not exist the requested resource');
                res.status(410).json({code:404, message:'not exist the requested resource'});
            }else{
                logger.info(__filename,nameFunction,'server was removed with success');                    
                res.status(203).json({code:203, message:'el registro fue eliminado'});
            }
        }
        client.end();
    });
}


/**token was invalidated previously */
function resetTokenServer (req, res, next){

    var client = req.client;
    var server_id = req.params.id;
    var nameFunction = arguments.callee.name;

    var tokenResponse = tokenController.createToken(server_id);
    //update jti
    text = 'UPDATE server SET jti=$1 WHERE server_id=$2 RETURNING *';
    values = [tokenResponse.jti,server_id];
    client.query(text,values,(err, resp) => {
        if(err){
            logger.error(__filename,nameFunction,err.message);
            res.status(500).json({code:500,message:err.message});                                                   
        }
        else{
            logger.info(__filename,nameFunction,'token reset successfully');                                                   
            res.status(201).send(model.postCreateServer(resp,tokenResponse.token));
        }
        client.end();
    });
}



function removeTrackings (req, res, next){
    var client = req.client;
    const text = 'DELETE FROM tracking WHERE server_fk=$1 RETURNING *';
    var server_id = req.params.id;
    var nameFunction = arguments.callee.name;

    client.query(text, [server_id], (err, resp) => {
        if (err) {
            logger.error(__filename,nameFunction,err.message);
            client.end();
            res.status(500).json({code: 500, message:'Unexpected error'});
        }else {
            var message = resp.rowCount+' trackings of server:'+server_id+' was removed successfully'
            logger.info(__filename,nameFunction,message);   
            next();        
        }
    })
}

function removePayments (req, res, next){
    var client = req.client;
    const text = 'DELETE FROM payment WHERE server_fk=$1 RETURNING *';
    var server_id = req.params.id;
    var nameFunction = arguments.callee.name;

    client.query(text, [server_id], (err, resp) => {
        if (err) {
            logger.error(__filename,nameFunction,err.message);
            client.end();
            res.status(500).json({code: 500, message:'Unexpected error'});
        }else {
            var message = resp.rowCount+' payments of server:'+server_id+' was removed successfully'
            logger.info(__filename,nameFunction,message);
            next();
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
    removeTrackings:removeTrackings,
    removePayments:removePayments,
};