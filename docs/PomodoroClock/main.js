
console.log("yes");

var interval;
var isPaused = false;
var savedMin;

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
  var remainingTime;
  switch(buttonId){
    case("start"):
      if(isPaused){
        isPaused = false;
        break;
      }
      remainingTime = savedMin * 60; //Total time in seconds.
      //Function to start timer.
      startTimer(remainingTime, screenTimer);
      //setupCountdown(screenTimer);
      break;
    case("reset"):
      isPaused = false;
      resetTimer(screenTimer);
      break;
    case("pause"):
      isPaused = true;
      break;
    case("task25"):
      screenTimer.innerHTML = "25:00";
      savedMin = 25;
      break;
    case("task55"):
      screenTimer.innerHTML = "55:00";
      savedMin= 55;
      break;
    case("break5"):
      screenTimer.innerHTML = "05:00";
      savedMin = 5;
      break;
    case("break15"):
      screenTimer.innerHTML = "15:00";
      savedMin = 5;
      break;
    case("plusMin"):
      addSub("plusMin");
      break;
    case("minusMin"):
      addSub("minusMin");
      break;
    case("plusSec"):
      addSub("plusSec");
      break;
    case("minusSec"):
      addSub("minusSec");
  }
}

function startTimer(duration, display){
  var timer = duration; //Total time to countdown from.
  var minutes;  //To store minutes left.
  var seconds;  //To store seconds left.

  interval = setInterval(function(){
    if(isPaused){
      return;
    }
    minutes = parseInt(timer / 60, 10); //Parsed: Base 10, 60 secs in a minute.
    seconds = parseInt(timer % 60, 10); //Parsed: Base 10, use modolus to get remainder for seconds.
    //If either minutes or seconds < 10, append 0 to the values.
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    //Updates HTML with new value.
    display.innerHTML = minutes + ":" + seconds;
    timer--;
    //If end of time, stop interval.
    if(timer < 0){
      clearInterval(interval);
    }
  }, 1000);
}

function resetTimer(screenTimer){
  clearInterval(interval);
  if(savedMin < 10){
    screenTimer.innerHTML = "0" + savedMin + ":00";
    return;
  }
  screenTimer.innerHTML = savedMin + ":00";
}

function addSub(type){
  var display = document.getElementById("countdown");
  var savedSec = parseInt(display.innerHTML.substring(3, 5), 10);
  var savedMin = parseInt(display.innerHTML.substring(0, 2), 10);
  var modifiedSec;
  switch(type){
    case("plusMin"):
      savedMin = parseInt(display.innerHTML.substring(0,2), 10) + 1;
      savedMin < 10 ? savedMin = "0" + savedMin : savedMin;
      display.innerHTML = savedMin + ":" + modifiedSec;
      break;
    case("minusMin"):

      if(parseInt(display.innerHTML.substring(0, 2), 10) == 0){ break;}
      savedMin = parseInt(display.innerHTML.substring(0, 2), 10) - 1;
      savedMin < 10 ? savedMin = "0" + savedMin : savedMin;
      display.innerHTML = savedMin + modifiedSec;
      break;
    case("plusSec"):
      var savedSec = parseInt(display.innerHTML.substring(3,5), 10);
      console.log(savedSec);
      modifiedSec = savedSec + 1;
      modifiedSec < 10 ? modifiedSec = "0" + modifiedSec : modifiedSec;
      if (modifiedSec > 59){
        modifiedSec = "00";
        if(savedMin < 10){
          savedMin = "0" + (savedMin + 1);
        }else{
          savedMin = savedMin + 1;
        }
      }else if(savedMin == 0){
        display.innerHTML = "00:" + modifiedSec;
        break;
      }
      display.innerHTML = savedMin + ":" + modifiedSec;
      break;
    case("minusSec"):
      modifiedSec--;
      //savedMin < 0 && modifiedSec > 0 ?
      console.log(modifiedSec);
      modifiedSec < 0 ? modifiedSec = 59 : modifiedSec;
      display.innerHTML = savedMin + ":" + modifiedSec;
      break;

  }
}
