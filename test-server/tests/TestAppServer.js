'use strict';

const chai = require('chai');
var chaiHttp = require('chai-http');
const expect = require('chai').expect;
var token;

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
            .send({createdBy:"autor2", name:"server2"})
            .end( function (err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                token = object.server.token.token;
                done();
            });
    });
});


describe('get all server with token',() =>{
    it('should get all servers with success',(done) =>{
        chai.request(url)
            .get('/api/servers')
            .set({'access-token':token})
            .end( function (err,res){
                expect(res).to.have.status(200);
                done();
            });
    });
});