const {Client} = require('pg');

function connect_db (req, res, next){    
    var client = new Client({
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
    });
    client.connect((err) => {
        if (err) {
            console.error('connection error', err.stack)
            res.status(500).json({code: 500, data: err.message});
        }
    })
    req.client = client;
    next();
}

module.exports = connect_db;