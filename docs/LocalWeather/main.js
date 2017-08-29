//Note the use of two API's used in this file.
//The reason for this is to practice working with different API's.

var url = "https://fcc-weather-api.glitch.me/api/current?lat=";
console.log(typeof(url));
var xhr = new XMLHttpRequest();

var x = document.getElementById("location");
var lon, lat;


//Displays city location using google geocode API
function displayLocation(latitude, longitude){
  var request = new XMLHttpRequest();
  var method = "GET";
  var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&sensor=true";
  var async = true;

  request.open(method, url, async);
  request.onload = function(){
    if(request.readyState == 4 && request.status == 200){
      var addrData = JSON.parse(request.responseText);
      var cityName = addrData.results[0].address_components[2].long_name;
      console.log(cityName);
      document.getElementById("location").innerHTML = cityName;
    }
  };
  request.send();
}



//Function used to get latitude/longitude with geolocation
function getLocation(){

  function success(position){
    lon = position.coords.longitude;
    lat = position.coords.latitude;
    //Update HTML with current user city using Google geocode map API
    displayLocation(lat, lon);
    //With updated long/lat values, grab weather API data using FCC Weather API
    getWeather();
  }

  function failure(position){
    alert("Use Zip Code");
  }

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(success, failure);
  }
}

//Function used to load weather API data and change appropriate values in index.html
function getWeather(){
  xhr.open("GET", url + lat + "&lon=" + lon, true);
  //When finished loading data, parse the data then change temperature in index.html to appropriate value
  xhr.onload = function(){
    var apiData = JSON.parse(xhr.responseText);
    console.log(apiData);
    //document.getElementById("location").innerHTML = apiData.main.
    document.getElementById("temp").innerHTML = apiData.main.temp + "&deg; C";
    document.getElementById("status").innerHTML = apiData.weather[0].main;
    //var elem = document.createElement("img");
    //elem.setAttribute("src", apiData.weather[0].icon);
    //document.getElementById("imgPlace").appendChild(elem);
  };
  xhr.send();
}

//Grab lat/long using HTML5 geolocation.
getLocation();
