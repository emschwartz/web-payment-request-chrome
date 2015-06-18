// This would be replaced if the browsers implemented
// the functionality natively

console.log('Injected window.requestPayment shim into DOM');

var s = document.createElement('script');
s.setAttribute('type','text/javascript');
s.textContent = '(' + function () {
  
  if (!window.requestPayment) {

    // This is generated when the extension is loaded into Chrome
    var extensionId = 'dppogfpjmhpkjjbgiebcbobjkmomfjhh';

    window.requestPayment = function(options, callback) {
      chrome.runtime.sendMessage(
        extensionId,
        {paymentOptions: options},
        callback
      )
    }
  }

} + ')();';
(document.head||document.documentElement).appendChild(s);
s.parentNode.removeChild(s);