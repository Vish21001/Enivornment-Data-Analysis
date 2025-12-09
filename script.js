const fetchButton = document.getElementById("fetchData");
const cityInput = document.getElementById("city");

// Chart instances
let tempChart, aqiChart;

// Fetch environmental data from OpenWeatherMap
fetchButton.addEventListener("click", async () => {
    const city = cityInput.value;
    if (!city) {
        alert("Please enter a city.");
        return;
    }

    // OpenWeatherMap API
    const apiKey = "YOUR_API_KEY_HERE"; // Get free key from https://openweathermap.org/api
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(weatherUrl);
        const data = await response.json();

        if (data.cod !== 200) {
            alert("City not found!");
            return;
        }

        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const aqi = Math.floor(Math.random() * 200); // Placeholder AQI, can integrate real AQI API later

        updateCharts(city, temperature, humidity, aqi);
    } catch (error) {
        console.error(error);
        alert("Error fetching data.");
    }
});

function updateCharts(city, temp, humidity, aqi) {
    const tempCtx = document.getElementById("temperatureChart").getContext("2d");
    const aqiCtx = document.getElementById("aqiChart").getContext("2d");

    // Temperature Chart
    if (tempChart) tempChart.destroy();
    tempChart = new Chart(tempCtx, {
        type: "bar",
        data: {
            labels: ["Temperature (°C)", "Humidity (%)"],
            datasets: [{
                label: city,
                data: [temp, humidity],
                backgroundColor: ["#14b8a6", "#fbbf24"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Weather Data"
                }
            }
        }
    });

    // AQI Chart
    if (aqiChart) aqiChart.destroy();
    aqiChart = new Chart(aqiCtx, {
        type: "doughnut",
        data: {
            labels: ["AQI Level", "Remaining"],
            datasets: [{
                data: [aqi, 500 - aqi],
                backgroundColor: ["#ef4444", "#e5e7eb"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Air Quality Index (AQI)"
                }
            }
        }
    });
}
