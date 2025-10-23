# Busca de Vagas em Hotéis Sindicais

A modern web application to search and monitor hotel vacancies from trade union partnerships and sindicate conventions.

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

## What the application does

1. **Modern Web Interface**: Provides a sleek, responsive web interface for searching hotel vacancies
2. **Trade Union Integration**: Connects multiple sindicate and federation hotel partnerships
3. **Smart Search**: Filters hotels by region, stay type, and available periods
4. **Real-time Updates**: Monitors availability and provides instant notifications
5. **Mobile Responsive**: Works perfectly on desktop, tablet, and smartphone devices
6. **Union Benefits**: Highlights exclusive discounts and special rates for union members

## Features

- **Regional Search**: Filter hotels by coastal, mountain, interior, and capital regions
- **Flexible Booking**: Choose between weekend stays or full-week vacations
- **Union Discounts**: Access exclusive rates negotiated by trade unions
- **Modern UI**: Job search platform-inspired design with gradient backgrounds
- **Portuguese Interface**: Fully localized for Brazilian users
- Extract specific data from the page
- Run in headless mode
## Development

To start the development server:

```bash
# Simple HTTP server for testing
python -m http.server 8080
# or
python3 -m http.server 8080

# Then open http://localhost:8080/src in your browser
```

## Testing

Run the comprehensive UI test suite:

```bash
# Install test dependencies
pip install -r test_requirements.txt

# Run UI tests
python simple_ui_test.py
```

## Project Structure

- `src/` - Main application source code
- `src/pages/` - Page components (Home, etc.)
- `src/components/` - Reusable UI components
- `src/styles/` - CSS styling with modern design system
- `src/assets/` - Images, icons, and static resources
- `docs/` - Project documentation
