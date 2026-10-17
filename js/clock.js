// Live clock. It updates once every second with setInterval.

var clockTime = document.getElementById("clock-time");
var clockDate = document.getElementById("clock-date");
var clock24 = document.getElementById("clock-24h");

// Adds a leading zero, so 7 becomes "07"
function pad(number) {
  return String(number).padStart(2, "0");
}

function updateClock() {
  var now = new Date();
  var hours = now.getHours();
  var suffix = "";

  if (!clock24.checked) {
    suffix = hours >= 12 ? " PM" : " AM";
    hours = hours % 12 || 12; // 0 o'clock shows as 12
  }

  clockTime.textContent =
    pad(hours) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds()) + suffix;

  clockDate.textContent = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Remember the 12/24 hour choice
try {
  clock24.checked = localStorage.getItem("dashboard_24h") === "yes";
} catch (error) {
  // localStorage can be blocked, the clock still works without it
}

clock24.addEventListener("change", function () {
  try {
    localStorage.setItem("dashboard_24h", clock24.checked ? "yes" : "no");
  } catch (error) {}
  updateClock();
});

updateClock();
setInterval(updateClock, 1000);
