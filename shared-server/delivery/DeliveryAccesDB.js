const logger =  require('../others/logger');
const connect = require('../service/Connect');
const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';

function createRecordOfRule (data){
    var nameFunction = arguments.callee.name;
    var client = connect();
    let nameRule = data.nameRule;
    let dataRule = data.dataRule;

    
     // Change Status of old rules
     
    var text = 'UPDATE rules SET status=$1 WHERE nameRule=$2';

    var promise = new Promise(function(reject,resolve){
        client.query(text, [STATUS_INACTIVE,nameRule], (error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error);
            } else {
                logger.info(__filename,nameFunction,'query update status of rules to inactive executed succesfully ');
                resolve(response);
            }
            client.end();
        });
    });


    
     // Create new record rule
     
    var client = connect();
    var text = 'INSERT INTO rules(namerule,datarule, status) VALUES($1,$2,$3)';
    var values = [nameRule,dataRule,STATUS_ACTIVE];

    var promise = new Promise(function(reject,resolve){
        client.query(text, values, (error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error);
            } else {
                logger.info(__filename,nameFunction,'query create new record rules  was executed succesfully');
                resolve(response);
            }
            client.end();
        });
    });

    return promise;
}



/*
function getRecordsOfRule (data){
    var client = connect();
    var nameFunction = arguments.callee.name;
    var text = "select * FROM server WHERE namerule=$1 and status=$2";
    var values = [data.nameRule,STATUS_INACTIVE];
    var promise = new Promise(function(reject,resolve){
        client.query(text, values, (error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error);
            } else {
                logger.info(__filename,nameFunction,'query get all records of a rule executed succesfully');
                resolve(response);
            }
            client.end();
        });

    });
    
    return promise;
}
*/
/*
function getCurrentRule (data){
    var client = connect();
    var nameFunction = arguments.callee.name;

    var text = "select datarule FROM rules WHERE namerule=$1 and status=$2";
    var values = [data.nameRule,STATUS_ACTIVE];

    var promise = new Promise(function(reject,resolve){
        client.query(text, values, (error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error);
            } else {
                logger.info(__filename,nameFunction,'query get actual rule was executed successfully');
                resolve(response);
            }
            client.end();
        });

    });
    
    return promise;
}
*/
/*
function getAllCurrentRules (){
    var client = connect();
    var nameFunction = arguments.callee.name;

    var text = "select namerule, datarule FROM rules WHERE status=$1";
    var values = [STATUS_ACTIVE];

    var promise = new Promise(function(reject,resolve){
        client.query(text, values, (error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error);
            } else {
                logger.info(__filename,nameFunction,'query get all current rules was executed successfully');
                resolve(response);
            }
            client.end();
        });

    });
    
    return promise;
}*/

function getAllRules (){
    var client = connect();
    var nameFunction = arguments.callee.name;

    var text = "select * FROM rules ";

    var promise = new Promise(function(reject,resolve){
        client.query(text, (error, response) => {
            if (error) {
                logger.error(__filename,nameFunction,error);
                reject(error);
            } else {
                logger.info(__filename,nameFunction,'query get all rules was executed successfully');
                resolve(response);
            }
            client.end();
        });

    });
    
    return promise;
}


module.exports = {
   createRecordOfRule,
 //   getCurrentRule,
  //  getAllCurrentRules,
  //  getRecordsOfRule,
    getAllRules
}