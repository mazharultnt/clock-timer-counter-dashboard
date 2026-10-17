// Counters: add, plus, minus, reset and remove. Saved in localStorage.

var STORAGE_KEY = "dashboard_counters";

var counterForm = document.getElementById("counter-form");
var counterName = document.getElementById("counter-name");
var counterMessage = document.getElementById("counter-message");
var counterList = document.getElementById("counter-list");
var counterEmpty = document.getElementById("counter-empty");

var counters = loadCounters();

function loadCounters() {
  try {
    var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) {
      return saved;
    }
  } catch (error) {}

  // First visit: start with two examples
  return [
    { id: 1, name: "Glasses of water", value: 0 },
    { id: 2, name: "Pages read", value: 0 },
  ];
}

function saveCounters() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counters));
  } catch (error) {}
}

// Names are typed by the user, so never put them into innerHTML directly
function showCounters() {
  counterList.innerHTML = "";
  counterEmpty.hidden = counters.length > 0;

  counters.forEach(function (counter) {
    var box = document.createElement("div");
    box.className = "counter";
    box.dataset.id = counter.id;

    var title = document.createElement("h3");
    title.textContent = counter.name;

    var value = document.createElement("p");
    value.className = "counter-value";
    value.textContent = counter.value;

    var minus = makeButton("-", "minus", "Decrease " + counter.name);
    var plus = makeButton("+", "plus", "Increase " + counter.name);
    var reset = makeButton("Reset", "reset", "Reset " + counter.name);
    reset.classList.add("btn-outline");
    minus.classList.add("btn-outline");

    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-button";
    remove.dataset.action = "remove";
    remove.textContent = "Remove";

    box.append(title, value, minus, plus, reset, remove);
    counterList.appendChild(box);
  });
}

function makeButton(text, action, label) {
  var button = document.createElement("button");
  button.type = "button";
  button.className = "btn";
  button.textContent = text;
  button.dataset.action = action;
  button.setAttribute("aria-label", label);
  return button;
}

// One click listener for every button in the list
counterList.addEventListener("click", function (event) {
  var button = event.target.closest("button");
  if (!button) {
    return;
  }

  var box = button.closest(".counter");
  var id = Number(box.dataset.id);
  var action = button.dataset.action;

  if (action === "remove") {
    counters = counters.filter(function (counter) {
      return counter.id !== id;
    });
  } else {
    counters.forEach(function (counter) {
      if (counter.id !== id) {
        return;
      }
      if (action === "plus") {
        counter.value += 1;
      } else if (action === "minus") {
        counter.value -= 1;
      } else if (action === "reset") {
        counter.value = 0;
      }
    });
  }

  saveCounters();
  showCounters();
});

counterForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var name = counterName.value.trim();

  if (name === "") {
    counterMessage.textContent = "Please type a name for the counter.";
    return;
  }
  if (counters.length >= 9) {
    counterMessage.textContent = "That is enough counters for now. Remove one to add another.";
    return;
  }

  counterMessage.textContent = "";
  counters.push({ id: Date.now(), name: name, value: 0 });
  counterName.value = "";
  saveCounters();
  showCounters();
});

showCounters();
