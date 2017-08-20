// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const ClientOAuth2 = require("client-oauth2");
const appendQuery = require('append-query');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const AUTH_URL = "https://drchrono.com/o/authorize/";
const TOKEN_URL = "https://drchrono.com/o/token/";

/**
* @param {Object} opts
* @return {Promise<Token>}
* */
function performOAuth(opts) {
  let clientId = opts.client_id,
    clientSecret = opts.client_secret,
    redirectURL = opts.redirect_uri,
    code = opts.code;
  let auth = new ClientOAuth2({
    clientId: clientId,
    clientSecret: clientSecret,
    accessTokenUri: TOKEN_URL,
    authorizationUri: AUTH_URL,
    redirectUri: redirectURL,
  });
  let url = appendQuery(redirectURL, { code: code });

  return auth.code.getToken(url, {
    body: {
      'code': code,
      'grant_type': 'authorization_code',
      'redirect_uri': redirectURL,
      'client_id': clientId,
      'client_secret': clientSecret
    }
  })
};

exports.createToken = functions.https.onRequest((req, res) => {
  if (req.get('content-type') === 'application/json' && req.method === 'POST') {
    performOAuth(req.body)
      .then(t => res.status(200).json(t.data))
      .catch(e => res.status(e.status || 400).json(e.body));
  } else {
    res.status(200).json({ error: 'Please use Content-Type: application/json and POST method' });
  }
});
