const popsicle = require('popsicle');
const API_URL = require("./constants").API_URL;

function executeResource(opts) {
  let body = opts.body,
    authToken = opts.access_token,
    resource = opts.resource,
    method = opts.method;

  return popsicle.request({
    method: method,
    url: `${API_URL}/${resource}`,
    body: body,
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
}

/**
 * @param {Request} req
 * @param {Response} res
 * */
module.exports = function callResource(req, res) {
  if (req.get('content-type') === 'application/json' && req.method === 'POST') {
    executeResource(req.body).exec((err, r) => res.status(r.status || 400).send(r.body));
  } else {
    res.status(200).json({ error: 'Please use Content-Type: application/json and POST method' });
  }
};
