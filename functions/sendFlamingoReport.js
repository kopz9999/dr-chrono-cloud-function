const API_URL = require("./constants").API_URL;
const popsicle = require('popsicle');
const fs = require("fs");
const path = require('path');
const streams = require('memory-streams');


function processFile(fileContent) {
  let fileName = path.join(__dirname, Date.now()+'.txt');
  console.log('before promise');
  return new Promise((resolve)=> {
    console.log('on promise');
    fs.writeFile(fileName, "Hello", function(err){
      console.log('inside write');
      if (err) throw err;
      console.log('what??');
      resolve(fs.createReadStream(filename));
    });
  });
}

/**
 *
 * @param {Object} opts
 * @returns {Promise<ReadStream>}
 */
function uploadFlamingoForm(opts) {
  let body = opts.body,
    authToken = opts.access_token,
    fileContent = opts.file_content,
    formBody;

  return processFile(fileContent).then((readStream) => {
    console.log('omg');
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
    uploadFlamingoForm(req.body)
      .then(t => res.status(200).json(t.data))
      .catch(e => res.status(e.status || 400).json(e.body));
  } else {
    res.status(200).json({ error: 'Please use Content-Type: application/json and POST method' });
  }
};
