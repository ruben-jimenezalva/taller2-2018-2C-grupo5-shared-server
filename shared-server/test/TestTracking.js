'use strict'
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var assert = chai.assert;
chai.use(chaiHttp);

const APP = require('../service/express');
const server = APP.listen();

//variables
var id_tracking = 'aaaaaaaa-bbbb-cccc-dddd-0242ac140002';
var token_server1;
var token_server2;
var id_server1;
var id_server2;
var id_payment1_server_1;
var id_payment2_server_1;
var id_payment1_server_2;
var id_tracking1_server1;
var id_tracking2_server1;
var id_tracking1_server2;
var createdByData = 'autor1---**%%%*%1000';
var nameServer1 = 'server1---**%%%*%';
var nameServer2 = 'server2---**%%%*%';



describe('TEST',() =>{
    it('BEGIN TEST',(done) =>{
        console.log("======================================");
        console.log("=============TEST TRACKING============");
        console.log("======================================");
        done();
    });
});


describe('create tracking', ()=>{
    it('should fail create tracking because it no authorized', (done)=>{
        chai.request(server) 
            .post('/api/trackings')
            .set({authorization:'dsadddd'})
            .end( function(err,res){
                expect(res).to.have.status(401);
                done();
            });
    });
});


describe('get tracking', ()=>{
    it('should fail get tracking because it no authorized', (done)=>{
        chai.request(server) 
            .get('/api/trackings/' +id_tracking)
            .set({authorization:'dsadddd'})
            .end( function(err,res){
                expect(res).to.have.status(401);
                done();
            });
    });
});

//--------------------------------------------------

describe('create server 1', ()=>{
    it('should create server sucessfully', (done)=>{
        chai.request(server) 
            .post('/api/servers')
            .send({createdBy:createdByData, name:nameServer1})
            .end( function(err,res){
                expect(res).to.have.status(201);
                var object = JSON.parse(res.text);
                token_server1 = object.server.token.token;
                id_server1 = object.server.server.id;
                done();
            });
    });
});


describe('create server 2', ()=>{
    it('should create server sucessfully', (done)=>{
        chai.request(server) 
            .post('/api/servers')
            .send({createdBy:createdByData, name:nameServer2})
            .end( function(err,res){
                expect(res).to.have.status(201);
                var object = JSON.parse(res.text);
                token_server2 = object.server.token.token;
                id_server2 = object.server.server.id;
                done();
            });
    });
});

//----------------------------------------------------

describe('create tracking for server 1', ()=>{
    it('should fail to create tracking because it has no associated payment', (done)=>{
        chai.request(server) 
            .post('/api/trackings')
            .set({authorization:token_server1})
            .send({status:'created'})
            .end( function(err,res){
                expect(res).to.have.status(500);
                done();
            });
    });
});


describe('create tracking for server 2', ()=>{
    it('should fail to create tracking because it has no associated payment', (done)=>{
        chai.request(server) 
            .post('/api/trackings')
            .set({authorization:token_server2})
            .send({status:'created'})
            .end( function(err,res){
                expect(res).to.have.status(500);
                done();
            });
    });
});


//--------------------------------------------------

