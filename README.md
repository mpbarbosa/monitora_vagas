# Monitora Vagas

A Selenium automation script to monitor job vacancies on the AFPESP website.

## Prerequisites

Before running this script, make sure you have:

1. **Node.js** installed on your system
2. **Chrome browser** installed
3. **ChromeDriver** installed and in your PATH, or let Selenium manage it automatically

## Installation

1. Install the dependencies:
```bash
npm install
```

## Usage

Run the script:
```bash
npm start
```

Or directly with Node.js:
```bash
node selenium-script.js
```

## What the script does

1. Opens a Chrome browser window
2. Navigates to the AFPESP vagas page: https://associadoh.afpesp.org.br/Servicos/Reservas/Vagas-disponiveis.aspx
3. Waits for the page to load
4. Displays the page title
5. Waits for 3 seconds (so you can see the page)
6. Closes the browser

## Customization

You can modify the script to:
- Use a different browser (Firefox, Edge, etc.)
- Add more interactions with the page
- Extract specific data from the page
- Run in headless mode
- Add error handling and retries

## Browser Options

To run in headless mode, modify the script to include Chrome options:

```javascript
const chrome = require('selenium-webdriver/chrome');
const options = new chrome.Options();
options.addArguments('--headless');
const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
```
Página web para monitorar vagas nos hotéis AFPESP usando Selenium
