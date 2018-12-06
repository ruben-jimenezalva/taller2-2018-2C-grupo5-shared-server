const model = require('./DeliveryModels');
const logger =  require('../others/logger');
var rules = require('./Rules');
var engine = rules.engine;

function calculateDelivery (req, res, next){
    var nameFunction = arguments.callee.name;
    
    facts = req.body.facts || "";
    if(facts === ""){
        res.status(400).send({code:400, message:"missing parameters"});
        return 0;
    }

    /**
     * Adding rules
     */
    engine.addRule(rules.ruleCancelDeliveryByApplicationServer);
    engine.addRule(rules.ruleCancelDeliveryForExccedsDistance);
    engine.addRule(rules.ruleCancelDeliveryPerDurationDelivery);
    engine.addRule(rules.ruleCancelDeliveryPerPointsOrCost);
    engine.addRule(rules.ruleDeliveryFreeByMail);
    engine.addRule(rules.ruleDiscountForScheduleDelivery);
    engine.addRule(rules.ruleDiscountPerApplicactionServer);
    engine.addRule(rules.ruleDiscountPerPaymethod);
    engine.addRule(rules.ruleDiscountPerPoints);
    engine.addRule(rules.ruleSurchargeByExceedsDistance);
    engine.addRule(rules.ruleSurchargeForAppllicationServer);
    engine.addRule(rules.ruleSurchargeForDurationDelivery);
    engine.addRule(rules.ruleSurchargeForPaymethod);
    engine.addRule(rules.ruleSurchargeForScheduleDelivery);
    
    
    /**
     * Running rules
     */
    
    var TOTALCOST=0;
    var DISCOUNTS_Surcharge=0;
    var MESSAGE="COST IN PESOS OF YOUR DELIVERY";
    var ADITIONAL_MESSAGE= "";
     /**
      * Calculating cost
      */
    TOTALCOST = COST_IN_PESOS_PER_KM * facts.distance ;
    console.log("TOTAL => "+ (TOTALCOST + DISCOUNTS_Surcharge));

    engine
      .run(facts)
      .then(events => { // run() return events with truthy conditions
        events.map(event =>{
            let percentage = acctionsOfTheEvents.get(event.type);
            if(event.params.isDiscount){
                percentage *= -1;
            }

            if(event.type === keyMinimumRequirements){
                TOTALCOST = 0;
                MESSAGE = event.params.message;
            }
            ADITIONAL_MESSAGE += event.params.message+ "  --  ";
            DISCOUNTS_Surcharge = DISCOUNTS_Surcharge + TOTALCOST*percentage/100;
        });
        console.log("TOTAL => "+ (TOTALCOST + DISCOUNTS_Surcharge));
        logger.info(__filename,nameFunction,"send response of the delivery");
        res.status(200).send(model.mockdelivery(TOTALCOST+DISCOUNTS_Surcharge,MESSAGE,ADITIONAL_MESSAGE));


        /**
         * Remove rules
         */
        engine.removeRule(rules.ruleCancelDeliveryByApplicationServer);
        engine.removeRule(rules.ruleCancelDeliveryForExccedsDistance);
        engine.removeRule(rules.ruleCancelDeliveryPerDurationDelivery);
        engine.removeRule(rules.ruleCancelDeliveryPerPointsOrCost);
        engine.removeRule(rules.ruleDeliveryFreeByMail);
        engine.removeRule(rules.ruleDiscountForScheduleDelivery);
        engine.removeRule(rules.ruleDiscountPerApplicactionServer);
        engine.removeRule(rules.ruleDiscountPerPaymethod);
        engine.removeRule(rules.ruleDiscountPerPoints);
        engine.removeRule(rules.ruleSurchargeByExceedsDistance);
        engine.removeRule(rules.ruleSurchargeForAppllicationServer);
        engine.removeRule(rules.ruleSurchargeForDurationDelivery);
        engine.removeRule(rules.ruleSurchargeForPaymethod);
        engine.removeRule(rules.ruleSurchargeForScheduleDelivery);

      })
      .catch(console.log)
    
    /**
     * save rules 
     */
    rules.fillDBWithRules();
}



