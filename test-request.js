// TODO: should this be requestPayment or something
// less payment specific and more generic?
window.requestPayment(
  // List of payment options specified using JSON-LD
  // The "wallet" determines which payment methods it supports
  [{
    "unsupportedType": "blah" 
  }, {
    "@context": "https://schema.org/PaymentChargeSpecification",
    "appliesToPaymentMethod": "visa",
    "price": 100,
    "priceCurrency": "USD"
    // Account not specified because this is a pull
  }, {
    "@context": "https://schema.org/PaymentChargeSpecification",
    "appliesToPaymentMethod": "bitcoin",
    "price": .5,
    "priceCurrency": "BTC",
    "address": "...bitcoin pay-to address...",
    "outputs": [
      ["1Gokm82v6DmtwKEB8AiVhm82hyFSsEvBDK", 15000]
    ]
  }],
  function(response) {
    console.log('payment request response: ', response)
    // In the case of pull, submit the response details
    // to the processor
    // In the case of a push, we should already have been paid
    // and the response is the proof of payment
  })