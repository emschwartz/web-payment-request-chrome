// This is the code of the "wallet", which can be
// implemented by the browser or an external app

var supportedMethods = {
  visa: loadCardDetails,
  bitcoin: sendBitcoinPayment
};

function loadCardDetails(options, sendResponse) {
  // TODO Get card details from storage
  var cardDetails = {
    "number": "5500005555555559",
    "expire_month": 12,
    "expire_year": 2018,
    "cvv2": 111,
    "first_name": "Betsy",
    "last_name": "Buyer"
  }
  sendResponse(cardDetails);
}

function sendBitcoinPayment(options, sendResponse) {
  // TODO Get secret from storage
  var keyPair = bitcoin.ECPair.makeRandom();

  var tx = new bitcoin.TransactionBuilder()
  // TODO add real inputs
  tx.addInput('aa94ab02c182214f090e99a0d57021caffd0f195a81c24602b1028b130b63e31', 0);
  

  options.outputs.forEach(function(output) {
    tx.addOutput.apply(tx, output);
  });
  tx.sign(0, keyPair)
  var txBuilt = tx.build()

  // TODO Submit transaction
  
  sendResponse(txBuilt.toHex());
}

chrome.runtime.onMessageExternal.addListener(
  function(message, sender, sendResponse) {

    console.log('got request for payment with options: ', message.paymentOptions)

    // Pick one of the options we support
    for (var option of message.paymentOptions) {
      if (option.appliesToPaymentMethod &&
        supportedMethods[option.appliesToPaymentMethod]) {

        console.log('using payment method: ' + option.appliesToPaymentMethod)
        supportedMethods[option.appliesToPaymentMethod](option, sendResponse);
        return;
      }
    }

    sendResponse({
      error: 'NoSupportedInstruments',
      message: 'The wallet does not support any of the supplied payment instruments'
    })
})