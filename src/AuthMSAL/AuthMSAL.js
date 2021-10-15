// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import * as msal from '@azure/msal-browser';

// Functions to read & write from storage.
// Notes : local storage works on Chromium but not on Firefox if "Delete
// cookies and site data when Firefox is closed" is selected (for more
// details, see https://bugzilla.mozilla.org/show_bug.cgi?id=1453699)
function writeToStorage(key, value) {
  localStorage.setItem(key, value);
}
// eslint-disable-next-line no-unused-vars
function readFromStorage(key) {
  return localStorage.getItem(key);
}
function clearFromStorage(key) {
  localStorage.removeItem(key);
}

const name = 'auth-msal';
const authData = {
  authenticated: false,
  accountId: undefined,
  username: undefined,
  userId: undefined,
};
let config = null;
let msalApp = null;

function setConfig(newConfig) {
  config = newConfig;
  msalApp = new msal.PublicClientApplication(config.msalConfig);
}

function checkInit() {
  if (msalApp === null) {
    console.error(
      'AuthMSAL module has not been initialized. Make sure you ' +
        'call the setConfig function when you add the AuthMSAL provider.'
    );
    return false;
  }
  return true;
}

function redirectOnAuthSuccess() {
  window.location.href = '/';
}

async function acquireTokens() {
  if (!checkInit()) {
    return;
  }

  const account = msalApp.getAllAccounts()[0];
  let tokenReq = config.accessRequest;
  if (!tokenReq) {
    console.warn('No base access token request provided');
    tokenReq = {
      scopes: ['user.read'],
    };
  }

  tokenReq.account = account;

  return await msalApp
    .acquireTokenSilent(tokenReq)
    .then(function (tokenRes) {
      return tokenRes;
    })
    .catch(function (error) {
      if (error.errorMessage === undefined) {
        console.error(error);
      } else if (error.errorMessage.indexOf('interaction_required') !== -1) {
        msalApp
          .acquireTokenPopup(tokenReq)
          .then(function (tokenRes) {
            // Token acquired with interaction
            return tokenRes;
          })
          .catch(function (error) {
            // Token retrieval failed
            console.warn(error);
            return undefined;
          });
      }
      return undefined;
    });
}

function selectAccount() {
  if (!checkInit()) {
    return;
  }

  const accounts = msalApp.getAllAccounts();
  if (accounts.length === 0) {
    return;
  }
  // Select the 1st account if more than one is detected
  if (accounts.length > 1) {
    console.warn('Several accounts detected, using the first one by default.');
  }
  authData.authenticated = true;
  authData.accountId = accounts[0].homeAccountId;
  authData.username = accounts[0].name;
  authData.userId = accounts[0].localAccountId;
  redirectOnAuthSuccess();
}

function handleResponse(response) {
  writeToStorage('authIdTokenPopup', response.idToken);
  if (response !== null) {
    authData.authenticated = true;
    authData.accountId = response.account.homeAccountId;
    authData.username = response.account.name;
    authData.userId = response.account.localAccountId;
    redirectOnAuthSuccess();
  } else {
    selectAccount();
  }
}

function signIn() {
  if (!checkInit()) {
    return;
  }

  msalApp
    .loginPopup(config.loginRequest)
    .then(handleResponse)
    .catch((error) => {
      console.error(error);
      // Error handling
      if (error.errorMessage) {
        // Check for forgot password error
        // Learn more about AAD error codes at
        // https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes
        if (error.errorMessage.indexOf('AADB2C90118') > -1) {
          msalApp.loginPopup(config.b2cPolicies.authorities.forgotPassword).then((response) => {
            window.alert('Password has been reset successfully. \nPlease sign-in with your new password.');
          });
        }
      }
    });
}

function signOut() {
  if (!checkInit()) {
    return;
  }

  clearFromStorage('authIdTokenPopup');
  clearFromStorage('authIdToken');
  clearFromStorage('authAccessToken');
  const logoutRequest = {
    account: msalApp.getAccountByHomeId(authData.accountId),
  };
  msalApp.logout(logoutRequest);
}

function isAsync() {
  return false;
}

async function isUserSignedIn() {
  // Return true if already authenticated
  if (authData.authenticated) {
    return true;
  }
  // Otherwise, try to acquire a token silently to implement SSO
  const tokens = await acquireTokens();
  if (tokens !== undefined && tokens.idToken !== undefined) {
    writeToStorage('authIdToken', tokens.idToken);
  }
  if (tokens !== undefined && tokens.accessToken !== undefined) {
    writeToStorage('authAccessToken', tokens.accessToken);
    return true;
  }
  return false;
}

function getUserName() {
  if (!checkInit()) {
    return;
  }

  if (authData.username !== undefined) {
    return authData.username;
  }
  const account = msalApp.getAllAccounts()[0];
  if (account !== undefined) {
    return account.name;
  }
  return undefined;
}

function getUserId() {
  if (authData.userId !== undefined) {
    return authData.userId;
  }
  const account = msalApp.getAllAccounts()[0];
  if (account !== undefined) {
    return account.localAccountId;
  }
  return undefined;
}

function getUserPicUrl() {
  return undefined;
}

const AuthMSAL = {
  name,
  signIn,
  signOut,
  isUserSignedIn,
  getUserName,
  getUserId,
  getUserPicUrl,
  isAsync,
  setConfig,
  acquireTokens,
};
export default AuthMSAL;
