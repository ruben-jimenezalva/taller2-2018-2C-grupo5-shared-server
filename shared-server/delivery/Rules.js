"use strict"

var Engine = require('json-rules-engine').Engine;
var Rule = require('json-rules-engine').Rule;
let engine = new Engine();
require("./Variables");
let allRules = new Map();
const logger =  require('../others/logger');

let db = require('./DeliveryAccesDB');


/**
 * Rules Criticals
 */

/**
 * Rule that cancel the delivery, for points cost or distanceInKm minumun
 */
let ruleCancelDeliveryPerPointsOrCost = new Rule({
    conditions: {
        any:[{
            fact: 'user',
            path: 'points',
            operator: 'lessThan',
            value: minimumPointsRequiredToDelivery
        },
        {
            fact: 'cost',
            path: 'value',
            operator: 'lessThanInclusive',
            value: minimumCostInPesosRequiredToDelivery
        },
        {
            fact: 'distanceInKm',
            operator: 'lessThan',
            value: minimumDistanceInKmAllowed
        }
    ]
    },
    event: {
        type: keyMinimumRequirements,
        params: {
          message: 'Delivery can not be made!'
        }
    },
    priority: 5,
    onSuccess: ()=>{engine.stop();}
});


/**
 * cancel delivery for durationInHours of the delivery
 */

let ruleCancelDeliveryPerDurationInHoursDelivery = new Rule({
    conditions:{
        any:[{
            fact: 'durationInHours',
            operator: 'greaterThanInclusive',
            value: maxDurationInHoursPermittedToDelivery
        }]
    },
    event: { 
        type: keyCancelDeliveryByDurationInHours,
        params: {
          message: 'Your delivery is cancel by durationInHours!'
        }
    },
    priority: 5,
    onSuccess: ()=>{ engine.stop();}
});

 /**
 * cancel the delivery for distanceInKm exceeds to limit
 */
let ruleCancelDeliveryForExccedsDistanceInKm = new Rule({
    conditions:{
        any:[{
            fact: 'distanceInKm',
            operator: 'greaterThanInclusive',
            value: maxDistanceInKmPermittedToDelivery
        }]
    },
    event: { 
        type: keyCancelDeliveryByDistanceInKm,
        params: {
          message: 'cancel delivery because the distanceInKm is very long!'
        }
    },
    priority: 5,
    onSuccess: ()=>{engine.stop();}
});

/**
 * cancel delivery because the delivery is request by application server 
 */
let ruleCancelDeliveryByApplicationServer = new Rule({
    conditions:{
        any:[{
            fact: 'appServerId',
            operator: 'in',
            value: serversToCancelDelivery
        }]
    },
    event: { 
        type: keyCancelDeliveryByAppServer,
        params: {
          message: 'Your delivery is cancel by app-Server!'
        }
    },
    priority: 5,
    onSuccess: ()=>{engine.stop();}
});

/**
 * End Rules Criticals
 */


/**
 * Rule for discount by email domain
 */
/**
 * operator for email domain
 */
engine.addOperator('haveEmailDomain',(factValue, jsonValue)=>{
    return jsonValue.some(element => {
        var expReg = new RegExp(`^.*${element.toLowerCase()}$`);
        return expReg.test(factValue.toLowerCase());
    });
});

let ruleDeliveryFreeByMail = new Rule({
    conditions:{
        all:[{
            fact: 'user',
            path: 'mail',
            operator: 'haveEmailDomain',
            value: allDomainsThatHaveDiscount
        }]
    },
    event: { 
        type: keyDiscountEmailDomain,
        params: {
            isDiscount : true,
            message: 'Delivery have discount by the email domain!'
        }
    },
    priority: 2
});


/**
 * Rule to disconunt and surcharge per day and schedule
 */
/**
 * operators to disconunt and surcharge per day and schedule
 */
engine.addOperator('isInDay',(factValue, jsonValue)=>{
    let dayToDelivery = new Date(factValue).getDay();
    let day = days[dayToDelivery-1];
    return (jsonValue.some((element)=>{
        return element.toLowerCase()== day.toLowerCase();
    }));
});


engine.addOperator('isInRangeSchedule',(factValue, jsonValue)=>{
    let hourDelivery = new Date(factValue).getHours();
    return (hourDelivery >= jsonValue[0] && hourDelivery < jsonValue[1]);
});


