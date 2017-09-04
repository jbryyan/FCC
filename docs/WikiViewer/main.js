
function changeStyle(){
  //Variables used to change html element styles

  var wikiBox = document.getElementById("wikiBox");
  var searchInput = document.getElementById("searchInput");
  var searchButton = document.getElementById("searchButton");
  var randomButton = document.getElementById("randomButton");

  //Changing element styles. Will move landing page div up to the top of page.
  wikiBox.style.margin = 0;
  wikiBox.style.height = "85px";
  wikiBox.style.position = "fixed";

  //searchInput.style.height = (30/85)*100 + "%";  //30px / wikiBox.clientHeight
  searchInput.style.margin = 0;
  //searchButton.style.height = (35/85)*100 + "%"; //35px / wikiBox.clientHeight
  //randomButton.style.height = (35/85)*100 + "%";

/*
  var wikiBox = document.getElementById("wikiBox");
  var formBox = document.getElementById("formBox");

  wikiBox.style.margin = 0;
  wikiBox.style.height = "85px";
  wikiBox.style.position = "fixed";
  formBox.style.margin = "1222px;"*/

}

//Function resets page back to original landing page.
function resetStyle(){
  document.querySelector("#wikiBox").removeAttribute("style");
  document.getElementById("searchInput").removeAttribute("style");
  document.getElementById("searchButton").removeAttribute("style");
  document.getElementById("randomButton").removeAttribute("style");

  if(document.getElementById("wikiData")){
    document.getElementById("wikiData").remove();
  }
  document.getElementById("wikiScript").remove();
}

//Dynamically setting top margin for new div that will post wiki info to page.
function createDiv(){
    var newDiv = document.createElement("div");
    var topMargin;

    newDiv.id = "wikiData";
    newDiv.className = "wikiData";
    document.getElementsByTagName("body")[0].appendChild(newDiv);
    topMargin = document.getElementById("wikiBox").clientHeight;
    document.getElementById("wikiData").style.marginTop = topMargin + 20 +"px";
}

//Function used to populate wikiData with wikipedia results.
function populateDiv(t, c, l){
  var title = t;
  var content = c;
  var link = l;

  console.log(title);
  for(i = 0; i < title.length; i++){
    var wikiLink = document.createElement("a");
    var wikiPar = document.createElement("p");
    //Setting up link to the wiki article
    wikiLink.className = "searchLink";
    wikiLink.href = link[i];
    wikiLink.textContent = title[i];
    //Setting up the wiki info retrieved
    wikiPar.className = "searchInfo";
    wikiPar.textContent = content[i];
    document.getElementById("wikiData").appendChild(wikiLink);
    document.getElementById("wikiData").appendChild(wikiPar);
  }
}

//Function used to depopulate wikiData for the next search.
function depopulateDiv(){
  var parent = document.getElementById("wikiData");
  while (parent.firstChild){
    parent.removeChild(parent.firstChild);
  }
}

//Wiki API response
function readResponse(response){

  //Breaking up API response.
  var title = response[1];
  var content = response[2];
  var link = response[3];
  console.log(title);
  //Checking to see if API returned anything.
  if(title.length == 0){
    var wikiPar = document.createElement("p");
    wikiPar.className = "errorInfo";
    wikiPar.textContent = "Sorry, search term not found. Check spelling and try again."
    document.getElementById("wikiData").appendChild(wikiPar);
    return;
  }

  //Append new children only if in landing page else depopulate and populate with new search results.
  if(document.getElementById("wikiData").children.length == 0){
    populateDiv(title, content, link);
  }
  else{
    depopulateDiv();
    populateDiv(title, content, link);
  }

}

//When search button is clicked..
function searchWiki(){



  //If the div for the wiki info is not set, it means it's still in landing page.
  if(!document.getElementById("wikiData")){
    changeStyle();  //Move landing page div to the top.
    createDiv();  //Create a wikiData div to post the search results. Total of 10 results.
  }

  //Variables for api request
  //https://en.wikipedia.org/w/api.php?action=opensearch&search=api&limit=10&namespace=0&format=jsonfm
  var url = "https://en.wikipedia.org/w/api.php?";
  var format = "&format=json";
  var action = "&action=opensearch";
  var limit = "&limit=10"
  var search = "&search=" + document.getElementById("searchInput").value;
  var data = "&callback=readResponse";
  var src = "https://en.wikipedia.org/w/api.php?" + format + action + limit + search + data;

  //JSONP
  var script = document.createElement("SCRIPT");
  script.src = src;
  script.id = "wikiScript";
  document.body.appendChild(script);
}
