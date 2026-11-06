# COVID-19 Early Outbreak Dashboard

## Overview

This dashboard visualizes the early outbreak phase of COVID-19 (February - March 2020) across five key countries. It allows researchers to track cumulative trends and daily new cases from the first recorded cases outside China up to the WHO pandemic declaration.

## Setup Instructions

1. Ensure all files (`index.html`, `styles.css`, `app.js`, and `covid-19.json`) are in the same directory.
2. Because this project fetches a local JSON file, it cannot be run simply by double-clicking the HTML file in a browser (due to CORS restrictions).
3. **To run locally:** Open the project folder in VS Code, right-click `index.html`, and select **"Open with Live Server"**.

## Decision-Making: Daily New Cases Calculation

The dataset only provides cumulative confirmed cases. To calculate the "Daily New Cases", the application subtracts the previous date's cumulative total from the current date's total. The first recorded date for each country is treated as the baseline new case count. Any data corrections that result in negative daily cases are floored to zero to prevent visual chart anomalies.

## Key Data Insights

- **China:** The data clearly shows the initial peak and rapid stabilization of confirmed cases throughout February.
- **Italy:** Demonstrates exponential growth beginning in early March, overtaking China's daily new case rate by the end of the month.
- **South Africa:** Highlights the delayed onset of the virus, with the first recorded case appearing precisely on March 5, 2020.