let ruleDiscountForScheduleDelivery = new Rule({
    conditions:{
        all:[{
            fact: 'start',
            path: 'timestamp',
            operator: 'isInDay',
            value: daysToDiscount
        },
        {
            fact: 'start',
            path: 'timestamp',
            operator: 'isInRangeSchedule',
            value: RangeHoursToDiscount,
        }]
    },
    event: {  
        type: keyDiscountByDayAndSchedule,
        params: {
            isDiscount : true,
            message: 'you have discount per day and Schedule!'
        }
    }
});


let ruleSurchargeForScheduleDelivery = new Rule({
    conditions:{
        all:[{
            fact: 'start',
            path: 'timestamp',
            operator: 'isInDay',
            value: daysToSurCharge
        },
        {
            fact: 'start',
            path: 'timestamp',
            operator: 'isInRangeSchedule',
            value: RangeHoursToSurCharge,
        }]
    },
    event: { 
        type: keySurchargeByDayAndSchedule,
        params: {
          message: 'you have surcharge per day and Schedule!'
        }
    }
});


 /**
 * discount for old user
 */

let ruleDiscountPerPoints = new Rule({
    conditions:{
        any:[{
            fact: 'user',
            path: 'points',
            operator: 'greaterThanInclusive',
            value: minimunPointsToApplyDiscount
        }],
    },
    event: { 
        type: keyDiscountByPoints,
        params: {
            isDiscount : true,
            message: 'You have discount per points!'
        }
    },
    priority: 2
});


//-------------------------------------------------------------

 /**
 * discount and Surcharge for paymthod of the user
 */

let ruleDiscountPerPaymethod = new Rule({
    conditions:{
        all:[{
            fact: 'cost',
            path: 'method',
            operator: 'in',
            value: paymethodsWithDiscount
        }]
    },
    event: { 
        type: keyDiscountByPaymethod,
        params: {
            isDiscount : true,
            message: 'You are discount per paymethod!'
        }
    },
    priority: 2,
});


let ruleSurchargeForPaymethod = new Rule({
    conditions:{
        any:[{
            fact: 'cost',
            path: 'method',
            operator: 'in',
            value: paymethodsWithSurcharge
        }]
    },
    event: { 
        type: keySurchargeByPaymehod,
        params: {
          message: 'You are Surcharge per paymethod!'
        }
    },
    priority: 2,
});

 //------------------------------------------------------------

 /**
 * Surcharge for durationInHours of the delivery
 */

let ruleSurchargeForDurationInHoursDelivery = new Rule({
    conditions:{
        any:[{
            fact: 'durationInHours',
            operator: 'greaterThanInclusive',
            value: minDurationInHoursToApplySurcharge
        }]
    },
    event: { 
        type: keySurchargeDurationInHoursDelivery,
        params: {
          message: 'Your delivery have Surcharge by durationInHours!'
        }
    },
    priority: 2,
});


 /**
 * Surcharge because distanceInKm exceeds to limit
 */

let ruleSurchargeByExceedsDistanceInKm = new Rule({
    conditions:{
        any:[{
            fact: 'distanceInKm',
            operator: 'greaterThanInclusive',
            value: minDistanceInKmToApplySurcharge
        }]
    },
    event: { 
        type: keySurchargeDistanceInKmDelivery,
        params: {
          message: 'You are Surcharge per distanceInKm to long!'
        }
    },
    priority: 2,
});


 //------------------------------------------------------------


 /**
 * discount for application server that make the delivery
 */
let ruleDiscountPerApplicactionServer = new Rule({
    conditions:{
        any:[{
            fact: 'appServerId',
            operator: 'in',
            value: serversToApplyDiscount
        }]
    },
    event: { 
        type: keyDiscountByAppServer,
        params: {
            isDiscount : true,
            message: 'You are discount per app-Server!'
        }
    },
    priority: 2,
});

 /**
 * Surcharge for application server that make the delivery
 */
let ruleSurchargeForAppllicationServer = new Rule({
    conditions:{
        any:[{
            fact: 'appServerId',
            operator: 'in',
            value: serversToApplySurcharge
        }]
    },
    event: { 
        type: keySurchargeByAppServer,
        params: {
          message: 'You are Surcharge per app-Server!'
        }
    },
    priority: 2,
});



