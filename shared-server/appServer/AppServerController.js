const tokenController = require('../auth/TokenController');
const model = require('./AppServerModels');
const crypto = require('crypto-js');
const logger =  require('../others/logger');
const db = require('./AppServerAccessDB');
const uuidV1 = require('uuid/v1');



function getAllServers (req, res, next){
    var nameFunction = arguments.callee.name;

    var res_get = db.getAllServers();
    res_get.then(
        function(error){
            res.status(500).json({code: 500, message:'Unexpected error'});
            logger.error(__filename,nameFunction,error.message);
        },
        function(response){
            res.status(200).send(model.getAllServers(response));
            logger.info(__filename,nameFunction,'returnning all servers with succes');
        }
    );
}

function createServer (req, res, next){
    var nameFunction = arguments.callee.name;
    var data_create = {};
    var createdBy = req.body.createdBy || '';
    var name = req.body.name || '';
    var url = req.body.url || '';

    //validate data input
    if(createdBy == '' || name == ''|| url == ''){
        logger.warn(__filename,nameFunction,'missing parameters to create server');
        return res.status(400).json({code: 400, message: 'breach of preconditions (missing parameters)'});
    }

    //create token
    var server_id = uuidV1();
    var tokenResponse= tokenController.createTokenServer(server_id);

    data_create.server_id = server_id;
    data_create.jti = tokenResponse.jti;
    data_create.createdBy = createdBy;
    data_create.name = name;
    data_create.url = url;

    //create server
    var res_create = db.createServer(data_create);
    res_create.then(
        function(error){
            logger.error(__filename,nameFunction,error.message);
            res.status(500).json({code: 500, message:error.message});
        },
        function(response){
            logger.info(__filename,nameFunction,'server created successfully');
            res.status(201).send(model.postCreateServer(response,tokenResponse.token));        
        }
    );
}


function getSingleServer (req, res, next){
    var nameFunction = arguments.callee.name;
    var data_get={};
    var server_id = req.params.id;
    data_get.server_id = server_id;

    var res_get = db.getSingleServer(data_get);
    res_get.then(
        function(error){
            logger.error(__filename,nameFunction,error.message);
            res.status(500).json({code: 500, message:error.message});
        },
        function(response){
            if(response.rowCount == 0){
                logger.warn(__filename,nameFunction,'the server: '+server_id+' not exist');
                res.status(404).json({code: 404, message:'the server not exist'});
            }else{
                logger.info(__filename,nameFunction,'get server: '+server_id+' with success ');
                res.status(200).send(model.getSingleServer(response));
            }
        }
    );    
}


function updateServer (req, res, next){
    var nameFunction = arguments.callee.name;
    var server_id;
    var name;
    var _rev;

    //verify parameters
    _rev = req.body._rev || '';
    name = req.body.name || '';
    if(_rev == '' || name == ''){
        logger.warn(__filename,nameFunction,'missing parameteres');
        client.end();
        return res.status(400).json({code: 400, message: 'breach preconditions (missing parameters)'});
    }


    //verify if server exist
    server_id = req.params.id;
    var data_select={};
    data_select.server_id = server_id;

    res_select = db.getSingleServer(data_select)
    res_select.then(
        function(error){
            logger.error(__filename,nameFunction,error.message);
            return res.status(500).json({code: 500, message:error.message}); 
        },
        function(response){
            if(response.rowCount == 0){
                logger.warn(__filename,nameFunction,'nonexistent server');
                return res.status(404).json({code: 404, message:'nonexistent server'});
                
            }else if(response.rows[0]._rev != _rev){
                //verify _rev
                logger.warn(__filename,nameFunction,'Conflict _rev is incorrect');
                return res.status(409).json({code: 409, message:'Conflict _rev is incorrect'});
            }else{
                //obtain new _rev
                var hash = crypto.MD5(JSON.stringify(response.rows[0]));
                var new_rev = hash.toString(crypto.enc.hex);

                //update server
                var data_update={};
                data_update._rev = new_rev;
                data_update.name = name;
                data_update.server_id = server_id;

                res_update = db.updateServer(data_update);
                res_update.then(
                    function(error){
                        logger.error(__filename,nameFunction,error.message);
                        res.status(500).json({code: 500, message: error.message});
                    },
                    function(response){
                        logger.info(__filename,nameFunction,'server update with success');
                        res.status(200).json(model.getSingleServer(response));
                    }
                );
            }
        }
    );
}


