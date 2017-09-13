
console.log("yes");

var interval;
var isPaused = false, startedTimer = false;
var savedMin = 0, savedSec = 0;
var audio = new Audio("./sound/analog-watch-alarm_daniel-simion.wav");

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
      }else if(!savedSec && !savedMin){
        break;
      }else if(startedTimer){
        break;
      }else if(screenTimer.innerHTML == "00:00"){
        break;
      }
      startedTimer = true;
      //remainingTime = savedMin * 60; //Total time in seconds.
      //Function to start timer.
      modifyUpDownButtons("hide");
      startTimer(screenTimer);
      //setupCountdown(screenTimer);
      break;
    case("reset"):
      isPaused = false;
      modifyUpDownButtons("visible");
      resetTimer(screenTimer);
      break;
    case("pause"):
      isPaused = true;
      break;
    case("task25"):
      screenTimer.innerHTML = "25:00";
      savedMin = 25;
      savedSec = "00";
      break;
    case("task55"):
      screenTimer.innerHTML = "55:00";
      savedMin= 55;
      savedSec = "00";
      break;
    case("break5"):
      screenTimer.innerHTML = "05:00";
      savedMin = 5;
      savedSec = "00";
      break;
    case("break15"):
      screenTimer.innerHTML = "15:00";
      savedMin = 5;
      savedSec = "00";
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

function startTimer(display){
  var timer = parseInt(savedMin, 10)*60 + parseInt(savedSec, 10); //Total time to countdown from.
  var minutes;  //To store minutes left.
  var seconds;  //To store seconds left

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
      audio.play();
    }
  }, 1000);
}

function modifyUpDownButtons(type){

  var userButtons = document.getElementsByClassName("userModify");
  var resetButton = document.getElementById("reset");
  var pauseButton = document.getElementById("pause");
  var startButton = document.getElementById("start");

  if(type == "hide"){
    for(var i = 0; i < userButtons.length; i++){
      userButtons[i].style.visibility = "hidden";
      console.log("Hidden");
    }
    resetButton.style.visibility = "visible";
    pauseButton.style.visibility = "visible";
  }else{
    for(var i = 0; i < userButtons.length; i++){
      userButtons[i].style.visibility = "visible";
    }
    resetButton.style.visibility = "hidden";
    pauseButton.style.visibility = "hidden";

  }
}

function resetTimer(screenTimer){
  clearInterval(interval);
  startedTimer = false;
  //if(parseInt(savedMin) < 10){
    //screenTimer.innerHTML = savedMin + ":" + savedSec;
    //return;
  //}
  audio.pause();
  audio.currentTime = 0;
  screenTimer.innerHTML = savedMin + ":" + savedSec;
}

function addSub(type){
  var display = document.getElementById("countdown");
  var localSavedSec = parseInt(display.innerHTML.substring(3, 5), 10);
  var localSavedMin = parseInt(display.innerHTML.substring(0, 2), 10);
  var modifiedSec;
  switch(type){
    case("plusMin"):
      localSavedMin++;
      localSavedMin < 10 ? localSavedMin = "0" + localSavedMin : localSavedMin;
      localSavedSec < 10 ? localSavedSec = "0" + localSavedSec : localSavedSec;
      display.innerHTML = localSavedMin + ":" + localSavedSec;
      savedMin = localSavedMin;
      savedSec = localSavedSec;
      break;

    case("minusMin"):
      if(localSavedMin == 0){
        break;
      }
      localSavedMin--;
      localSavedMin < 10 ? localSavedMin = "0" + localSavedMin : localSavedMin;
      localSavedSec < 10 ? localSavedSec = "0" + localSavedSec : localSavedSec;
      display.innerHTML = localSavedMin + ":" + localSavedSec;
      savedMin = localSavedMin;
      savedSec = localSavedSec;
      break;

    case("plusSec"):
      localSavedSec++;
      if(localSavedSec > 59){
        localSavedSec = 0;
        localSavedMin++;
      }
      localSavedSec < 10 ? localSavedSec = "0" + localSavedSec : localSavedSec;
      localSavedMin < 10 ? localSavedMin = "0" + localSavedMin : localSavedMin;
      display.innerHTML = localSavedMin + ":" + localSavedSec;
      savedMin = localSavedMin;
      savedSec = localSavedSec;
      break;

    case("minusSec"):
      console.log("In minus");
      if(localSavedSec == 0 && localSavedMin == 0){
        break;
      }
      localSavedSec--;
      if(localSavedSec < 0 && localSavedMin > 0){
        localSavedMin--;
        localSavedSec = 59;
      }
      localSavedSec < 10 ? localSavedSec = "0" + localSavedSec : localSavedSec;
      localSavedMin < 10 ? localSavedMin = "0" + localSavedMin : localSavedMin;
      display.innerHTML = localSavedMin + ":" + localSavedSec;
      savedMin = localSavedMin;
      savedSec = localSavedSec;
      break;

  }
}
