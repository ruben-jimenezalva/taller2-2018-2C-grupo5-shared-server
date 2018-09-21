var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../others/Constants'); // get our config file
const nJwt = require('njwt');

function verifyToken(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers['authorization'];

    if (!token) 
        return res.status(401).send({ code:401, message: 'Unauthorized' });

    // verifies secret and checks exp
    nJwt.verify(token, config.secret, function(err, decoded) {      
        if (err) 
            return res.status(401).send({ code:401, message: 'Unauthorized' });       
        else{
            req.id = decoded.id;
            next();
        }
    });
}


//{id:server_id, currentTime: Date.now() };

function createToken(id) {
    var payload = {id:id, currentTime: Date.now() };
    var jwt = nJwt.create(payload,config.secret);
    jwt.setExpiration(new Date().getTime() + config.expireTime);
    var token = jwt.compact();
    return token;
}


/*no encuentro forma de implementarlo*/
function invalidateToken(token) {

    console.log(token);
    jwt.verify(token, config.secret, function(err, decoded){
        if (err){
            return -1;
        }
        else{
            var jwt = nJwt.create(decoded,config.secret);
            jwt.setExpiration(new Date().getTime());
            var old_token = jwt.compact();

            console.log("....decoded........");
            console.log(decoded);
            console.log("................");
            console.log("....jwt........");
            console.log(jwt);
            console.log("................");
            console.log("....old token............");
            console.log(old_token);
            console.log("................");
        }
    }) 
    return 0;
}

module.exports = {
    verifyToken: verifyToken,
    createToken: createToken,
    invalidateToken: invalidateToken
};