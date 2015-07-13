var ACCOUNT_SID = 'ACaf0232e2832b0cbe15d9c74fc812cf7e';
var AUTH_TOKEN = '8b9c7db15691ed32283ccb89acc7ac99';
var twilio = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sti = require('./src/sti');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/', sti.validate_zip, sti.get_locations, sti.send_locations);

app.post('/', sti.validate_zip, sti.get_locations, sti.send_locations);

var server = app.listen(process.env.PORT || 3000, function () {
  console.log('Code For RVA STI SMS App Started!');
});
