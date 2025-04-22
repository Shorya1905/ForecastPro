// Formatting time
function formatTime(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

// Formatting day
function formatDay(date) {
  const dayArray = date.getDay();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  const day = days[dayArray];
  return day;
}

// Getting current time & day and displaying it
const currentTime = document.querySelector("#current-time");
let newCurrentTime = new Date();
currentTime.innerHTML = formatTime(newCurrentTime);

const currentDay = document.querySelector("#current-day");
let newCurrentDay = new Date();
currentDay.innerHTML = formatDay(newCurrentDay);

// Implementing search bar and API request
function displayWeatherInfo(response) {
  document.querySelector("#searched-city").innerHTML = response.data.name;
  const temperature = Math.round(response.data.main.temp);
  document.querySelector("#current-temperature").innerHTML = `${temperature}°`;
  const humidity = response.data.main.humidity;
  document.querySelector("#humidity").innerHTML = `${humidity}%`;
  const windSpeed = Math.round(response.data.wind.speed);
  document.querySelector("#wind").innerHTML = `${windSpeed} km/h`;
  document.querySelector("#weather-type").innerHTML =
    response.data.weather[0].main;
  const pressure = response.data.main.pressure;
  document.querySelector("#pressure").innerHTML = `${pressure} hPa`;

// Sunrise and Sunset times
  const sunriseTime = new Date(response.data.sys.sunrise * 1000); // Convert to ms
  const sunsetTime = new Date(response.data.sys.sunset * 1000); // Convert to ms
  document.querySelector("#sunrise").innerHTML = `Sunrise: ${formatTime(sunriseTime)}`;
  document.querySelector("#sunset").innerHTML = `Sunset: ${formatTime(sunsetTime)}`;
  // Dynamically change image based on weather
  const weatherImage = document.querySelector("#weather-image");
  const weatherType = response.data.weather[0].main;

  if (weatherType === "Clouds") {
    weatherImage.src = "https://assets.onecompiler.app/43a927tw7/43fa3mz95/cloud.png";
  } else if (weatherType === "Rain") {
    weatherImage.src = "https://assets.onecompiler.app/43a927tw7/43fa3mz95/rain.png";
  } else if (weatherType === "Clear") {
    weatherImage.src = "https://assets.onecompiler.app/43a927tw7/43fa3mz95/sun.png";
  } else if (weatherType === "Snow") {
    weatherImage.src = "https://assets.onecompiler.app/43a927tw7/43fa3mz95/snow.png";
  } else {
    weatherImage.src = "default-image.png";
  }
}

// Search City
function searchCity(city) {
  const apiKey = "2b5fc755ac2ec59250868b5527df31c4";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(displayWeatherInfo);
}

// Displaying the weather forecast
function displayForecast(response) {
  const forecastData = response.data.list;
  const forecastElement = document.querySelector(".week-forecast");
  forecastElement.innerHTML = "";

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const usedDays = new Set();

  forecastData.forEach((forecast) => {
    const date = new Date(forecast.dt_txt);
    const dayName = dayNames[date.getDay()];
    const time = date.getHours();

    // Show one forecast per day at 12:00 PM
    if (time === 12 && !usedDays.has(dayName)) {
      usedDays.add(dayName);

      const iconCode = forecast.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      const temp = Math.round(forecast.main.temp);
      const weatherDesc = forecast.weather[0].main;

      // Pressure
      const pressure = forecast.main.pressure;
      // Humidity
      const humidity = forecast.main.humidity;
      // Wind Speed
      const windSpeed = Math.round(forecast.wind.speed);

      // Sunrise and Sunset times for future forecast
      const sunriseTime = new Date(forecast.sys.sunrise * 1000); // Convert to ms
      const sunsetTime = new Date(forecast.sys.sunset * 1000); // Convert to ms

      let weatherImage;
      if (weatherDesc === "Clouds") {
        weatherImage = "https://assets.onecompiler.app/43a927tw7/43fa3mz95/cloud.png";
      } else if (weatherDesc === "Rain") {
        weatherImage = "https://assets.onecompiler.app/43a927tw7/43fa3mz95/rain.png";
      } else if (weatherDesc === "Clear") {
        weatherImage = "https://assets.onecompiler.app/43a927tw7/43fa3mz95/sun.png";
      } else if (weatherDesc === "Snow") {
        weatherImage = "https://assets.onecompiler.app/43a927tw7/43fa3mz95/snow.png";
      } else {
        weatherImage = "default-image.png";
      }

      forecastElement.innerHTML += `
        <div class="col">
          <h3>${dayName}</h3>
          <br /><img src="${weatherImage}" /><br />
          <p class="weather">${weatherDesc}</p>
          <span>${temp}°</span>
          <div>Humidity: ${humidity}%</div>
          <div>Wind: ${windSpeed} km/h</div>
          <div>Pressure: ${pressure} hPa</div>
        </div>
      `;
    }
  });
}

// Search Forecast
function searchForecast(city) {
  const apiKey = "2b5fc755ac2ec59250868b5527df31c4";
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

// Form submit handler
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  searchCity(city);
  searchForecast(city); // Call forecast too
}

// Event listener for search form
const searchBar = document.querySelector("#search-form");
searchBar.addEventListener("submit", handleSubmit);

// Load default city (Jaipur) weather and forecast on page load
window.onload = function () {
  searchCity("Jaipur");
  searchForecast("Jaipur");
};
