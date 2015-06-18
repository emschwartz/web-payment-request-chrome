# Web Payment Request Spec proposal

## Goal

This is a spec for a very simple request for payment that seeks to provide users with a seemless payment experience across different websites. It allows merchants to support as many payment instruments as they want, without adding to the complexity of the experience. If implemented by browsers and merchants this standard would support all types of payment instruments, withthout any changes to the schemes.

This spec aims to address:

* Discovery of merchant-supported payment methods
* Simplified user payment flow, including automatic payment instrument selection
* Pull payments (e.g. credit cards) and push payments (e.g. Bitcoin)
* Tokenized payment schemes

## `window.requestPayment`

`window.requestPayment` is called with an array of payment options as JSON objects and a callback function. The browser will either have payment instrument credentials stored or it will call out to a wallet app or extension. The wallet will select from among the merchant's list of options one that it supports and has credentials for.

In the case of a pull or payee-initiated payment the wallet will return the payment credentials, which can be tokenized, to the callback. In the case of a push or payer-initiated payment the wallet can directly submit the payment authorization to the payment instrument and return the proof of payment to the merchant.

```js
window.requestPayment([{
  // List of payment options specified using JSON-LD
  // The "wallet" determines which payment methods it supports
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
}], function(response) {
  console.log(response)
  // In the case of pull, submit the response details
  // to the processor
  // In the case of a push, we should already have been paid
  // and the response is the proof of payment
})
```

Further development of this spec would likely include discussion about whether browsers will implement the wallet functionality or provide an API for wallets to handle the `requestPayment` call. Either way, we should discuss how new schemes and instruments will be added to the wallet software.


## Running the extension

1. Clone the repo
2. Follow [these instructions](https://developer.chrome.com/extensions/getstarted#unpacked) to load the extension in chrome
3. Modify the `inject/inject.js` script and change the `extensionId` to the one generated when the extension is loaded into Chrome
4. Install and run the [Web Payment Request Demo Server](https://github.com/emschwartz/web-payment-request-demo-server)
5. Open the developer console for the extension's background page to see logged output
