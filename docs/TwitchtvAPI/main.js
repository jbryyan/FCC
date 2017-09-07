
var num = 0;  //Used for div id's when creating/destroying divs.
var defaultName = "summit1g"; //Default streamer that is shown upon loading the page.
var defaultValue = 0; //Used to distinguish default streamer values or not in functions.

//Function used to check if streamer exists on TwitchTV
//The "users" twitch tv endpoint will return valid values if user exists.
function searchTwitch(){
  console.log("In search function.");
  var streamer = document.getElementById("inputBox");
  var xhr = new XMLHttpRequest;
  var method = "GET";
  var url = "https://wind-bow.glitch.me/twitch-api/users/" + streamer.value;
  var async = true;

  xhr.open(method, url, async);
  xhr.onload = function(){
    var data = JSON.parse(xhr.responseText);
    console.log(data);
    if(data.status == "404" || data.status == "422"){
      alert("Streamer does not extist. Try another.")
      streamer.value = "";
      return;
    }
    else{
      getJSON2(streamer.value);
    }
  };
  xhr.send();

}

//This function is solely used to search streamers that are submitted by the user.
function getJSON2(streamer){
  console.log("In JSON2");
  var streamerName = streamer;
  var xhr = new XMLHttpRequest;
  var method = "GET"
  var url = "https://wind-bow.glitch.me/twitch-api/streams/" + streamerName;
  var async = true;

  xhr.open(method, url, async);
  xhr.onload = function(){

    if(xhr.readyState == 4 && xhr.status == 200 ){
        //Variable for API response.
        var streamData = JSON.parse(xhr.responseText);
        console.log(streamData);
        //If valid, continue to change HTML with response
        //Else, user is offline.
        if(streamData.stream){
          num++;
          defaultValue = 0;
          createDivs(streamData, "streams");
        }else {
          num++;
          defaultValue = 0;
          console.log(streamerName + "sr");
          offlineStreamer(streamerName);
        }
    }else{
      alert("API request error. Status: " + xhr.status);
    }
  };
  xhr.send();
}

//Runs on loading the page. JSON API call
function defaultJSON(){
  var xhr = new XMLHttpRequest;
  var method = "GET"
  var url = "https://wind-bow.glitch.me/twitch-api/streams/" + defaultName;
  var async = true;

  xhr.open(method, url, async);
  xhr.onload = function(){

    if(xhr.readyState == 4 && xhr.status == 200 ){
        //Variable for API response.
        var streamData = JSON.parse(xhr.responseText);
        //If valid, continue to change HTML with response
        //Else, check continue to offline
        if(streamData.stream){
          defaultStreamer(streamData);
        }else {
          defaultValue = 1;
          offlineStreamer("freecodecamp");
        }
    }else{
      alert("API request error. Status: " + xhr.status);
    }
  };
  xhr.send();
}

//Preloads freecodecamp stream. Used to test API.
function defaultStreamer(streamData, endPoint){
  if(endPoint == "channels"){
    var logo = streamData.logo;
    var title = streamData.display_name;
    var game = "Offline";
    var status = "";
    var url = streamData.url;
  }else{
    var data = streamData.stream.channel;
    var logo = data.logo;
    var title = data.display_name;
    var status = data.status
    var game = data.game + ": ";
    var url = data.url;
  }

  //Changed background color to online. (green)
  document.getElementById("preLoad").style.backgroundColor = "#3CB371";


  //Appends streamer logo.
  var a = document.createElement("a");
  var linkContainer = document.getElementById("titleContainer0");

  a.href = url;
  a.id = "title0";
  a.innerHTML = title;
  linkContainer.appendChild(a);

  //Appends streamer title/link
  var img = document.createElement("img");
  var imgContainer = document.getElementById("imgContainer0");
  img.src = logo;
  img.className = "image";
  img.id = "img0";
  imgContainer.appendChild(img);

  //Appends game playing and description status
  document.getElementById("desc0").innerHTML = game + status;
}

//This function uses the "channels" twitch tv endpoint. Correctly gives offline twitch tv user info.
function offlineStreamer(streamerName){
  var name = streamerName;
  var xhr = new XMLHttpRequest;
  var method = "GET"
  var url = "https://wind-bow.glitch.me/twitch-api/channels/" + name;
  var async = true;

  xhr.open(method, url, async);
  xhr.onload = function(){

    if(xhr.readyState == 4 && xhr.status == 200 ){
        //Variable for API response.
        var streamData = JSON.parse(xhr.responseText);
        if(defaultValue){
          defaultStreamer(streamData, "channels");
        }else{
          createDivs(streamData, "channels");
      }
    }
  };
  xhr.send();
}


//After grabbing the appropriate info from the API's.
//Use the information to update HTML page.
function createDivs(streamData, endPoint){
  //Checking to see if grabbing data from "channels" API or "streams" API.
  //"Channels API endpoint gives correct info for OFFLINE twitch tv user."
  //"Streams API endpoint gives correct info for LIVE twitch tv user."
  if(endPoint == "channels"){
    var data = streamData;
    var status = "Offline";
    var logo = data.logo;
  }else{
    var data = streamData.stream.channel;
    var logo = data.logo;
    var status = data.game + ": "+ data.status;
  }

  var url = data.url;
  var title = data.display_name;

  //Overall hierarchy: Main Container[Sub Container, Sub container, Sub container]
  /*Main container along with container cells*/
  var divMain = document.getElementById("mainContainer");
  var divContainer = document.createElement("div");
  var divImg = document.createElement("div");
  var divTitle = document.createElement("div");
  var divDesc = document.createElement("div");

  /*Individual elements in each container*/
  var image = document.createElement("img");
  var anchor = document.createElement("a");
  var para = document.createElement("p");

  /*Nested div class names and id's*/
  divContainer.className = "streamContainer streamMod";
  if(endPoint == "channels"){
    divContainer.style.backgroundColor = "#d3d3d3";
  }else{
    divContainer.style.backgroundColor = "#3CB371";
  }
  divImg.className = "imageContainer tableMod";
  divImg.id = "imgContainer" + num;
  divTitle.className = "titleContainer tableMod";
  divTitle.id = "titleContainer" + num;
  divDesc.className = "descContainer tableMod";

  /*Nested element classes and id's*/
  image.className = "image";
  image.id = "img" + num;
  anchor.id = "title" + num;
  para.className = "text";
  para.id = "desc" + num;

  //Appending appropriate image for null logo response.
  if(logo === null){
    image.src = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";
  }else{
    image.src = logo;
  }

  /*Adding values to the most inner elements*/
  anchor.href = url;     //Appending href="streamer url"
  anchor.innerHTML = title;
  para.innerHTML = status;

  //Putting it all together.
  divMain.appendChild(divContainer);
  divContainer.appendChild(divImg);
  divImg.appendChild(image);
  divContainer.appendChild(divTitle);
  divTitle.appendChild(anchor);
  divContainer.appendChild(divDesc);
  divDesc.appendChild(para);
}

//Used to change the HTML page layout upon pressing a radio button.
function changeLayout(){
  //Checking to see what radio button was pressed
  var buttonClicked = document.querySelector('input[name="rad"]:checked').value;
  if(buttonClicked == "Online"){
    alert("Online");
  }
  else if(buttonClicked == "Offline"){
    alert("Offline");
  }else{
    alert("All");
  }
}

defaultJSON();
