'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const assert = chai.assert;
var createdByData = 'someone';
var nameData = 'test server payment**++$$-##- 1000+**++';
var nameData2 = 'test server patment**++$$-##- 2000**++';
var token1;
var token2;
var id1;
var id2;

chai.use(chaiHttp);
const url = "http://shared-server:8080";


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
        chai.request(url)
            .get('/api/payments')
            .end(function(err,res){
                expect(res).to.have.status(401);
                done();
            });
    });
});

describe('get all paymethods',()=>{
    it('should fail because it is not authorized',(done)=>{
        chai.request(url)
            .get('/api/payments/methods')
            .end(function(err,res){
                expect(res).to.have.status(401);
                done();
            });
    });
});

describe('create payment',()=>{
    it('should fail because it is not authorized',(done)=>{
        chai.request(url)
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
        chai.request(url)
            .post('/api/servers')
            .send({createdBy:createdByData, name:nameData})
            .end(function(err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                token1 = object.server.token.token;
                id1 = object.server.server.id;
                done();
            });
    });
});

describe('create server',()=>{
    it('should create server with success',(done)=>{
        chai.request(url)
            .post('/api/servers')
            .send({createdBy:createdByData, name: nameData2})
            .end(function(err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                token2 = object.server.token.token;
                id2 = object.server.server.id;
                done();
            });
    });
});

//----------------------------------------------------

describe('create payment 1 for test server 1 ',()=>{
    it('should create with success because it is authorized',(done)=>{
        chai.request(url)
            .post('/api/payments')
            .set({'authorization':token1})
            .send({
                "currency":"pesos",
                "value":"10000",
                    "paymentMethod":{
                        "expiration_month":"8",
                        "expiration_year":"2020",
                        "method":"credit",
                        "number":"----",
                        "type":"-----"
                    }
            })
            .end(function(err,res){
                expect(res).to.have.status(201);
                done();
            });
    });
});

describe('create payment 2 for test server 1 ',()=>{
    it('should create with success because it is authorized',(done)=>{
        chai.request(url)
            .post('/api/payments')
            .set({'authorization':token1})
            .send({
                "currency":"dolar",
                "value":"300",
                    "paymentMethod":{
                        "expiration_month":"10",
                        "expiration_year":"2019",
                        "method":"debit",
                        "number":"----",
                        "type":"----"
                    }
            })
            .end(function(err,res){
                expect(res).to.have.status(201);
                done();
            });
    });
});

describe('create payment 1 for test server 2 ',()=>{
    it('should create with success because it is authorized',(done)=>{
        chai.request(url)
            .post('/api/payments')
            .set({'authorization':token2})
            .send({
                "currency":"pesos",
                "value":"902000",
                    "paymentMethod":{
                        "expiration_month":"",
                        "expiration_year":"",
                        "method":"cash",
                        "number":"",
                        "type":""
                    }
            })
            .end(function(err,res){
                expect(res).to.have.status(201);
                done();
            });
    });
});

//----------------------------------------------------

describe('get payments of test server 1',()=>{
    it('should it have 2 payments ',(done)=>{
        chai.request(url)
            .get('/api/payments')
            .set({'authorization':token1})
            .end(function(err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                assert.equal(object.length,2);
                done();
            });
    });
});


describe('get payments of test server 2',()=>{
    it('should it have 1 payment',(done)=>{
        chai.request(url)
            .get('/api/payments')
            .set({'authorization':token2})
            .end(function(err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                assert.equal(object.length,1);
                done();
            });
    });
});

describe('get all paymethods',()=>{
    it('should get all paymethods with success',(done)=>{
        chai.request(url)
            .get('/api/payments/methods')
            .set({'authorization':token2})
            .end(function(err,res){
                expect(res).to.have.status(200);
                done();
            });
    });
});

//-------------------------------------------------

describe('remove server',()=>{
    it('should remove server with success',(done)=>{
        chai.request(url)
            .delete('/api/servers/'+id1)
            .set({'authorization':token1})
            .end(function(err,res){
                expect(res).to.have.status(203);
                done();
            });
    });
});

describe('remove server',()=>{
    it('should remove server with success',(done)=>{
        chai.request(url)
            .delete('/api/servers/'+id2)
            .set({'authorization':token2})
            .end(function(err,res){
                expect(res).to.have.status(203);
                done();
            });
    });
});