let covidData = [];
let lineChartInstance = null;
let barChartInstance = null;

// DOM Elements
const countrySelect = document.getElementById("countrySelect");
const metricConfirmed = document.getElementById("metric-confirmed");
const metricDeaths = document.getElementById("metric-deaths");
const metricRecovered = document.getElementById("metric-recovered");
const metricActive = document.getElementById("metric-active");

// 1. Load Data
async function initDashboard() {
  try {
    const response = await fetch("covid-19.json");
    const json = await response.json();
    covidData = json.countries;

    populateDropdown();

    // Listen for changes
    countrySelect.addEventListener("change", (e) => {
      updateDashboard(e.target.value);
    });

    // Initialize with the first country (China)
    updateDashboard(covidData[0].code);
  } catch (error) {
    console.error(
      "Error loading JSON. Ensure you are using a local server (like VS Code Live Server).",
      error,
    );
  }
}

// 2. Populate Country Selector
function populateDropdown() {
  covidData.forEach((countryObj) => {
    const option = document.createElement("option");
    option.value = countryObj.code;
    option.textContent = countryObj.country;
    countrySelect.appendChild(option);
  });
}

// 3. Update Dashboard on Selection
function updateDashboard(countryCode) {
  const countryData = covidData.find((c) => c.code === countryCode);
  if (!countryData) return;

  const timeSeries = countryData.data;
  const latestData = timeSeries[timeSeries.length - 1];

  updateMetrics(latestData);
  updateCharts(timeSeries);
}

// 4. Calculate and Update Metric Cards
function updateMetrics(latestData) {
  const confirmed = latestData.confirmed;
  const deaths = latestData.deaths;
  const recovered = latestData.recovered;
  // Calculation required by brief: confirmed - deaths - recoveries
  const active = confirmed - deaths - recovered;

  metricConfirmed.textContent = confirmed.toLocaleString();
  metricDeaths.textContent = deaths.toLocaleString();
  metricRecovered.textContent = recovered.toLocaleString();
  metricActive.textContent = active.toLocaleString();
}

// 5. Calculate Daily New Cases and Render Charts
function updateCharts(timeSeries) {
  const dates = timeSeries.map((d) => d.date);
  const confirmed = timeSeries.map((d) => d.confirmed);
  const deaths = timeSeries.map((d) => d.deaths);
  const recovered = timeSeries.map((d) => d.recovered);

  // Calculate Daily New Cases (decision making under ambiguity)
  // First recorded date is treated as the initial new cases.
  // Subsequent dates are (current - previous).
  const dailyNewCases = [];
  for (let i = 0; i < timeSeries.length; i++) {
    if (i === 0) {
      dailyNewCases.push(timeSeries[i].confirmed);
    } else {
      const newCases = timeSeries[i].confirmed - timeSeries[i - 1].confirmed;
      // Handle negative anomalies if data was corrected in reality
      dailyNewCases.push(newCases >= 0 ? newCases : 0);
    }
  }

  renderLineChart(dates, confirmed, deaths, recovered);
  renderBarChart(dates, dailyNewCases);
}

// 6. Chart.js Renderers
function renderLineChart(labels, confirmed, deaths, recovered) {
  const ctx = document.getElementById("lineChart").getContext("2d");

  if (lineChartInstance) lineChartInstance.destroy(); // Clear old chart

  lineChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Confirmed",
          data: confirmed,
          borderColor: "#f39c12",
          backgroundColor: "transparent",
          tension: 0.1,
        },
        {
          label: "Deaths",
          data: deaths,
          borderColor: "#e74c3c",
          backgroundColor: "transparent",
          tension: 0.1,
        },
        {
          label: "Recovered",
          data: recovered,
          borderColor: "#2ecc71",
          backgroundColor: "transparent",
          tension: 0.1,
        },
      ],
    },
    options: { responsive: true },
  });
}

function renderBarChart(labels, dailyNew) {
  const ctx = document.getElementById("barChart").getContext("2d");

  if (barChartInstance) barChartInstance.destroy(); // Clear old chart

  barChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Daily New Cases",
          data: dailyNew,
          backgroundColor: "rgba(52, 152, 219, 0.7)",
          borderColor: "rgba(52, 152, 219, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: { responsive: true },
  });
}

// Start the app
initDashboard();
