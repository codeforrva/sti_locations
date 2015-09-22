require('dotenv').load();
var ACCOUNT_SID = process.env.TW_ACCOUNT_SID;
var AUTH_TOKEN  = process.env.TW_AUTH_TOKEN;
var twilio      = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
var async       = require('async');
var request     = require('request');
var fs          = require('fs');
var geolib      = require('geolib');

module.exports = {
  validate_zip: function(req, res, next){
    var zip, toPhone;
    if(req.body && Object.keys(req.body).length > 0){
      zip = req.body.Body;
      toPhone = req.body.From;
    } else{
      zip = req.query.zip;
      toPhone = process.env.TEST_PHONE;
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
    var locations = JSON.parse(fs.readFileSync('./src/locations.json', 'utf8'));
    var coordinates = [];
    locations.locations.forEach(function(loc){
      coordinates.push(loc.coordinates);
    });
    var params = {
      url: "http://maps.googleapis.com/maps/api/geocode/json",
      qs: {
        address: req.zip
      }
    };
    request(params, function(err, response, body){
      if (!err && response.statusCode == 200) {
        var zip_query = JSON.parse(body);
        if(zip_query.status == "OK"){
          var result = zip_query.results[0];
          var zip_lat = result.geometry.location.lat;
          var zip_lng = result.geometry.location.lng;
          var closest = geolib.orderByDistance({latitude: zip_lat, longitude: zip_lng}, coordinates);
          var final_locations = [];
          for (var i = 0; i < 3; i++) {
            var location = locations.locations[closest[i].key];
            location.distance = closest[i].distance;
            final_locations.push(location);
          }
          res.locations = final_locations;
          next();
        }
      } else{
         send('noResults', req.toPhone, {zip: req.zip});
      }
    });
  },
  send_locations: function(req, res, next){
    if(res.locations){
      res.locations.forEach(function(location){
          send('location', req.toPhone, {location: location});
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
      body = location.name + ': \n' + location.address.street + ', ' + location.address.city + ', ' + location.address.state + ' ' + location.address.zip +  '\n';
      body += 'hours: ' + location.hours + '\n';
      body += 'phone: ' + location.phone;
    break;
  }
  twilio.sendMessage({
    to: toPhone,
    from: '+18043085060',
    body: body
  }, function(err, responseData){
    if (!err) { // "err" is an error received during the request, if any
    }
  });
}
