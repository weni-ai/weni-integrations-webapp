/* eslint-disable no-undef */
export function initFacebookSdk() {
  // wait for facebook sdk to initialize before starting the vue app
  window.fbAsyncInit = function () {
    // JavaScript SDK configuration and setup
    FB.init({
      appId: process.env.VUE_APP_FACEBOOK_APP_ID, // Facebook App ID
      cookie: true, // enable cookies
      xfbml: true, // parse social plugins on this page
      version: 'v11.0', //Graph API version
    });
  };

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
