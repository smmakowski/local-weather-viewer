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

  function toggleTemp(fromNum, fromUnit) {
    if (fromUnit === 'M') {
      return fromUnit * (9/5) + 32;
    }
    return (fromUnit - 32) * (5/9);
  }

  function toggleSpeed(fromNum, fromUnit) {
    if ( fromUnit === 'M') {
      return;
    }
    return;
  }

  function getDateAsOf(dt) {
    var date = new Date(dt * 1000);
    return 'as of ' + date.toUTCString();
  }

  // check to see how this function behaves in the morning
  function setBackground(dt, sunrise, sunset) {
    console.log(dt, sunrise, sunset);
    if (dt > sunrise && dt < sunset) {
      console.log('DAYTIME!')
      // original source http://leominsterchiropractic.com/2015/11/11/understanding-vitamin-d/sun-in-the-sky-wallpapersgood/
      $('body').css('background-image', 'url("http://leominsterchiropractic.com/blog/wp-content/uploads/2015/11/Sun-In-The-Sky-Wallpapersgood.jpg"');
    } else {
      $('body').css('background-image', 'url("http://goldwallpapers.com/uploads/posts/night-time-backgrounds/night_time_backgrounds_023.jpg"');
    }
  }

  function findWindDirection(degree) {
    if (deg >= 337.5 && deg <= 22.5) {
      return 'N';
    } else if (deg <= 67.5) {
      return 'NE';
    } else if (deg <= 112.5) {
      return 'E';
    } else if (deg <= 157.5) {
      return'SE';
    } else if (deg <= 202.5) {
      return 'S';
    } else if (deg <= 247.5) {
      return 'SW';
    } else if (deg <= 292.5) {
      return 'W';
    } else {
      return 'NW';
    }
  }

  var currPos = {
    lat: 37.3382,
    lon: -121.8863,
  }
  // variables that may change due to conversion
  var units = 'M' // init a I (for imperial) M (for metrix);
  var temp;
  var high;
  var low;
  var wind;
  var rain;
  var vis;

  $('#info').hide();

  var baseURL = 'https://fcc-weather-api.glitch.me/api/current?';
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      currPos['lat'] = pos.coords.latitude;
      currPos['lon'] = pos.coords.longitude;
      $.getJSON(baseURL + 'lat=' + currPos.lat + '&lon=' + currPos.lon)
       .done(function(json) {
        console.log(json);
        temp = json.main.temp;
        high = json.main.temp_max;
        low = json.main.temp_min;
        wind = json.wind.speed * 1.60934; // originally in km/h?
        vis = json.visibility / 5024;
        var humidity = json.main.humidity;
        var sunrise = json.sys.temp_sunrise;
        var location = json.name + ', ' + json.sys.country;
        var description = capitalize(json.weather[0]['description']);
        var iconURL = json.weather[0].icon;

        setBackground(json.dt, json.sys.sunrise, json.sys.sunset);

        $('#location').text(location);
        $("#icon").attr('src', iconURL);
        $('#temp').text(temp);
        $('#high').text(high);
        $('#low').text(low);
        $('#description').text(description);
        $('#wind').text(Math.floor(wind));
        $('#deg').text(findWindDirection(json.wind.deg))
        $('#hum').text(humidity + '%')
        $('#dt').text(getDateAsOf(json.dt));
        $('#vis').text(vis.toString().slice(0))
        $('#loading').hide();
        $('#info').fadeIn(1000);
      })
      .fail(function() {
        console.log('FAILED');
      });
    });
  } else {
    // default to san jose lat/long and attempt API request
  }



});
