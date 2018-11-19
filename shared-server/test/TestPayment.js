'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const assert = chai.assert;

chai.use(chaiHttp);

const APP = require('../service/express');
const server = APP.listen();

//variables
var createdByData = 'someone';
var nameData = 'test server payment**++$$-##- 1000+**';
var nameData2 = 'test server patment**++$$-##- 2000**';
var dataUrl1 = 'urkadasdasdads';
var dataUrl2 = 'ent**++$$-##- 2000**';
var token_server1;
var token_server2;
var server_id_1;
var server_id_2;

var id_payment1_server_1;
var id_payment2_server_1;
var id_payment1_server_2;

var method1_server_1 = 'method 1_server1--' + Math.random()*10000000000;
var method2_server_1 = 'method 2_server1--' + Math.random()*10000000000;
var method1_server_2 = 'method 1_server2--' + Math.random()*10000000000;


describe('TEST',() =>{
    it('BEGIN TEST',(done) =>{
        console.log("======================================");
        console.log("==============TEST PAYMENT============");
        console.log("======================================");
        done();
    });
});


describe('get my payments',()=>{
    it('should fail because it is not authorized',(done)=>{
        chai.request(server) 
            .get('/api/payments')
            .end(function(err,res){
                expect(res).to.have.status(401);
                done();
            });
    });
});

describe('get all paymethods',()=>{
    it('should fail because it is not authorized',(done)=>{
        chai.request(server) 
            .get('/api/payments/methods')
            .end(function(err,res){
                expect(res).to.have.status(401);
                done();
            });
    });
});

describe('create payment',()=>{
    it('should fail because it is not authorized',(done)=>{
        chai.request(server) 
            .post('/api/payments')
            .end(function(err,res){
                expect(res).to.have.status(401);
                done();
            });
    });
});

//----------------------------------------------------

describe('create server',()=>{
    it('should create server with success',(done)=>{
        chai.request(server) 
            .post('/api/servers')
            .send({createdBy:createdByData, name:nameData, url:dataUrl1})
            .end(function(err,res){
                expect(res).to.have.status(201);
                var object = JSON.parse(res.text);
                token_server1 = object.server.token.token;
                server_id_1 = object.server.server.id;
                done();
            });
    });
});

describe('create server',()=>{
    it('should create server with success',(done)=>{
        chai.request(server) 
            .post('/api/servers')
            .send({createdBy:createdByData, name: nameData2, url:dataUrl2})
            .end(function(err,res){
                expect(res).to.have.status(201);
                var object = JSON.parse(res.text);
                token_server2 = object.server.token.token;
                server_id_2 = object.server.server.id;
                done();
            });
    });
});

//----------------------------------------------------

describe('create payment 1 for test server 1 ',()=>{
    it('should create with success because it is authorized',(done)=>{
        chai.request(server) 
            .post('/api/payments')
            .set({'authorization':token_server1})
            .send({
                "currency":"pesos",
                "value":"10000",
                    "paymentMethod":{
                        "expiration_month":"8",
                        "expiration_year":"2020",
                        "method":method1_server_1,
                        "number":"1234",
                        "type":"anytype"
                    }
            })
            .end(function(err,res){
                expect(res).to.have.status(201);
                var object = JSON.parse(res.text);
                id_payment1_server_1 = object.transaction_id;
                assert.equal("pesos",res.body.currency);
                assert.equal("10000",res.body.value);
                assert.equal("8",res.body.paymentMethod.expiration_month);
                assert.equal("2020",res.body.paymentMethod.expiration_year);
                assert.equal(method1_server_1,res.body.paymentMethod.method);
                assert.equal("1234",res.body.paymentMethod.number);
                assert.equal("anytype",res.body.paymentMethod.type);
                done();
            });
    });
});

describe('create payment 2 for test server 1 ',()=>{
    it('should create with success because it is authorized',(done)=>{
        chai.request(server) 
            .post('/api/payments')
            .set({'authorization':token_server1})
            .send({
                "currency":"dolar",
                "value":"300",
                    "paymentMethod":{
                        "expiration_month":"10",
                        "expiration_year":"2019",
                        "method":method2_server_1,
                        "number":"----",
                        "type":"----"
                    }
            })
            .end(function(err,res){
                expect(res).to.have.status(201);
                assert.equal("dolar",res.body.currency);
                assert.equal("300",res.body.value);
                assert.equal("10",res.body.paymentMethod.expiration_month);
                assert.equal("2019",res.body.paymentMethod.expiration_year);
                assert.equal(method2_server_1,res.body.paymentMethod.method);
                assert.equal("----",res.body.paymentMethod.number);
                assert.equal("----",res.body.paymentMethod.type);
                id_payment2_server_1 = res.body.transaction_id;
                done();
            });
    });
});

describe('create payment 1 for test server 2 ',()=>{
    it('should create with success because it is authorized',(done)=>{
        chai.request(server) 
            .post('/api/payments')
            .set({'authorization':token_server2})
            .send({
                "currency":"pesos",
                "value":"902000",
                    "paymentMethod":{
                        "expiration_month":"",
                        "expiration_year":"",
                        "method":method1_server_2,
                        "number":"",
                        "type":""
                    }
            })
            .end(function(err,res){
                expect(res).to.have.status(201);
                id_payment1_server_2 = res.body.transaction_id;
                done();
            });
    });
});

//----------------------------------------------------

