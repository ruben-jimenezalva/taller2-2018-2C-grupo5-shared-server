const logger = require('../others/logger');
const db = require('./UserAccessDB');
const bcrypt = require('bcryptjs');
const tokenControlller = require('../auth/TokenController');
const model = require('./UserModels');

function login(req,res,next){
    var nameFunction = arguments.callee.name;
    var data_get = {};
    var username = req.body.username || '';
    var password = req.body.password || '';
    data_get.username = username;

    //verify parameters
    if (username == '' || password == ''){
        logger.warn(__filename,nameFunction,'breach of preconditions, missing paramters');
        return res.status(400).send({code:400, message:'breach of preconditions, missing paramters'});
    }

    var res_get = db.getSingleUser(data_get)
    res_get.then(
        function(error){
            logger.error(__filename,nameFunction,error.message);
            res.status(500).send({code:500, message:error.message});
        },
        function(response){
            if(response.rowCount == 0){
                logger.warn(__filename,nameFunction,'user: '+username+' not exist');
                res.status(401).send({code:500, message:'user: '+username+' not exist'});
            }else{
                // check if the password is valid
                bcrypt.compare(password,response.rows[0].password)
                .then(function(resp){
                    if (resp){
                        //generate token
                        var token = tokenControlller.createTokenAdmin(username);
                        logger.info(__filename,nameFunction,'token generated successfully for user: '+username);
                        res.status(201).send(model.loginResponse(token));
                    }else{
                        logger.warn(__filename,nameFunction,'incorrect password for user: '+username);
                        res.status(401).send({code:401, message:'incorrect password'});
                    }
                });
            }
        }
    );
}

function register(req,res,next){
    var nameFunction = arguments.callee.name;
    var data_insert = {};
    var username = req.body.username || '';
    var password = req.body.password || '';

    //verify parameters
    if (username == '' || password == ''){
        logger.warn(__filename,nameFunction,'breach of preconditions, missing paramters');
        return res.status(400).send({code:400, message:'breach of preconditions, missing paramters'});
    }

    data_insert.username = username;
    data_insert.password = bcrypt.hashSync(password, 8);
    var res_get = db.register(data_insert)
    res_get.then(
        function(error){
            logger.error(__filename,nameFunction,error.message);
            res.status(500).send({code:500, message:error.message});
        },
        function(response){
            logger.info(__filename,nameFunction,'user: '+username+' registered successfully');
            res.status(201).send({code:500, message:'user registered successfully'});
        }
    );
}

//--------------------------------------

function getAllAppServers(req,res,next){
    client = req,client;
    
}


function getAllPayments(req,res,next){
    client = req,client;
    
}

function getAllTrackings(req,res,next){
    client = req,client;
    
}

//--------------------------------------

function updatePayment(req,res,next){
    client = req,client;
    
}


function updateTracking(req,res,next){
    client = req,client;
    
}

module.exports = {
    login:login,
    register:register
}