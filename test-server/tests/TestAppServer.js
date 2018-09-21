'use strict';

const chai = require('chai');
var chaiHttp = require('chai-http');
const expect = require('chai').expect;
const assert = chai.assert;
const fetch = require('node-fetch');
var token;
var id;

chai.use(chaiHttp);
const url= "http://shared-server:8080";


describe('get all Servers ',() =>{
    it('should fail because no use token',(done) =>{
        chai.request(url)
            .get('/api/servers')
            .end( function (err,res){
                expect(res).to.have.status(401);
                done();
            });
    });
});


describe('create server',() =>{
    it('should fail because missing arg',(done) =>{
        chai.request(url)
            .post('/api/servers')
            .send({createdBy:"autor1"})
            .end( function (err,res){
                expect(res).to.have.status(400);
                done();
            });
    });
});


describe('create server',() =>{
    it('should get token, register success',(done) =>{
        chai.request(url)
            .post('/api/servers')
            .send({createdBy:"autor1", name:"server29"})
            .end( function (err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                token = object.server.token.token;
                id = object.server.server.server_id;
                done();
            });
    });
});


describe('get all server with token',() =>{
    it('should get all servers with success',(done) =>{
        chai.request(url)
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
        chai.request(url)
            .get('/api/servers/'+id)
            .set({'Authorization':token})
            .end( function (err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                assert.equal(object.server.server_id,id);
                done();
            });
    });
});

describe('get single server with token',() =>{
    it('should no get single server because id no exists',(done) =>{
        chai.request(url)
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
        chai.request(url)
            .get('/api/servers/'+id)
            .set({'Authorization':url})
            .end( function (err,res){
                expect(res).to.have.status(401);
                done();
            });
    });
});


describe('delete server',() =>{
    it('should delete single server with success',(done) =>{
        chai.request(url)
            .delete('/api/servers/'+id)
            .set({'Authorization':token})
            .end( function (err,res){
                expect(res).to.have.status(203);
                done();
            });
    });
});
