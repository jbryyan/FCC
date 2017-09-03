//Note the use of two API's used in this file.
//The reason for this is to practice working with different API's.

var url = "https://fcc-weather-api.glitch.me/api/current?lat=";

var xhr = new XMLHttpRequest();

var x = document.getElementById("location");
var lon, lat;
var zipCode;

//Displays city location using google geocode API
function displayLocation(latitude, longitude){
  var request = new XMLHttpRequest();
  var method = "GET";
  var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&sensor=true";
  var async = true;

  request.open(method, url, async);
  request.onload = function(){
    if(request.readyState == 4 && request.status == 200){
      var addrData = JSON.parse(request.responseText);
      var cityName = addrData.results[0].address_components[2].long_name;
      document.getElementById("location").innerHTML = cityName;
    }
    else{
      alert("Request failed. Returned status of: " + request.status);
    }
  };
  request.send();
}

//Geocodes city name with zip code. Wrote seperate function to see functionality.
//Could have implemented within the top function that uses lat/lng values.
function zipCodeLoc(){
  var inputData = document.getElementById("zipInput").value;
  var request = new XMLHttpRequest();
  var method = "GET";
  var async = true;

  if(inputData == ""){
    alert("Enter a valid zip code or city");
    return;
  }
  //Checking to see if zip code was entered.
  if(/^\d+$/.test(inputData)){
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=high+st+hasting&components=postal_code:" + inputData;
    //Following code is used to request location from google API
    request.open(method, url, async);
    request.onload = function(){
      if(request.readyState == 4 && request.status == 200){
        var zipData = JSON.parse(request.responseText);
        var cityName = zipData.results[0].address_components[1].long_name;
        lat = zipData.results[0].geometry.location.lat;
        lon = zipData.results[0].geometry.location.lng;
        document.getElementById("location").innerHTML = cityName;
        getDateTime();
      }
      else{
        alert("Could not find city.");
        return;
      }
    };
    request.send();
  }
  else{
    //City name was entered.
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + inputData;
    request.open(method, url, async);
    request.onload = function(){
      if(request.readyState == 4 && request.status == 200){
        var cityData = JSON.parse(request.responseText);
        if(cityData.status === "ZERO_RESULTS"){
          alert("Enter valid city");
          return;
        }
        else{
          var cityName = cityData.results[0].address_components[0].long_name;
          lat = cityData.results[0].geometry.location.lat;
          lon = cityData.results[0].geometry.location.lng;
          document.getElementById("location").innerHTML = cityName;
          getDateTime();
        }
      }
      else{
        alert("Could not find city.")
      }
    };
    request.send();
  }
  document.getElementById("zipInput").value="";

}

//Function used to get latitude/longitude with geolocation
function getLocation(){
  function success(position){
    lon = position.coords.longitude;
    lat = position.coords.latitude;
    //Update HTML with current user city using Google geocode map API
    displayLocation(lat, lon);
    //With updated long/lat values, grab weather API data using FCC Weather API
    getDateTime();
    //getWeather();
  }

  function failure(position){
    return;
  }

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(success, failure);
  }
}

//Using Google Timezone API to get city date and time
function getDateTime(){
  var targetDate = new Date();  //Current date/time of user
  var timeStamp = targetDate.getTime()/1000 + targetDate.getTimezoneOffset() * 60; //Current UTC date/time
  var url = "https://maps.googleapis.com/maps/api/timezone/json?location="+ lat + "," + lon + "&timestamp=" + timeStamp;

  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function(){
    if(xhr.status === 200){
      var timeZoneData = JSON.parse(xhr.responseText);
      if (timeZoneData.status == "OK"){
        var offsets = timeZoneData.dstOffset * 1000 + timeZoneData.rawOffset * 1000;
        var localDate = new Date(timeStamp * 1000 + offsets);
        document.getElementById("localTime").innerHTML = localDate.toLocaleString();
        getWeather(localDate.toLocaleString());

      }
    }
    else{
      alert("Request failed. Returned status of" + xhr.status);
    }
  };
  xhr.send();
}

