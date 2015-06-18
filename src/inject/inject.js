// This would be replaced if the browsers implemented
// the functionality natively

var s = document.createElement('script');
s.setAttribute('type','text/javascript');
s.textContent = '(' + function () {
  
  if (!window.requestPayment) {
    var extensionId = 'gfaihiahclpeekpjkokehomlbbnncoml';
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