"use strict"

var Engine = require('json-rules-engine').Engine;


let engine = new Engine();


/**
 * Adding rules that cancel the delivery
 */
engine.addRule({
    conditions:{
        any:[{
            fact: 'user',
            path: 'points',
            operator: 'lessThan',
            value: '0'
        },
        {
            fact: 'cost',
            path: 'value',
            operator: 'lessThanInclusive',
            value: '50'
        }]
    },
    event: {  // define the event to fire when the conditions evaluate truthy
        type: 'minimum-requirements',
        params: {
          message: 'Delivery can not be made!'
        }
    }
});

/**
 * Rules and operations for free Delivery
 */

engine.addOperator('haveEmailDomain',(factValue, jsonValue)=>{
    var expReg = new RegExp(`^.*${jsonValue.toLowerCase()}$`);
    return expReg.test(factValue.toLowerCase());
});


engine.addRule({
    conditions:{
        all:[{
            fact: 'user',
            path: 'mail',
            operator: 'haveEmailDomain',
            value:'@comprame.com'
        }]
    },
    event: {  // define the event to fire when the conditions evaluate truthy
        type: 'free-delivery',
        params: {
          message: 'Delivery is Free!'
        }
    }
});



/**
 * Discount per first delivery
 */

var usersThatUsedDelivery = ['pedro213', 'pablo12s3', 'marcos23'];

/*
engine.addOperator('firstDelivery',(factValue, jsonValue)=>{
    return(jsonValue.some(function(element){
        return element == factValue;
    }));
});
*/

engine.addRule({
    conditions:{
        all:[{
            fact: 'user',
            path: 'id',
            operator: 'in',
            value: usersThatUsedDelivery,
        }]
    },
    event: {  // define the event to fire when the conditions evaluate truthy
        type: 'first-delivery',
        params: {
          message: 'It is your first Delivery  !'
        }
    }
});



/**
 * Adding rules to disconunt and surcharge per day and schedule
 */

var daysToDiscount=["tuesday","wednesday"];
var RangeHoursToDiscount=[15,16];
var daysToSurCharge=["monday","tuesday","wednesday","thursday","friday"];
var RangeHoursToSurCharge=[17,19];

const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

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


engine.addRule({
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
    event: {  // define the event to fire when the conditions evaluate truthy
        type: 'discount-delivery-perDayAndSchedule',
        params: {
          message: 'you have discount per day and Schedule!'
        }
    }
});



engine.addRule({
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
    event: {  // define the event to fire when the conditions evaluate truthy
        type: 'surcharge-delivery-perDayAndSchedule',
        params: {
          message: 'you have surcharge per day and Schedule!'
        }
    }
});


let facts = {
    cost: {
        value: 70,
        currency:"pesos"
    },
    user: {
        id:'pablo123',
        points:9,
        mail:'abraham@gmal.com'
    },
    start: {
        address: {
            street: "calle falsa 123",
            location: {
                lat: 120,
                lon: 1230    
            }   
        },
        timestamp: 1543424952537 //no dicount or surcharge
        //timestamp: 1543430925337 //discount
        //timestamp: 1543436925337 //surcharge
    },
    end:{ 
        address: {
            street: "avenida siempre viva 123",      
            location: {
                lat: 0,        
                lon: 0 
            }
        },   
        timestamp: 0
    }
}



engine
  .run(facts)
  .then(events => { // run() return events with truthy conditions
    events.map(event =>{
        console.log(event.params.message);
    });
  })
  .catch(console.log)
