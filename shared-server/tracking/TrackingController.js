var logger = require('../others/logger');
var model = require('./TrackingModels');
var db = require('./TrackingAccessDB');

function createTracking (req, res, next){
    var nameFunction = arguments.callee.name;

    var data_create = {};
    data_create.server_fk = req.id;
    data_create.status = req.body.status || '';

    var res_create = db.createTracking(data_create);
    res_create.then(
        function(error){
            res.status(500).json({code:500, message:error.message});
            logger.error(__filename,nameFunction,error.message);
        },
        function(response){
            res.status(201).send(model.getInfoTracking(response));
            logger.info(__filename,nameFunction,'tracking created by server: '+req.id+' successfully');
        }
    );
}

function getInfoTracking (req, res, next){
    var nameFunction = arguments.callee.name;
    var res_get;
    var messageLog;
    var data_get = {};
    data_get.tracking_id = req.params.tracking_id;

    if(req.username){
        messageLog = 'get tracking: '+data_get.tracking_id+' for admin: '+req.username+' successfully';
        res_get = db.getTracking(data_get);
    }else{
        data_get.server_fk = req.id;
        messageLog = 'get tracking: '+data_get.tracking_id+' for server: '+req.id+' successfully';
        res_get = db.getInfoMyTracking(data_get);
    }

    res_get.then(
        function(error){
            res.status(500).json({code:500, message:error.message});
            logger.error(__filename,nameFunction,error.message);
        },
        function(response){
            if(response.rowCount == 0){
                logger.warn(__filename,nameFunction,'not exists tracking: '+data_get.tracking_id);
                res.status(404).json({code:404, message:'not exists tracking'});
            }else{
                res.status(200).send(model.getInfoTracking(response));
                logger.info(__filename,nameFunction,messageLog);
            }
        }
    );
}



/**
 * Method added
 * return all trackings of the AppServer that execute the query
 * return all trackings of all AppServers if a Administrator execute the query
 */
function getAllTrackings (req, res, next){
    var nameFunction = arguments.callee.name;
    var res_get;
    var messageLog;

    if(req.username){
        messageLog = 'get all trackings successfully by admin: '+req.username;
        res_get = db.getAllTrackings();
    }else{
        var data_get = {};
        data_get.server_fk = req.id;
        messageLog = 'get all trackings of the server: '+req.id+ ' successfully';
        res_get = db.getMyTrackings(data_get);
    }

    res_get.then(
        function(error){
            res.status(500).json({code:500, message:error.message});
            logger.error(__filename,nameFunction,error.message);
        },
        function(response){
            res.status(200).send(model.getAllTrackigs(response));
            logger.info(__filename,nameFunction,messageLog);
        }
    );
}


module.exports = {
    createTracking: createTracking,
    getInfoTracking: getInfoTracking,
    getAllTrackings:getAllTrackings
};
  