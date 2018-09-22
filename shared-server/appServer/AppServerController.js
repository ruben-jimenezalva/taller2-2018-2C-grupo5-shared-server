const config = require('../others/Constants'); // get our config file
const tokenController = require('../auth/TokenController');
//const metadataResp = {version: config.apiVersion};
//var connect_db = require('../service/Connect');
//const bcrypt = require('bcryptjs');
const crypto = require('crypto-js');
const model = require('./AppServerModels');

function getAllServers (req, res, next){
    var client = req.client;
    client.query("select * FROM server", (err, resp) => {
        if (err) {
            res.status(500).json({code: 500, message: err.message});
        } else {
            //res.status(200).send(model.getAllServers(resp));
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
        return res.status(400).json({code: 400, message: 'Incumplimiento de precondiciones (parámetros faltantes)'});
    }

    var values = [createdBy,name,'NaN'];
    client.query(text, values, (err, resp) => {
        if (err) {
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
                    res.status(500).json({code: 500, message: err.message});
                } else {
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
            res.status(500).json({code: 500, message: err.message});
        } else {
            if(resp.rowCount == 0){
                res.status(404).json({code: 404, message:'Servidor inexistente'});
            }else{
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
        return res.status(400).json({code: 400, message: 'Incumplimiento de precondiciones (parámetros faltantes)'});
    }

    var text = 'SELECT * FROM server WHERE server_id=$1';
    client.query(text,[req.params.id],(error,resp)=>{
        if(error){
            res.status(500).json({code: 500, message:error.message});
        }else{
            if(resp.rows == ''){
                res.status(404).json({code: 404, message:'Servidor inexistente'});
            }else{

                if(resp.rows[0]._rev != _rev){
                    res.status(409).json({code: 409, message:'Conflict _rev is incorrect'});
                }else{
                    var hash = crypto.MD5(JSON.stringify(resp.rows[0]));
                    var new_rev = hash.toString(crypto.enc.hex);
                
                    text = 'UPDATE server SET nameServer=$1, _rev=$2 WHERE server_id=$3 RETURNING *';
                    client.query(text, [name,new_rev,req.params.id], (err, response) => {
                        if (err) {
                            res.status(500).json({code: 500, message: err.message});
                        } else {
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
            res.status(500).json({code: 500, message: err.message});
        }else {
            if(resp.rowCount == 0){
                res.status(410).json({code:404, message:'No existe el recurso solicitado'});
            }else{
                responseInvalidToken = tokenController.invalidateToken(resp.rows[0].jti,client);
                if (responseInvalidToken < 0){
                    return res.status(500).json({code: 500, message:'Unexpected error'});
                }else
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
           return res.status(500).json({code: 500, message: err.message});
        } else {
            if(resp.rowCount == 0){
               return res.status(404).json({code: 404, message:'Servidor inexistente'});
            }else{
                var server = resp.rows[0];
                responseInvalidToken = tokenController.invalidateToken(server.jti,client);
                if (responseInvalidToken < 0){
                    return res.status(500).json({code: 500, message:'Unexpected error'});
                }else{
                    var tokenResponse = tokenController.createToken(server_id);
                    //update jti
                    text = 'UPDATE server SET jti=$1 WHERE server_id=$2 RETURNING *';
                    values = [tokenResponse.jti,server_id];
                    client.query(text,values,(error, resp) => {
                        if(error)
                            console.log(error);
                        else{
                            console.log("fue actualizado");
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