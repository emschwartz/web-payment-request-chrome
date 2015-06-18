// This is the code of the "wallet", which can be
// implemented by the browser or an external app

var supportedMethods = {
  visa: loadCardDetails,
  bitcoin: sendBitcoinPayment
};

console.log('Wallet supports: ' + Object.keys(supportedMethods).join(', '))

function loadCardDetails(options, sendResponse) {
  // TODO Get card details from storage
  var cardDetails = {
    "number": "5500005555555559",
    "expire_month": 12,
    "expire_year": 2018,
    "cvv2": 111,
    "first_name": "Betsy",
    "last_name": "Buyer"
  };

  // TODO do something better than adding the properties
  // to the initital object we were sent
  Object.keys(cardDetails).forEach(function(key) {
    options[key] = cardDetails[key];
  })
  sendResponse(options);
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
  
  // TODO do something better than adding the properties
  // to the initital object we were sent
  options.tx = txBuilt.toHex();
  sendResponse(options);
}

chrome.runtime.onMessageExternal.addListener(
  function(message, sender, sendResponse) {

    chrome.pageAction.show(sender.tab.id);

    console.log('got request for payment with options: ', message.paymentOptions)

    // Pick one of the options we support
    for (var option of message.paymentOptions) {
      if (option.appliesToPaymentMethod &&
        supportedMethods[option.appliesToPaymentMethod.toLowerCase()]) {

        var instrument = option.appliesToPaymentMethod.toLowerCase();

        console.log('Waiting for confirmation on payment: ' + instrument)

        var notificationId = 'paymentConfirmation';

        chrome.notifications.create('paymentConfirmation',
          {
            title: 'Payment Confirmation',
            message: 'This page is requesting a ' +
              instrument +
              ' payment for ' +
              option.price + ' ' +
              option.priceCurrency +
              '. Would you like to continue?',
            iconUrl: 'icons/wallet48.png',
            type: 'basic',
            buttons: [{
              title: 'Confirm Payment',
              iconUrl: 'icons/coin38.png'
            }, {
              title: 'Reject Payment'
            }]
          });

        // I need to call this function from within the onButtonClicked listener but the function sendResponse isn't being included properly
        // Any ideas what to do? It's a scope issue
        // It's not getting called
        function buttonListener(notifId, btnIndex) {
          if (btnIndex === 0) {
            console.log('Payment confirmed')
            supportedMethods[instrument](option, sendResponse);
          } else {
            console.log('Payment rejected');
          }
          chrome.notifications.clear(notificationId);
        }
        chrome.notifications.onButtonClicked.addListener(buttonListener);

        chrome.notifications.onClosed.addListener(function(notifId) {
          if (notifId !== notificationId) {
            return;
          }
          console.log('Payment rejected');
        });

        // Keep message channel open
        return true;
      }
    }

    sendResponse({
      error: 'NoSupportedInstruments',
      message: 'The wallet does not support any of the supplied payment instruments'
    })
})
