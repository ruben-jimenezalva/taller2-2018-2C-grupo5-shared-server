/**
 * LOAD VARIABLES 
 * key = keyEvent
 * Value = percentage => 0 no affects, negative is discount, positive is surcharge
 */

var fs = require('fs');
var obj = JSON.parse(fs.readFileSync(__dirname+'/data.json', 'utf8'));

global.acctionsOfTheEvents = new Map();

 //criticals
 global.minimumPointsRequiredToDelivery = obj.minimumPointsRequiredToDelivery;
 global.minimumCostInPesosRequiredToDelivery = obj.minimumCostInPesosRequiredToDelivery;
 global.minimumDistanceInKmAllowed = obj.minimumDistanceInKmAllowed;
 global.keyMinimumRequirements = "minimum-requirements";
 global.COST_IN_PESOS_PER_KM = obj.COST_IN_PESOS_PER_KM;

 acctionsOfTheEvents.set(keyMinimumRequirements,0);
 
 
 global.maxDistanceInKmPermittedToDelivery = obj.maxDistanceInKmPermittedToDelivery; //in Km
 global.keyCancelDeliveryByDistanceInKm = 'cancel-delivery-by-distance';
 acctionsOfTheEvents.set(keyCancelDeliveryByDistanceInKm,0);
 
 
 global.maxDurationInHoursPermittedToDelivery = obj.maxDurationInHoursPermittedToDelivery; //in hours
 global.keyCancelDeliveryByDurationInHours = 'cancel-delivery-by-duration';
 acctionsOfTheEvents.set(keyCancelDeliveryByDurationInHours,0);
 
 
 global.serversToCancelDelivery = obj.serversToCancelDelivery;
 global.keyCancelDeliveryByAppServer = 'cancel-delivery-per-appServer';
 acctionsOfTheEvents.set(keyCancelDeliveryByAppServer,0);
 
 
//domains of email
 global.allDomainsThatHaveDiscount = obj.allDomainsThatHaveDiscount;
 percentageDiscountEmailDomain = obj.percentageDiscountEmailDomain;
 global.keyDiscountEmailDomain= 'domaing-delivery';
 acctionsOfTheEvents.set(keyDiscountEmailDomain,percentageDiscountEmailDomain);
 
 
//servers
 global.serversToApplyDiscount = obj.serversToApplyDiscount;
 percentageDiscountPerAppServer = obj.percentageDiscountPerAppServer;
 global.keyDiscountByAppServer = 'discount-delivery-per-appServer';
 acctionsOfTheEvents.set(keyDiscountByAppServer,percentageDiscountPerAppServer);
 
 
 global.serversToApplySurcharge = obj.serversToApplySurcharge;
 percentageSurchargePerAppServer = obj.percentageSurchargePerAppServer;
 global.keySurchargeByAppServer = 'Surcharge-delivery-per-appServer';
 acctionsOfTheEvents.set(keySurchargeByAppServer,percentageSurchargePerAppServer);
  
 
//distance in km
 global.minDistanceInKmToApplySurcharge = obj.minDistanceInKmToApplySurcharge;
 percentageSurchargePerDistanceInKm = obj.percentageSurchargePerDistanceInKm;
 global.keySurchargeDistanceInKmDelivery = 'Surcharge-delivery-per-distance';
 acctionsOfTheEvents.set(keySurchargeDistanceInKmDelivery,percentageSurchargePerDistanceInKm);
 
 
//duration in hours
 global.minDurationInHoursToApplySurcharge = obj.minDurationInHoursToApplySurcharge;
 percentageSurchargePerDurationInHours = obj.percentageSurchargePerDurationInHours;
 global.keySurchargeDurationInHoursDelivery = 'Surcharge-delivery-per-duration';
 acctionsOfTheEvents.set(keySurchargeDurationInHoursDelivery,percentageSurchargePerDurationInHours);
 
 
//for days and schedule
 global.days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
 
 global.daysToDiscount=obj.daysToDiscount;
 global.RangeHoursToDiscount=[obj.InitialHourToDiscount,obj.FinalHourToDiscount];
 percentageDiscountPerDayAndSchedule = obj.percentageDiscountPerDayAndSchedule;
 global.keyDiscountByDayAndSchedule = 'discount-delivery-perDayAndSchedule';
 acctionsOfTheEvents.set(keyDiscountByDayAndSchedule,percentageDiscountPerDayAndSchedule);
 
 
 global.daysToSurCharge=obj.daysToSurCharge;
 global.RangeHoursToSurCharge=[obj.InitialHourToSurCharge,obj.FinalHourToSurCharge];
 percentageSurchargePerDayAndSchedule = obj.percentageSurchargePerDayAndSchedule;
 global.keySurchargeByDayAndSchedule = 'surcharge-delivery-perDayAndSchedule';
 acctionsOfTheEvents.set(keySurchargeByDayAndSchedule,percentageSurchargePerDayAndSchedule);
 
 
//points
 global.minimunPointsToApplyDiscount=obj.minimunPointsToApplyDiscount;
 percentageDiscountPerPoints=obj.percentageDiscountPerPoints;
 global.keyDiscountByPoints = 'discount-per-point-greather-than';
 acctionsOfTheEvents.set(keyDiscountByPoints,percentageDiscountPerPoints);
 
 
//paymethod
 global.paymethodsWithDiscount = obj.paymethodsWithDiscount;
 percentageDiscountPerPaymethod=obj.percentageDiscountPerPaymethod;
 global.keyDiscountByPaymethod = 'discount-paymethod';
 acctionsOfTheEvents.set(keyDiscountByPaymethod,percentageDiscountPerPaymethod);
 
 
 global.paymethodsWithSurcharge = obj.paymethodsWithSurcharge;
 percentageSurchargePerPaymethod= obj.percentageSurchargePerPaymethod;
 global.keySurchargeByPaymehod = 'Surcharge-paymethod';
 acctionsOfTheEvents.set(keySurchargeByPaymehod,percentageSurchargePerPaymethod);
 