function updateDataRules (req, res, next){
    var nameFunction = arguments.callee.name;

    let dataToUpdate = {};

    dataToUpdate.minimumPointsRequiredToDelivery = req.body.minimumPointsRequiredToDelivery || ""; 
    dataToUpdate.minimumCostInPesosRequiredToDelivery = req.body.minimumCostInPesosRequiredToDelivery || ""; 

    dataToUpdate.maxDistancePermittedToDelivery  = req.body.maxDistancePermittedToDelivery  || ""; 

    dataToUpdate.maxDurationPermittedToDelivery  = req.body.maxDurationPermittedToDelivery  || ""; 

    dataToUpdate.serversToCancelDelivery  = req.body.serversToCancelDelivery  || ""; 

    dataToUpdate.allDomainsThatHaveDiscount  = req.body.allDomainsThatHaveDiscount  || ""; 
    dataToUpdate.percentageDiscountEmailDomain  = req.body.percentageDiscountEmailDomain  || ""; 

    dataToUpdate.serversToApplyDiscount  = req.body.serversToApplyDiscount  || ""; 
    dataToUpdate.percentageDiscountPerAppServer  = req.body.percentageDiscountPerAppServer  || "";

    dataToUpdate.serversToApplySurcharge  = req.body.serversToApplySurcharge  || ""; 
    dataToUpdate.percentageSurchargePerAppServer  = req.body.percentageSurchargePerAppServer  || ""; 

    dataToUpdate.minDistanceToApplySurcharge  = req.body.minDistanceToApplySurcharge  || ""; 
    dataToUpdate.percentageSurchargePerDistance  = req.body.percentageSurchargePerDistance  || "";

    dataToUpdate.minDurationToApplySurcharge  = req.body.minDurationToApplySurcharge  || ""; 
    dataToUpdate.percentageSurchargePerDuration  = req.body.percentageSurchargePerDuration  || ""; 

    dataToUpdate.daysToDiscount  = req.body.daysToDiscount  || ""; 
    dataToUpdate.InitHourDiscount  = req.body.InitHourDiscount  || ""; 
    dataToUpdate.FinalHourDiscount  = req.body.FinalHourDiscount  || ""; 
    dataToUpdate.percentageDiscountPerDayAndSchedule  = req.body.percentageDiscountPerDayAndSchedule  || "";

    dataToUpdate.daysToSurcharge  = req.body.daysToSurcharge  || ""; 
    dataToUpdate.InitHourToSurcharge  = req.body.InitHourToSurcharge  || ""; 
    dataToUpdate.FinalHourToSurcharge  = req.body.FinalHourToSurcharge  || ""; 
    dataToUpdate.percentageSurchargePerDayAndSchedule  = req.body.percentageSurchargePerDayAndSchedule  || ""; 

    dataToUpdate.minimunPointsToApplyDiscount  = req.body.minimunPointsToApplyDiscount  || ""; 
    dataToUpdate.percentageDiscountPerPoints  = req.body.percentageDiscountPerPoints  || ""; 

    dataToUpdate.paymethodsWithDiscount  = req.body.paymethodsWithDiscount  || ""; 
    dataToUpdate.percentageDiscountPerPaymethod  = req.body.percentageDiscountPerPaymethod  || ""; 

    dataToUpdate.paymethodsWithSurcharge  = req.body.paymethodsWithSurcharge  || ""; 
    dataToUpdate.percentageSurchargePerPaymethod  = req.body.percentageSurchargePerPaymethod  || ""; 

    console.log("=====================================");
    console.log(req.body.minimumPointsRequiredToDelivery);    

    var fs = require('fs');
    var obj = JSON.parse(fs.readFileSync(__dirname+'/data.json', 'utf8'));

    if(dataToUpdate.minimumPointsRequiredToDelivery !== ""){
        obj.minimumPointsRequiredToDelivery = dataToUpdate.minimumPointsRequiredToDelivery;
        console.log("=====================================");
    }

    if(dataToUpdate.minimumCostInPesosRequiredToDelivery !== "")
        obj.minimumCostInPesosRequiredToDelivery = dataToUpdate.minimumCostInPesosRequiredToDelivery;
    
    if (dataToUpdate.maxDistancePermittedToDelivery !== "") 
        obj.maxDistancePermittedToDelivery = dataToUpdate.maxDistancePermittedToDelivery;

    if (dataToUpdate.maxDurationPermittedToDelivery !== "") 
        obj.maxDurationPermittedToDelivery = dataToUpdate.maxDurationPermittedToDelivery;

    if (dataToUpdate.serversToCancelDelivery !== "")
        obj.serversToCancelDelivery = dataToUpdate.serversToCancelDelivery;


    if(dataToUpdate.allDomainsThatHaveDiscount !== "")
        obj.allDomainsThatHaveDiscount = dataToUpdate.allDomainsThatHaveDiscount;

    if(dataToUpdate.minimumCostInPesosRequiredToDelivery !== "")
        obj.percentageDiscountEmailDomain = dataToUpdate.percentageDiscountEmailDomain;

    if(dataToUpdate.serversToApplyDiscount !== "")
        obj.serversToApplyDiscount = dataToUpdate.serversToApplyDiscount;

    if(dataToUpdate.percentageDiscountPerAppServer !== "")
        obj.percentageDiscountPerAppServer = dataToUpdate.percentageDiscountPerAppServer;


    if(dataToUpdate.serversToApplySurcharge !== "")
        obj.serversToApplySurcharge = dataToUpdate.serversToApplySurcharge;

    if(dataToUpdate.percentageSurchargePerAppServer !== "")
        obj.percentageSurchargePerAppServer = dataToUpdate.percentageSurchargePerAppServer;
        

    if(dataToUpdate.minDistanceToApplySurcharge !== "")
        obj.minDistanceToApplySurcharge = dataToUpdate.minDistanceToApplySurcharge;

    if(dataToUpdate.percentageSurchargePerDistance !== "")
        obj.percentageSurchargePerDistance = dataToUpdate.percentageSurchargePerDistance;


    if(dataToUpdate.minDurationToApplySurcharge !== "")
        obj.minDurationToApplySurcharge = dataToUpdate.minDurationToApplySurcharge;

    if(dataToUpdate.percentageSurchargePerDuration !== "")
        obj.percentageSurchargePerDuration = dataToUpdate.percentageSurchargePerDuration;

    if(dataToUpdate.daysToDiscount !== "")
        obj.daysToDiscount = dataToUpdate.daysToDiscount;
    
    if(dataToUpdate.InitHourDiscount !== "")
        obj.InitHourDiscount = dataToUpdate.InitHourDiscount;

    if(dataToUpdate.FinalHourDiscount !== "")
        obj.FinalHourDiscount = dataToUpdate.FinalHourDiscount;

    if(dataToUpdate.percentageDiscountPerDayAndSchedule !== "")
        obj.percentageDiscountPerDayAndSchedule = dataToUpdate.percentageDiscountPerDayAndSchedule;


    if(dataToUpdate.daysToSurcharge !== "")
        obj.daysToSurcharge = dataToUpdate.daysToSurcharge;
    
    if(dataToUpdate.InitHourToSurcharge !== "")
        obj.InitHourToSurcharge = dataToUpdate.InitHourToSurcharge;

    if(dataToUpdate.FinalHourToSurcharge !== "")
        obj.FinalHourToSurcharge = dataToUpdate.FinalHourToSurcharge;

    if(dataToUpdate.percentageSurchargePerDayAndSchedule !== "")
        obj.percentageSurchargePerDayAndSchedule = dataToUpdate.percentageSurchargePerDayAndSchedule;


    if(dataToUpdate.minimunPointsToApplyDiscount !== "")
        obj.minimunPointsToApplyDiscount = dataToUpdate.minimunPointsToApplyDiscount;

    if(dataToUpdate.percentageDiscountPerPoints !== "")
        obj.percentageDiscountPerPoints = dataToUpdate.percentageDiscountPerPoints;


    if(dataToUpdate.paymethodsWithDiscount !== "")
        obj.paymethodsWithDiscount = dataToUpdate.paymethodsWithDiscount;

    if(dataToUpdate.percentageDiscountPerPaymethod !== "")
        obj.percentageDiscountPerPaymethod = dataToUpdate.percentageDiscountPerPaymethod;


    if(dataToUpdate.paymethodsWithSurcharge !== "")
        obj.paymethodsWithSurcharge = dataToUpdate.paymethodsWithSurcharge;

    if(dataToUpdate.percentageSurchargePerPaymethod !== "")
        obj.percentageSurchargePerPaymethod = dataToUpdate.percentageSurchargePerPaymethod;


    fs.writeFileSync(__dirname+'/data.json', JSON.stringify(obj, null, 4), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
    });

    //console.log("The file was saved!");
    /**
     * save rules 
     */
    //if(rules.saveAllRules()){
        res.status(200).send({code:200, message:"rules updated"});
    //}else{
    //    res.status(500).send({code:500, message:"error to update rules"});
    //}

}




module.exports = {
    calculateDelivery:calculateDelivery,
    updateDataRules
}