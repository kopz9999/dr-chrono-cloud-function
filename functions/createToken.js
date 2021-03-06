const AUTH_URL = require("./constants").AUTH_URL;
const TOKEN_URL = require("./constants").TOKEN_URL;
const ClientOAuth2 = require("client-oauth2");
const appendQuery = require('append-query');
const saveToken = require("./shared").saveToken;

/**
 * @param {Object} opts
 * @return {Promise<ClientOAuth2.Token>}
 * */
function performOAuth(opts) {
  let clientId = opts.client_id,
    clientSecret = opts.client_secret,
    redirectURL = opts.redirect_uri,
    code = opts.code;
    grantType = opts.grant_type;

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
      'grant_type': grantType,
      'redirect_uri': redirectURL,
      'client_id': clientId,
      'client_secret': clientSecret
    }
  })
};

/**
 * @param {Request} req
 * @param {Response} res
 * */
module.exports = function createToken(req, res) {
  if (req.get('content-type') === 'application/json' && req.method === 'POST') {
    performOAuth(req.body)
      .then(saveToken)
      .then((t) => res.status(200).json(t.data) )
      .catch(e => {
        console.log(e);
        return res.status(e.status || 400).json(e.body)
      });
  } else {
    res.status(200).json({ error: 'Please use Content-Type: application/json and POST method' });
  }
};
