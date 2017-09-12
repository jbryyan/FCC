
console.log("yes");
var seconds;
window.onload = function(){
  document.getElementById("container").addEventListener("click", function(e){
    var startButton = document.getElementById("start");
    var resetButton = document.getElementById("reset");
    var pauseButton = document.getElementById("pause");
    //Event handler. If any button is pressed, check which button and do the apprpriate action.
    if(e.target && e.target.matches("button")){
      buttonPressed(e.target.id);
    }

  });

}

function buttonPressed(buttonId){
  var screenTimer = document.getElementById("countdown");

  switch(buttonId){
    case("start"):
      startCountdown(seconds, display);
      break;
    case("reset"):
      resetCountdown(seconds);
      break;
    case("pause"):
      pauseCountdown(seconds);
      break;
    case("task25"):
      screenTimer.innerHTML = "25:00";
      seconds = 25*60;
      break;
    case("task55"):
      screenTimer.innerHTML = "55:00";
      seconds = 55*60;
      break;
    case("break5"):
      screenTimer.innerHTML = "05:00";
      seconds = 5*60;
      break;
    case("break15"):
      screenTimer.innerHTML = "15:00";
      seconds = 5*60;
      break;
    case("plus"):
      addSubMin("plus");
      break;
    case("minus"):
      addSubMin("minus");
      break;
  }
}

function startCountdown(seconds, display){
  var remainingTime = seconds;
  setTimeout(function(){
    display(remainingTime);
    console.log(remainingTime);
    if(remainingTime > 0){
      startCountdown(remainingTime - 1, display);
    }
  }, 1000);
}

var display = function(seconds){
  var minutes = parseInt(seconds/60) + ":00";
  var screenMinutes = document.getElementById("countdown").innerHTML;
  //console.log(minutes.substring(0,2));
  //console.log(screenMinutes.substring(0,2));
  if(minutes.substring(0, 2) != screenMinutes.substring(0, 2)){
    
  }
};
