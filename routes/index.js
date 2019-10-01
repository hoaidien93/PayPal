var express = require('express');
var router = express.Router();
var paypal = require('paypal-rest-sdk');

/* GET home page. */
router.get('/', function (req, res, next) {
  paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AfRyVflOJxHZgxckV_I-iW6fW4QBnvMtwZjXD_fzSd9hBm-NGcWtfNXsz7Fo8v4cAbzhcrCnfAhAzk0f',
    'client_secret': 'EMPl_gpCUfIWNG-6ZBJlRHhuND4IU8Veqx9WINryYmZx8fB-dYbnbbzeV2COxegb5zpz7hOhuf8oRNNl'
  });
  var create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": "http://localhost:3000/success",
      "cancel_url": "http://cancel.url"
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "Art",
          "sku": "Art",
          "price": "25.00",
          "currency": "USD",
          "quantity": 2
        }]
      },
      "amount": {
        "currency": "USD",
        "total": "50.00"
      },
      "description": "This is the payment description."
    }]
  };
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url')
          res.redirect(payment.links[i].href)
      }
    }
  });
});
router.get("/success", function (req, res) {
  let payerId = req.query.PayerID;
  let paymentId = req.query.paymentId;
  var execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
      "amount": {
        "currency": "USD",
        "total": "50.00"
      }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
      console.log(error.response);
    } else {
      console.log("Get Payment Response");
      console.log(payment.state);
    }
  });
});

router.get("/cancel",(req,res)=>{
  
});

module.exports = router;
