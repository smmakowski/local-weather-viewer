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

  function getDateAsOf(dt) {
    var date = new Date(dt * 1000);
    return 'as of ' + date.toUTCString();
  }

  // check to see how this function behaves in the morning
  function setBackground(dt, sunrise, sunset) {
    console.log(dt, sunrise, sunset);
    if (dt > sunrise && dt < sunset) {
      console.log('DAYTIME!')
      $('body').css('background-image', 'url("http://leominsterchiropractic.com/blog/wp-content/uploads/2015/11/Sun-In-The-Sky-Wallpapersgood.jpg"');
    } else {
      $('body').css('background-image', 'url("http://goldwallpapers.com/uploads/posts/night-time-backgrounds/night_time_backgrounds_023.jpg"');
    }
  }

  function findWindDirection(deg) {
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

  function getTime(time) {
    var date = new Date(time * 1000);
    var hour = date.getHours();
    var minute = date.getMinutes();

    if (hour >= 12) {
      if (hour > 12) {
        hour -= 12;
      }
      return hour + ':' + minute + 'pm';
    } else {
      if (hour === 0) {
        hour = 12;
      }
      return hour + ':' + minute + 'am';
    }
  }

  function getPrecipitation(rainObj){
    if (rainObj) {
      return Math.floor(rainObj['3r'] * 100) + '%';
    }
    return '0%';
  }

  function displayTemps() {
    $('#temp').text(Math.round(temp));
    $('#high').text(Math.round(high));
    $('#low').text(Math.round(low));
    $('.deg').text(unit);
  }
  function cToF(temp) {
    return temp * (9 / 5) + 32;
  }
  function fToC(temp) {
    return (temp - 32) * (5/9);
  }

  function toggleTemp() {
    if (unit === 'C') {
      temp = cToF(temp);
      high = cToF(high);
      low = cToF(low);
      unit = 'F';
      $('#convert').text('°C');
      displayTemps();
    } else {
      temp = fToC(temp);
      high = fToC(high);
      low = fToC(low);
      unit = 'C';
      $('#convert').text('°F');
      displayTemps();
    }


  }

  function getWeather(lat, lon) {
    $.getJSON(baseURL + 'lat=' + lat + '&lon=' + lon)
     .done(function(json) {
      console.log(json);
      temp = json.main.temp;
      high = json.main.temp_max;
      low = json.main.temp_min;
      var wind = Math.floor(json.wind.speed * 1.15078); // originally in knots!
      var vis = Math.floor(json.visibility * 0.000621371); // orginally in meters?
      var humidity = json.main.humidity;
      var sunrise = getTime(json.sys.sunrise);
      var sunset = getTime(json.sys.sunset)
      var location = json.name + ', ' + json.sys.country;
      var description = capitalize(json.weather[0]['description']);
      var iconURL = json.weather[0].icon;
      var rain = getPrecipitation(json.rain);

      setBackground(json.dt, json.sys.sunrise, json.sys.sunset);
      displayTemps();
      $('#loading').fadeOut();
      $('#location').text(location);
      $("#icon").attr('src', iconURL);

      $('#description').text(description);
      $('#wind').text(wind + 'mph ' + findWindDirection(json.wind.deg));
      $('#set').text(sunset);
      $('#rise').text(sunrise);
      $('#hum').text(humidity + '%');
      $('#dt').text(getDateAsOf(json.dt));
      $('#vis').text(vis + 'mi');

      $('#info').fadeIn(1000);
      $('#rain').text(rain);
    })
    .fail(function() {
      $('#loading').hide();
      $('#fail').show();
    });
  }

  // variables that may change due to conversion
  var baseURL = 'https://fcc-weather-api.glitch.me/api/current?';
  var unit = 'C' // init a I (for imperial) M (for metrix);
  var hide = true;
  var temp;
  var high;
  var low;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      getWeather(pos.coords.latitude, pos.coords.longitude);
    }, function (err) {
      // if geolocation has an error
      alert('There seems to have been a problem with finding your current location.' +
      ' It is possible that that there was an error finding your coordinates, or you ' +
      'may have selected "block", when prompted.' +
      ' For the purpose of demonstration, Weather information for a default location will be acquired');
      getWeather(37.3382, -121.8863);
    });
  } else {
     // if geolocation not supported
     alert('There seems to have been a problem with finding your current location.' +
     ' It is possible your browser does not support HTML5 geolocation.' +
     ' For the purpose of demonstration, Weather information for a default location will be acquired');
     getWeather(37.3382, -121.8863);
  }

  $('#convert').on('click', function() {
    toggleTemp();
  });

  $('#hide').on('click', function() {
      $('#other').slideToggle();
      if (hide === true) {
        $('#hide').text('Hide Additional Info');
        $('#hide').removeClass('btn-success');
        $('#hide').addClass('btn-danger');
        hide = false;
      } else {
        $('#hide').text('Show Additional Info');
        $('#hide').removeClass('btn-danger');
        $('#hide').addClass('btn-success');
        hide = true;
      }

  });
});
