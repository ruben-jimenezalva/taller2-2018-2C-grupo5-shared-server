var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../others/Constants'); // get our config file

function verifyToken(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers['access-token'];
    if (!token) 
        return res.status(401).send({ code:401, message: 'Unauthorized' });

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {      
        if (err) 
            return res.status(401).send({ code:401, message: 'Unauthorized' });       
      // if everything is good, save to request for use in other routes
      req.userId = decoded.id;
      next();
    });
}

module.exports = verifyToken;