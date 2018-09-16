const config = require('../others/Constants'); // get our config file
const tokenController = require('../auth/TokenController');
const metadataResp = {version: config.apiVersion};

function getAllServers (req, res, next){
    var client = req.client;

    client.query("select * FROM server", (err, resp) => {
        if (err) {
        res.status(500).json({code: 500, message: err.message});
        } else {
            metadataAllServers = {total:resp.rowCount, version: config.apiVersion};
            res.status(200).json({metadata: metadataAllServers, server: resp.rows});
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
            var server_id = resp.rows[0].server_id;
            var token = tokenController.createToken(server_id);
            req.server_id = server_id;
            req.token = token;
            
            //send result
            tokenResp = {expiresAt:config.expireTime, token:token};
            serverResp={server:resp.rows[0], token: tokenResp};
            res.status(200).json({metadata: metadataResp, server: serverResp});
            next();
        }
    })
}


function saveToken (req, res, next){
    //save token
    var client=req.client;
    var server_id=req.server_id;
    var token=req.token;
    client.query('INSERT INTO token(server_id,token) VALUES($1,$2) ',[server_id,token],(error, response) => {
        if(error)
            console.log(error);
        client.end();
    });
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
                res.status(200).json({metadata: metadataResp, server: resp.rows[0]});
            }
        }
        client.end();
    })
}


function updateServer (req, res, next){

    var client = req.client;
    var _rev = req.body._rev || '';
    var name = req.body.name || '';

    if(_rev == '' || name == ''){
        return res.status(400).json({code: 400, data: 'Incumplimiento de precondiciones (parámetros faltantes)'});
    }

    const text = 'UPDATE server SET nameServer=$1, _rev=$2 WHERE server_id=$3 RETURNING *';
    client.query(text, [name,_rev,req.params.id], (err, resp) => {
        if (err) {
            res.status(500).json({code: 500, data: err.message});
        } else {
            if(resp.rows == ''){
            res.status(404).json({code: 404, data:'Servidor inexistente'});
            }else{
            res.status(200).json({metadata: metadataResp, server: resp.rows});
            }
        }
        client.end();
    })
}


function removeServer (req, res, next){
    var client = req.client;
    const text = 'DELETE FROM server WHERE server_id=$1';
    var server_id = req.params.id;

    client.query(text, [server_id], (err, resp) => {
        if (err) {
            res.status(500).json({code: 500, message: err.message});
        }else {
            if(resp.rowCount == 0){
                res.status(410).json({code:404, message:'No existe el recurso solicitado'});
            }else{
                res.status(203).json({code:203, message:'el registro fue eliminado'});
            }
        }
        client.end();
    })
}


function deleteToken (req, res, next){
    var client=req.client;
    var server_id=req.params.id;

    client.query('DELETE FROM token WHERE server_id=$1',[server_id],(error, response) => {
        if(error)
            console.log(error);
        next();
    });
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
    saveToken:saveToken,
    deleteToken:deleteToken
};