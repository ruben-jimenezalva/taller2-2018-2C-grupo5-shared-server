'use strict';

const chai = require('chai');
var chaiHttp = require('chai-http');
const expect = require('chai').expect;
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
            .send({createdBy:"autor1", name:"server1"})
            .end( function (err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                token = object.server.token.token;
                id = object.server.server.id;
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




describe('get single server with token',() =>{
    it('should get single server with success',(done) =>{
        chai.request(url)
            .get('/api/servers/')
            .send({id:id})
            .set({'access-token':token})
            .end( function (err,res){
                expect(res).to.have.status(200);
                done();
            });
    });
});


/**no funciona ver porque */
/*
describe('delete server',() =>{
    it('should delete single server with success',(done) =>{
        chai.request(url)
            .delete('/api/servers/')
            .send({id:id})
            .set({'access-token':token})
            .end( function (err,res){
                console.log("---res---");
                console.log(res);
                expect(res).to.have.status(204);
                done();
            });
    });
});
*/