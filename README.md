# Busca de Vagas em Hotéis Sindicais

A modern web application to search and monitor hotel vacancies from trade union partnerships and sindicate conventions. Built with vanilla JavaScript, modern HTML5/CSS3, and Colorlib template integration for a professional user experience.

## Architecture

This application is currently a **frontend web application** with plans for future backend integration:

- **Frontend**: Modern JavaScript (ES6+) with Colorlib template integration
- **UI/UX**: Card-based design with blue gradient theme and responsive layout
- **Automation**: Selenium WebDriver integration for hotel vacancy searches (planned)
- **PWA Support**: Service Worker for offline capability and installable app experience

## Prerequisites

Before running this application, make sure you have:

1. **Modern Web Browser** (Chrome, Firefox, Edge, or Safari)
2. **Node.js** (v14 or higher) for package management (optional, for development)
3. **Python 3** for running UI tests (optional)
4. **Chrome browser** and **ChromeDriver** for Selenium tests (optional)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd monitora_vagas
```

2. Open the application:

Simply open `src/index.html` in your web browser, or use a local development server:

```bash
# Using Python 3
python3 -m http.server 8000

# Or using Node.js http-server (requires: npm install -g http-server)
http-server src -p 8000
```

Then navigate to `http://localhost:8000`

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

Run the automated UI test suite:

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
3. **QuickSearch Component**: Fast hotel search with trade union dropdown and date selection
4. **Regional Filters**: Search by coastal, mountain, interior, and capital regions
5. **Flexible Date Selection**: Month-based or specific date range options
6. **Responsive Design**: Mobile-first approach working on all devices (320px to 1200px+)
7. **PWA Capabilities**: Installable web app with offline support
8. **Material Design Icons**: Professional iconography with Font Awesome integration
9. **Modern Typography**: Roboto font family for clean, readable interface
10. **No-Scroll Design**: Above-the-fold optimization with progressive disclosure

### Planned Features

7. **Multi-Strategy Search**: Three sophisticated approaches (in development):
   - **🔍 API Search**: Direct AFPESP API integration
   - **🤖 Selenium Automation**: Headless browser automation
   - **🪟 Assisted Search**: Guided user interaction
8. **Trade Union Integration**: Connections to multiple sindicate partnerships
9. **Union Benefits Portal**: Special rates and premium offers for members
10. **Session Management**: User search history and preferences

## Search Strategy Details (Planned)

### 🔍 **API Search**

- **Method**: Direct HTTP requests to AFPESP API
- **Best For**: Fast results when CORS policies allow
- **Status**: In development

### 🤖 **Selenium Automation** 

- **Method**: Headless browser automation with intelligent patterns
- **Best For**: Reliable results regardless of API restrictions
- **Features**: Weekend detection, Brazilian date formatting, screenshot capture
- **Status**: Planned

### 🪟 **Assisted Search**

- **Method**: Guided workflow with step-by-step user interaction
- **Best For**: Users preferring direct AFPESP website interaction
- **Status**: Planned

## Features

### Frontend (Modern JavaScript + Colorlib Template)

- **Card-Based Layout**: Clean 90-line HTML structure (reduced from 692 lines)
- **Blue Gradient Theme**: Modern aesthetic with #4481eb to #04befe gradient
- **Component Architecture**: Modular JavaScript with ES6+ modules
- **QuickSearch Form**: Simplified hotel search with semantic HTML grouping
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
│   ├── main.js                      # JavaScript application logic
│   ├── App.js                       # Application component
│   ├── sw.js                        # Service Worker for PWA
│   ├── components/                  # UI Components
│   │   ├── QuickSearch/             # Quick search component
│   │   ├── SearchForm/              # Advanced search form
│   │   └── ResultsList/             # Results display
│   ├── pages/                       # Page components
│   ├── services/                    # API services
│   ├── config/                      # Configuration files
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
