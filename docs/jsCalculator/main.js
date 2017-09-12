var inputStorage = [];
var symbolStorage = [];
var tempNum = [];
var resultGiven = false;
//On page load, run function.
window.onload = function(){

  //Event listener for numpad keyboard.
  //Will button click appropriate button when keyboard is pressed.
  document.addEventListener("keydown", function(event){
    var keyCode = event.keyCode;
    switch(keyCode){
      case(96): document.getElementById("zero").click();  break;
      case(97): document.getElementById("one").click(); break;
      case(98): document.getElementById("two").click(); break;
      case(99): document.getElementById("three").click(); break;
      case(100): document.getElementById("four").click(); break;
      case(101): document.getElementById("five").click(); break;
      case(102): document.getElementById("six").click(); break;
      case(103): document.getElementById("seven").click(); break;
      case(104): document.getElementById("eight").click(); break;
      case(105): document.getElementById("nine").click(); break;
      case(106): document.getElementById("times").click(); break;
      case(107): document.getElementById("plus").click(); break;
      case(109): document.getElementById("minus").click(); break;
      case(111): document.getElementById("divide").click(); break;
      case(110): document.getElementById("decimal").click(); break;
      case(13): document.getElementById("results").click(); break;
      case(8): document.getElementById("larr").click();  break;//Undo/delete
    }
  });

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
          if(resultGiven){
            inputStorage.push(inputScreen.innerHTML);
            resultGiven = false;
          }
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
          undoChar();
          break;
        //Default: Number or decimal button was pressed.
        default:
          if(resultGiven == true){
            tempNum = [];
            resultGiven = false;
          }
          else if(inputScreen.innerHTML.length > 13){
            memoryScreen.innerHTML = "Digit limit met."
            inputScreen.innerHTML = "0";
            tempNum = []; inputStorage = []; symbolStorage = [];
            break;
          }
          inputStorage.push(userInput);
          tempNum.push(userInput);
          inputScreen.innerHTML = tempNum.join("");
          break;
      }
    }
  });
  function clearScreen(clear){
    if(clear == "CE"){
      document.getElementById("inputScreen").innerHTML = "0";
      tempNum = [];
      inputStorage.pop();
    }else{
      document.getElementById("inputScreen").innerHTML = "0";
      document.getElementById("memoryScreen").innerHTML = "0";
      tempNum = [];
      inputStorage = [];
      symbolStorage = [];
    }
  }

  function undoChar(){
    if(inputScreen.innerHTML.length == "1"){
      tempNum.pop();
      inputStorage.pop();
      inputScreen.innerHTML = "0";
      return;
    }
      tempNum.pop();
      inputStorage.pop();
      document.getElementById("inputScreen").innerHTML = tempNum.join("");
  }

  function result(){
    console.log(typeof(inputStorage));
    var inputString = (inputStorage.join(""));
    var inputScreen = document.getElementById("inputScreen");
    var memoryScreen = document.getElementById("memoryScreen");
    var result = parseFloat(eval(inputString).toFixed(3));
    if(result.length > 13){
      inputScreen.innerHTML = "0";
      memoryScreen.innerHTML = "Digit limit met.";
      inputStorage = []; symbolStorage = []; tempNum = [];
      return;
    }
    inputScreen.innerHTML = result;
    memoryScreen.innerHTML = inputString + "=" + result;
    inputStorage = [];
    symbolStorage = [];
    resultGiven = true;
    //inputStorage.push(inputString);

  }
}
