
const chai = require('chai');
var chaiHttp = require('chai-http');
const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

const APP = require('../service/express');
const server = APP.listen();


//global varibles
var username = 'pepito-perez' + Math.random()*1000000000;
var password = 'pepito-perez-pass';
var tokenUser;



describe('TEST',() =>{
    it('BEGIN TEST',(done) =>{
        console.log("======================================");
        console.log("===============TEST USER==============");
        console.log("======================================");
        done();
    });
});


describe('test regiter', ()=>{
    it('sould failure because missing all parameters', (done)=>{
        chai.request(server) 
            .post('/api/user/register')
            .end(function(err,res){
                expect(res).to.have.status(400);
                done();
            })
    });
});


describe('test regiter', ()=>{
    it('sould failure because missing username', (done)=>{
        chai.request(server) 
            .post('/api/user/register')
            .send({password:password})
            .end(function(err,res){
                expect(res).to.have.status(400);
                done();
            })
    });
});

describe('test regiter', ()=>{
    it('sould failure because missing password', (done)=>{
        chai.request(server) 
            .post('/api/user/register')
            .send({username:username})
            .end(function(err,res){
                expect(res).to.have.status(400);
                done();
            })
    });
});

//-----------------------------------------------------

describe('test login', ()=>{
    it('sould failure because missing all parameters', (done)=>{
        chai.request(server) 
            .post('/api/user/login')
            .end(function(err,res){
                expect(res).to.have.status(400);
                done();
            })
    });
});


describe('test login', ()=>{
    it('sould failure because missing username', (done)=>{
        chai.request(server) 
            .post('/api/user/login')
            .send({password:password})
            .end(function(err,res){
                expect(res).to.have.status(400);
                done();
            })
    });
});

describe('test login', ()=>{
    it('sould failure because missing password', (done)=>{
        chai.request(server) 
            .post('/api/user/login')
            .send({username:username})
            .end(function(err,res){
                expect(res).to.have.status(400);
                done();
            })
    });
});



describe('test login', ()=>{
    it('sould failure because it is not yet registered', (done)=>{
        chai.request(server) 
            .post('/api/user/login')
            .send({username:username, password:password})
            .end(function(err,res){
                expect(res).to.have.status(401);
                done();
            })
    });
});


//-----------------------------------------------

describe('test regiter', ()=>{
    it('sould register with success', (done)=>{
        chai.request(server) 
            .post('/api/user/register')
            .send({username:username, password:password})
            .end(function(err,res){
                expect(res).to.have.status(201);
                done();
            })
    });
});



describe('test login', ()=>{
    it('sould failiru login because username incorrect', (done)=>{
        chai.request(server) 
            .post('/api/user/login')
            .send({username:'username', password:password})
            .end(function(err,res){
                expect(res).to.have.status(401);
                done();
            })
    });
});

describe('test login', ()=>{
    it('sould failiru login because password incorrect', (done)=>{
        chai.request(server) 
            .post('/api/user/login')
            .send({username:username, password:'password'})
            .end(function(err,res){
                expect(res).to.have.status(401);
                done();
            })
    });
});



describe('test login', ()=>{
    it('sould login with success', (done)=>{
        chai.request(server) 
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

describe('test get all server with admin', ()=>{
    it('sould obtain all servers successfully', (done)=>{
        chai.request(server) 
            .get('/api/servers')
            .set({authorization:tokenUser})
            .end(function(err,res){
                expect(res).to.have.status(200);
                done();
            })
    });
});