describe('get payments of test server 1',()=>{
    it('should it have 2 payments because their states are pending ',(done)=>{
        chai.request(server) 
            .get('/api/payments')
            .set({'authorization':token_server1})
            .end(function(err,res){
                expect(res).to.have.status(200);
                assert.equal(res.body.length,2);
                done();
            });
    });
});


describe('get payments of test server 2',()=>{
    it('should it have 1 payment because your status is pending',(done)=>{
        chai.request(server) 
            .get('/api/payments')
            .set({'authorization':token_server2})
            .end(function(err,res){
                expect(res).to.have.status(200);
                assert.equal(res.body.length,1);
                done();
            });
    });
});

//----------------------------------------------

describe('get all paymethods of the server 1',()=>{
    it('should obtain paymethods successfully and the paymethods searched exists',(done)=>{
        chai.request(server) 
            .get('/api/payments/methods')
            .set({'authorization':token_server1})
            .end(function(err,res){
                expect(res).to.have.status(200);
                assert.match(res.text,new RegExp(method1_server_1),'regexp matches');
                assert.match(res.text,new RegExp(method2_server_1),'regexp matches');
                done();
            });
    });
});


describe('get all paymethods of the server 2',()=>{
    it('should obtain paymethods successfully and the paymethods searched exists',(done)=>{
        chai.request(server) 
            .get('/api/payments/methods')
            .set({'authorization':token_server2})
            .end(function(err,res){
                expect(res).to.have.status(200);
                assert.match(res.text,new RegExp(method1_server_2),'regexp matches');
                done();
            });
    });
});



describe('get all paymethods of the server 1',()=>{
    it('should obtain paymethods successfully but the paymethods searched not exists',(done)=>{
        chai.request(server) 
            .get('/api/payments/methods')
            .set({'authorization':token_server1})
            .end(function(err,res){
                expect(res).to.have.status(200);
                assert.notMatch(res.text,new RegExp(method1_server_2),'regexp no matches');
                done();
            });
    });
});


describe('get all paymethods of the server 2',()=>{
    it('should obtain paymethods successfully but the paymethods searched not exists',(done)=>{
        chai.request(server) 
            .get('/api/payments/methods')
            .set({'authorization':token_server2})
            .end(function(err,res){
                expect(res).to.have.status(200);
                assert.notMatch(res.text,new RegExp(method1_server_1),'regexp matches');
                assert.notMatch(res.text,new RegExp(method2_server_1),'regexp matches');
                done();
            });
    });
});


//################TEST ADDED######################


describe('get single payment_1_server2 of the server 2',()=>{
    it('should obtain the payment_1 successfully',(done)=>{
        chai.request(server) 
            .get('/api/payments/'+id_payment1_server_2)
            .set({'authorization':token_server2})
            .end(function(err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                assert.equal(object.transaction_id,id_payment1_server_2);
                done();
            });
    });
});

describe('get single payment_1_server1 of the server 1',()=>{
    it('should obtain the payment_1 successfully',(done)=>{
        chai.request(server) 
            .get('/api/payments/'+ id_payment1_server_1)
            .set({'authorization':token_server1})
            .end(function(err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                assert.equal(object.transaction_id,id_payment1_server_1);
                done();
            });
    });
});


describe('get single payment_2_server1 of the server 1',()=>{
    it('should obtain the payment_2 successfully',(done)=>{
        chai.request(server) 
            .get('/api/payments/'+ id_payment2_server_1)
            .set({'authorization':token_server1})
            .end(function(err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                assert.equal(object.transaction_id,id_payment2_server_1);
                done();
            });
    });
});

//-------------------------------------------------

describe('get single payment_1_server2 of the server 1',()=>{
    it('should fail because server_1 no have that payment',(done)=>{
        chai.request(server) 
            .get('/api/payments/'+id_payment1_server_2)
            .set({'authorization':token_server1})
            .end(function(err,res){
                expect(res).to.have.status(404);
                var object = JSON.parse(res.text);
                assert.equal(object.code,404);
                done();
            });
    });
});

describe('get single payment_1_server1 of the server 2',()=>{
    it('should fail because server_2 no have that payment',(done)=>{
        chai.request(server) 
            .get('/api/payments/'+id_payment1_server_1)
            .set({'authorization':token_server2})
            .end(function(err,res){
                expect(res).to.have.status(404);
                var object = JSON.parse(res.text);
                assert.equal(object.code,404);
                done();
            });
    });
});

describe('get single payment_2_server1 of the server 2',()=>{
    it('should fail because server_2 no have that payment',(done)=>{
        chai.request(server) 
            .get('/api/payments/'+id_payment2_server_1)
            .set({'authorization':token_server2})
            .end(function(err,res){
                expect(res).to.have.status(404);
                var object = JSON.parse(res.text);
                assert.equal(object.code,404);
                done();
            });
    });
});

//################################################


describe('remove server',()=>{
    it('should remove server with success',(done)=>{
        chai.request(server) 
            .delete('/api/servers/'+server_id_1)
            .set({'authorization':token_server1})
            .end(function(err,res){
                expect(res).to.have.status(203);
                done();
            });
    });
});

describe('remove server',()=>{
    it('should remove server with success',(done)=>{
        chai.request(server) 
            .delete('/api/servers/'+server_id_2)
            .set({'authorization':token_server2})
            .end(function(err,res){
                expect(res).to.have.status(203);
                done();
            });
    });
});

//-------------------------------------------------
