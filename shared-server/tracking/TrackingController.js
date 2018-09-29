var logger = require('../others/logger');
var model = require('./TrackingModels');
var connect = require('../service/Connect');

function createTracking (req, res, next){
    var client = connect();
    var server_fk = req.id;
    var nameFunction = arguments.callee.name;
    var status = req.body.status || '';

    var text = 'INSERT INTO tracking(status,server_fk) VALUES ($1,$2) RETURNING*';
    var values = [status,server_fk];
    client.query(text,values,(err,resp)=>{
        if(err){
            logger.error(__filename,nameFunction,err.message);
            res.status(500).json({code:500, message:err.message});
        }else{
            logger.info(__filename,nameFunction,'tracking created successfully');
            res.status(201).send(model.getInfoTracking(resp));
            //res.status(201).send(resp.rows[0]);
        }
        client.end();
    });
}

function getInfoTracking (req, res, next){
    var client = connect();
    var server_fk = req.id;
    var nameFunction = arguments.callee.name;
    var text = 'SELECT * FROM tracking WHERE tracking_id=$1 and server_fk=$2 ';
    client.query(text,[req.params.tracking_id,server_fk],(err,resp) =>{
        if(err){
            logger.error(__filename,nameFunction,err.message);
            res.status(500).json({code:500, message:err.message});
        }else{
            if(resp.rowCount < 1){
                logger.warn(__filename,nameFunction,'non exists tracking');
                res.status(404).json({code:404, message:'non exists tracking'});
            }else{
                logger.info(__filename,nameFunction,'get tracking successfully');
                res.status(200).send(model.getInfoTracking(resp));
            }
        }
        client.end();
    });
}

module.exports = {
    createTracking: createTracking,
    getInfoTracking: getInfoTracking
};
  