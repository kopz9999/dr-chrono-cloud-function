const saveToken = require("./shared").saveToken;
const oAuthClient = require("./shared").oAuthClient;
const retrieveOAuthToken = require("./shared").retrieveOAuthToken;

function refreshDbToken(token) {
  token.refresh().then(saveToken);
}

/**
 * @param {Request} req
 * @param {Response} res
 * */
module.exports = function updateToken(req, res) {
  if (req.get('content-type') === 'application/json' && (req.method === 'PUT' || req.method === 'PATCH')) {
    retrieveOAuthToken(oAuthClient())
      .then(refreshDbToken)
      .then(() => res.status(200).json({ status: 'ok' }) )
      .catch(e => {
        console.log(e);
        return res.status(e.status || 400).json(e.body)
      });
  } else {
    res.status(200).json({ error: 'Please use Content-Type: application/json and PUT/PATCH method' });
  }
};
