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
  userEmail: undefined,
  username: undefined,
  userId: undefined,
  roles: [],
};
let config = null;
let msalApp = null;

async function setConfig(newConfig) {
  config = newConfig;
  msalApp = new msal.PublicClientApplication(config.msalConfig);
  await msalApp.initialize();
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
  window.location.href = config?.msalConfig?.auth?.redirectUri ?? '/';
}

async function _acquireTokensByRequestAndAccount(tokenReq, account) {
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
    .catch(function (silentTokenFetchError) {
      if (silentTokenFetchError.errorCode === 'no_tokens_found') {
        // No token found during acquireTokenSilent, ignore this error, nothing to do
        return;
      } else if (silentTokenFetchError.errorCode === 'login_required') {
        console.warn(
          'Silent authentication not possible, user is not logged in. This usually happens when the user session ' +
            'has expired. Please try to log in again.'
        );
        return;
      } else if (silentTokenFetchError.errorMessage?.indexOf('interaction_required') !== -1) {
        msalApp
          .acquireTokenPopup(tokenReq)
          .then(function (tokenRes) {
            return tokenRes; // Token acquired with interaction
          })
          .catch(function (popupTokenFetchError) {
            throw popupTokenFetchError; // Token retrieval failed
          });
      }
      throw silentTokenFetchError;
    });
}

async function acquireTokens() {
  if (!checkInit()) {
    return;
  }

  const account = msalApp.getAllAccounts()[0];
  const tokenReq = config.accessRequest;
  if (account === undefined) {
    return undefined;
  }

  return await _acquireTokensByRequestAndAccount(tokenReq, account);
}

async function acquireTokensByRequest(tokenReq) {
  if (!checkInit()) {
    return;
  }

  const account = msalApp.getAllAccounts()[0];
  return await _acquireTokensByRequestAndAccount(tokenReq, account);
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
  const account = accounts[0];
  authData.accountId = account.homeAccountId;
  authData.userEmail = account.username; // In MSAL account data, username property contains user email
  authData.username = account.name;
  authData.userId = account.localAccountId;
  redirectOnAuthSuccess();
}

function handleResponse(response) {
  writeToStorage('authIdTokenPopup', response.idToken);
  if (response !== null) {
    authData.authenticated = true;
    const account = response.account;
    authData.accountId = account.homeAccountId;
    authData.userEmail = account.username; // In MSAL account data, username property contains user email
    authData.username = account.name;
    authData.userId = account.localAccountId;
    redirectOnAuthSuccess();
  } else {
    selectAccount();
  }
}

function signIn() {
  if (!checkInit()) {
    return;
  }

  // Force removal of MSAL interaction status if it exists in session storage (it happens sometimes after logout)
  const itemKey = 'msal.interaction.status';
  if (sessionStorage.getItem(itemKey)) {
    sessionStorage.removeItem(itemKey);
  }

  return msalApp
    .loginPopup(config.loginRequest)
    .then(handleResponse)
    .catch((error) => {
      // Error handling
      // Check for forgot password error
      // Learn more about AAD error codes at
      // https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes
      if (error.errorMessage?.indexOf('AADB2C90118') > -1) {
        msalApp.loginPopup(config.b2cPolicies.authorities.forgotPassword).then((response) => {
          window.alert('Password has been reset successfully. \nPlease sign-in with your new password.');
        });
      } else if (error.errorCode === 'user_cancelled') {
        // User cancelled login, nothing to do
      } else {
        throw error;
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
  msalApp.logoutRedirect(logoutRequest);
}

function isAsync() {
  return false;
}

function _extractRolesFromAccessToken(accessToken) {
  let result = [];
  if (accessToken) {
    const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
    if (decodedToken?.roles) {
      result = decodedToken?.roles;
    }
  }
  return result;
}

async function isUserSignedIn() {
  // Return true if already authenticated
  if (authData.authenticated) {
    return true;
  }
  // Otherwise, try to acquire a token silently to implement SSO
  const tokens = await acquireTokens();
  if (tokens?.idToken !== undefined) {
    writeToStorage('authIdToken', tokens.idToken);
  }
  if (tokens?.accessToken !== undefined) {
    const accessToken = tokens.accessToken;
    authData.roles = _extractRolesFromAccessToken(accessToken);
    writeToStorage('authAccessToken', accessToken);
    return true;
  }
  return false;
}

function getUserEmail() {
  if (!checkInit()) {
    return undefined;
  }
  // Note: account data from MSAL seems to contain user email in the 'username' property
  return authData?.userEmail || msalApp.getAllAccounts()[0]?.username;
}

function getUserName() {
  if (!checkInit()) {
    return undefined;
  }
  return authData?.name || msalApp.getAllAccounts()[0]?.name;
}

function getUserId() {
  if (!checkInit()) {
    return undefined;
  }
  return authData?.userId || msalApp.getAllAccounts()[0]?.localAccountId;
}

function getUserRoles() {
  if (!checkInit()) {
    return undefined;
  }
  return authData.roles;
}

function getUserPicUrl() {
  return undefined;
}

const AuthMSAL = {
  name,
  signIn,
  signOut,
  isUserSignedIn,
  getUserEmail,
  getUserName,
  getUserId,
  getUserRoles,
  getUserPicUrl,
  isAsync,
  setConfig,
  acquireTokens,
  acquireTokensByRequest,
};
export default AuthMSAL;
