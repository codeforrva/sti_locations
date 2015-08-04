require('newrelic');
var ACCOUNT_SID = process.env.TW_ACCOUNT_SID;
var AUTH_TOKEN  = process.env.TW_AUTH_TOKEN;
var twilio = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sti = require('sti');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/', sti.validate_zip, sti.get_locations, sti.send_locations);

app.post('/', sti.validate_zip, sti.get_locations, sti.send_locations);

app.get('/locations', sti.get_locations);

var server = app.listen(process.env.PORT || 3000, function () {
  console.log('Code For RVA STI SMS App Started!');
});
