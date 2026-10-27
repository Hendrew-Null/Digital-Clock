/* =========================
   CLOCK
========================= */

function updateClock() {

    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const timeElement = document.getElementById("time");

    timeElement.style.transform = "scale(0.995)";
    timeElement.style.opacity = "0.8";

    setTimeout(() => {

        timeElement.textContent =
            `${hours}:${minutes}:${seconds}`;

        timeElement.style.transform = "scale(1)";
        timeElement.style.opacity = "1";

    }, 80);


    /* Date */

    const date = now.toLocaleDateString("en-US", {

        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"

    });

    document.getElementById("date").textContent = date;


    /* Day */

    document.getElementById("day").textContent =
        now.toLocaleDateString("en-US", {
            weekday: "long"
        });


    /* Timezone */

    const timezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone;

    document.getElementById("timezone").textContent =
        timezone;

}

updateClock();

setInterval(updateClock, 1000);


/* =========================
   WEATHER
========================= */

function getWeather() {

    if (!navigator.geolocation) {

        document.getElementById("weather").textContent =
            "Unavailable";

        return;

    }

    navigator.geolocation.getCurrentPosition(

        async function(position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try {

                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
                );

                const data = await response.json();

                const temperature =
                    Math.round(data.current.temperature_2m);

                const code =
                    data.current.weather_code;

                const condition =
                    getWeatherCondition(code);

                document.getElementById("weather").textContent =
                    `${temperature}°C · ${condition}`;

            }

            catch {

                document.getElementById("weather").textContent =
                    "Unavailable";

            }

        },

        function() {

            document.getElementById("weather").textContent =
                "Location denied";

        }

    );

}


function getWeatherCondition(code) {

    if (code === 0)
        return "Clear";

    if (code <= 3)
        return "Cloudy";

    if (code <= 48)
        return "Fog";

    if (code <= 67)
        return "Rain";

    if (code <= 77)
        return "Snow";

    if (code <= 82)
        return "Showers";

    if (code >= 95)
        return "Storm";

    return "Unknown";

}

getWeather();


/* =========================
   SWITCH PANELS
========================= */

function showStopwatch() {

    document.getElementById("stopwatch")
        .classList.remove("hidden");

    document.getElementById("timer")
        .classList.add("hidden");

}


function showTimer() {

    document.getElementById("timer")
        .classList.remove("hidden");

    document.getElementById("stopwatch")
        .classList.add("hidden");

}


/* =========================
   STOPWATCH
========================= */

let stopwatchTime = 0;

let stopwatchInterval = null;

function updateStopwatchDisplay() {

    const hours =
        Math.floor(stopwatchTime / 3600);

    const minutes =
        Math.floor((stopwatchTime % 3600) / 60);

    const seconds =
        stopwatchTime % 60;

    document.getElementById("stopwatchDisplay")
        .textContent =
        `${String(hours).padStart(2, "0")}:` +
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;

}


function startStopwatch() {

    if (stopwatchInterval !== null)
        return;

    stopwatchInterval = setInterval(() => {

        stopwatchTime++;

        updateStopwatchDisplay();

    }, 1000);

}


function pauseStopwatch() {

    clearInterval(stopwatchInterval);

    stopwatchInterval = null;

}


function resetStopwatch() {

    pauseStopwatch();

    stopwatchTime = 0;

    updateStopwatchDisplay();

}


/* =========================
   TIMER
========================= */

let timerTime = 0;

let timerInterval = null;


function updateTimerDisplay() {

    const minutes =
        Math.floor(timerTime / 60);

    const seconds =
        timerTime % 60;

    document.getElementById("timerDisplay")
        .textContent =
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;

}


function startTimer() {

    if (timerInterval !== null)
        return;

    if (timerTime === 0) {

        const minutes =
            parseInt(document.getElementById("timerMinutes").value) || 0;

        const seconds =
            parseInt(document.getElementById("timerSeconds").value) || 0;

        timerTime =
            (minutes * 60) + seconds;

    }

    if (timerTime <= 0)
        return;

    timerInterval = setInterval(() => {

        timerTime--;

        updateTimerDisplay();

        if (timerTime <= 0) {

            clearInterval(timerInterval);

            timerInterval = null;

            alert("Timer finished.");

        }

    }, 1000);

}


function pauseTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

}


function resetTimer() {

    pauseTimer();

    timerTime = 0;

    updateTimerDisplay();

}
