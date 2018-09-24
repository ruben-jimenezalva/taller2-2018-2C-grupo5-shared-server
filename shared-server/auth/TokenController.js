//var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../others/Constants'); // get our config file
const nJwt = require('njwt');
const logger =  require('../others/logger');

function verifyToken(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers['authorization'];
    var nameFunction = arguments.callee.name;
    var client = req.client;

    if (!token){
        logger.warn(__filename,nameFunction,'Unauthorized Access');
        client.end();
        return res.status(401).send({ code:401, message: 'Unauthorized' });
    }

    // verifies secret and checks exp
    nJwt.verify(token, config.secret, function(err, decoded) { 
        if (err) {
            logger.warn(__filename,nameFunction,'Unauthorized Access');
            client.end();
            return res.status(401).send({ code:401, message: 'Unauthorized' }); 
        }else{
            // consult jti in database
            var jti = decoded.body.jti;

            client.query('SELECT * FROM blackListToken where jti=$1',[jti],(error, resp) => {
                if(error){
                    logger.warn(__filename,nameFunction,'Unauthorized Access');
                    client.end();        
                    res.status(500).send({ code:500, message: 'Unexpected error' });
                }
                else{
                    if(resp.rowCount != 0){
                        logger.warn(__filename,nameFunction,'Unauthorized Access');
                        client.end();        
                        res.status(401).send({ code:401, message: 'Unauthorized' });
                    }
                    else{
                        logger.info(__filename,nameFunction,'Authorized Access');
                        req.id = decoded.body.id;
                        next();
                    }
                } 
            });
        }
    });
}


//{id:server_id, currentTime: Date.now() };

function createToken(server_id) {
    var nameFunction = arguments.callee.name;
    var payload = {id:server_id, currentTime: Date.now() };
    var jwt = nJwt.create(payload,config.secret);
    jwt.setExpiration(new Date().getTime() + config.expireTime);
    var token = jwt.compact();
    var response={token:token, jti:jwt.body.jti};
    logger.info(__filename,nameFunction,'token created successfully');    
    return response;
}


/*
function invalidateToken(jti,client) {
    var nameFunction = arguments.callee.name;
    client.query('INSERT INTO blackListToken(jti) values($1)',[jti],(error, resp) => {
        if(error){
            logger.warn(__filename,nameFunction,'the token could not be disabled');    
            return -1;
        }else{
            logger.info(__filename,nameFunction,'the token was be disabled with success');    
            return 0;
        }
    });
}
*/

function invalidateToken(req, res, next) {
    var nameFunction = arguments.callee.name;
    client = req.client;

    client.query('SELECT jti FROM server where server_id=$1',[req.params.id], (err,resp) =>{
        if(err){
            logger.error(__filename,nameFunction,err.message);
            res.status(500).json({code: 500, message: err.message});
            client.end();
        }else{
            if(resp){
                client.query('INSERT INTO blackListToken(jti) values($1)',[resp.rows[0].jti],(error, resp) => {
                    if(error){
                        client.end();
                        logger.warn(__filename,nameFunction,'the token could not be disabled');    
                    }else{
                        logger.info(__filename,nameFunction,'the token was be disabled with success'); 
                        next();
                    }
                });
            }else{
                logger.warn(__filename,nameFunction,'not exist the requested resource');
                client.end();
                res.status(410).json({code:404, message:'not exist the requested resource'});
            }
        }
    })
}








module.exports = {
    verifyToken: verifyToken,
    createToken: createToken,
    invalidateToken: invalidateToken
};