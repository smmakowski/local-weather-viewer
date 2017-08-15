$(document).ready(function() {
  function capitalize(str) {
    var words = str.split(' ');
    words = words.map(function(word) {
      let letters = word.split('');
      letters[0] = letters[0].toUpperCase();
      return letters.join('');
    });

    return words.join(' ');
  }

  function convertUnits(fromNum, fromUnit) {
    if (fromUnit === 'C') {
      return fromUnit * (9/5) + 32;
    }
    return (fromUnit - 32) * (5/9);
  }

  var currPos = {
    lat: 37.3382,
    lon: -121.8863,
  }
  var celcius = true;
  var temp;

  var baseURL = 'https://fcc-weather-api.glitch.me/api/current?';
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      currPos['lat'] = pos.coords.latitude;
      currPos['lon'] = pos.coords.longitude;
      $.getJSON(baseURL + 'lat=' + currPos.lat + '&lon=' + currPos.lon, function(json){
        console.log(json);
        var temp = json.main.temp;
        var high = json.main.temp_max;
        var low = json.main.temp_min;
        var humidity = json.temp_humidity;
        var sunrise = json.sys.temp_sunrise;
        var location = json.name + ', ' + json.sys.country;
        var description = capitalize(json.weather[0]['description']);
        console.log(location);
        var iconURL = json.weather[0].icon;
        $('#location').text(location);
        $("#icon").attr('src', iconURL);
        $('#temp').text(temp);
        $('#high').text(high);
        $('#low').text(low);
        $('#description').text(description);
      });
    });
  }


});
