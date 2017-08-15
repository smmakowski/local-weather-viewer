$(document).ready(function() {
  var currPos = {
    lat: 37.3382,
    lon: -121.8863,
  }
  var baseURL = 'https://fcc-weather-api.glitch.me/api/current?';
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      currPos['lat'] = pos.coords.latitude;
      currPos['lon'] = pos.coords.longitude;
      $.getJSON(baseURL + 'lat=' + currPos.lat + '&lon=' + currPos.lon, function(json){
        console.log(json);
      });
    });


  }


});
