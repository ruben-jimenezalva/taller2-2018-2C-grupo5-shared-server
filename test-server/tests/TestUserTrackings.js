
const chai = require('chai');
var chaiHttp = require('chai-http');
const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);
const url = 'http://shared-server:8080';

//global varibles
var username = 'juan-gonzales' + Math.random()*1000000000;
var password = 'juan-gonzales-pass';
var tokenUser;
var token_server_1;
var token_server_2;

var server_id_1;
var server_id_2;

var dataCreated_1='alguien1';
var dataName_1 = 'server-----1'+ Math.random()*1000000000;
var dataCreated_2 = 'alguien2';
var dataName_2 = 'sever-------2'+ Math.random()*1000000000;
var id_tracking1_server1;
var id_tracking1_server2;



describe('TEST',() =>{
    it('BEGIN TEST',(done) =>{
        console.log("======================================");
        console.log("=========TEST USER TRACKING===========");
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


describe('create tracking for server 1', ()=>{
    it('should create tracking succesfully', (done)=>{
        chai.request(url)
            .post('/api/trackings')
            .set({authorization:token_server_1})
            .send({status:'created'})
            .end( function(err,res){
                expect(res).to.have.status(201);
                var object = JSON.parse(res.text);
                id_tracking1_server1 = object.id;
                done();
            });
    });
});


describe('create tracking for server 2', ()=>{
    it('should create tracking succesfully', (done)=>{
        chai.request(url)
            .post('/api/trackings')
            .set({authorization:token_server_2})
            .send({status:'created'})
            .end( function(err,res){
                expect(res).to.have.status(201);
                var object = JSON.parse(res.text);
                id_tracking1_server2 = object.id;
                done();
            });
    });
});

//-------------------------------------------------

describe('get single tracking of the server 1',()=>{
    it('should obtain tracking successfully',(done)=>{
        chai.request(url)
            .get('/api/trackings/'+ id_tracking1_server1)
            .set({authorization:token_server_1})
            .end(function(err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                assert.equal(id_tracking1_server1,object.id);
                done();
            });
    });
});


describe('get single tracking of the server 2',()=>{
    it('should obtain tracking successfully',(done)=>{
        chai.request(url)
            .get('/api/trackings/'+id_tracking1_server2)
            .set({'authorization':token_server_2})
            .end(function(err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                assert.equal(id_tracking1_server2,object.id);
                done();
            });
    });
});

//-------------------------------------------------------


describe('get single tracking of the server2 in server 1',()=>{
    it('should fail because server1 no contain that tracking',(done)=>{
        chai.request(url)
            .get('/api/trackings/'+ id_tracking1_server2)
            .set({authorization:token_server_1})
            .end(function(err,res){
                expect(res).to.have.status(404);
                var object = JSON.parse(res.text);
                assert.equal(404,object.code);
                done();
            });
    });
});


describe('get single tracking of the server1 in server 2',()=>{
    it('should fail because server2 no contain that tracking',(done)=>{
        chai.request(url)
            .get('/api/trackings/'+id_tracking1_server1)
            .set({'authorization':token_server_2})
            .end(function(err,res){
                expect(res).to.have.status(404);
                var object = JSON.parse(res.text);
                assert.equal(404,object.code);
                done();
            });
    });
});


//------------------------------------------------------


describe('get single tracking of the server2 by the admin',()=>{
    it('should obtain succesfully because admin can obtain all trackings',(done)=>{
        chai.request(url)
            .get('/api/trackings/'+ id_tracking1_server2)
            .set({authorization:tokenUser})
            .end(function(err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                assert.equal(id_tracking1_server2,object.id);
                done();
            });
    });
});


describe('get single tracking of the server1 by the admin',()=>{
    it('should obtain succesfully because admin can obtain all trackings',(done)=>{
        chai.request(url)
            .get('/api/trackings/'+id_tracking1_server1)
            .set({'authorization':tokenUser})
            .end(function(err,res){
                expect(res).to.have.status(200);
                var object = JSON.parse(res.text);
                assert.equal(id_tracking1_server1,object.id);
                done();
            });
    });
});



//#####################ADDED###########################


describe('get all trackings of all the servers',()=>{
    it('should it obtain all trackings and trackings searched exists',(done)=>{
        chai.request(url)
            .get('/api/trackings')
            .set({'authorization':tokenUser})
            .end(function(err,res){
                expect(res).to.have.status(200);
                assert.match(res.text,new RegExp(id_tracking1_server1),'regexp matches');
                assert.match(res.text,new RegExp(id_tracking1_server2),'regexp matches');
                done();
            });
    });
});

describe('get all trackings of all the servers',()=>{
    it('should it obtain all trackings and trackings searched not exists',(done)=>{
        chai.request(url)
            .get('/api/trackings')
            .set({'authorization':tokenUser})
            .end(function(err,res){
                expect(res).to.have.status(200);
                assert.notMatch(res.text,new RegExp(id_tracking1_server1+'q'),'regexp matches');
                assert.notMatch(res.text,new RegExp(id_tracking1_server2+'q'),'regexp matches');
                done();
            });
    });
});


//#####################################################


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


describe('get single tracking of the server2 by the admin',()=>{
    it('should fail because the trackings of the server2 were deleted',(done)=>{
        chai.request(url)
            .get('/api/trackings/'+ id_tracking1_server2)
            .set({authorization:tokenUser})
            .end(function(err,res){
                expect(res).to.have.status(404);
                var object = JSON.parse(res.text);
                assert.equal(404,object.code);
                done();
            });
    });
});


describe('get single tracking of the server1 by the admin',()=>{
    it('should fail because the trackings of the server1 were deleted',(done)=>{
        chai.request(url)
            .get('/api/trackings/'+id_tracking1_server1)
            .set({'authorization':tokenUser})
            .end(function(err,res){
                expect(res).to.have.status(404);
                var object = JSON.parse(res.text);
                assert.equal(404,object.code);
                done();
            });
    });
});


//#####################ADDED###########################

describe('get all trackings of all the servers',()=>{
    it('should it obtain all trackings but trackings searched not exists because were deleted',(done)=>{
        chai.request(url)
            .get('/api/trackings')
            .set({'authorization':tokenUser})
            .end(function(err,res){
                expect(res).to.have.status(200);
                assert.notMatch(res.text,new RegExp(id_tracking1_server1),'regexp matches');
                assert.notMatch(res.text,new RegExp(id_tracking1_server2),'regexp matches');
                done();
            });
    });
});
//#####################ADDED###########################
