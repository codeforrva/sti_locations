var ACCOUNT_SID = 'ACaf0232e2832b0cbe15d9c74fc812cf7e';
var AUTH_TOKEN = '8b9c7db15691ed32283ccb89acc7ac99';
var twilio = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
var request = require('request');
var async = require('async');

module.exports = {
  validate_zip: function(req, res, next){
    var zip, toPhone;
    if(req.body){
      zip = req.body.Body;
      toPhone = req.body.From;
    } else{
      zip = req.query.zip;
      toPhone = "+17174870605";
    }
    if(/^\d{5}(-\d{4})?$/.test(zip)){
      req.zip = zip;
      req.toPhone = toPhone;
      next();
    } else {
      send('invalidZip', toPhone, {zip: zip});
      res.end();
    }
  },
  get_locations: function(req, res, next){
    var params = {
      url: 'https://locator.aids.gov/data',
      qs: {
        zip: req.zip,
        format: 'json',
        services: 'testing',
        distance: '10',
      }
    };
    request(params, function(err, response, body){
      if (!err && response.statusCode == 200) {
        var json_data = JSON.parse(body);
        res.locations = json_data.services[0].providers;
        next();
      } else{
        send('noResults', req.toPhone, {zip: req.zip});
      }
    });
  },
  send_locations: function(req, res, next){
      res.locations.reduce(function(previousValue, currentValue, index, array){
        if(index < 4){
          send('location', req.toPhone, {location: currentValue});
        }
      });
    }
    res.end();
  }
};

function send(type, toPhone, data){
  var body;
  switch (type) {
    case "invalidZip":
      body = "Sorry, " + data.zip + " is not a valid zip code. Please try again!";
      break;
    case "noResults":
      body = "Sorry, " + data.zip + " did not return any testing locations. Please try a different zip code";
      break;
    case "location":
      var location = data.location;
      body = location.title + ': ' + location.streetAddress + ', ' + location.locality + ', ' + location.region + ' ' + location.postalCode;
    break;
  }
  twilio.sendMessage({
    to: toPhone,
    from: '+18042987609',
    body: body
  }, function(err, responseData){
    if (!err) { // "err" is an error received during the request, if any
    }
  });
}