/**token was invalidated previously */
function removeServer (req, res, next){
    var nameFunction = arguments.callee.name;
    var server_id = req.params.id;
    var data_remove={};
    data_remove.server_id =server_id;
    
    var res_remove = db.removeServer(data_remove);
    res_remove.then(
        function(error){
            logger.error(__filename,nameFunction,error.message);
            res.status(500).json({code: 500, message: error.message});
        },
        function(response){
            if(response.rowCount == 0){
                logger.warn(__filename,nameFunction,'not exist the requested resource');
                res.status(410).json({code:404, message:'not exist server: '+server_id+' to remove'});
            }else{
                logger.info(__filename,nameFunction,'the server: '+server_id +' was removed successfully');                    
                res.status(203).json({code:203, message:'the server: '+server_id +' was removed'});
            }
        }
    );
}


/**token was invalidated previously */
function resetTokenServer (req, res, next){
    var nameFunction = arguments.callee.name;
    var server_id = req.params.id;

    //create token
    var tokenResponse = tokenController.createTokenServer(server_id);

    //update jti
    var data_reset={};
    data_reset.jti = tokenResponse.jti;
    data_reset.server_id =server_id;

    var res_reset = db.resetTokenServer(data_reset);
    res_reset.then(
        function(error){
            logger.error(__filename,nameFunction,error.message);
            res.status(500).json({code:500,message:error.message}); 
        },
        function(response){
            logger.info(__filename,nameFunction,'token reset successfully');                                                   
            res.status(201).send(model.postCreateServer(response,tokenResponse.token));
        }
    );
}


/*
function updateLastConnection(req,res,next){
    var client = req.client;
    var server_id = req.id;
    var nameFunction = arguments.callee.name;
    var text = 'UPDATE server SET lastConnection=NOW() WHERE server_id=$1';

    client.query(text,[server_id],(err,resp)=>{
        if(err){
            logger.error(__filename,nameFunction,err.message);
            res.status(500).json({code:500, message:err.message});
        }else{
            logger.info(__filename,nameFunction,'update lastConnection succesfully');     
            next();       
        }
    })
}
*/




function removeTrackings (req, res, next){
    var server_id = req.params.id;
    var nameFunction = arguments.callee.name;
    var data_removeTracking={};
    data_removeTracking.server_id = server_id;

    res_removeTracking = db.removeTrackings(data_removeTracking);
    res_removeTracking.then(
        function(error){
            logger.error(__filename,nameFunction,error.message);
            res.status(500).json({code: 500, message:error.message});
        },
        function(response){
            var message = response.rowCount+' trackings of server:'+server_id+' was removed successfully'
            logger.info(__filename,nameFunction,message); 
            next();  
        }
    );
}

function removePayments (req, res, next){
    var server_id = req.params.id;
    var nameFunction = arguments.callee.name;
    var data_removePayments={};
    data_removePayments.server_id = server_id;

    res_removePayments = db.removePayments(data_removePayments);
    res_removePayments.then(
        function(error){
            logger.error(__filename,nameFunction,error.message);
            res.status(500).json({code: 500, message:error.message});
        },
        function(response){
            var message = response.rowCount+' payments of server:'+server_id+' was removed successfully'
            logger.info(__filename,nameFunction,message);
            next();
        }
    );
}


function pingAppServer(req, res, next){
    var server
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
//    updateLastConnection:updateLastConnection,
};