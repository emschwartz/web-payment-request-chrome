# Web Payment Request Spec proposal

## Goal

This is a spec for a very simple request for payment that seeks to provide users with a seemless payment experience across different websites. It allows merchants to support as many payment instruments as they want, without adding to the complexity of the experience. If implemented by browsers and merchants this standard would support all types of payment instruments, withthout any changes to the schemes.

This spec aims to address:

* Supporting all payment schemes
* Easy discovery of merchant-supported payment methods
* Simplified user payment flow, including automatic payment instrument selection
* Reduction of "cart abandonment"
* Pull payments (e.g. credit cards) and push payments (e.g. Bitcoin)
* Tokenized payment schemes

This spec does *not* aim to address:

* The security, speed, or cost of payment schemes
* Methods of authentication
* Standardized proofs of payments or receipts
* Syncing payment credentials across devices (this is up to the browser/wallet)

This spec also does not address digital identity, but it is likely that a _separate_ standard for Web Credentials would improve the Web Payment experience and security.

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
  "address": "16UwLL9Risc3QfPqBUvKofHmBQ7wMtjvM",
  "outputs": [
    ["1Gokm82v6DmtwKEB8AiVhm82hyFSsEvBDK", 15000]
  ]
}], function(response) {
  console.log(response)
  // In the case of pull, submit the response details to the processor
  // In the case of a push, we should already have been paid and the 
  //   response may be the proof of payment or transaction ID
})
```

The format of the payment option objects does not necessarily need to be formally standardized. [JSON-LD](http://json-ld.org/) can be used to provide context for the data formats used. Wallets can support any formats they want, and can provide extension functionality to enable users to add new schemes (and the behavior necessary to pay with that scheme) to them. 

The response format is dependent on the scheme used and also does not need to be standardized. The merchant will know what to do with the response (and in what ways they can trust it) because they are the ones that asked for payment through that scheme in the first place.

> Note: The responses do not require a signature specification. Whether or not the response must be signed is highly dependent on the scheme and potentially the details of the payment. For cryptographic push-based systems the response will, in almost all cases, be digitally signed. However, requiring a digital signature from all schemes would place a high implementation burden on payment schemes and would severely hamper the adoption of this standard.

Further development of this spec would likely include discussion about whether browsers will implement the wallet functionality or provide an API for wallets to handle the `requestPayment` call. Either way, we should discuss how new schemes and instruments will be added to the wallet software.


## Running the extension

1. Clone the repo
2. Follow [these instructions](https://developer.chrome.com/extensions/getstarted#unpacked) to load the extension in chrome
3. Modify the `inject/inject.js` script and change the `extensionId` to the one generated when the extension is loaded into Chrome
4. Install and run the [Web Payment Request Demo Server](https://github.com/emschwartz/web-payment-request-demo-server)
5. Open the developer console for the extension's background page to see logged output
