# 🏨 Monitora Vagas

> Modern hotel vacancy monitoring web application with real-time API integration

**Version**: 2.1.0  
**Last Updated**: 2024-12-22  
**Status**: ✅ Production Ready (Enhanced)  
**Framework**: Bootstrap 5.3.3 + Custom CSS

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Testing](#testing)
- [Documentation](#documentation)
- [Dependencies](#dependencies)
- [Development](#development)
- [Changelog](#changelog)
- [License](#license)

---

## 🎯 Overview

Monitora Vagas is a responsive web application that helps users search for hotel vacancies through integration with the Busca Vagas API. The application features a modern, mobile-first design with comprehensive form validation and real-time API communication.

### Key Highlights

✅ **Bootstrap 5.3.3** - Latest Bootstrap framework integrated  
✅ **Real-time Hotel Data** - Dynamic dropdown populated from live API  
✅ **Responsive Design** - Mobile, tablet, and desktop optimized  
✅ **API Integration** - Full integration with Busca Vagas API v1.2.1  
✅ **Client-side Caching** - Local storage cache for hotel data  
✅ **Search Lifecycle Management** - FR-008A implemented with state-driven UI  
✅ **Referential Transparency** - Pure functional API client with dependency injection  
✅ **Comprehensive Testing** - Unit, E2E, and integration test suites  
✅ **Code Quality** - ESLint with no-this rule for functional programming  
✅ **Production Ready** - Deployed and fully functional

---

## ✨ Features

### User Features

- **Hotel Selection** - 25 hotels across multiple locations
- **Date Range Picker** - Native HTML5 date inputs (ISO 8601 format)
- **Guest Counter** - Dynamic guest number management
- **Booking Rules Toggle** - Enable/disable booking validation rules (FR-014)
- **Vacancy Search** - Real-time availability checking
- **Results Display** - Clear, organized hotel cards
- **Responsive UI** - Seamless mobile experience

### Technical Features

- **Bootstrap 5.3.3** - Modern UI framework with responsive utilities
- **ES6 Modules** - Modern JavaScript architecture
- **API Client** - Robust error handling and retry logic
- **Hotel Cache** - LocalStorage-based caching system with TTL
- **Environment Detection** - Automatic dev/prod configuration
- **CORS Support** - Cross-origin resource sharing enabled
- **Caching** - 5-minute cache for hotel data
- **Error Handling** - Comprehensive error messages
- **No jQuery Required** - Bootstrap 5 uses vanilla JavaScript

---

### Utility Scripts

#### CSS Symlink Fix (`fix-css-symlink.sh`)

**Purpose:** Resolves CSS loading issues when using `file://` URLs by replacing symbolic links with actual CSS files.

**Problem:** The `public/css` directory is a symbolic link to `src/styles/`, which doesn't work with `file://` protocol in browsers.

**Solution:** Replaces the symlink with actual CSS files, enabling local file browsing without a web server.

**Usage:**
```bash
# Run the script (interactive)
./fix-css-symlink.sh

# The script will:
# 1. Show current symlink setup
# 2. Ask for confirmation
# 3. Remove symlink and create real directory
# 4. Copy CSS files from src/styles to public/css
# 5. Display file structure and sizes
```

**When to Use:**
- Opening `index.html` directly in browser (`file://` URL)
- CSS styles not loading in local development
- Need offline development without web server

**Alternative Solutions (provided by script):**
```bash
# Option 1: Python HTTP Server
cd public && python3 -m http.server 8080

# Option 2: Node.js HTTP Server
npx http-server public -p 8080

# Option 3: PHP Built-in Server
cd public && php -S localhost:8080
```

**To Keep Files in Sync:**
```bash
# Sync src/styles to public/css
rsync -av --delete src/styles/ public/css/
```

#### Dependency Updates (`scripts/update-dependencies.sh`)

**Purpose:** Safely update npm dependencies following the phased approach from `DEPENDENCY_ANALYSIS_REPORT.md`.

**Features:**
- Phased updates (critical → safe → major)
- Interactive confirmation for breaking changes
- Automatic test suite execution
- Color-coded output for status

**Usage:**
```bash
# Run all safe updates (Phase 0 + Phase 1)
./scripts/update-dependencies.sh all

# Phase 0: Critical fixes only
./scripts/update-dependencies.sh 0
# or
./scripts/update-dependencies.sh critical

# Phase 1: Safe updates (Bootstrap, markdownlint)
./scripts/update-dependencies.sh 1
# or
./scripts/update-dependencies.sh safe

# Phase 2: Jest upgrade (requires confirmation)
./scripts/update-dependencies.sh 2
# or
./scripts/update-dependencies.sh jest

# Run test suite only
./scripts/update-dependencies.sh test
```

**Update Phases:**

**Phase 0 - Critical Fixes:**
- Moves `selenium-webdriver` to devDependencies (classification fix)
- No breaking changes
- Safe to run anytime

**Phase 1 - Safe Updates:**
- Bootstrap: `5.3.3` → `5.3.8` (patch update)
- markdownlint-cli: `0.43.0` → `0.47.0` (minor update)
- No breaking changes
- Automatic test recommendation

**Phase 2 - Jest Upgrade:**
- Jest: `29.7.0` → `30.2.0` (major version)
- @jest/globals: `29.7.0` → `30.2.0`
- jest-environment-jsdom: `29.7.0` → `30.2.0`
- Requires manual confirmation
- **Must run full test suite after**

**Post-Update Steps:**
```bash
# 1. Review changes
git diff package.json package-lock.json

# 2. Run test suite
npm run test:all

# 3. Commit changes
git add package.json package-lock.json
git commit -m "chore(deps): update dependencies - Phase 1 complete"
```

**Environment Variables:**
None required - script uses default npm configuration.

---

## 📁 Project Structure

```
monitora_vagas/
├── public/                    # Static assets (not processed)
│   ├── vendor/                # Third-party libraries
│   │   ├── jquery/           # jQuery
│   │   ├── bootstrap-wizard/ # Bootstrap Wizard
│   │   ├── datepicker/       # Date picker
│   │   ├── select2/          # Select2 dropdown
│   │   ├── font-awesome-4.7/ # Font Awesome icons
│   │   └── mdi-font/         # Material Design icons
│   ├── archived-versions/     # Archived HTML versions
│   ├── index.html            # Main HTML file
│   ├── sw.js                 # Service worker
│   └── favicon.ico           # Favicon
│
├── src/                       # Source code (processed)
│   ├── assets/                # Dynamic assets
│   │   ├── fonts/            # Web fonts
│   │   ├── icons/            # SVG icons
│   │   └── images/           # Images
│   │
│   ├── services/              # API & external services
│   │   ├── apiClient.js      # Busca Vagas API client (pure functional) ✅
│   │   └── hotelCache.js     # Hotel data caching ✅
│   │
│   ├── js/                    # JavaScript modules
│   │   ├── global.js         # Global initialization ✅
│   │   ├── guestCounter.js   # Guest counter ✅
│   │   ├── guestNumberFilter.js # Guest filtering ✅
│   │   ├── hotelSearch.js    # Hotel search logic ✅
│   │   └── searchLifecycleState.js # FR-008A search state management ✅
│   │
│   ├── config/                # Configuration
│   │   └── environment.js    # Environment vars ✅
│   │
│   ├── styles/                # Stylesheets
│   │   ├── components/       # Component styles
│   │   ├── global/           # Global styles
│   │   ├── pages/            # Page styles
│   │   ├── main.css          # Main stylesheet ✅
│   │   └── index-page.css    # Index page styles ✅
│   │
│   ├── components/           # Empty (future React components)
│   └── utils/                # Empty (future utility functions)
│
├── tests/                     # Test suite
│   ├── e2e/                   # End-to-end tests
│   │   └── apiClient.e2e.test.js # API client E2E tests
│   ├── integration/           # Integration tests
│   ├── unit/                  # Unit tests
│   │
│   ├── apiClient.test.js     # API client unit tests (Jest)
│   ├── test_apiClient_pure_functions.js # Pure function tests
│   ├── test_search_lifecycle_state.py # FR-008A state tests
│   ├── test-index-e2e.py     # E2E tests (26 tests)
│   ├── test-css-loading.py   # CSS loading tests
│   ├── test-css-automated.py # Automated CSS tests
│   ├── test-background-color.py # Background color tests
│   │
│   ├── run-index-tests.sh    # Test runner script
│   ├── run-css-tests.sh      # CSS test runner
│   ├── run-fr008a-tests.sh   # FR-008A test runner
│   │
│   ├── API_CLIENT_TEST_README.md
│   ├── E2E_TEST_SUMMARY.md
│   ├── JEST_SETUP_COMPLETE.md
│   ├── CSS_TEST_SUITE_README.md
│   ├── CSS_LOADING_TEST_README.md
│   ├── BACKGROUND_COLOR_TEST_README.md
│   └── TEST_SUITE_README.md
│
├── docs/                       # Comprehensive documentation
│   ├── README.md             # Documentation index
│   ├── api/                  # API documentation
│   ├── architecture/         # Architecture decisions
│   ├── features/             # Feature specifications
│   ├── guides/               # Development guides
│   ├── implementation/       # Technical implementation
│   ├── specifications/       # Technical specifications
│   ├── styling/              # CSS and visual design
│   ├── testing/              # Test documentation
│   ├── troubleshooting/      # Problem solving guides
│   └── workflows/            # Development workflows
│
├── .github/                   # GitHub-specific files
│   ├── dependabot.yml        # Automated dependency updates
│   ├── FOLDER_STRUCTURE_GUIDE.md
│   ├── HTML_CSS_JS_SEPARATION.md
│   ├── HIGH_COHESION_GUIDE.md
│   ├── LOW_COUPLING_GUIDE.md
│   └── REFERENTIAL_TRANSPARENCY.md
│
├── .nvmrc                     # Node.js version specification
├── .npmrc                     # NPM configuration
├── .workflow-config.yaml      # AI workflow automation config
├── CHANGELOG.md               # Version history
├── package.json               # Node.js dependencies
├── eslint.config.js           # ESLint configuration (no-this rule)
├── jest.config.js             # Jest test configuration
├── vite.config.js             # Vite build config (future)
├── run-tests.sh               # Main test runner
└── requirements.txt           # Python dependencies
```

> 📖 **For detailed structure documentation, see:** [docs/architecture/PROJECT_STRUCTURE.md](docs/architecture/PROJECT_STRUCTURE.md)

### v2.0 Structure Changes

**What Changed:**
- ✅ Removed symlinks from `public/` folder
- ✅ All source code organized in `src/` directory
- ✅ Clear separation: `public/` for static, `src/` for source
- ✅ Follows modern web development best practices
- ✅ Prepared for future build tool integration

**Key Improvements:**
- Better organization and maintainability
- Clear separation of concerns
- Easier testing and development
- Ready for Vite/Webpack integration
- No duplicate files or symlinks

---

## 🚀 Quick Start

### Prerequisites

- **Python**: 3.8+ (for testing)
- **Node.js**: 14+ (for local API server)
- **Chrome**: Latest version
- **Web Server**: Any HTTP server

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mpbarbosa/monitora_vagas.git
   cd monitora_vagas
   ```

2. **Install dependencies**
   ```bash
   # Python dependencies (for testing)
   pip install -r requirements.txt
   
   # Node.js dependencies (optional, for future builds)
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # This runs: python3 -m http.server 8080
   ```

4. **Access the application**
   ```
   http://localhost:8080/public/index.html
   ```

### API Configuration

By default, the application uses the **production API** at `https://www.mpbarbosa.com/api`.

**To use a local mock API for development:**

1. **Start the mock API server**
   ```bash
   node docs/api/mock-api-server.js
   ```

2. **Access with local API**
   ```
   http://localhost:8080/public/index.html?useLocalAPI=true
   ```

**To use the real Busca Vagas API locally:**

1. **Clone Busca Vagas API**
   ```bash
   git clone https://github.com/mpbarbosa/busca_vagas.git
   cd busca_vagas
   npm install
   ```

2. **Start API server**
   ```bash
   PORT=3001 node src/server.js
   ```

3. **Access with local API**
   ```
   http://localhost:8080/public/index.html?useLocalAPI=true
   ```

---

## 🧪 Testing

### Quick Test Run

**Run All Tests:**
```bash
./run-tests.sh
```

### Test Scripts Overview

| Script | Purpose | Location | Runtime |
|--------|---------|----------|---------|
| `run-tests.sh` | Master test runner for background color tests | Root | 1-2 min |
| `run-index-tests.sh` | Comprehensive index.html E2E tests (36 tests) | `tests/` | 3-5 min |
| `run-fr008a-tests.sh` | Search lifecycle state management tests | `tests/` | 2-3 min |
| `run-booking-rules-tests.sh` | Booking rules toggle tests (BR-18, BR-19) | `tests/` | 2-3 min |
| `run-css-tests.sh` | CSS loading and style validation tests | `tests/` | 1-2 min |
| `run_ui_tests.sh` | Web UI Selenium test setup and runner | `tests/` | 3-5 min |
| `run-version-tests.sh` | Semantic version validation (Python + JS) | `tests/` | <1 min |
| `start-local-testing.sh` | Starts mock API + web server for testing | `tests/` | N/A (server) |
| `test_api_integration.sh` | API integration validation against spec | `tests/` | 1-2 min |
| `test-md3-migration.sh` | Material Design 3 migration tests | `tests/` | 2-3 min |

### Detailed Test Commands

**Run API Client Tests (Unit):**
```bash
npm run test:api
```

**Run API Client E2E Tests:**
```bash
npm run test:api:e2e
```

**Run FR-008A Tests:**
```bash
cd tests
./run-fr008a-tests.sh
```

**Run Index Tests:**
```bash
cd tests
./run-index-tests.sh
```

**Run CSS Tests:**
```bash
cd tests
./run-css-tests.sh
```

### Test Suite

**API Client Tests:**
- ✅ **Unit Tests** (100+ assertions) - Pure function validators, URL builders, error handlers
- ✅ **E2E Tests** - Real API integration, cache behavior, error scenarios
- ✅ **Referential Transparency** - Dependency injection, time-based testing

**Search Lifecycle Tests (FR-008A):**
- ✅ Initial state validation
- ✅ During search state management
- ✅ After search state behavior
- ✅ "Start New Search" button functionality
- ✅ Input enable/disable states

**Index Tests (36 tests):**
- ✅ Page load and rendering (6 tests)
- ✅ Form element interactions (5 tests)
- ✅ Form validation (2 tests)
- ✅ UI components (3 tests)
- ✅ API integration (26 hotel options)
- ✅ Responsive design (mobile/tablet/desktop) (3 tests)
- ✅ Accessibility features (3 tests)
- ✅ JavaScript functionality (2 tests)
- ✅ Performance (2 tests)
- ✅ Integration workflows (2 tests)
- ✅ Date picker functionality (10 tests)

**CSS Tests:**
- ✅ CSS file loading validation
- ✅ Background color verification
- ✅ Style application tests
- ✅ Visual regression tests

### Test Features

- **Automatic API Management** - Starts/stops local API server
- **Production Fallback** - Uses production API if local unavailable
- **Browser Logging** - Console output with grey styling
- **Health Checks** - Validates API connectivity
- **Screenshot Support** - Captures test failures
- **Automated CSS Validation** - Python-based CSS testing

For detailed testing documentation, see:
📖 **[E2E Testing Guide](docs/guides/E2E_TESTING_GUIDE.md)**

---

## 📚 Documentation

### Guides

- **[Quick Start Guide](docs/guides/QUICKSTART.md)** - Get started quickly
- **[E2E Testing Guide](docs/guides/E2E_TESTING_GUIDE.md)** - Complete testing documentation
- **[Local Testing Guide](docs/guides/LOCAL_TESTING_GUIDE.md)** - Local development setup
- **[Development Tools Guide](docs/guides/DEVELOPMENT_TOOLS_GUIDE.md)** - Development tools
- **[Git Best Practices](docs/guides/GIT_BEST_PRACTICES_GUIDE.md)** - Git workflow

### API Documentation

- **[API Documentation](docs/api/API_DOCUMENTATION.md)** - 📖 Complete API reference (START HERE)
- **[API Client Functional Requirements](docs/features/API_CLIENT_FUNCTIONAL_REQUIREMENTS.md)** - Complete FR specs
- **[API Client Quick Reference](docs/features/API_CLIENT_QUICK_REFERENCE.md)** - Quick lookup guide
- **[API Client Referential Transparency Analysis](docs/api/APICLIENT_REFERENTIAL_TRANSPARENCY_ANALYSIS.md)** - Pure function analysis
- **[API Client Improvements v1.1](docs/api/APICLIENT_IMPROVEMENTS_v1.1.md)** - Enhancement summary
- **[API Documentation Index](docs/api/README.md)** - API docs overview
- **[API Integration Update](docs/api/API_INTEGRATION_UPDATE.md)** - Latest integration guide
- **[API Integration Success](docs/api/API_INTEGRATION_SUCCESS.md)** - Integration success stories
- **[API Client Usage](docs/api/API_CLIENT_USAGE_REVIEW.md)** - Client usage patterns
- **[Integration Checklist](docs/api/INTEGRATION_CHECKLIST.md)** - Integration steps

### Architecture

- **[Documentation Index](docs/README.md)** - Complete documentation navigation
- **[Implementation Guide](docs/architecture/IMPLEMENTATION_GUIDE.md)** - Architecture overview
- **[No-Scroll Principle](docs/guides/NO_SCROLL_PRINCIPLE_GUIDE.md)** - Design philosophy
- **[Test Results Analysis](docs/architecture/TEST_RESULTS_ANALYSIS.md)** - Test insights
- **[State-Driven UI Pattern](docs/architecture/STATE_DRIVEN_UI_PATTERN.md)** - UI state management

### Code Quality & Best Practices

- **[High Cohesion Guide](.github/HIGH_COHESION_GUIDE.md)** - High cohesion principles
- **[Low Coupling Guide](.github/LOW_COUPLING_GUIDE.md)** - Low coupling patterns
- **[HTML/CSS/JS Separation](.github/HTML_CSS_JS_SEPARATION.md)** - Separation of concerns
- **[Referential Transparency](.github/REFERENTIAL_TRANSPARENCY.md)** - Pure function guidelines

### Technical Specifications

- **[Functional Requirements](docs/features/FUNCTIONAL_REQUIREMENTS.md)** - 📋 Complete requirements FR-001 to FR-014
- **[FR-008A Implementation](docs/features/FR-008A_IMPLEMENTATION_SUMMARY.md)** - Search lifecycle state management
- **[FR-014 Implementation](docs/features/FR-014-IMPLEMENTATION-SUMMARY.md)** - Booking rules toggle feature
- **[GUI Layout Technical Docs](docs/specifications/GUI_LAYOUT_TECHNICAL_DOCUMENTATION.md)** - UI layout specifications

### CSS & Styling

- **[Bootstrap Integration](docs/styling/BOOTSTRAP_INTEGRATION.md)** - 🆕 Bootstrap 5.3.3 setup and usage
- **[Colorlib Template Application](docs/styling/COLORLIB_TEMPLATE_APPLICATION.md)** - Template integration
- **[CSS Folders Comparison](docs/styling/CSS_FOLDERS_COMPARISON.md)** - CSS structure analysis
- **[Guest Button States](docs/styling/GUEST_BUTTONS_COMPLETE_GUIDE.md)** - UI state management
- **[CSS Loading Issue](docs/styling/CSS_LOADING_ISSUE.md)** - CSS troubleshooting

### Caching & Performance

- **[Hotel Cache Implementation](docs/implementation/HOTEL_CACHE_IMPLEMENTATION.md)** - Caching system details
- **[Hotel Cache Quick Reference](docs/implementation/HOTEL_CACHE_QUICK_REFERENCE.md)** - Cache usage guide

### Specifications

- **[HTML Specification](docs/specifications/HTML_SPECIFICATION.md)** - HTML standards
- **[Specification Formats](docs/specifications/SPECIFICATION_FORMATS_README.md)** - Format documentation

---

## 📦 Dependencies

### Python (Testing)

```
selenium==4.39.0      # Browser automation
colorama==0.4.6       # Terminal colors
```

### JavaScript (Runtime)

- **Bootstrap 5.3.3** - Modern UI framework (no jQuery needed)
- **jQuery** - DOM manipulation (legacy components)
- **Daterangepicker** - Date selection
- **Moment.js** - Date formatting
- **Select2** - Enhanced dropdowns
- **Font Awesome 4.7** - Icons
- **Material Design Icons** - Additional icons
- **ibira.js** - Functional API client library

### Development

- **Chrome/Chromium** - Browser testing
- **ChromeDriver** - Selenium driver
- **Python HTTP Server** - Local web server
- **Node.js** - API server
- **Jest** - JavaScript unit testing
- **ESLint** - Code linting (no-this rule enabled)

---

## 💻 Development

### Environment Configuration

The application automatically detects the environment:

**Development** (localhost)
- Uses local API on port 3001
- Enables verbose logging
- Disables caching

**Production** (deployed)
- Uses production API
- Minimal logging
- Enables caching

### Query Parameters

Override environment detection:

```
# Force production API
http://localhost:8080/index.html?useProductionAPI=true
```

### API Endpoints

**Local Development**
```
http://localhost:3001/api/vagas/hoteis        # Get hotels
http://localhost:3001/api/vagas/search        # Search vacancies
http://localhost:3001/api/health               # Health check
```

**Production**
```
https://www.mpbarbosa.com/api/vagas/hoteis
https://www.mpbarbosa.com/api/vagas/search
https://www.mpbarbosa.com/api/health
```

---

## 🔧 Configuration

### Environment Variables

Set in `public/config/environment.js`:

```javascript
NODE_ENV: 'development' | 'production'
API_BASE_URL: 'http://localhost:3001/api' | 'https://www.mpbarbosa.com/api'
PORT: 3000
CACHE_TTL: 300000  // 5 minutes
HOTEL_CACHE_TTL: 3600000  // 1 hour (LocalStorage cache)
```

### API Client Configuration

Set in `src/services/apiClient.js`:

```javascript
timeout: {
  default: 30000,      // 30 seconds
  search: 60000,       // 60 seconds
  weekendSearch: 600000 // 10 minutes
}
```

### Hotel Cache Configuration

Set in `src/services/hotelCache.js`:

```javascript
CACHE_KEY: 'hotelListCache'
CACHE_TTL: 3600000  // 1 hour
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Run tests** (`cd tests && ./run-index-tests.sh`)
5. **Commit changes** (`git commit -m 'feat: add amazing feature'`)
6. **Push to branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: new feature
fix: bug fix
docs: documentation changes
test: test updates
refactor: code refactoring
style: formatting changes
chore: maintenance tasks
```

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history and release notes.

### Latest Changes (v2.1.0 - December 22, 2024)

- 🎯 **Implemented FR-014: Booking Rules Toggle**
  - Bootstrap toggle switch for enabling/disabling booking validation rules
  - API parameter `applyBookingRules` (boolean)
  - Checked by default (rules enabled)
  - ARIA labels and tooltip for accessibility
  - Complete test suite with 281 lines of coverage

- 📁 **Documentation Restructure**
  - Organized into logical subdirectories (api/, features/, guides/, etc.)
  - Consolidated 5 guest button documents into complete guide
  - Moved QUICKSTART.md to docs/guides/
  - Enhanced navigation and discoverability

- 🔧 **Infrastructure Updates**
  - Added .nvmrc for Node.js version management (>=20.0.0)
  - Added .npmrc with optimized NPM settings
  - Added .workflow-config.yaml for AI workflow automation
  - Added .github/dependabot.yml for dependency updates
  - Added scripts/update-dependencies.sh automation script

- 🗄️ **Code Cleanup**
  - Removed src/archive/ directory (archived code no longer needed)
  - Cleaner project structure

### Previous Changes (v1.4.5)

- 🎯 **Implemented FR-004A: Guest Filter State Management**
  - Guest filter disabled on page load, enabled after first search
  - Visual feedback with opacity and status indicators
  - Full ARIA accessibility support
  - Smooth state transitions with animations

- 🎨 **Updated empty state message** - Changed from "Nenhuma Vaga Encontrada" to "Sem vagas disponíveis"
- ✅ **Updated unit tests** - Test expectations aligned with new message
- 📝 **Updated documentation** - CHANGELOG and test suite documentation updated

- ✅ **Fixed all E2E tests** - 36/36 tests passing (100% pass rate)
- 🔧 **Fixed UI test runner paths** - Tests now properly locate and execute
- 🎨 **Added CSS @import statements** - Modular architecture with 99.1% test pass rate
- 📝 **Updated test expectations** - Aligned with modern ES6 module architecture

---

## 📜 License

This project is part of the Monitora Vagas ecosystem.

---

## 🙏 Acknowledgments

- **Busca Vagas API** - Hotel vacancy data
- **Colorlib** - Base template inspiration
- **AFPESP** - Hotel network data source

---

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/mpbarbosa/monitora_vagas/issues)
- **API**: [Busca Vagas API](https://github.com/mpbarbosa/busca_vagas)

---

**✅ Built with ❤️ by the Monitora Vagas Team**  
**📅 Last Updated**: 2024-12-22  
**🚀 Version**: 2.1.0
