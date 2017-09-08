
var num = 0;  //Used for div id's when creating/destroying divs.
var defaultName = "summit1g"; //Default streamer that is shown upon loading the page.
var defaultValue = 0; //Used to distinguish default streamer values or not in functions.

//Function used to check if streamer exists on TwitchTV
//The "users" twitch tv endpoint will return valid values if user exists.
function searchTwitch(){
  var streamer = document.getElementById("inputBox");
  var xhr = new XMLHttpRequest;
  var method = "GET";
  var url = "https://wind-bow.glitch.me/twitch-api/users/" + streamer.value;
  var async = true;

  xhr.open(method, url, async);
  xhr.onload = function(){
    var data = JSON.parse(xhr.responseText);
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

//Will hide divs that the user did not search for.
function searchStreamer(){
  var streamerName = document.getElementById("inputBar").value;
  var mainDiv = document.getElementById("mainContainer");
  var myAnchors = mainDiv.getElementsByTagName("a");

  var index;  //Used to store index of streamer, if found.

  //Looping through anchors on page to search for the streamer name.
  for(var i = 0; i < myAnchors.length; i++){
    //Searching the inner html text for streamer.
    if(myAnchors[i].innerHTML == streamerName){
      index = i;  //Storing index of streamer in index.
      break;
    }
  }
  //If streamer exists on list, hide the others but the streamer.
  //Else, nothing happens. Alert user.
  if(index){
    //Grabbing every element with class name "wrapper"
    var wrappers = document.getElementsByClassName("wrapper");
    //Looping through each wrapper element and checking
    //Against index of streamer found
    for(var i = 0; i < wrappers.length; i++){
      if(i != index){
        wrappers[i].style.display = "none"; //Hides streamer from list.
      }
    }
    //Uncheck all radio button to display all again once clicked.
    document.getElementById("allRadio").checked = false;
  }else{
    alert("Not on list. Try adding them.");
  }
  //Clear Search Field
  document.getElementById("inputBar").value = "";
}
//This function is solely used to search streamers that are submitted by the user.
function getJSON2(streamer){
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

        //If valid, continue to change HTML with response
        //Else, user is offline.
        if(streamData.stream){
          num++;
          if(num > 0){
            document.getElementById("searchBar").style.display = "block";
          }
          defaultValue = 0;
          createDivs(streamData, "streams");
        }else {
          num++;
          if(num > 0){
            document.getElementById("searchBar").style.display = "block";
          }
          defaultValue = 0;
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
  if(num < 1){
    document.getElementById("searchBar").style.display = "none";
  }
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
  if(endPoint == "channels"){
    document.getElementById("wrapper0").style.backgroundColor = "grey";
  }else{
    document.getElementById("wrapper0").style.backgroundColor = "#dff0d8";
  }

  //Appends streamer logo.
  var a = document.createElement("a");
  var linkContainer = document.getElementById("titleContainer0");

  a.href = url;
  a.target = "_blank";
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
  eventListener();
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

  //Overall hierarchy:
  //Wrapper[Main Container[Sub Container, Sub container, Sub container, Sub container],
  //Video[sub, sub]]

  /*Main container along with container cells*/
  var divMain = document.getElementById("mainContainer");
  var wrapper = document.createElement("div");
  var divContainer = document.createElement("div");
  var divImg = document.createElement("div");
  var divTitle = document.createElement("div");
  var divDesc = document.createElement("div");
  var divExit = document.createElement("div");
  var divVideo= document.createElement("div");

  /*Individual elements in each container*/
  var image = document.createElement("img");
  var anchor = document.createElement("a");
  var para = document.createElement("p");
  var btn = document.createElement("button");
  var caret = document.createElement("i");

  /*Nested div class names and id's*/
  divContainer.className = "streamContainer streamMod";
  divContainer.id = "divCont" + num;
  wrapper.className = "wrapper";
  wrapper.id = "wrapper" + num;

  if(endPoint == "channels"){
    wrapper.style.backgroundColor = "grey"; //Offline

  }else{
    wrapper.style.backgroundColor = "#dff0d8"; //Online

  }

  //Adding image div info.
  divImg.className = "imageContainer tableMod";
  divImg.id = "imgContainer" + num;
  //Adding title div info.
  divTitle.className = "titleContainer tableMod";
  divTitle.id = "titleContainer" + num;
  //Adding status div info
  divDesc.className = "descContainer tableMod";
  divExit.className = "exitDiv";
  //Adding exit button div info
  btn.className = "exitBtn";
  btn.id= "btn" + num;
  //Adding video div info
  divVideo.className = "videoContainer";
  divVideo.id = "showVideo" + num;

  /*Nested element classes and id's*/
  image.className = "image";
  image.id = "img" + num;
  anchor.id = "title" + num;
  para.className = "text";
  para.id = "desc" + num;
  caret.className = "fa fa-caret-down fa-lg aria-hidden='true'";
  caret.id = "caret" + num;

  //Appending appropriate image for null logo response.
  if(logo === null){
    image.src = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";
  }else{
    image.src = logo;
  }

  /*Adding values to the most inner elements*/
  anchor.href = url;     //Appending href="streamer url"
  anchor.innerHTML = title;
  anchor.target = "_blank";
  para.innerHTML = status;
  btn.innerHTML = "x";

  //Putting it all together.
  divMain.appendChild(wrapper);
  wrapper.appendChild(divContainer);
  wrapper.appendChild(divVideo);
  divContainer.appendChild(divImg);
  divImg.appendChild(image);
  divContainer.appendChild(divTitle);
  divTitle.appendChild(anchor);
  divContainer.appendChild(divDesc);
  divDesc.appendChild(para);
  divContainer.appendChild(divExit);
  divExit.appendChild(btn);
  divVideo.appendChild(caret);
  document.getElementById("inputBox").value = "";
}

function showVideo(parentId){
  var numID = parentId.match(/\d+/)[0];
  var divVideo = document.getElementById(parentId);
  //var titleDiv = document.getElementById("title" + num);
  var divTitle = "title" + numID;
  var twitchUser = document.getElementById(divTitle).innerHTML;
  var url = "http://player.twitch.tv/?channel=" + twitchUser + "&muted=true&autoplay=false";
  var iFrame = document.createElement("iframe");
  iFrame.style.display = "block";
  iFrame.style.width = "100%";
  iFrame.src = url;
  iFrame.height = "500";
  iFrame.width = document.getElementById("mainContainer").clientWidth;
  iFrame.frameborder = "0"
  iFrame.scrolling = "no";
  iFrame.allowfullscreen = "true";
  iFrame.id = "iframe" + numID;
  iFrame.backgroundColor = "white;"
  divVideo.appendChild(iFrame);
  //After appending the video, turn the carrot upwards.
  document.getElementById("caret" + parentId.match(/\d+/)[0]).className = ("fa fa-caret-up fa-lg aria-hidden='true'");
}

function deleteVideo(iframe){
  document.getElementById(iframe).remove();
  var numID = iframe.match(/\d+/)[0];
  document.getElementById("caret" + numID).className = ("fa fa-caret-down fa-lg aria-hidden='true'");

}

//Used to change the HTML page layout upon pressing a radio button.
function changeLayout(){
  //Checking to see what radio button was pressed
  var buttonClicked = document.querySelector('input[name="rad"]:checked').value;
  //Online, offline or all buttons were clicked. Appropriate functions called.
  if(buttonClicked == "Online"){
    onlineRadio("Online");
  }
  else if(buttonClicked == "Offline"){
    offlineRadio("Offline");
  }else if(buttonClicked == "All"){
    allRadio("All");
  }
}

function eventListener(){
  //Event delegation for onclick div elements.
  document.getElementById("mainContainer").addEventListener("click", function(e) {
    //Used for exit out buttons on the streamer divs.
    if(e.target && e.target.matches("button.exitBtn") ){
      //Variable used to delete div container pertaining to button clicked.
      var parentDiv = e.target.parentNode.parentNode.parentNode.id;
      //Deleting parent div on clicking the x button.
      deleteDiv(parentDiv);
    }
    //Used to expand and show the streamer live stream on the page itself.
    else if(e.target && e.target.matches("i.fa-caret-down") ){
      //Variable used to determined video element to show appropriate streamer.
      var parentId = e.target.parentNode.id;
      //Appending video to page.
      showVideo(parentId);
    }
    else if(e.target && e.target.matches("i.fa-caret-up") ) {
      var caret = e.target.id;
      var iframe = "iframe" + caret.match(/\d+/)[0];

      deleteVideo(iframe);
    }

  });
}

//deleteDiv() deletes the streamer container when the x button is clicked
//x button is located on upper right corner of every streamer container.
function deleteDiv(id){
  //Checks to see if the number of streamers shown is greater than one.
  //If it is, the search bar will appear.
  if(num < 1){
    document.getElementById("searchBar").style.display = "none";
  }
  num--;
  document.getElementById(id).remove();
}

//Following radios: show all streamers, show only online, show only offline.
function allRadio(){
  //Will loop through all streamer containers and display.
  var wrappers = document.getElementsByClassName("wrapper");
  for(var i = 0; i < wrappers.length; i++){
    wrappers[i].style.display = "table";
  }
}
//Show only online streamers.
function onlineRadio(){
  var mainDiv = document.getElementById("mainContainer")
  var myParagraphs = mainDiv.getElementsByTagName("p");
  //Will loop through myParagraphs array and will hide parent containers that are "Offline".
  for(var i = 0; i < myParagraphs.length; i++){
    if(myParagraphs[i].innerHTML == "Offline"){
      myParagraphs[i].parentNode.parentNode.parentNode.style.display = "none";
    }
    else if(myParagraphs[i].innerHTML != "Offline" && myParagraphs[i].parentNode.parentNode.parentNode.style.display == "none"){
      myParagraphs[i].parentNode.parentNode.parentNode.style.display = "table";
    }
  }
}
//Show only offline streamers.
function offlineRadio(){
  var mainDiv = document.getElementById("mainContainer");
  var myParagraphs = mainDiv.getElementsByTagName("p");
  //Will loop through myParagraphs and hide parent containers that are "Online".
  for(var i = 0; i < myParagraphs.length; i++){
    if(myParagraphs[i].innerHTML != "Offline"){
      myParagraphs[i].parentNode.parentNode.parentNode.style.display = "none";
    }
    else if(myParagraphs[i].innerHTML == "Offline" && myParagraphs[i].parentNode.parentNode.parentNode.style.display == "none"){
      myParagraphs[i].parentNode.parentNode.parentNode.style.display = "table";
    }
  }
}


window.onload = function(){
  defaultJSON();
}