allRules.set("ruleCancelDeliveryByApplicationServer",ruleCancelDeliveryByApplicationServer);
allRules.set("ruleCancelDeliveryForExccedsDistanceInKm",ruleCancelDeliveryForExccedsDistanceInKm);
allRules.set("ruleCancelDeliveryPerDurationInHoursDelivery",ruleCancelDeliveryPerDurationInHoursDelivery);
allRules.set("ruleCancelDeliveryPerPointsOrCost",ruleCancelDeliveryPerPointsOrCost);
allRules.set("ruleDeliveryFreeByMail",ruleDeliveryFreeByMail);
allRules.set("ruleDiscountForScheduleDelivery",ruleDiscountForScheduleDelivery);
allRules.set("ruleDiscountPerApplicactionServer",ruleDiscountPerApplicactionServer);
allRules.set("ruleDiscountPerPaymethod",ruleDiscountPerPaymethod);
allRules.set("ruleDiscountPerPoints",ruleDiscountPerPoints);
allRules.set("ruleSurchargeByExceedsDistanceInKm",ruleSurchargeByExceedsDistanceInKm);
allRules.set("ruleSurchargeForAppllicationServer",ruleSurchargeForAppllicationServer);
allRules.set("ruleSurchargeForDurationInHoursDelivery",ruleSurchargeForDurationInHoursDelivery);
allRules.set("ruleSurchargeForPaymethod",ruleSurchargeForPaymethod);
allRules.set("ruleSurchargeForScheduleDelivery",ruleSurchargeForScheduleDelivery);



/*
function saveAllRules(){

    var index = 1;
    db.getAllCurrentRules()
    .then(
        function(error){
            console.log(error);
            return false;
        },
        function(response){
            console.log("°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°");
            let allRulesDB = response.rows;

            for(var [nameRule,rule] of allRules){
                if(allRulesDB.find( function(element){
                    if(element.namerule === nameRule){
                        console.log(element.datarule);
                        console.log(rule.toJSON());
                        return element.datarule !== rule.toJSON();
                        
                    }

                })){
                    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                    console.log("SE TIENE Q ACTUALIZAR LA REGLA");
                    db.createRecordOfRule({nameRule:nameRule, dataRule: rule.toJSON()})
                    .then(
                        function(error){
                            console.log("ERROR AL ACTUALIZAR LA REGLA");
                            console.log("----> "+ nameRule);
                            return false;
                        },
                        function(response){
                            console.log("SE HA ACTUALIZADO LA REGLA");
                            console.log("----> "+ nameRule);
                        }
                    );
                
                }else{
                    console.log("la regla no se actualiza: "+nameRule);
                }
                
                console.log("index"+index);
                console.log("total"+allRules.size);
                index++;
                
            }

        }
    );
    if(index >= allRules.size){
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&6");
        return true;
    }
}
*/
/*
function fillDBWithRules(){
    db.getAllRules()
    .then(
        function(error){
            console.log("error to get all rules");
        },
        function(response){
            if(response.rowCount === 0){
                for(var [nameRule,rule] of allRules){
                    db.createRecordOfRule({nameRule:nameRule, dataRule:rule.toJSON()})
                    .then(
                        function(error){
                            console.log(error);
                            console.log("error to create record of rules");
                        },
                        function(response){
                            console.log("SE HA llenado con reglas");
                            console.log(rule.toJSON());
                        }
                    );
                }
            }else{
                console.log("YA HABIAN REGLAS");
            }
        }
    );
}*/



module.exports={
    ruleCancelDeliveryByApplicationServer,
    ruleCancelDeliveryForExccedsDistanceInKm,
    ruleCancelDeliveryPerDurationInHoursDelivery,
    ruleCancelDeliveryPerPointsOrCost,
    ruleDeliveryFreeByMail,
    ruleDiscountForScheduleDelivery,
    ruleDiscountPerApplicactionServer,
    ruleDiscountPerPaymethod,
    ruleDiscountPerPoints,
    ruleSurchargeByExceedsDistanceInKm,
    ruleSurchargeForAppllicationServer,
    ruleSurchargeForDurationInHoursDelivery,
    ruleSurchargeForPaymethod,
    ruleSurchargeForScheduleDelivery,
//    saveAllRules,
    engine,
//    fillDBWithRules,
}