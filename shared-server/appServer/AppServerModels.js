const config = require('../others/Constants'); // get our config file
const metadataResp = {version: config.apiVersion};

function getAllServers(res){
    var metadataAllServers = {
        total:res.rowCount,
         version: config.apiVersion
    };
    var servers = [];
    for(i=0;i<res.rowCount;i++){
        var server = {
            "createdBy" : res.rows[i].createdby,
            "_rev" : res.rows[i]._rev,
            "name" : res.rows[i].nameserver,
            "createdTime" : res.rows[i].createdtime,
            "id" : res.rows[i].server_id,
            "lastConnection" : res.rows[i].lastconnection
        };
        servers[i]=server;
    }
    response = {metadata: metadataAllServers, server: servers};
    return response;
}

function postCreateServer(res,token){
    var server = {
        "createdBy" : res.rows[0].createdby,
        "_rev" : res.rows[0]._rev,
        "name" : res.rows[0].nameserver,
        "createdTime" : res.rows[0].createdtime,
        "id" : res.rows[0].server_id,
        "lastConnection" : res.rows[0].lastconnection
    };

    tokenResp = {
        expiresAt:config.expireTime,
        token:token
    };
    
    serverResp={server:server, token: tokenResp};
    response = {metadata: metadataResp, server: serverResp};
    return response;
}

function getSingleServer(res){
    var server = {
        "createdBy" : res.rows[0].createdby,
        "_rev" : res.rows[0]._rev,
        "name" : res.rows[0].nameserver,
        "createdTime" : res.rows[0].createdtime,
        "id" : res.rows[0].server_id,
        "lastConnection" : res.rows[0].lastconnection
    };
    response = {metadata: metadataResp, server: server};
    return response;
}




module.exports = {
    getAllServers: getAllServers,
    postCreateServer: postCreateServer,
    getSingleServer: getSingleServer
};