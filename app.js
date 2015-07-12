var ACCOUNT_SID = 'ACaf0232e2832b0cbe15d9c74fc812cf7e';
var AUTH_TOKEN = '8b9c7db15691ed32283ccb89acc7ac99';
var twilio = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
var twilio_response = require('twilio');
var resp = new twilio_response.TwimlResponse();
var express = require('express');
var app = express();

app.get('/', function (req, res){
  twilio.sendMessage({
    to: '+17174870605',
    from: '+1804298-7609',
    body: 'Test Message from node!'
  }, function(err, responseData){
    if (!err) { // "err" is an error received during the request, if any
      console.log(responseData.from); // outputs "+14506667788"
      console.log(responseData.body); // outputs "word to your mother."
    }
  });
});

app.post('/', function (req, res){
});

var server = app.listen(process.env.port || 3000, function () {
  console.log('Code For RVA STI SMS App Started!');
});
