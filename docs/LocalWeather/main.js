//Note the use of two API's used in this file.
//The reason for this is to practice working with different API's.

var url = "https://fcc-weather-api.glitch.me/api/current?lat=";

console.log(typeof(url));
var xhr = new XMLHttpRequest();

var x = document.getElementById("location");
var lon, lat;
var zipCode;
var weatherIcon;

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
  var zipCodeNum = document.getElementById("zipInput").value;
  if(zipCodeNum == ""){
    alert("Enter a valid zip code");
    return;
  }
  var url = "https://maps.googleapis.com/maps/api/geocode/json?address=high+st+hasting&components=postal_code:" + zipCodeNum;
  var request = new XMLHttpRequest();
  var method = "GET";
  var async = true;
  request.open(method, url, async);
  request.onload = function(){
    if(request.readyState == 4 && request.status == 200){
      var zipData = JSON.parse(request.responseText);
      var cityName = zipData.results[0].address_components[1].long_name;
      lat = zipData.results[0].geometry.location.lat;
      lon = zipData.results[0].geometry.location.lng;
      console.log(lat);
      document.getElementById("location").innerHTML = cityName;
      getWeather(lat, lon);
    }
  };
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
    //document.getElementById("location").innerHTML = apiData.main.
    var src = document.getElementById("imgPlace");
    var time = new Date();
    var body = document.getElementsByTagName('body')[0];
    console.log(apiData);
    document.getElementById("temp").innerHTML = apiData.main.temp + "&deg; C";
    document.getElementById("status").innerHTML = apiData.weather[0].main;
    console.log(time.getHours());
    if(time.getHours() > 15){
      alert("It's night");
      body.style.backgroundImage = "url(https://res.cloudinary.com/dsusc7zii/image/upload/v1504164866/sam-mcjunkin-38078_kfevhy.jpg)"
      document.getElementById("header").style.color = "white";
    }


    if(document.getElementById("img")){
      if(apiData.weather[0].icon === undefined){
        alert("Returning");
        return;
      }else{
        document.getElementById("img").src = apiData.weather[0].icon;
      }
    }else{
      var img = document.createElement("img");
      img.src = apiData.weather[0].icon;
      src.appendChild(img);
    }
    //var src = document.getElementById("imgPlace");
    //var img = document.createElement("img");
    //console.log(apiData.weather[0]);
    //console.log(apiData.weather[0].icon);
    //img.src = apiData.weather[0].icon;
    //src.appendChild(img);
    //elem.setAttribute("src", apiData.weather[0].icon);
    //document.getElementById("imgPlace").appendChild(elem);
  };
  xhr.send();
}



//Grab lat/long using HTML5 geolocation.
getLocation();
