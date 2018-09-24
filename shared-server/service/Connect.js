const pg = require('pg');
const logger = require('../others/logger');
var connectionString = process.env.DATABASE_URL; 

function connect_db (req, res, next){
    var nameFunction = arguments.callee.name;    
    const client = new pg.Client(connectionString);

    client.connect((err) => {
        if (err) {
            logger.error(__filename,nameFunction,err.message);
            res.status(500).json({code: 500, data: err.message});
        }else{
            logger.info(__filename,nameFunction,'connected');
            req.client = client;
            next();
        }
    })
}

module.exports = connect_db;