// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const name = 'auth-static-web-app';
let authData = null;

function getBaseUrl () {
  return window.location.protocol + '//' +
    window.location.host;
}

function signIn () {
  window.location.href = getBaseUrl() + '/.auth/login/aad?post_login_redirect_uri=' + getBaseUrl() + '/digitaltwin';
}

function signOut () {
  window.location.href = getBaseUrl() + '/.auth/logout?post_logout_redirect_uri=' + getBaseUrl();
}

function isAsync () {
  return true;
}

// TODO: use Error-First Callback pattern (warning: doing so may break
// compatibility with existing apps)
function isUserSignedIn (callbackFunction) {
  // Return true if already authenticated
  if (authData) {
    callbackFunction(authData !== null);
  }
  // Otherwise, try to acquire a token silently to implement SSO
  acquireUserInfo(callbackFunction);
}

// TODO: use Error-First Callback pattern (warning: doing so may break
// compatibility with existing apps)
function acquireUserInfo (callbackFunction) {
  fetch(getBaseUrl() + '/.auth/me')
    .then(response => response.json())
    .then(data => {
      authData = data.clientPrincipal;
      callbackFunction(authData !== null);
    })
    .catch(error => {
      console.error(error);
      callbackFunction(false);
    });
}

function getUserName () {
  if (authData) {
    return authData.userDetails;
  }
  return undefined;
}

function getUserId () {
  if (authData) {
    return authData.userId;
  }
  return undefined;
}

function getUserPicUrl () {
  return undefined;
}

const AuthStaticWebApp = {
  name,
  signIn,
  signOut,
  isUserSignedIn,
  getUserName,
  getUserId,
  getUserPicUrl,
  isAsync
};
export default AuthStaticWebApp;
