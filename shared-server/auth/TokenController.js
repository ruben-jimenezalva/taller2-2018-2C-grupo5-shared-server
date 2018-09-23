//var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../others/Constants'); // get our config file
const nJwt = require('njwt');
const logger =  require('../others/logger');

function verifyToken(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers['authorization'];

    if (!token){
        logger.warn(__filename +' - '+ 'verifyToken, '+'Unauthorized Access');
        return res.status(401).send({ code:401, message: 'Unauthorized' });
    }


    // verifies secret and checks exp
    nJwt.verify(token, config.secret, function(err, decoded) { 
        if (err) {
            logger.warn(__filename +' - '+ 'verifyToken, '+'Unauthorized Access');            
            return res.status(401).send({ code:401, message: 'Unauthorized' }); 
        }
      
        else{
            // consult jti in database
            var client = req.client;
            var jti = decoded.body.jti;

            client.query('SELECT * FROM blackListToken where jti=$1',[jti],(error, resp) => {
                if(error){
                    logger.warn(__filename +' - '+'verifyToken, '+'Unauthorized Access');        
                    return res.status(500).send({ code:500, message: 'Unexpected error' });
                }
                else{
                    if(resp.rowCount != 0){
                        logger.warn(__filename +' - '+ 'verifyToken, '+'Unauthorized Access');        
                        return res.status(401).send({ code:401, message: 'Unauthorized' });
                    }
                    else{
                        logger.info(__filename +' - '+ 'verifyToken, '+'Authorized Access');
                        req.id = decoded.id;
                        next();
                    }
                } 
            });
        }
    });
}


//{id:server_id, currentTime: Date.now() };

function createToken(req) {
    var id = req.idToGenerateToken;
    var payload = {id:id, currentTime: Date.now() };
    var jwt = nJwt.create(payload,config.secret);
    jwt.setExpiration(new Date().getTime() + config.expireTime);
    var token = jwt.compact();
    var response={token:token, jti:jwt.body.jti};
    logger.info(__filename +' - '+ 'createToken, token created successfully');    
    return response;
}


/*no encuentro forma de implementarlo*/
function invalidateToken(jti,client) {

    client.query('INSERT INTO blackListToken(jti) values($1)',[jti],(error, resp) => {
        if(error){
            logger.warn(__filename +' - '+ 'invalidateToken, the token could not be disabled');    
            return -1;
        }
        else{
            logger.info(__filename +' - '+ 'invalidateToken, the token was be disabled with success');    
        } 
    });
}

module.exports = {
    verifyToken: verifyToken,
    createToken: createToken,
    invalidateToken: invalidateToken
};