//%%%%%%%%%%PAYMENTS ASSOCIATED TO TRACKINGS%%%%%

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
                        "method":"method1",
                        "number":"1234",
                        "type":"anytype"
                    }
            })
            .end(function(err,res){
                expect(res).to.have.status(201);
                id_payment1_server_1 = res.body.transaction_id;
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
                        "method":"method2",
                        "number":"----",
                        "type":"----"
                    }
            })
            .end(function(err,res){
                expect(res).to.have.status(201);
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
                        "method":"method3",
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



//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

describe('create tracking for server 1', ()=>{
    it('should create tracking succesfully because it have payment associated', (done)=>{
        chai.request(server) 
            .post('/api/trackings')
            .set({authorization:token_server1})
            .send({id: id_payment1_server_1})
            .end( function(err,res){
                expect(res).to.have.status(201);
                id_tracking1_server1 = res.body.id;
                done();
            });
    });
});


describe('create tracking for server 1', ()=>{
    it('should create tracking succesfully because it have payment associated', (done)=>{
        chai.request(server) 
            .post('/api/trackings')
            .set({authorization:token_server1})
            .send({id: id_payment2_server_1})
            .end( function(err,res){
                expect(res).to.have.status(201);
                id_tracking2_server1 = res.body.id;
                done();
            });
    });
});

describe('create tracking for server 2', ()=>{
    it('should create tracking succesfully because it have payment associated', (done)=>{
        chai.request(server) 
            .post('/api/trackings')
            .set({authorization:token_server2})
            .send({id: id_payment1_server_2})
            .end( function(err,res){
                expect(res).to.have.status(201);
                id_tracking1_server2 = res.body.id;
                done();
            });
    });
});

//--------------------------------------------------

describe('get tracking 1 for server 1', ()=>{
    it('should obtain tracking successfully', (done)=>{
        chai.request(server) 
            .get('/api/trackings/' +id_tracking1_server1)
            .set({authorization:token_server1})
            .end( function(err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                assert.equal(id_tracking1_server1,object.id);
                done();
            });
    });
});


describe('get tracking 2 for server 1', ()=>{
    it('should obtain tracking successfully', (done)=>{
        chai.request(server) 
            .get('/api/trackings/' +id_tracking2_server1)
            .set({authorization:token_server1})
            .end( function(err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                assert.equal(id_tracking2_server1,object.id);
                done();
            });
    });
});


describe('get tracking 1 for server 2 ', ()=>{
    it('should obtain tracking successfully', (done)=>{
        chai.request(server) 
            .get('/api/trackings/' +id_tracking1_server2)
            .set({authorization:token_server2})
            .end( function(err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                assert.equal(id_tracking1_server2,object.id);
                done();
            });
    });
});

//--------------------------------------------------

describe('get tracking 1 of server 1 in server 2 ', ()=>{
    it('should fail get tracking because server2 not have that tracking', (done)=>{
        chai.request(server) 
            .get('/api/trackings/' +id_tracking1_server1)
            .set({authorization:token_server2})
            .end( function(err,res){
                expect(res).to.have.status(404);
                done();
            });
    });
});

describe('get tracking 2 of server 1 in server 2 ', ()=>{
    it('should fail get tracking because server2 not have that tracking', (done)=>{
        chai.request(server) 
            .get('/api/trackings/' +id_tracking2_server1)
            .set({authorization:token_server2})
            .end( function(err,res){
                expect(res).to.have.status(404);
                done();
            });
    });
});

describe('get tracking 1 of server 2 in server 1 ', ()=>{
    it('should fail get tracking because server1 not have that tracking', (done)=>{
        chai.request(server) 
            .get('/api/trackings/' +id_tracking1_server2)
            .set({authorization:token_server1})
            .end( function(err,res){
                expect(res).to.have.status(404);
                done();
            });
    });
});

//#################added#########################

describe('get all trackings of the server 1',()=>{
    it('should it have 2 trackings ',(done)=>{
        chai.request(server) 
            .get('/api/trackings')
            .set({authorization:token_server1})
            .end(function(err,res){
                expect(res).to.have.status(200);
                assert.equal(res.body.length,2);
                done();
            });
    });
});


describe('get all trackings of the server 2',()=>{
    it('should it have 1 tracking',(done)=>{
        chai.request(server) 
            .get('/api/trackings')
            .set({'authorization':token_server2})
            .end(function(err,res){
                expect(res).to.have.status(200);
                assert.equal(res.body.length,1);
                done();
            });
    });
});

//###################################################


describe('remove server 1', ()=>{
    it('should remove server 1 sucessfully', (done)=>{
        chai.request(server) 
            .delete('/api/servers/'+id_server1)
            .set({authorization:token_server1})
            .send({createdBy:createdByData, name:nameServer1})
            .end( function(err,res){
                expect(res).to.have.status(203);
                done();
            });
    });
});

describe('remove server 2', ()=>{
    it('should remove server 1sucessfully', (done)=>{
        chai.request(server) 
            .delete('/api/servers/'+id_server2)
            .set({authorization:token_server2})
            .send({createdBy:createdByData, name:nameServer2})
            .end( function(err,res){
                expect(res).to.have.status(203);
                done();
            });
    });
});