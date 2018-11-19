//var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../others/Constants'); // get our config file
const nJwt = require('njwt');
const logger =  require('../others/logger');
const db_token = require('./TokenAccessDB');
const db_server = require('../appServer/AppServerAccessDB');

function verifyToken(req, res, next) {
    
    // check header or url parameters or post parameters for token
    var token = req.headers['authorization'];
    var nameFunction = arguments.callee.name;

    if (!token){
        logger.warn(__filename,nameFunction,'Unauthorized Access');
        return res.status(401).send({ code:401, message: 'Unauthorized' });
    }

    // verifies secret and checks exp
    nJwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            logger.warn(__filename,nameFunction,'Unauthorized Access');
            return res.status(401).send({ code:401, message: 'Unauthorized' }); 
        }else{
            //if is admin
            if(decoded.body.username){
                logger.info(__filename,nameFunction,'Authorized Access to Admin: '+decoded.body.username);
                req.username = decoded.body.username; //save because it can be used to data access
                next();
            }else{
                //else is appserver
                var data_get = {};
                data_get.jti = decoded.body.jti;
                var id = decoded.body.id;
                // consult if jti is in blacklist
                var nameFunction = arguments.callee.name;
                var promise = db_token.getTokensOfBlackList(data_get);
                promise.then(
                    function (error){
                        logger.error(__filename,nameFunction,error.message);
                        res.status(500).send({ code:500, message:error.message });
                    },
                    function(response){
                        //if jwt is in blacklist
                        if(response.rowCount != 0){
                            logger.warn(__filename,nameFunction,'Unauthorized Access to server: '+id);
                            res.status(401).send({ code:401, message: 'Unauthorized Access' });
                        }
                        else{
                            logger.info(__filename,nameFunction,'Authorized Access to server: '+id);
                            req.id = id; //save because it can be used to data access
                            db_server.updateLastConnection(id).then(
                                function(error){
                                    logger.error(__filename,nameFunction,error.message);
                                    res.status(500).json({code: 500, message: error.message});
                                },
                                function(response){
                                    logger.info(__filename,nameFunction,"updated last connection server");
                                    next();
                                }
                            );
                        }
                    }
                );
            }
        }
    });

}


//{id:server_id, currentTime: Date.now() };
function createTokenServer(server_id) {
    var nameFunction = arguments.callee.name;
    var payload = {id:server_id, currentTime: Date.now() };
    var jwt = nJwt.create(payload,config.secret);
    jwt.setExpiration(new Date().getTime() + config.expireTime);
    var token = jwt.compact();
    var response={token:token, jti:jwt.body.jti};
    logger.info(__filename,nameFunction,'token for Server created successfully');    
    return response;
}


function createTokenAdmin(username) {
    var nameFunction = arguments.callee.name;
    var payload = {username:username, currentTime: Date.now() };
    var jwt = nJwt.create(payload,config.secret);
    jwt.setExpiration(new Date().getTime() + config.expireTime);
    var token = jwt.compact();
    //var response={token:token, jti:jwt.body.jti};
    logger.info(__filename,nameFunction,'token for Admin created successfully');    
    return token;
}


function invalidateToken(req, res, next) {
    var nameFunction = arguments.callee.name;

    var data_select = {};
    var server_id =req.params.id;
    data_select.server_id = server_id;
    var res_select = db_server.getSingleServer(data_select);
    res_select.then(
        function(error){
            logger.error(__filename,nameFunction,error.message);
            res.status(500).json({code: 500, message: error.message});
        },
        function(response){
            if(response.rowCount == 0){
                logger.warn(__filename,nameFunction,'not exist the requested resource');
                res.status(410).json({code:404, message:'not exist the requested resource'});
            }else{
                var data_insert = {};
                data_insert.jti = response.rows[0].jti;
                var res_insert = db_token.addTokenBlackList(data_insert);
                res_insert.then(
                    function(error){
                        res.status(410).json({code:404, message:error.message});
                        logger.warn(__filename,nameFunction,'the token could not be disabled');   
                    },
                    function(response){
                        logger.info(__filename,nameFunction,'the token was be disabled for server: '+server_id+' with success'); 
                        next();
                    }
                );
            }
        }
    );
}


module.exports = {
    verifyToken: verifyToken,
    createTokenServer: createTokenServer,
    createTokenAdmin:createTokenAdmin,
    invalidateToken: invalidateToken
};