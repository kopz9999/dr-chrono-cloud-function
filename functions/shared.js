const admin = require("firebase-admin");
const ClientOAuth2 = require("client-oauth2");
const functions = require('firebase-functions');
const REDIRECT_URL = require("./constants").REDIRECT_URL;
const AUTH_URL = require("./constants").AUTH_URL;
const TOKEN_URL = require("./constants").TOKEN_URL;

/**
 *
 * @return {ClientOAuth2}
 */
function oAuthClient() {
  return new ClientOAuth2({
    clientId: functions.config().oauth.client_id,
    clientSecret: functions.config().oauth.client_secret,
    accessTokenUri: TOKEN_URL,
    authorizationUri: AUTH_URL,
    redirectUri: REDIRECT_URL,
  });
}

/**
 * @param {ClientOAuth2} client
 * @return {Promise<ClientOAuth2.Token>}
 * */
function retrieveOAuthToken(client) {
  let db = admin.database();
  let ref = db.ref("tokens/default");

  return new Promise((resolve)=> {
    ref.once('value', function(snapshot) {
      resolve(client.createToken(snapshot.val()));
    });
  });
}

/**
 * @param {ClientOAuth2.Token} token
 * @return {ClientOAuth2.Token}
 * */
function saveToken(token) {
  let db = admin.database();
  let ref = db.ref("tokens/default");
  ref.set(token.data);
  return token;
}

module.exports = {
  retrieveOAuthToken: retrieveOAuthToken,
  oAuthClient: oAuthClient,
  saveToken: saveToken,
};
