const {Client} = require('pg');

function connect_db (req, res, next){    
    var client = new Client();
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