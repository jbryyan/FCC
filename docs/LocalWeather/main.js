var url = "https://fcc-weather-api.glitch.me/api/current?lat=";//lat=35&lon=139";
console.log(typeof(url));
var xhr = new XMLHttpRequest();
var x = document.getElementById("location");
var lon, lat;


function getLocation(){

  function success(position){
    console.log(position);
    typeof(position.coords.latitude);
    lon = position.coords.longitude;
    lat = position.coords.latitude;
    //url = url + lat + lon;
    console.log("In getLocation, the url is: " + url);
    getWeather();
  }

  function failure(position){
    alert("Use Zip Code");
  }

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(success, failure);
  }

}

function getWeather(){
  console.log(url);
  xhr.open("GET", url + lat + "&lon=" + lon, true);
  console.log(url);
  xhr.onload = function(){
    console.log("In onload function");
    console.log(xhr.responseText);
    var apiData = JSON.parse(xhr.responseText);
    console.log(apiData.main.temp);
    document.getElementById("temp").innerHTML = apiData.main.temp + "Temperature";
  }
  xhr.send();
}

console.log(url);
getLocation();
