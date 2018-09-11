'use strict';

//const chai = require('chai');
//var chaiHttp = require('chai-http');
const expect = require('chai').expect;
//var bodyParser = require('body-parser');
const fetch = require('node-fetch');

//chai.use(chaiHttp);
const url= "http://127.0.0.1:8080";

/*
//start body-parser configuration
chai.use(bodyParser.json() );       // to support JSON-encoded bodies
chai.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
*/
/*
describe('Insert Server ',() =>{
    it('Insert server',(done) =>{
        chai.request(url)
            .post('/api/server')
            .send({createdBy:"Juancho", name: "Un server"})
            .end( function (res,err){
                console.log(res.body)
                expect(res).to.have.status(200);
                done();
            });
    });
});
*/
/*
describe('get all Servers ',() =>{
    it('should fail because no use token',(done) =>{
        chai.request(url)
            .get('/api/server')
            .end( function (res,err){
                console.log('--SALIDA--')
                console.log(res)
                expect(res).to.have.status(401);
                done();
            });
    });
});
*/
/*
describe('test Hello World',() =>{
    it('too bien',() =>{
        chai.request(url).get('/')
            .end( function (res,err){
                console.log('--SALIDA-res-');
                console.log(res);
                console.log('--SALIDA-err-');
                console.log(err);
                expect(res).to.be.text;
                //done();
            });
    });
});
*/

describe('API REST', function () {
    it('GET /users debe devolver todos los usuarios', async () => {
   
      const response = await fetch(url);
      console.log('--SALIDA-res-');
      console.log(response);
      expect(response.status).to.be.text;
 /*  
      const users = await response.json();
      expect(users).to.be.an('Array');
      for (let usr of users) {
        expect(usr).to.be.an('Object');
        expect(usr.id).to.be.a('Number');
        expect(usr.name).to.be.a('String');
        expect(usr.username).to.be.a('String');
        expect(usr.email).to.be.a('String');
      }
   
   */
    });
});