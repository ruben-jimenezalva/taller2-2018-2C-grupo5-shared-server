const chai = require('chai');
var chaiHttp = require('chai-http');
const assert = chai.assert;
const expect = chai.expect;
var statusPayments = require('../Constants');


chai.use(chaiHttp);
const url = 'http://shared-server:8080';

//global varibles
var username = 'pepito-perez' + Math.random()*1000000000;
var password = 'pepito-perez-pass';
var tokenUser;
var token_server_1;
var token_server_2;

var server_id_1;
var server_id_2;

var dataCreated_1='alguien1';
var dataName_1 = 'server-----1'+ Math.random()*1000000000;
var dataCreated_2 = 'alguien2';
var dataName_2 = 'sever-------2'+ Math.random()*1000000000;
var transaction_id_server1;
var transaction_id_server2;

var method1_server_1 = 'method 2_server1--' + Math.random()*10000000000;
var method1_server_2 = 'method 1_server2--' + Math.random()*10000000000;


describe('TEST',() =>{
    it('BEGIN TEST',(done) =>{
        console.log("======================================");
        console.log("=========TEST USER PAYMENTS===========");
        console.log("======================================");
        done();
    });
});



describe('test regiter', ()=>{
    it('sould register with success', (done)=>{
        chai.request(url)
            .post('/api/user/register')
            .send({username:username, password:password})
            .end(function(err,res){
                expect(res).to.have.status(201);
                done();
            })
    });
});


describe('test login', ()=>{
    it('sould login with success', (done)=>{
        chai.request(url)
            .post('/api/user/login')
            .send({username:username, password:password})
            .end(function(err,res){
                expect(res).to.have.status(201);
                var object = JSON.parse(res.text);
                tokenUser = object.token.token;
                done();
            })
    });
});

//---------------------------------------------------------


describe('test create server_1', ()=>{
    it('sould create server_1 successfully', (done)=>{
        chai.request(url)
            .post('/api/servers')
            .send({createdBy:dataCreated_1, name:dataName_1})
            .end(function(err,res){
                expect(res).to.have.status(201);
                var object = JSON.parse(res.text);
                token_server_1 = object.server.token.token;
                server_id_1 = object.server.server.id;
                done();
            })
    });
});


describe('test create server_2', ()=>{
    it('sould create server_2 successfully', (done)=>{
        chai.request(url)
            .post('/api/servers')
            .send({createdBy:dataCreated_2, name:dataName_2})
            .end(function(err,res){
                expect(res).to.have.status(201);
                var object = JSON.parse(res.text);
                token_server_2 = object.server.token.token;
                server_id_2 = object.server.server.id;
                done();
            })
    });
});

//-------------------------------------------------------

describe('test create payment for server 1', ()=>{
    it('sould create payment for server_1 successfully', (done)=>{
        chai.request(url)
            .post('/api/payments')
            .send({
                "currency":"pesos",
                "value":"10000",
                    "paymentMethod":{
                        "expiration_month":"8",
                        "expiration_year":"2020",
                        "method":method1_server_1,
                        "number":"----",
                        "type":"-----"
                    }
            })
            .set({authorization:token_server_1})
            .end(function(err,res){
                expect(res).to.have.status(201);
                var object = JSON.parse(res.text);
                transaction_id_server1 = object.transaction_id;
                done();
            })
    });
});


describe('test create payment for server 2', ()=>{
    it('sould create payment for server_2 successfully', (done)=>{
        chai.request(url)
            .post('/api/payments')
            .send({
                "currency":"pesos",
                "value":"500000",
                    "paymentMethod":{
                        "expiration_month":"8",
                        "expiration_year":"2020",
                        "method":method1_server_2,
                        "number":"----",
                        "type":"-----"
                    }
            })
            .set({authorization:token_server_2})
            .end(function(err,res){
                expect(res).to.have.status(201);
                var object = JSON.parse(res.text);
                transaction_id_server2 = object.transaction_id;
                done();
            })
    });
});

//-------------------------------------------------

describe('get all payments of all the servers',()=>{
    it('should it obtain all payments but the transactions searched not exists',(done)=>{
        chai.request(url)
            .get('/api/payments')
            .set({'authorization':tokenUser})
            .end(function(err,res){
                expect(res).to.have.status(200);
                assert.notMatch(res.text,new RegExp(transaction_id_server1+'q'),'regexp not matches');
                assert.notMatch(res.text,new RegExp(transaction_id_server1+'q'),'regexp not matches');
                done();
            });
    });
});



describe('get all payments of all the servers',()=>{
    it('should it obtain all payments and transactions searched exists',(done)=>{
        chai.request(url)
            .get('/api/payments')
            .set({'authorization':tokenUser})
            .end(function(err,res){
                expect(res).to.have.status(200);
                assert.match(res.text.toString(),new RegExp(transaction_id_server1),'regexp matches');
                assert.match(res.text.toString(),new RegExp(transaction_id_server2),'regexp matches');
                done();
            });
    });
});





