const API_URL = require("./constants").API_URL;
const popsicle = require('popsicle');
const fs = require("fs");
const oAuthClient = require("./shared").oAuthClient;
const retrieveOAuthToken = require("./shared").retrieveOAuthToken;

/**
 *
 * @param fileMatrix {Array<Array<String>>}
 * @return {String}
 */
function matrixToCsv(fileMatrix) {
  return fileMatrix.map(arr=> arr.map(word => '"' + word + '"').join(",") ).join("\n");
}

function processFile(fileMatrix) {
  let fileName = "/tmp/"+ Date.now()+'.csv';
  return new Promise((resolve)=> {
    fs.writeFile(fileName, matrixToCsv(fileMatrix), 'utf8', function(err){
      if (err) throw err;
      resolve(fs.createReadStream(fileName));
    });
  });
}

/**
 *
 * @param {ClientOAuth2.Token} token
 * @param {Object} opts
 * @returns {Promise<Response>}
 */
function uploadFlamingoForm(token, opts) {
  let body = opts.body,
    fileMatrix = opts.file_matrix,
    formBody;

  return processFile(fileMatrix).then((readStream) => {
    formBody = Object.assign(body, {
      attachment: readStream
    });
    return popsicle.post({
      url: `${API_URL}messages`,
      body: popsicle.form(formBody),
      headers: {
        'Authorization': `Bearer ${token.accessToken}`
      }
    });
  });
}

/**
 * @param {Request} req
 * @param {Response} res
 * */
module.exports = function sendFlamingoReport(req, res) {
  if (req.get('content-type') === 'application/json' && req.method === 'POST') {
    retrieveOAuthToken(oAuthClient())
      .then((token)=> uploadFlamingoForm(token, req.body))
      .then((r)=> res.status(r.status || 400).send(r.body));
  } else {
    res.status(200).json({ error: 'Please use Content-Type: application/json and POST method' });
  }
};
