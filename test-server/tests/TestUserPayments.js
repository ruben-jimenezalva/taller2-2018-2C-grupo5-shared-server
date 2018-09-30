
const chai = require('chai');
var chaiHttp = require('chai-http');
const assert = chai.assert;
const expect = chai.expect;

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
                        "method":"credit",
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
                        "method":"credit",
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

describe('get payments of the server 1',()=>{
    it('should it have 1 payments ',(done)=>{
        chai.request(url)
            .get('/api/payments')
            .set({authorization:token_server_1})
            .end(function(err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                assert.equal(object.length,1);
                done();
            });
    });
});


describe('get payments of the server 2',()=>{
    it('should it have 1 payment',(done)=>{
        chai.request(url)
            .get('/api/payments')
            .set({'authorization':token_server_2})
            .end(function(err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                assert.equal(object.length,1);
                done();
            });
    });
});



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

//-------------------------------------------------------

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

describe('get all payments of all the servers',()=>{
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