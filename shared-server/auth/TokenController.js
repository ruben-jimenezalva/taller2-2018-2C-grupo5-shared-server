//var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
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
            // consult jti in database
            var client = req.client;
            var jti = decoded.body.jti;
            console.log("-----------jti a consultar----------");
            console.log(jti);

            client.query('SELECT * FROM blackListToken where jti=$1',[jti],(error, resp) => {
                if(error)
                    return res.status(500).send({ code:500, message: 'Unexpected error' });
                else{
                    if(resp.rowCount != 0)
                        return res.status(401).send({ code:401, message: 'Unauthorized' });
                    else{
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
    return response;
}


/*no encuentro forma de implementarlo*/
function invalidateToken(jti,client) {

    console.log("-----------jti a guardar para restringir----------");
    console.log(jti);
    client.query('INSERT INTO blackListToken(jti) values($1)',[jti],(error, resp) => {
        if(error){
            console.log(error);
            console.log("no se logró inhabilitar el token");
            return -1;
            //return res.status(500).send({ code:500, message: 'Unexpected error' });
        }
        else{
            console.log("se inhabilito el token");
        } 
    });
}

module.exports = {
    verifyToken: verifyToken,
    createToken: createToken,
    invalidateToken: invalidateToken
};