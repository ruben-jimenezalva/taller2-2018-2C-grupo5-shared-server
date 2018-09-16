var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../others/Constants'); // get our config file


function verifyToken(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers['authorization'];

    if (!token) 
        return res.status(401).send({ code:401, message: 'Unauthorized' });

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {      
        if (err) 
            return res.status(401).send({ code:401, message: 'Unauthorized' });       
      // if everything is good, save to request for use in other routes
      req.id = decoded.id;
      next();
    });
}


//{id:server_id, currentTime: Date.now() };

function createToken(id) {
    var payload = {id:id, currentTime: Date.now() };
    var token = jwt.sign (payload, config.secret, {
        expiresIn: config.expireTime
    });
    return token;
}

function invalidateToken(req, res, next) {
/*ver como se hace*/ 
}

module.exports = {
    verifyToken: verifyToken,
    createToken: createToken,
    invalidateToken: invalidateToken
};