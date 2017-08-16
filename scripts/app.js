$(document).ready(function() {
  function minuteTotal(time) {
    var date = new Date(time * 1000);
    return (date.getHours() * 60) + date.getMinutes();
  }

  function capitalize(str) {
    var words = str.split(' ');
    words = words.map(function(word) {
      let letters = word.split('');
      letters[0] = letters[0].toUpperCase();
      return letters.join('');
    });

    return words.join(' ');
  }

  function getMonth(idx){
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

    return months[idx];
  }
  function getDateAsOf(dt) {
    var date = new Date(dt * 1000);
    return getMonth(date.getMonth()) + ' ' + date.getDate() + ', ' +
    date.getFullYear() + ' - ' + getTimeString(dt);
  }

  function setBackground(dt, sunrise, sunset) {
    var curr = minuteTotal(dt);
    var rise = minuteTotal(sunrise);
    var set = minuteTotal(sunset);

    console.log(curr, rise, set);
    console.log(dt, sunrise, sunset);
    if (curr >= rise && curr < set) {
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

  function getTimeString(time) {
    var date = new Date(time * 1000);
    var hour = date.getHours();
    var minute = date.getMinutes();

    if (minute < 10) {
      minute = '0' + minute;
    }

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
      var wind = Math.round(json.wind.speed * 1.15078);
      var vis = Math.round(json.visibility * 0.000621371);
      var humidity = json.main.humidity;
      var sunrise = getTimeString(json.sys.sunrise);
      var sunset = getTimeString(json.sys.sunset)
      var location = json.name + ', ' + json.sys.country;
      var description = capitalize(json.weather[0]['description']);
      var iconURL = json.weather[0].icon;
      var rain = getPrecipitation(json.rain);

      setBackground(json.dt, json.sys.sunrise, json.sys.sunset);
      displayTemps();
      $('#loading').hide();
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
    .fail(function(err) {
      console.log(err);
      $('#loading').hide();
      $('#fail').show();
    });
  }

  var baseURL = 'https://fcc-weather-api.glitch.me/api/current?';
  var unit = 'C';
  var hide = true;
  var temp;
  var high;
  var low;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      getWeather(pos.coords.latitude, pos.coords.longitude);
    }, function (err) {
      console.log(err);
      $('#loading').hide();
      $('#fail').show();
    });
  } else {
    $('#loading').hide();
    console.log('fail')
    $('#fail').show();
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
