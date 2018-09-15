const pg = require('pg');
var connectionString = process.env.DATABASE_URL; 

function connect_db (req, res, next){
    const client = new pg.Client(connectionString);
    client.connect((err) => {
        if (err) {
            console.error('connection error', err.stack)
            res.status(500).json({code: 500, data: err.message});
        }else{
            console.error('connected');
        }
    })
    req.client = client;
    next();
}

module.exports = connect_db;