//Function used to load weather API data and change appropriate values in index.html
function getWeather(localTime){
  //*** Getting time of day, whether AM or PM, along with the hour
  var dayNight, timeHour;
  dayNight = localTime.substr(localTime.length - 2, localTime.length - 1);  //Gives either AM or PM
  timeHour = localTime.substr(0, localTime.indexOf(":"));
  timeHour = timeHour.substr(timeHour.indexOf(",") + 1);

  //*** Opening google API ***//
  xhr.open("GET", url + lat + "&lon=" + lon, true);

  //When finished loading data, parse the data then change temperature in index.html to appropriate value
  xhr.onload = function(){
    if(xhr.status == 200){
      var apiData = JSON.parse(xhr.responseText);
      var body = document.getElementsByTagName('body')[0];
      var weatherStatus = apiData.weather[0].main;

      //*** Updating webpage ***//
      //Updating status data
      document.getElementById("status").innerHTML = weatherStatus;
      //Updating temperature data
      document.getElementById("temp").innerHTML = apiData.main.temp;
      document.getElementById("convert").value = "\u00B0" + "C/" + "\u00B0" + "F";

      //*** Updating background image ***//
      if(weatherStatus == "Smoke"){
        document.body.style.backgroundImage = "url(https://res.cloudinary.com/dsusc7zii/image/upload/v1504388184/dominik-lange-41376_whmjsc.jpg)";
      }
      else if(weatherStatus == "Clouds"){
        document.body.style.backgroundImage = "url(https://res.cloudinary.com/dsusc7zii/image/upload/v1504392612/kristopher-kinsinger-29252_fod9fq.jpg)";
      }
      else if( ( (dayNight == "AM" && timeHour > 5) || (dayNight == "PM" && timeHour < 7) ) && weatherStatus == "Clear"){
        document.body.style.backgroundImage = "url(https://res.cloudinary.com/dsusc7zii/image/upload/v1504164867/rachel-lees-267186_x5wvvo.jpg)";
      }
      else if( ( (dayNight == "AM" && timeHour < 6) || (dayNight == "PM" && timeHour > 6) ) && weatherStatus == "Clear"){
        document.body.style.backgroundImage = "url(https://res.cloudinary.com/dsusc7zii/image/upload/v1504164866/sam-mcjunkin-38078_kfevhy.jpg)";
      }
      else if( weatherStatus == "Rain"){
        document.body.style.backgroundImage = "url(https://res.cloudinary.com/dsusc7zii/image/upload/v1504392615/veriret-248718_pgxv5f.jpg)";
      }
      else if( weatherStatus == "Thunderstorm"){
        document.body.style.backgroundImage = "url(https://res.cloudinary.com/dsusc7zii/image/upload/v1504323736/dominik-qn-45994_pn5ak5.jpg)";
      }
    }
    else{
      alert("Request failed. Returned status of" + xhr.status);
    }
  };
  xhr.send();
}

//Function used to convert from celsius -> fahrenheit and vice-versa.
function degConvert(){
  var currentNotation = document.getElementById("convert").value;
  var currentTemp = document.getElementById("temp").innerHTML;
  var fahrTemp, celsTemp;
  //If currently in celsius. Convert to fahrenheit.
  if(currentNotation == ("\u00B0" + "C/" + "\u00B0" + "F") ){
    fahrTemp = (currentTemp * (9/5) + 32).toFixed(2);
    document.getElementById("temp").innerHTML = fahrTemp;
    document.getElementById("convert").value = "\u00B0" + "F/" + "\u00B0" + "C";
  }else{
    //Else Convert to celsius.
    celsTemp = ((currentTemp - 32)/1.8).toFixed(2);
    document.getElementById("temp").innerHTML = celsTemp;
    document.getElementById("convert").value = "\u00B0" + "C/" + "\u00B0" + "F";
  }
}

//Grab lat/long using HTML5 geolocation.
getLocation();
