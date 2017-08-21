const API_URL = require("./constants").API_URL;
const popsicle = require('popsicle');
const fs = require("fs");

/**
 *
 * @param fileMatrix {Array<Array<String>>}
 * @return {String}
 */
function matrixToCsv(fileMatrix) {
  let lines = [];
  fileMatrix.forEach((arr)=> lines.push(arr.join(",")));
  return lines.join("\n");
}

function processFile(fileMatrix) {
  let fileName = "/tmp/"+ Date.now()+'.csv';
  return new Promise((resolve)=> {
    fs.writeFile(fileName, matrixToCsv(fileMatrix), function(err){
      if (err) throw err;
      resolve(fs.createReadStream(fileName));
    });
  });
}

/**
 *
 * @param {Object} opts
 * @returns {Promise<Response>}
 */
function uploadFlamingoForm(opts) {
  let body = opts.body,
    authToken = opts.access_token,
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
        'Authorization': `Bearer ${authToken}`
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
    uploadFlamingoForm(req.body).then((r)=> res.status(r.status || 400).send(r.body));
  } else {
    res.status(200).json({ error: 'Please use Content-Type: application/json and POST method' });
  }
};
