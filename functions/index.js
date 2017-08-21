// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const createToken = require("./createToken");
const callResource = require("./callResource");
const sendFlamingoReport = require("./sendFlamingoReport");

const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

/**
 * @param {Request} req
 * @param {Response} res
 * @param {Function} callback
 * */
function validateRequestMethod(req, res, callback) {
  res.header('Content-Type','application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
  } else {
    callback(req, res);
  }
}

exports.createToken = functions.https.onRequest((req, res) => {
  validateRequestMethod(req, res, createToken);
});

exports.callResource = functions.https.onRequest((req, res) => {
  validateRequestMethod(req, res, callResource);
});

exports.sendFlamingoReport = functions.https.onRequest((req, res) => {
  validateRequestMethod(req, res, sendFlamingoReport);
});
