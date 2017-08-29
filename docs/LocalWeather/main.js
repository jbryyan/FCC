var url = "https://fcc-weather-api.glitch.me/api/current?lat=";//lat=35&lon=139";
console.log(typeof(url));
var xhr = new XMLHttpRequest();
var x = document.getElementById("location");
var lon, lat;

//Function used to get latitude/longitude with geolocation
function getLocation(){

  function success(position){
    lon = position.coords.longitude;
    lat = position.coords.latitude;
    //With updated long/lat values, grab weather API data.
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
    document.getElementById("temp").innerHTML = apiData.main.temp + "Temperature";
  }
  xhr.send();
}

//First thing that should be done is get long/lat with html5 geolocation
getLocation();