//################TEST ADDED######################

describe('get single payment_1_server1 of the server 1',()=>{
    it('should obtain the payment_1_server1 successfully because query is executed by admin',(done)=>{
        chai.request(url)
            .get('/api/payments/'+ transaction_id_server1)
            .set({'authorization':tokenUser})
            .end(function(err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                assert.equal(object.transaction_id,transaction_id_server1);
                done();
            });
    });
});

describe('get single payment_1_server2 of the server 2',()=>{
    it('should obtain the payment_1_server2 successfully because query is executed by admin',(done)=>{
        chai.request(url)
            .get('/api/payments/'+ transaction_id_server2)
            .set({'authorization':tokenUser})
            .end(function(err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                assert.equal(object.transaction_id,transaction_id_server2);
                done();
            });
    });
});


describe('get all paymethods of all servers',()=>{
    it('should obtain all paymethods successfully because the query is executed by admin',(done)=>{
        chai.request(url)
            .get('/api/payments/methods')
            .set({'authorization':tokenUser})
            .end(function(err,res){
                expect(res).to.have.status(200);
                assert.match(res.text,new RegExp(method1_server_1),'regexp matches');
                assert.match(res.text,new RegExp(method1_server_2),'regexp matches');
                done();
            });
    });
});

//################################################



//&&&&&&&&&&&&&&&& MORE TEST ADDED &&&&&&&&&&&&&&&&&&&

//update payments

describe('update payment transaction_id_server1 to payment accepted',()=>{
    it('should it update payment successfully',(done)=>{
        chai.request(url)
            .put('/api/payments/'+transaction_id_server1)
            .send({'status':statusPayments.PAYMENT_ACCEPTED})
            .set({'authorization':tokenUser})
            .end(function(err,res){
                expect(res).to.have.status(200);
                assert.equal(res.body.status,statusPayments.PAYMENT_ACCEPTED);
                done();
            });
    });
});



describe('update payment transaction_id_server2 to payment declined',()=>{
    it('should it update payment successfully',(done)=>{
        chai.request(url)
            .put('/api/payments/'+transaction_id_server2)
            .send({'status':statusPayments.PAYMENT_DECLINED})            
            .set({'authorization':tokenUser})
            .end(function(err,res){
                expect(res).to.have.status(200);
                assert.equal(res.body.status,statusPayments.PAYMENT_DECLINED);
                done();
            });
    });
});


//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


describe('delete server 1',() =>{
    it('should delete single server with success',(done) =>{
        chai.request(url)
            .delete('/api/servers/'+server_id_1)
            .set({'Authorization':token_server_1})
            .end( function (err,res){
                expect(res).to.have.status(203);
                done();
            });
    });
});

describe('delete server 2',() =>{
    it('should delete single server with success',(done) =>{
        chai.request(url)
            .delete('/api/servers/'+server_id_2)
            .set({'Authorization':token_server_2})
            .end( function (err,res){
                expect(res).to.have.status(203);
                done();
            });
    });
});

//------------------------------------------------------

describe('get all payments of all servers',()=>{
    it('should it obtain all payments but transactions searched not exists because were deleted',(done)=>{
        chai.request(url)
            .get('/api/payments')
            .set({'authorization':tokenUser})
            .end(function(err,res){
                expect(res).to.have.status(200);
                assert.notMatch(res.text.toString(),new RegExp(transaction_id_server1),'regexp matches');
                assert.notMatch(res.text.toString(),new RegExp(transaction_id_server2),'regexp matches');
                done();
            });
    });
});


describe('get single payment of the server_1',()=>{
    it('should it fail because server 1 was deleted',(done)=>{
        chai.request(url)
            .get('/api/payments/'+transaction_id_server1)
            .set({'authorization':tokenUser})
            .end(function(err,res){
                expect(res).to.have.status(404);
                done();
            });
    });
});

describe('get single payment of the server_2',()=>{
    it('should it fail because server 2 was deleted',(done)=>{
        chai.request(url)
            .get('/api/payments/'+transaction_id_server2)
            .set({'authorization':tokenUser})
            .end(function(err,res){
                expect(res).to.have.status(404);
                done();
            });
    });
});



describe('get all paymethods of all servers',()=>{
    it('should it obtain all paymethods but methods searched not exists because were deleted',(done)=>{
        chai.request(url)
            .get('/api/payments/methods')
            .set({'authorization':tokenUser})
            .end(function(err,res){
                expect(res).to.have.status(200);
                assert.notMatch(res.text.toString(),new RegExp(method1_server_1),'regexp matches');
                assert.notMatch(res.text.toString(),new RegExp(method1_server_2),'regexp matches');
                done();
            });
    });
});