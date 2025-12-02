# Busca de Vagas em Hotéis Sindicais

A modern web application to search and monitor hotel vacancies from trade union partnerships and sindicate conventions. Built with vanilla JavaScript, modern HTML5/CSS3, and Colorlib template integration for a professional user experience.

## Architecture

This application is a **full-stack web application** with backend API integration:

- **Frontend**: Modern JavaScript (ES6+) with Colorlib template integration
- **Backend**: Integration with busca_vagas API (Puppeteer-based scraping)
- **UI/UX**: Card-based design with blue gradient theme and responsive layout
- **Automation**: Real-time AFPESP hotel vacancy searches via backend API
- **PWA Support**: Service Worker for offline capability and installable app experience
- **API Client**: Centralized service with timeout, retry, and caching capabilities

## Prerequisites

Before running this application, make sure you have:

1. **Modern Web Browser** (Chrome, Firefox, Edge, or Safari)
2. **Backend API** - The busca_vagas API must be running
   - Development: `http://localhost:3000/api`
   - Production: `https://www.mpbarbosa.com/api`
3. **Node.js** (v14 or higher) for package management (optional, for development)
4. **Python 3** for running UI tests (optional)
5. **Chrome browser** and **ChromeDriver** for Selenium tests (optional)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd monitora_vagas
```

2. **Start the backend API** (required):

```bash
# Clone and start the busca_vagas backend
git clone https://github.com/mpbarbosa/busca_vagas.git
cd busca_vagas
npm install
npm start
# API will run on http://localhost:3000
```

3. Open the application:

Simply open `src/index.html` in your web browser, or use a local development server:

```bash
# Using Python 3
python3 -m http.server 8000

# Or using Node.js http-server (requires: npm install -g http-server)
http-server src -p 8000
```

Then navigate to `http://localhost:8000`

**Note:** For full functionality, ensure the backend API is running before using the application.

## Usage

### Running the Application

**Option 1: Direct File Access**
Open `src/index.html` directly in your web browser.

**Option 2: Local Development Server**

Using Python 3:
```bash
cd src
python3 -m http.server 8000
```

Using Node.js http-server:
```bash
npm install -g http-server
http-server src -p 8000
```

Then open `http://localhost:8000` in your browser.

### Testing the Application

**API Client Tests:**
```bash
# Open the API test suite
cd src
python3 -m http.server 8000
# Navigate to http://localhost:8000/api-test.html
```

**UI Tests:**
```bash
# Install test dependencies
python3 -m pip install -r test_requirements.txt

# Run UI tests
python3 test_web_ui.py

# Or use the test script
bash run_ui_tests.sh
```

## What the application does

### Current Features

1. **Modern UI**: Colorlib-based search template with blue gradient theme
2. **Card-Based Design**: Simplified 90-line HTML structure with professional aesthetics
3. **QuickSearch Component**: Fast hotel search with dynamic hotel dropdown (API-loaded) and date selection
4. **Real-Time Vacancy Search**: Integration with busca_vagas backend API
   - Specific date range searches (30-60 seconds)
   - Weekend searches for up to 12 weekends (5-10 minutes)
5. **API Client Service**: Centralized API integration with:
   - Automatic environment detection (dev/production)
   - Timeout handling (30s-10min depending on endpoint)
   - Retry logic with exponential backoff
   - Response validation and error handling
   - Caching for hotel list (5 minutes)
6. **Regional Filters**: Search by coastal, mountain, interior, and capital regions
7. **Flexible Date Selection**: Month-based or specific date range options
8. **Responsive Design**: Mobile-first approach working on all devices (320px to 1200px+)
9. **PWA Capabilities**: Installable web app with offline support
10. **Material Design Icons**: Professional iconography with Font Awesome integration
11. **Modern Typography**: Roboto font family for clean, readable interface
12. **No-Scroll Design**: Above-the-fold optimization with progressive disclosure

### API Integration

