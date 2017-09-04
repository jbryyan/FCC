
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
  randomButton.style.display = "inline-block";
  searchInput.style.height = (30/85)*100 + "%"; /* 25px / wikiBox.clientHeight */
  searchInput.style.margin = 0;
  searchButton.style.height = (35/85)*100 + "%"; /* 30px / wikiBox.clientHeight */
  randomButton.style.height = (35/85)*100 + "%";

}

//Function resets back to original landing page.
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

//Dynamically setting top margin for new div that will store wiki info
function createDiv(){
    var newDiv = document.createElement("div");
    var topMargin;

    newDiv.id = "wikiData";
    newDiv.className = "wikiData";
    document.getElementsByTagName("body")[0].appendChild(newDiv);
    topMargin = document.getElementById("wikiBox").clientHeight;
    document.getElementById("wikiData").style.marginTop = topMargin +"px";
}

//Wiki API response
function readResponse(response){
  createDiv();
  var newEle = document.createElement("p");


}


function searchWiki(){
  //Moving search div up to the top of the page.
  changeStyle();

  //Variables for api request
  //https://en.wikipedia.org/w/api.php?action=opensearch&search=api&limit=10&namespace=0&format=jsonfm
  var url = "https://en.wikipedia.org/w/api.php?";
  var format = "&format=json";
  var action = "&action=opensearch";
  var limit = "&limit=10"
  var search = "&search=cookies";
  var data = "&callback=readResponse";
  var src = "https://en.wikipedia.org/w/api.php?" + format + action + limit + search + data;

  //JSONP
  var script = document.createElement("SCRIPT");
  script.src = src;
  script.id = "wikiScript";
  document.body.appendChild(script);

}
