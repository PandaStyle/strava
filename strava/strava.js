if (Meteor.isClient) {
    Meteor.startup(function () {




    });


  Template.hello.greeting = function () {
    return "Welcome to strava.";
  };

  function cb(err, respJson){
      if(err) {
          window.alert("Error: " + err.reason);
          console.log("error occured on receiving data on server. ", err );
      } else {
          console.log("respJson: ", respJson);

          var firstObjPolylineEncoded = respJson[0].map.summary_polyline.replace(/\\/g, '&#92;');

          var map = new L.Map('map');
          L.tileLayer(
              'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              {
                  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                  maxZoom: 18
              }
          ).addTo(map);

          var polyline = L.Polyline.fromEncoded(firstObjPolylineEncoded).addTo(map);

          map.fitBounds(polyline.getBounds());

      }
  }

  Template.hello.events({
    'click input':  function () {
        console.log("Recent strava data from stream!");

        Meteor.call('fetchFromService', cb);


    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {

      Meteor.methods({
          fetchFromService: function() {
                  var token = "9b0ee979bc8ac6624040c69edabec731a6249597";
                  var url = "https://www.strava.com/api/v3/activities/following";
                  //synchronous GET
                  var result = HTTP.get(url, {params: {access_token: token}});
                  console.log(result);
                  if(result.statusCode==200) {
                      var respJson = JSON.parse(result.content);
                      console.log("response received.");
                      return respJson;
                  } else {
                      console.log("Response issue: ", result.statusCode);
                      var errorJson = JSON.parse(result.content);
                      throw new Meteor.Error(result.statusCode, errorJson.error);
                  }
          }
      });



  });
}

