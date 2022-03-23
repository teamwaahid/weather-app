function $(sel) {
  return document.querySelector(sel);
}

const key = "b1d3c28d56c606599510469ac91d4ab8";

let weatherInfo = {};

// getting location from user and fetching data through API
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const latitude = coords.latitude;
      const longitude = coords.longitude;
      const uri = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

      serverData(uri);
    },
    (err) => {
      const uri = `https://api.openweathermap.org/data/2.5/weather?q=dhaka&appid=${key}`;

      serverData(uri);
    }
  );
}

// API fetching function
function serverData(uri) {
  fetch(uri)
    .then((res) => res.json())
    .then((data) => {
      const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      const cityAndCountry = data.name + ", " + data.sys.country;
      const condition = data.weather[0].description;
      const celciusTemp = data.main.temp - 273.15;
      const pressure = data.main.pressure;
      const humidity = data.main.humidity;

      weatherInfo = {
        icon,
        cityAndCountry,
        condition,
        celciusTemp,
        pressure,
        humidity,
      };

      const div = document.createElement("div");
      div.innerHTML = `
    <div class="history_card">
        <div class="icon">
            <img src="${icon}" alt="" />
        </div>
        <div class="details">
            <h4>${cityAndCountry}</h4>
            <p>${condition}</p>
            <p>
                Temp: <span id="temp">${celciusTemp.toFixed(
                  2
                )}</span>°C, Pressure:
                <span id="pressure">${pressure}</span>, Humidity:
                <span id="humidity">${humidity}</span>
            </p>
        </div>
    </div>
    `;

      // reset data to UI
      const historyCard = document.querySelectorAll(".history_card");
      const history = getDataToLocalStorage();
      if (history.length === 4) {
        historyCard[3].remove();
        history.pop();
        history.unshift(weatherInfo);
      } else {
        history.unshift(weatherInfo);
      }
      $("#search_history").insertAdjacentElement("afterbegin", div);

      // set data to local storage
      localStorage.setItem("weather", JSON.stringify(history));
    })
    .catch((err) => alert("Enter Valid City Name"))
    .finally(() => {
      updateDisplay(weatherInfo);
    });
}

// display data function
function updateDisplay() {
  $("#app_icon").src = weatherInfo.icon;
  $(".city_name").innerHTML = weatherInfo.cityAndCountry;
  $(".weather_info").innerHTML = weatherInfo.condition;
  $("#temp").innerHTML = weatherInfo.celciusTemp.toFixed(2);
  $("#pressure").innerHTML = weatherInfo.pressure;
  $("#humidity").innerHTML = weatherInfo.humidity;
}

// getting data from input
$("#search_btn").addEventListener("click", () => {
  const inputValue = $("#search_input").value;
  if (!inputValue) return;
  const uri = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${key}`;

  serverData(uri);

  $("#search_input").value = "";
});

// get data from local storage
function getDataToLocalStorage() {
  const data = localStorage.getItem("weather");
  let weather = [];
  if (data) {
    weather = JSON.parse(data);
  }
  return weather;
}

// load data from local storage
window.onload = function () {
  const history = getDataToLocalStorage();
  history.forEach((h) => {
    const div = document.createElement("div");
    div.innerHTML = `
    <div class="history_card">
        <div class="icon">
            <img src="${h.icon}" alt="" />
        </div>
        <div class="details">
            <h4>${h.cityAndCountry}</h4>
            <p>${h.condition}</p>
            <p>
                Temp: <span id="temp">${h.celciusTemp.toFixed(
                  2
                )}</span>°C, Pressure:
                <span id="pressure">${h.pressure}</span>, Humidity:
                <span id="humidity">${h.humidity}</span>%
            </p>
        </div>
    </div>
    `;
    $("#search_history").appendChild(div);
  });
};

// Checking Internet
window.addEventListener("offline", () =>
  alert("You Are Offline Now!!! Connect To The Internet and Try Again")
);

// convert temp
$("#convertTemp").addEventListener("click", () => {
  if ($("#tempUnit").innerHTML === "°C") {
    const temp = $("#temp").innerHTML;
    console.log(temp);
    const newValue = (temp * 9) / 5 + 32;
    $("#temp").innerHTML = newValue.toFixed(2);
    $("#tempUnit").innerHTML = "°F";
  } else {
    const temp = $("#temp").innerHTML;
    const newValue = ((temp - 32) * 5) / 9;
    $("#temp").innerHTML = newValue.toFixed(2);
    $("#tempUnit").innerHTML = "°C";
  }
});
