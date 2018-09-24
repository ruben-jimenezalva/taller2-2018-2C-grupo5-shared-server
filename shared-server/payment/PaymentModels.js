function getMyPayments(res){
    var mypyments = [];
    for(i=0; i<res.rowCount; i++){
        var payment = {
            "transaction_id" : res.rows[i].transaction_id,
            "currency" : res.rows[i].currency,
            "value" : res.rows[i].value,
            "paymentMethod" : {
              "epiration_month" : res.rows[i].epiration_month,
              "expiration_year" : res.rows[i].expiration_year,
              "number" : res.rows[i].number,
              "method" : res.rows[i].method,
              "type" : res.rows[i].type
            },
        };
        mypyments[i] = payment;
    }
    return mypyments;
}


function postCreatePayment(res){
    var payment = {
        "transaction_id" : res.rows[0].transaction_id,
        "currency" : res.rows[0].currency,
        "value" : res.rows[0].value,
        "paymentMethod" : {
          "expiration_month" : res.rows[0].expiration_month,
          "expiration_year" : res.rows[0].expiration_year,
          "number" : res.rows[0].number,
          "method" : res.rows[0].method,
          "type" : res.rows[0].type
        },
    };
    return payment;
}


function getPaymentMethods(res){
    var Methods = [];
    for(i=0; i<res.rowCount; i++){
        var method = {
              "method" : res.rows[i].method,
        };
        Methods[i] = method;
    }
    var value = {paymentMethod:'paymentMethod', parameters:Methods}
    return value;
}


module.exports = {
    getMyPayments: getMyPayments,
    postCreatePayment: postCreatePayment,
    getPaymentMethods: getPaymentMethods
};