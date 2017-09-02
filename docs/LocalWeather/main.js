//Note the use of two API's used in this file.
//The reason for this is to practice working with different API's.

var url = "https://fcc-weather-api.glitch.me/api/current?lat=";

console.log(typeof(url));
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
      console.log(cityName);
      document.getElementById("location").innerHTML = cityName;
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
        var cityName = zipData.results[0].address_components[0].long_name;
        lat = zipData.results[0].geometry.location.lat;
        lon = zipData.results[0].geometry.location.lng;
        console.log(lat);
        document.getElementById("location").innerHTML = cityName;
        getWeather(lat, lon);
      }
      else{
        alert("Could not find city.")
      }
    };
  }else{
    //City name was entered.
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=Manula" + inputData;
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
          getWeather(lat, lon);
        }
      }
      else{
        alert("Could not find city.")
      }
    };

  }

  request.send();
  //Grabbing latitude and longitude using google geocode api
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
    getWeather();
  }

  function failure(position){
    return;
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
    //Variable used to determine time of day for proper background picture.
    var time = new Date();
    //Varibale to change background picture
    var body = document.getElementsByTagName('body')[0];
    //To determine current time
    var timeNow = time.getHours();
    var weatherStatus = apiData.weather[0].main;

    //*** Updating webpage ***//
    //Updating status data
    document.getElementById("status").innerHTML = weatherStatus;
    //Updating temperature data
    document.getElementById("temp").innerHTML = apiData.main.temp;
    document.getElementById("convert").value = "\u00B0" + "C/" + "\u00B0" + "F";

    //*** Upadting background image ***//
    //If night, and not raining. Set night background.
    if( (timeNow > 18 || timeNow < 6) && weatherStatus == "Clear"){
      body.style.backgroundImage = "url(https://res.cloudinary.com/dsusc7zii/image/upload/v1504164866/sam-mcjunkin-38078_kfevhy.jpg)";
      document.getElementById("header").style.color = "white";
    }

    //If not clear, regardless of time. Set cloudy background.
    if(weatherStatus != "Clear"){
      body.style.backgroundImage = "url(https://res.cloudinary.com/dsusc7zii/image/upload/v1504164873/dmitry-sytnik-25017_cwal0n.jpg)";
    }

  };
  xhr.send();
}

//Function used to convert from celsius -> fahrenheit and vice-versa.
//Github not showing correctly..
function degConvert(){
  var currentNotation = document.getElementById("convert").value;
  var currentTemp = document.getElementById("temp").innerHTML;
  var fahrTemp, celsTemp;
  //It's currently in celsius. Convert to fahrenheit.
  if(currentNotation == ("\u00B0" + "C/" + "\u00B0" + "F") ){
    fahrTemp = (currentTemp * (9/5) + 32).toFixed(2);
    document.getElementById("temp").innerHTML = fahrTemp;
    document.getElementById("convert").value = "\u00B0" + "F/" + "\u00B0" + "C";
  }else{
    //Convert to celsius.
    celsTemp = ((currentTemp - 32)/1.8).toFixed(2);
    document.getElementById("temp").innerHTML = celsTemp;
    document.getElementById("convert").value = "\u00B0" + "C/" + "\u00B0" + "F";
  }
}

//Grab lat/long using HTML5 geolocation.
getLocation();
