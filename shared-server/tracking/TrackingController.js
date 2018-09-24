logger = require('../others/logger');
model = require('./TrackingModels');

function createTracking (req, res, next){
    client = res.client;
    
}
  
function getInfoTracking (req, res, next){
    client = res.client;
    var text = 'SELECT * FROM tracking WHERE tracking_id=$1';
    client.query(text,[req.parameters.tracking_id],(err,resp) =>{
        if(err){
            logger.info(__filename+' - '+'getInfoTracking,'+err.message);
            res.status(200).send(model.getInfoTracking(resp));
        }else{
            logger.info(__filename+' - '+'getInfoTracking, tracking created successfully');
            res.status(200).send(model.getInfoTracking(resp));
        }
    });
}

module.exports = {
    createTracking: createTracking,
    getInfoTracking: getInfoTracking,
};
  