let cityNameElement = document.getElementById("cityName");
let currentDayElement = document.getElementById("currentDay");
let currentDateElement = document.getElementById("currentDate");
let temperatureValueElement = document.getElementById("temperatureValue");
let temperatureUnitElement = document.getElementById("temperatureUnit");

let isCelsius = true;
let currentTemperature = 0;

let celsiusLinkElement = document.getElementById("celsiusLink");
let fahrenheitLinkElement = document.getElementById("fahrenheitLink");
let currentLocationButton = document.getElementById("currentLocationButton");

// Function to handle temperature unit toggle
function onCelsiusLinkClick(event) {
  event.preventDefault();
  isCelsius = true;
  updateTemperature();
}



function onFahrenheitLinkClick(event) {
  event.preventDefault();
  isCelsius = false;
  updateTemperature();
}

celsiusLinkElement.addEventListener("click", onCelsiusLinkClick);
fahrenheitLinkElement.addEventListener("click", onFahrenheitLinkClick);

// Function to update the city name, current day, and current date
function updateLocationAndDate(location) {
  cityNameElement.textContent = location;
  let currentDate = new Date();
  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  currentDayElement.textContent = daysOfWeek[currentDate.getDay()];
  let day = currentDate.getDate();
  let month = currentDate.toLocaleString("default", { month: "short" });
  let year = currentDate.getFullYear();
  currentDateElement.textContent = `${day} ${month} ${year}`;
}

// Function to update the temperature value and unit
function updateTemperature() {
  let temperature = isCelsius
    ? currentTemperature.toFixed(1)
    : convertToFahrenheit(currentTemperature).toFixed(1);
  temperatureValueElement.textContent = temperature;
  temperatureUnitElement.textContent = isCelsius ? "°C" : "°F";
}

// Function to convert Celsius to Fahrenheit
function convertToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

// Function to fetch weather data for a city using the OpenWeather API
function getWeatherByCity(city) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(
    (response) => {
      currentTemperature = response.data.main.temp;
      updateTemperature();
      displayWeatherCondition(response);
    },
    (error) => {
      console.error("Error fetching weather data:", error);
    }
  );
}



// Function to handle search button click
function onSearchButtonClick() {
  let searchInput = document.getElementById("searchInput");
  let location = searchInput.value.trim().toUpperCase();
  updateLocationAndDate(location);
  // Fetch weather data for the entered city
  getWeatherByCity(location);
  searchInput.value = "";
}

// Function to fetch weather data based on latitude and longitude
function getCurrentWeather(latitude, longitude) {
  let apiKey = "e0a5a97de9a0b7a951e9d154a8f9bad8";
  let units = "metric"; // Define the units variable here
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(
    (response) => {
      currentTemperature = response.data.main.temp;
      updateTemperature();

      let city = response.data.name.toUpperCase();
      cityNameElement.textContent = response.data.name;
      displayWeatherCondition(response);
    },
    (error) => {
      console.error("Error fetching weather data:", error);
    }
  );
}


// Function to handle the click event on the "Current Location" button
function handleCurrentLocationButtonClick() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      getCurrentWeather(latitude, longitude);
    });
  } else {
    alert("Geolocation is not available in this browser.");
  }
}

// ... (previous JavaScript code)

function displayWeatherCondition(response) {
  document.querySelector("#description").textContent =
    response.data.weather[0].main;
  document.querySelector("#humidity").textContent =
    `Humidity: ${response.data.main.humidity}%`;
  document.querySelector("#wind").textContent =
    `Wind: ${response.data.wind.speed} m/s`;
}



// Attach event listeners
document
  .getElementById("searchButton")
  .addEventListener("click", onSearchButtonClick);
document
  .getElementById("searchInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      onSearchButtonClick();
    }
  });
document
  .getElementById("temperatureValue")
  .addEventListener("click", function () {
    isCelsius = !isCelsius;
    updateTemperature();
  });

currentLocationButton.addEventListener(
  "click",
  handleCurrentLocationButtonClick
);

// Initial update with default location (London)
updateLocationAndDate("London");
