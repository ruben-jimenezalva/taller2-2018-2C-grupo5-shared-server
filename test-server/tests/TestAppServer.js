'use strict';

const chai = require('chai');
var chaiHttp = require('chai-http');
const expect = require('chai').expect;


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