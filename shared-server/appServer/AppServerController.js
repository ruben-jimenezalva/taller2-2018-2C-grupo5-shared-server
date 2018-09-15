var jwt = require('jsonwebtoken');
var config = require('../others/Constants'); // get our config file
const metadataResp = {version: config.apiVersion};


function getAllServers (req, res, next){
    var client = req.client;
    client.query('SELECT * FROM server', (err, resp) => {
        if (err) {
        res.status(500).json({code: 500, message: err.message});
        } else {
            res.status(200).json({metadata: metadataResp, server: resp.rows});
        }
        client.end();
    }) 
}

function createServer (req, res, next){
    var client = req.client;
    const text = 'INSERT INTO server(createdBy, nameServer) VALUES($1, $2) RETURNING *';
    var createdBy = req.body.createdBy || '';
    var name = req.body.name || '';

    if(createdBy == '' || name == ''){
        return res.status(400).json({code: 400, data: 'Incumplimiento de precondiciones (parámetros faltantes)'});
    }

    const values = [createdBy,name];
    client.query(text, values, (err, resp) => {
        if (err) {
            res.status(500).json({code: 500, message: err.message});
        } else {
            // create token
            var jsonValue = JSON.parse(JSON.stringify(resp.rows[0])); 
            var token = jwt.sign (jsonValue, config.secret, {
                expiresIn: config.expireTime
            });

            //send result
            tokenResp = {expiresAt:config.expireTime, token:token};
            serverResp={server:resp.rows[0], token: tokenResp};
            res.status(200).json({metadata: metadataResp, server: serverResp});
        }
        client.end();
    })
}


function getSingleServer (req, res, next){
    var client = req.client;
    const text = 'SELECT * FROM server WHERE server_id=$1';
    client.query(text, [req.params.id], (err, resp) => {
        if (err) {
            res.status(500).json({code: 500, data: err.message});
        } else {
            if(resp.rowCount == 0){
            res.status(404).json({code: 404, message:'Servidor inexistente'});
            }else{
            res.status(200).json({metadata: metadataResp, server: resp.rows});
            }
        }
        client.end();
    })
}

//preguntar bien
function updateServer (req, res, next){
/*    var client = req.client;
    const text = 'UPDATE server() VALUES () WHERE server_id=$1';
    client.query(text, [req.params.id], (err, resp) => {
    if (err) {
        res.status(500).json({code: 500, data: err.message});
    } else {
        if(resp.rows == ''){
          res.status(404).json({code: 404, data:'Servidor inexistente'});
        }else{
          res.status(200).json({metadata: metadataResp, server: resp.rows});
        }
      }
    })
*/
res.send('updateServer\n');
}


function removeServer (req, res, next){
    var client = req.client;
    const text = 'DELETE FROM server WHERE server_id=$1)';

    client.query(text, [req.params.id], (err, resp) => {
        if (err) {
            res.status(500).json({code: 500, message: err.message});
        }else {
            if(resp.rowCount == 0){
                res.status(410).json({code:404, data:'No existe el recurso solicitado'});
            }else{
                res.status(204).json({code:204 , message: "el registro fue eliminado"});
            }
        }
        client.end();
    })
}


function resetTokenServer (req, res, next){
    res.send('resetTokenServer\n');
}


module.exports = {
    getAllServers: getAllServers,
    createServer: createServer,
    getSingleServer: getSingleServer,
    updateServer: updateServer,
    removeServer: removeServer,
    resetTokenServer: resetTokenServer,
};