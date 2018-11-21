'use strict';

const chai = require('chai');
var chaiHttp = require('chai-http');
const expect = require('chai').expect;
const assert = chai.assert;

chai.use(chaiHttp);

const APP = require('../service/express');
const server = APP.listen();


//variables
var token;
var newToken;
var id;
var _rev;
var new_rev;
var dataName = "server&***#$$$$+##++(-)110dasdasd23*d+2";
var dataCreatedBy = "autor&***$$+##++(-)13add*-+*2";
var dataUrl = "www.google.com.ar/serachs";


describe('TEST',() =>{
    it('BEGIN TEST',(done) =>{
        console.log("======================================");
        console.log("============TEST APP SERVER===========");
        console.log("======================================");
        done();
    });
});


describe('get all Servers ',() =>{
    it('should fail because no use token',(done) =>{
        chai.request(server)           
            .get('/api/servers')
            .end( function (err,res){
                expect(res).to.have.status(401);
                done();
            });
    });
});


describe('create server',() =>{
    it('should fail because missing arg',(done) =>{
        chai.request(server)
            .post('/api/servers')
            .send({createdBy:"autor1"})
            .end( function (err,res){
                expect(res).to.have.status(400);
                done();
            });
    });
});


describe('create server',() =>{
    it('should create server with success',(done) =>{
        chai.request(server)
            .post('/api/servers')
            .timeout(10000)
            .send({createdBy:dataCreatedBy, name:dataName, url:dataUrl})
            .end( function (err,res){
                expect(res).to.have.status(201);
                var object = JSON.parse(res.text);
                token = object.server.token.token;
                id = object.server.server.id;
                _rev = object.server.server._rev;
                done();
            });
    });
});

describe('create server with url already existing',() =>{
    it('should throw error 500 ',(done) =>{
        chai.request(server)
            .post('/api/servers')
            .timeout(10000)
            .send({createdBy:"dataCreatedBy123", name:"dataName123", url:dataUrl})
            .end( function (err,res){
                expect(res).to.have.status(500);
                done();
            });
    });
});


describe('get all servers with token',() =>{
    it('should get all servers with success',(done) =>{
        chai.request(server)
            .get('/api/servers')
            .set({'Authorization':token})
            .end( function (err,res){
                expect(res).to.have.status(200);
                done();
            });
    });
});


describe('get single server with token',() =>{
    it('should get single server with success',(done) =>{
        chai.request(server)
            .get('/api/servers/'+id)
            .set({'Authorization':token})
            .end( function (err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                assert.equal(object.server.id,id);
                done();
            });
    });
});


describe('get single server with token',() =>{
    it('should no get single server because id no exists',(done) =>{
        chai.request(server)
            .get('/api/servers/aaaaaaaa-bbbb-cccc-dddd-eeeeffff0002')
            .set({'Authorization':token})
            .end( function (err,res){
                expect(res).to.have.status(404);
                var object = JSON.parse(res.text);
                assert.equal(object.code,404);
                done();
            });
    });
});

describe('get single server with false token',() =>{
    it('should no get single server',(done) =>{
        chai.request(server)
            .get('/api/servers/'+id)
            .set({'Authorization':'falseToken'})
            .end( function (err,res){
                expect(res).to.have.status(401);
                done();
            });
    });
});


describe('reset token of a server',() =>{
    it('should update the token',(done) =>{
        chai.request(server)
            .post('/api/servers/'+id)
            .end( function (err,res){
                expect(res).to.have.status(201);
                var object = JSON.parse(res.text);
                newToken = object.server.token.token;
                done();
            });
    });
});


describe('get all servers with token canceled by a reset',() =>{
    it('should fail get all servers because token is invalid',(done) =>{
        chai.request(server)
            .get('/api/servers')
            .set({'Authorization':token})
            .end( function (err,res){
                expect(res).to.have.status(401);
                done();
            });
    });
});



describe('update server with field _rev & name nulls',() =>{
    it('should fail update because _rev & name are nulls',(done) =>{
        chai.request(server)
            .put('/api/servers/'+id)
            .send({_rev:'', name:''})
            .set({'Authorization':newToken})
            .end( function (err,res){
                expect(res).to.have.status(400);
                done();
            });
    });
});



