/* eslint-disable no-undef */
export function initFacebookSdk(appId, loginCallback) {
  // wait for facebook sdk to initialize before starting the vue app
  window.fbAsyncInit = function () {
    // JavaScript SDK configuration and setup
    FB.init({
      appId, // Facebook App ID
      xfbml: true, // parse social plugins on this page
      version: 'v18.0', //Graph API version
    });

    // Call login code after init
    loginCallback();
  };

  // Search for current loaded SDK and remove it
  (function (d, s, id) {
    let es = d.getElementById(id);
    if (es) es.remove();
    if (typeof FB !== 'undefined') {
      FB = null;
    }
  })(document, 'script', 'facebook-jssdk');

  // Load the JavaScript SDK asynchronously
  (function (d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  })(document, 'script', 'facebook-jssdk');
}