The application integrates with the [busca_vagas API](https://github.com/mpbarbosa/busca_vagas) (v1.2.1) for real-time vacancy data:

- **GET /api/health** - Health check
- **GET /api/vagas/hoteis** - Static hotel list (cached)
- **GET /api/vagas/hoteis/scrape** - Scrape current hotels from AFPESP (includes "Todas" option with `type` field)
- **GET /api/vagas/search** - Search vacancies for specific dates
- **GET /api/vagas/search/weekends** - Search multiple weekends

**New in v1.2.1:** The `/api/vagas/hoteis/scrape` endpoint now includes the "Todas" (All) option with a `type` field to distinguish between "All" and "Hotel" entries.

See [API_CLIENT_USAGE_REVIEW.md](./API_CLIENT_USAGE_REVIEW.md) for detailed integration documentation.

### Planned Features

1. **Trade Union Integration**: Connections to multiple sindicate partnerships
2. **Union Benefits Portal**: Special rates and premium offers for members
3. **Session Management**: User search history and preferences
4. **Advanced Filters**: More granular search criteria
5. **Notification System**: Email/SMS alerts for vacancy availability

## Features

### Frontend (Modern JavaScript + Colorlib Template)

- **Card-Based Layout**: Clean 90-line HTML structure (reduced from 692 lines)
- **Blue Gradient Theme**: Modern aesthetic with #4481eb to #04befe gradient
- **Component Architecture**: Modular JavaScript with ES6+ modules
- **QuickSearch Form**: Simplified hotel search with dynamic API-loaded hotel dropdown
- **Progressive Disclosure**: Advanced search modal for additional filters
- **Form Validation**: Client-side validation before submission
- **Real-time Feedback**: Loading states and error messages
- **Mobile-First Design**: Responsive breakpoints from 320px to 1200px+
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **PWA Support**: Service worker with offline caching

### UI/UX Enhancements

- **No-Scroll Design**: Above-the-fold optimization for faster user action
- **Vendor Libraries**: Material Design Icons, Font Awesome, Select2, DateRangePicker
- **Typography**: Roboto font family with multiple weights
- **Color Consistency**: CSS variables for maintainable theming
- **High Contrast**: Ensures text visibility across all backgrounds
- **Z-Index Strategy**: Proper layering for form element interactivity

## Development

### Local Development Server

**Using Python 3:**
```bash
cd src
python3 -m http.server 8000
```

**Using Node.js:**
```bash
npm install -g http-server
http-server src -p 8000
```

Then open `http://localhost:8000` in your browser.

### Code Structure

The application uses vanilla JavaScript with ES6+ modules:
- `main.js` - Main application logic
- `components/` - UI components
- `services/` - API integration (planned)
- `utils/` - Helper functions

## Testing

### UI/Component Tests

Run Python-based Selenium tests:

```bash
# Install test dependencies
python3 -m pip install -r test_requirements.txt

# Run full UI test suite
python3 test_web_ui.py

# Run unit component tests
python3 test_unit_components.py

# Or use the test script
bash run_ui_tests.sh
```

### Test Coverage

- **Unit Tests**: 19 tests covering components, CSS, logic, and architecture (100% pass rate)
- **Functional Tests**: 21 tests covering page loading, forms, responsive design, and accessibility (48% pass rate)
- **Total**: 40 tests with 73% overall success rate

See [`docs/TEST_RESULTS_ANALYSIS.md`](./docs/TEST_RESULTS_ANALYSIS.md) for detailed test results.

## Project Structure

```plaintext
monitora_vagas/
├── src/                             # Frontend Application
│   ├── index.html                   # Main HTML entry (Colorlib template)
│   ├── api-test.html                # API client test suite
│   ├── main.js                      # JavaScript application logic
│   ├── App.js                       # Application component
│   ├── sw.js                        # Service Worker for PWA
│   ├── components/                  # UI Components
│   │   ├── QuickSearch/             # Quick search component (with API integration)
│   │   ├── SearchForm/              # Advanced search form
│   │   └── ResultsList/             # Results display
│   ├── pages/                       # Page components
│   ├── services/                    # API services
│   │   └── apiClient.js             # Centralized API client with timeout/retry/caching
│   ├── config/                      # Configuration files
│   │   ├── environment.js           # Environment detection & API URLs
│   │   └── app.js                   # App configuration
│   ├── utils/                       # Utility functions
│   ├── js/                          # JavaScript modules
│   ├── styles/                      # CSS stylesheets
│   │   ├── global/                  # Global styles
│   │   ├── components/              # Component styles
│   │   └── pages/                   # Page styles
│   ├── css/                         # Template CSS (Colorlib)
│   │   └── main.css                 # Main template styles
│   ├── vendor/                      # Third-party libraries
│   │   ├── mdi-font/                # Material Design Icons
│   │   ├── font-awesome-4.7/        # Font Awesome icons
│   │   ├── select2/                 # Select2 dropdown library
│   │   └── datepicker/              # Date range picker
│   └── assets/                      # Static resources (images, fonts)
│
├── docs/                            # Project documentation
│   ├── README.md                    # Documentation index
│   ├── ROADMAP.md                   # Development roadmap
│   ├── TEST_RESULTS_ANALYSIS.md     # Test results and analysis
│   ├── DEVELOPMENT_TOOLS_GUIDE.md   # Development tools reference
│   ├── GIT_BEST_PRACTICES_GUIDE.md  # Git workflow guide
│   ├── NO_SCROLL_PRINCIPLE_GUIDE.md # UI/UX design principles
│   └── QUICK_REFERENCE.md           # Quick command reference
│
├── API_CLIENT_USAGE_REVIEW.md       # API integration review
├── API_INTEGRATION_CHANGES.md       # Implementation summary
├── IMPLEMENTATION_GUIDE.md          # API integration guide
│
├── prompts/                         # AI workflow prompts
│   └── tests_documentation_update_enhanced.txt
│
├── test_screenshots/                # Test execution screenshots
├── selenium-script.js               # Legacy automation script
├── test_web_ui.py                   # UI test suite (Python/Selenium)
├── test_unit_components.py          # Component unit tests
├── run_ui_tests.sh                  # Test execution script
├── package.json                     # Node.js dependencies
├── CHANGELOG.md                     # Version history
├── TRANSFORMATION_SUMMARY.md        # Project transformation history
└── README.md                        # This file
```

## API Endpoints (Planned)

The following API endpoints are planned for future backend integration:

### Search Endpoints
- `POST /api/search/hotels` - Search hotels by criteria
- `GET /api/search/regions` - Get available regions
- `GET /api/search/unions` - Get trade union list

### Automation Endpoints
- `POST /api/selenium/search` - Selenium-based search
- `GET /api/selenium/status` - WebDriver status

### User Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/user/history` - Search history

## Environment Variables (For Future Backend)

When backend is implemented, create a `.env` file:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Selenium
SELENIUM_HEADLESS=true
CHROME_DRIVER_PATH=/usr/local/bin/chromedriver

# API Keys
AFPESP_API_KEY=your_api_key_here
```

## Documentation

- [`CHANGELOG.md`](./CHANGELOG.md) - Version history and recent changes
- [`TRANSFORMATION_SUMMARY.md`](./TRANSFORMATION_SUMMARY.md) - Project transformation journey
- [`docs/ROADMAP.md`](./docs/ROADMAP.md) - Development roadmap and future plans
- [`docs/TEST_RESULTS_ANALYSIS.md`](./docs/TEST_RESULTS_ANALYSIS.md) - Comprehensive test analysis
- [`docs/DEVELOPMENT_TOOLS_GUIDE.md`](./docs/DEVELOPMENT_TOOLS_GUIDE.md) - Development tools and commands
- [`docs/NO_SCROLL_PRINCIPLE_GUIDE.md`](./docs/NO_SCROLL_PRINCIPLE_GUIDE.md) - UI/UX design principles
- [`docs/GIT_BEST_PRACTICES_GUIDE.md`](./docs/GIT_BEST_PRACTICES_GUIDE.md) - Git workflow guide
- [`docs/QUICK_REFERENCE.md`](./docs/QUICK_REFERENCE.md) - Quick command reference
- [`docs/`](./docs/) - Complete technical documentation

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
