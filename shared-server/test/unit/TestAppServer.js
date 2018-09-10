let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url= 'http://localhost:8080';

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

describe('get all Servers ',() =>{
    it('should fail because no use token',(done) =>{
        chai.request(url)
            .get('/api/server')
            .end( function (res,err){
                console.log(res.body)
                expect(res).to.have.status(401);
                done();
            });
    });
});
