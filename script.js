const fetchButton = document.getElementById("fetchData");
const cityInput = document.getElementById("city");

let tempTrendChart, aqiChart;

fetchButton.addEventListener("click", async () => {
    const city = cityInput.value.trim();
    if (!city) return alert("Please enter a city.");

    try {
        // 1️⃣ Fetch current weather + 7-day forecast
        const weatherApiKey = "YOUR_OPENWEATHERMAP_KEY";
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${weatherApiKey}`;
        const geoResp = await fetch(geoUrl);
        const geoData = await geoResp.json();
        if (!geoData[0]) return alert("City not found!");

        const { lat, lon } = geoData[0];
        const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${weatherApiKey}`;
        const forecastResp = await fetch(forecastUrl);
        const forecastData = await forecastResp.json();

        const tempData = forecastData.daily.slice(0, 7).map(d => d.temp.day);
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dayLabels = forecastData.daily.slice(0,7).map(d => {
            const date = new Date(d.dt * 1000);
            return days[date.getDay()];
        });

        // 2️⃣ Fetch AQI data
        const aqiToken = "YOUR_WAQI_API_TOKEN";
        const aqiUrl = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${aqiToken}`;
        const aqiResp = await fetch(aqiUrl);
        const aqiData = await aqiResp.json();
        const aqi = aqiData.status === "ok" ? aqiData.data.aqi : 0;

        updateCharts(city, dayLabels, tempData, aqi);

    } catch (err) {
        console.error(err);
        alert("Error fetching data.");
    }
});

function updateCharts(city, days, temps, aqi) {
    const tempCtx = document.getElementById("tempTrendChart").getContext("2d");
    const aqiCtx = document.getElementById("aqiChart").getContext("2d");

    if (tempTrendChart) tempTrendChart.destroy();
    tempTrendChart = new Chart(tempCtx, {
        type: "line",
        data: {
            labels: days,
            datasets: [{
                label: `7-Day Temp (°C) in ${city}`,
                data: temps,
                borderColor: "#14b8a6",
                backgroundColor: "rgba(20,184,166,0.2)",
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: { title: { display: true, text: "7-Day Temperature Forecast" } }
        }
    });

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
            plugins: { title: { display: true, text: `Air Quality Index (AQI) in ${city}` } }
        }
    });
}
