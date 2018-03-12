// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const createToken = require("./createToken");
const sendFlamingoReport = require("./sendFlamingoReport");
const updateToken = require("./updateToken");
const trackCalendlyEvent = require('./trackCalendlyEvent');

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

exports.sendFlamingoReport = functions.https.onRequest((req, res) => {
  validateRequestMethod(req, res, sendFlamingoReport);
});

exports.updateToken = functions.https.onRequest((req, res) => {
  validateRequestMethod(req, res, updateToken);
});

exports.trackCalendlyEvent = functions.https.onRequest((req, res) => {
  validateRequestMethod(req, res, trackCalendlyEvent);
});
