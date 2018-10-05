'use strict';

const chai = require('chai');
var chaiHttp = require('chai-http');
const expect = require('chai').expect;
const assert = chai.assert;

chai.use(chaiHttp);
const url= "http://shared-server:8080";


describe('TEST',() =>{
    it('BEGIN TEST',(done) =>{
        console.log("======================================");
        console.log("=============TEST DELIVERY============");
        console.log("======================================");
        done();
    });
});

describe('calculate delivery ',() =>{
    it('should response a mock delivery',(done) =>{
        chai.request(url)
            .post('/api/deliveries/estimate')
            .end( function (err,res){
                expect(res).to.have.status(200);
                console.log(res.body);
                done();
            });
    });
});
