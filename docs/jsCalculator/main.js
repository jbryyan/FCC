var inputStorage = [];
var symbolStorage = [];
var tempNum = [];
//On page load, run function.
window.onload = function(){
  //Event listener for any clicks in myButtons div.
  document.getElementById("myButtons").addEventListener("click", function mouseClick(e){
    var inputScreen = document.getElementById("inputScreen");
    var memoryScreen = document.getElementById("memoryScreen");

    //Used to store the inputs from the user.
    //Will use eval() to evaluate.

    if(e.target && e.target.matches("button")){
      var userInput = e.target.innerHTML;
      switch(true){
        case (userInput == "+" || userInput  == "-" || userInput  == "/" || userInput  == "x"):
          //If the screen has a 0: break.
          //if(inputScreen.userInput  == "0") { break };
          tempNum = [];
          if(userInput == "x"){
            inputStorage.push("*");
            symbolStorage.push(userInput);
            memoryScreen.innerHTML = inputStorage.join("");
          }
          else{
            inputStorage.push(userInput);
            symbolStorage.push(userInput);
            memoryScreen.innerHTML = inputStorage.join("");
          }
          inputScreen.innerHTML = userInput;
          break;

        case (userInput  == "="):
          result();
          break;

        case (userInput  == "CE" || userInput  == "C"):
          clearScreen(userInput);
          break;

        case (e.target.id == "larr"):
          alert("Calling undo");
          undoChar();
          break;
        //Default: Number or decimal button was pressed.
        default:
          inputStorage.push(userInput);
          tempNum.push(userInput);
          inputScreen.innerHTML = tempNum.join("");
          break;
      }
    }
  });
  function clearScreen(clear){
    if(clear == "CE"){
      console.log("Clear input only");
    }else{

    }
  }

  function result(){
    console.log(typeof(inputStorage));
    var inputString = (inputStorage.join(""));
    var inputScreen = document.getElementById("inputScreen");
    var memoryScreen = document.getElementById("memoryScreen");
    var result = eval(inputString);
    console.log(inputString);
    inputScreen.innerHTML = result;
    memoryScreen.innerHTML = inputString + "=" + result;
    inputStorage = [];
    inputStorage.push(inputString);

  }
}
