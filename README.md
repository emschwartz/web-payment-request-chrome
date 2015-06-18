# Web Payment Request Spec proposal

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

## Running the extension

1. Clone the repo
2. Follow [these instructions](https://developer.chrome.com/extensions/getstarted#unpacked) to load the extension in chrome
3. Modify the `inject/inject.js` script and change the `extensionId` to the one generated when the extension is loaded into Chrome
4. Install and run the [Web Payment Request Demo Server](https://github.com/emschwartz/web-payment-request-demo-server)
5. Open the developer console for the extension's background page to see logged output