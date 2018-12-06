'use strict';

const chai = require('chai');
var chaiHttp = require('chai-http');
const expect = require('chai').expect;
const assert = chai.assert;

chai.use(chaiHttp);

const APP = require('../service/express');
const server = APP.listen();


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
        chai.request(server) 
            .post('/api/deliveries/estimate')
            .send({
                    "facts" : {
                        "appServerId":"server8",
                        "cost": {
                            "value": 760,
                            "currency":"pesos",
                            "method":"debit"
                        },
                        "user": {
                            "points":290,
                            "mail":"abraham@hotmail.com",
                            "monthOld": 23,
                            "deliverysInLastMonth": 2
                        },
                        "start": {
                            "address": {
                                "street": "calle falsa 123",
                                "location": {
                                    "lat": 120,
                                    "lon": 1230    
                                }   
                            },
                            "timestamp": 1543424952537
                        },
                        "end":{ 
                            "address": {
                                "street": "avenida siempre viva 123",      
                                "location": {
                                    "lat": 0,        
                                    "lon": 0 
                                }
                            },   
                            "timestamp": 0
                        },
                        "distance": 7,
                        "duration": 12 
                    }
                })
            .end( function (err,res){
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('change value of rule delivery ',() =>{
    it('should change values of rules delivery',(done) =>{
        chai.request(server) 
            .put('/api/deliveries/estimate')
            .send({
                "minimumPointsRequiredToDelivery": 230,
                "minimumCostInPesosRequiredToDelivery": 500,
                "maxDistancePermittedToDelivery": 120,
                "maxDurationPermittedToDelivery": 120,
                "minimumDistanceInKMAllowed":2,
                "COST_IN_PESOS_PER_KM":27,
                "serversToCancelDelivery": [
                    "server1",
                ],
                "allDomainsThatHaveDiscount": [
                    "@comprame.com",
                    "@gmail.com"
                ],
                "percentageDiscountEmailDomain": 75,
                "serversToApplyDiscount": [
                    "server4",
                    "server5",
                    "server6"
                ],
                "percentageDiscountPerAppServer": 5,
                "serversToApplySurcharge": [
                    "server7",
                    "server8"
                ],
                "percentageSurchargePerAppServer": 5,
                "minDistanceToApplySurcharge": "100",
                "percentageSurchargePerDistance": 5,
                "minDurationToApplySurcharge": 90,
                "percentageSurchargePerDuration": 5,
                "daysToDiscount": [
                    "tuesday",
                    "wednesday"
                ],
                "InitialHourToDiscount": 15,
                "FinalHourToDiscount": 16,
                "percentageDiscountPerDayAndSchedule": 5,
                "daysToSurCharge": [
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday"
                ],
                "InitialHourToSurCharge": 17,
                "FinalHourToSurCharge": 19,
                "percentageSurchargePerDayAndSchedule": 5,
                "minimunPointsToApplyDiscount": 100,
                "percentageDiscountPerPoints": 10,
                "paymethodsWithDiscount": [
                    "cash"
                ],
                "percentageDiscountPerPaymethod": 5,
                "paymethodsWithSurcharge": [
                    "credit",
                    "debit"
                ],
                "percentageSurchargePerPaymethod": 15
            })
            .end( function (err,res){
                expect(res).to.have.status(200);
                done();
            });
    });
});