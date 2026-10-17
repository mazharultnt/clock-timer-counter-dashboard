// Countdown timer with Start, Pause and Reset.

var timerDisplay = document.getElementById("timer-display");
var timerStatus = document.getElementById("timer-status");
var minutesInput = document.getElementById("timer-minutes");
var secondsInput = document.getElementById("timer-seconds");
var startButton = document.getElementById("timer-start");
var pauseButton = document.getElementById("timer-pause");
var resetButton = document.getElementById("timer-reset");

var secondsLeft = 0; // how many seconds are left right now
var intervalId = null; // the running setInterval, or null when stopped
var hasStarted = false; // true once a countdown has begun (so Start can "resume")

function pad(number) {
  return String(number).padStart(2, "0");
}

function showTime() {
  var minutes = Math.floor(secondsLeft / 60);
  var seconds = secondsLeft % 60;
  timerDisplay.textContent = pad(minutes) + ":" + pad(seconds);
}

// Reads the two inputs and keeps them inside a sensible range
function readInputs() {
  var minutes = parseInt(minutesInput.value, 10);
  var seconds = parseInt(secondsInput.value, 10);

  if (isNaN(minutes) || minutes < 0) {
    minutes = 0;
  }
  if (isNaN(seconds) || seconds < 0) {
    seconds = 0;
  }
  minutes = Math.min(minutes, 99);
  seconds = Math.min(seconds, 59);

  minutesInput.value = minutes;
  secondsInput.value = seconds;
  return minutes * 60 + seconds;
}

function stopCounting() {
  clearInterval(intervalId);
  intervalId = null;
}

function tick() {
  secondsLeft = secondsLeft - 1;
  showTime();

  if (secondsLeft <= 0) {
    stopCounting();
    hasStarted = false;
    timerDisplay.classList.add("timer-done");
    timerStatus.textContent = "Time is up!";
    startButton.disabled = false;
    pauseButton.disabled = true;
    minutesInput.disabled = false;
    secondsInput.disabled = false;
  }
}

startButton.addEventListener("click", function () {
  if (!hasStarted) {
    // A fresh start: take the time from the inputs
    secondsLeft = readInputs();
    if (secondsLeft === 0) {
      timerStatus.textContent = "Please set a time that is more than zero.";
      return;
    }
    hasStarted = true;
  }

  timerDisplay.classList.remove("timer-done");
  showTime();
  timerStatus.textContent = "Counting down...";

  startButton.disabled = true;
  pauseButton.disabled = false;
  minutesInput.disabled = true;
  secondsInput.disabled = true;

  stopCounting(); // make sure only one interval is ever running
  intervalId = setInterval(tick, 1000);
});

pauseButton.addEventListener("click", function () {
  stopCounting();
  timerStatus.textContent = "Paused. Press Start to continue.";
  startButton.disabled = false;
  pauseButton.disabled = true;
});

resetButton.addEventListener("click", function () {
  stopCounting();
  hasStarted = false;
  secondsLeft = readInputs();
  showTime();
  timerDisplay.classList.remove("timer-done");
  timerStatus.textContent = "Set the time and press Start.";
  startButton.disabled = false;
  pauseButton.disabled = true;
  minutesInput.disabled = false;
  secondsInput.disabled = false;
});

// Show the starting time when the page opens
secondsLeft = readInputs();
showTime();
