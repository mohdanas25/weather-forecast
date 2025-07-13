const api_key = 'YOUR_API_KEY_HERE';
const search_btn = document.querySelector("#search-btn");
const weatherOverview = document.querySelector(".weather-overview");
const forecastContainer = document.querySelector(".daily-forecast");

search_btn.addEventListener("click", async () => {

    const city_name = document.querySelector("#cityInput").value.trim();

    if (!city_name) {
        alert("Please Enter City Name");
        return;
    }

    try {
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${api_key}&units=metric`);

        const weatherData = await weatherRes.json();

        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city_name}&appid=${api_key}&units=metric`);

        const forecastData = await forecastRes.json();

        document.querySelector(".section").style.removeProperty("justify-content");
        document.querySelector(".top-section").style.justifyContent = "space-between";
        document.querySelector(".search-location").style.width = "40%";
        weatherOverview.style.display = "flex";

        weatherOverview.innerHTML = `
            <h2 class="city-name">${weatherData.name}, ${weatherData.sys.country}</h2>
            <img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="${weatherData.weather[0].description}" class="weather-icon">
            <p><strong>Temperature:</strong>${weatherData.main.temp.toFixed(1)}</p>
            <p><strong>Condition:</strong>${weatherData.weather[0].main} ${weatherData.weather[0].description}</p>
            <p><strong>Humidity:</strong> ${weatherData.main.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${weatherData.wind.speed} m/s</p>
        `

        const dailyForecasts = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));

        forecastContainer.innerHTML = "";

        dailyForecasts.forEach(item => {
            const day = getDayName(item.dt_txt);

            forecastContainer.innerHTML += `
                <div class="forecast-card">
                    <h3>${day}</h3>
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
                    <p><strong>${item.main.temp}°C</strong></p>
                    <p><strong>${item.weather[0].main}</strong></p>
                </div>
            `
        }
        )

    } catch (err) {
        console.error("Error while fetching weather data", err);
        alert("Could not fetch weather data. Please try again.");
    }
});

function getDayName(dateStr) {
    const date = new Date(dateStr);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
}