describe('update server with field _rev invalid',() =>{
    it('should fail update _rev is invalid',(done) =>{
        chai.request(server)
            .put('/api/servers/'+id)
            .send({_rev:"nananananabatman", name:"newName"})
            .set({'Authorization':newToken})
            .end( function (err,res){
                expect(res).to.have.status(409);
                done();
            });
    });
});

var lastConnectionServer1;

describe('update name server with field _rev valid',() =>{
    var newNameServer ="new name";
    it('should update name server with success',(done) =>{
        chai.request(server)
            .put('/api/servers/'+id)
            .send({_rev:_rev, name:newNameServer})
            .set({'Authorization':newToken})
            .end( function (err,res){
                expect(res).to.have.status(200);
                assert.equal(newNameServer,res.body.server.name);
                lastConnectionServer1 = res.body.server.lastConnection;
                new_rev = res.body.server._rev;
                done();
            });
    });
});


var updatenewUrlServer ="alguna url 1234";


describe('update url server with field _rev valid',() =>{
    it('should update url server with success and change lastConnection server',(done) =>{
        chai.request(server)
            .put('/api/servers/'+id)
            .send({_rev:new_rev, url:updatenewUrlServer})
            .set({'Authorization':newToken})
            .end( function (err,res){
                expect(res).to.have.status(200);
                assert.equal(updatenewUrlServer,res.body.server.url);
                new_rev = res.body.server._rev;
                assert.notEqual(lastConnectionServer1,res.body.server.lastConnection)
                done();
            });
    });
});


var id_server2;
var _rev_server2;
var tokenServer2;

describe('create new server',() =>{
    it('should create server succesfully',(done) =>{
        chai.request(server)
            .post('/api/servers')
            .timeout(10000)
            .send({createdBy:"por algun wachin1235467", name:"servertestss", url:"www.algunanrluevaUrl.com"})
            .end( function (err,res){
                expect(res).to.have.status(201);
                id_server2 = res.body.server.server.id;
                _rev_server2 = res.body.server.server._rev;
                tokenServer2 = res.body.server.token.token;
                done();
            });
    });
});


describe('update server2 with url that already existing',() =>{
    it('should throw error 500',(done) =>{
        chai.request(server)
            .put('/api/servers/'+id_server2)
            .send({_rev:_rev_server2, url:updatenewUrlServer})
            .set({'Authorization':tokenServer2})
            .end( function (err,res){
                expect(res).to.have.status(500);
                done();
            });
    });
});



describe('delete server2',() =>{
    it('should delete single server with success',(done) =>{
        chai.request(server)
            .delete('/api/servers/'+id_server2)
            .set({'Authorization':tokenServer2})
            .end( function (err,res){
                expect(res).to.have.status(203);
                done();
            });
    });
});


describe('update name and url server with new field _rev valid',() =>{
    var newNameServer ="newName2";
    var newUrlServer ="new url2";
    it('should update  name and url of server with success',(done) =>{
        chai.request(server)
            .put('/api/servers/'+id)
            .send({_rev:new_rev, name:newNameServer, url:newUrlServer})
            .set({'Authorization':newToken})
            .end( function (err,res){
                expect(res).to.have.status(200);
                assert.equal(newUrlServer,res.body.server.url);
                assert.equal(newNameServer,res.body.server.name);
                done();
            });
    });
});


describe('delete server',() =>{
    it('should delete single server with success',(done) =>{
        chai.request(server)
            .delete('/api/servers/'+id)
            .set({'Authorization':newToken})
            .end( function (err,res){
                expect(res).to.have.status(203);
                done();
            });
    });
});


describe('get all servers with token canceled by a deleted server',() =>{
    it('should fail get all servers because token is invalid',(done) =>{
        chai.request(server)
            .get('/api/servers')
            .set({'Authorization':newToken})
            .end( function (err,res){
                expect(res).to.have.status(401);
                done();
            });
    });
});
