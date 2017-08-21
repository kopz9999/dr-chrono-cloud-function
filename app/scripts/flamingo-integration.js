(function (jQuery) {
  var doctorId = 101310;
  var redirectURL = 'https://ktcpartnership.com/ktcs-9-qualifying-questions/';
  var clientId = 'FZ1JJqoQpHcNuXI7PGt3PxMoeQU9ytomqL6QY5xr';
  var clientSecret = 'xQ0j1GX4AcLGy22LCjdI1fcjkEqvSazDAdaJN1vACSrq3QjNTiUCMcROO7vzJZGg8YiaDFsvp0XQtEua2mkBybrsfvnyKii0nQ1GtBW1194neFUjdZOJaDqs8PKg2rJG';
  var proxyUrl = "https://us-central1-dr-chrono.cloudfunctions.net/";
  var chronoClient = new DrChronoClient.Base(proxyUrl, {
    redirectUri: redirectURL,
    clientId: clientId,
    clientSecret: clientSecret,
    scopes: ['messages:write']
  });
  var inputMap = {
    "your-name": "Name",
    "treated-for-depression": "Are you currently being treated for depression?",
    "treated-for-PTSD": "Are you currently being treated for PTSD?",
    "treated-for-OCD": "Are you currently being treated for OCD?",
    "treated-for-Anxiety": "Are you currently being treated for Anxiety?",
    "treated-for-Bipolar_Disorder": "Are you currently being treated for Bipolar Disorder?",
    "treated-for-Pain": "Are you currently being treated for Pain?",
    "treated-for-Alcohol_or_substance_abuse": "Are you currently being treated for Alcohol or substance abuse?",
    "other-then-marijuana-or-abuse-prescribed-medication": "Do you currently use any drugs other than marijuana or abuse prescribed medication?",
    "two-weeks-with-no-alchohol": "Please answer yes or no whether you are able to go at least 2 weeks without having any alcohol and without being shaky or uncomfortable because of that?",
    "treated-for-condition-with-medication": "Are you now or have you previously been treated with medication for any of the conditions you answered yes to in the previous question?",
    "on-benzodiazepines-or-amphetamines": "If yes, are you on benzodiazepines or amphetamines?",
    "care-of-psychiatrist-or-therapist": "Are you currently under the care of a psychiatrist? A therapist?",
    "primary-care-prescribing-psychiatric-medication": "If the answer to both of the above is \"no\"... Do you have a primary care physician who prescribes psychiatric medication for you?",
    "able-to-sign-release-of-information": "We require a confirmation from that provider that you are actively under their care. Are you able to sign a release of information so that we can verify that?",
    "have-diagnosis-of-schizophrenia-or-schizo-affective-disorder": "Do you have a diagnosis of schizophrenia or schizo-affective disorder?",
    "less-sleep-dont-miss-it": "Do you currently sleep much less than usual, but also don't miss it because you have so much energy?",
    "groceries-up-stairs": "Are you physically able to carry a bag of groceries up 2 flights of stairs?",
    "pregnant": "Are you pregnant right now?",
    "your-email": "Email"
  }

  function processForm(event) {
    var fileMatrix = [["Question", "Answer"]];
    var hashed = {};
    event.detail.inputs.forEach(function(pair) {
      hashed[pair.name] = pair.value;
      fileMatrix.push([inputMap[pair.name], pair.value]);
    });

    sendData(fileMatrix, hashed['your-email'])
  }

  function sendData(fileMatrix, name) {
    var data = {
      "access_token": chronoClient.currentToken.accessToken,
      "body": {
        "doctor": doctorId,
        "title": "KTC’s 9 - " + name
      },
      "file_matrix" : fileMatrix
    };
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://us-central1-dr-chrono.cloudfunctions.net/sendFlamingoReport",
      "method": "POST",
      "headers": {
        "content-type": "application/json",
      },
      "processData": false,
      "data": JSON.stringify(data)
    }

    jQuery.ajax(settings).done(function (response) {
      console.log(response);
    });
  }

  if (window.location.href.indexOf(redirectURL) >= 0) {
    chronoClient.authWorkflow().then(function() {
      document.addEventListener('wpcf7mailsent', processForm, false);
    });
  }
}(jQuery));
