# 🏨 Monitora Vagas

> Modern hotel vacancy monitoring web application with real-time API integration

**Version**: 1.3.1  
**Last Updated**: 2025-12-09  
**Status**: ✅ Production Ready

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
- [License](#license)

---

## 🎯 Overview

Monitora Vagas is a responsive web application that helps users search for hotel vacancies through integration with the Busca Vagas API. The application features a modern, mobile-first design with comprehensive form validation and real-time API communication.

### Key Highlights

✅ **Real-time Hotel Data** - Dynamic dropdown populated from live API  
✅ **Responsive Design** - Mobile, tablet, and desktop optimized  
✅ **API Integration** - Full integration with Busca Vagas API v1.2.1  
✅ **Comprehensive Testing** - 26 E2E tests with automatic API management  
✅ **Production Ready** - Deployed and fully functional

---

## ✨ Features

### User Features

- **Hotel Selection** - 25 hotels across multiple locations
- **Date Range Picker** - Intuitive check-in/check-out selection
- **Guest Counter** - Dynamic guest number management
- **Vacancy Search** - Real-time availability checking
- **Results Display** - Clear, organized hotel cards
- **Responsive UI** - Seamless mobile experience

### Technical Features

- **ES6 Modules** - Modern JavaScript architecture
- **API Client** - Robust error handling and retry logic
- **Environment Detection** - Automatic dev/prod configuration
- **CORS Support** - Cross-origin resource sharing enabled
- **Caching** - 5-minute cache for hotel data
- **Error Handling** - Comprehensive error messages

---

## 📁 Project Structure

```
monitora_vagas/
├── docs/                      # Documentation
│   ├── api/                   # API integration docs
│   ├── architecture/          # Architecture decisions
│   └── guides/                # Development guides
│
├── legacy/                    # Legacy code and prompts
│   └── prompts/               # Workflow templates
│
├── public/                    # Web application
│   ├── config/                # Environment configuration
│   │   ├── environment.js     # Environment detection
│   │   └── constants.js       # Application constants
│   │
│   ├── css/                   # Stylesheets
│   │   └── main.css          # Main application styles
│   │
│   ├── js/                    # JavaScript modules
│   │   ├── global.js         # Global utilities
│   │   └── guestCounter.js   # Guest counter component
│   │
│   ├── services/              # API services
│   │   └── apiClient.js      # Busca Vagas API client
│   │
│   ├── vendor/                # Third-party libraries
│   │   ├── jquery/           # jQuery
│   │   ├── bootstrap-wizard/ # Bootstrap Wizard
│   │   ├── datepicker/       # Date picker
│   │   ├── select2/          # Select2 dropdown
│   │   ├── font-awesome-4.7/ # Font Awesome icons
│   │   └── mdi-font/         # Material Design icons
│   │
│   ├── index.html            # Main application page
│   ├── sw.js                 # Service worker
│   └── favicon.ico           # Favicon
│
├── src/                       # Source files
│   └── js/                    # Additional JavaScript
│       └── global.js         # Global JavaScript utilities
│
├── tests/                     # Test suite
│   ├── test-index-e2e.py     # E2E tests (26 tests)
│   ├── run-index-tests.sh    # Test runner script
│   └── README.md             # Test documentation
│
└── requirements.txt           # Python dependencies
```

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

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start a web server**
   ```bash
   cd public
   python3 -m http.server 8080
   ```

4. **Access the application**
   ```
   http://localhost:8080/index.html
   ```

### Using with Local API

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
   http://localhost:8080/index.html
   (Automatically detects local API on port 3001)
   ```

---

## 🧪 Testing

### Quick Test Run

```bash
cd tests
./run-index-tests.sh
```

### Test Suite

**36 Comprehensive Tests** covering:
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

### Test Features

- **Automatic API Management** - Starts/stops local API server
- **Production Fallback** - Uses production API if local unavailable
- **Browser Logging** - Console output with grey styling
- **Health Checks** - Validates API connectivity
- **Screenshot Support** - Captures test failures

For detailed testing documentation, see:
📖 **[E2E Testing Guide](docs/guides/E2E_TESTING_GUIDE.md)**

---

## 📚 Documentation

### Guides

- **[Quick Start Guide](docs/guides/QUICK_START.md)** - Get started quickly
- **[E2E Testing Guide](docs/guides/E2E_TESTING_GUIDE.md)** - Complete testing documentation
- **[Local Testing Guide](docs/guides/LOCAL_TESTING_GUIDE.md)** - Local development setup
- **[Development Tools Guide](docs/guides/DEVELOPMENT_TOOLS_GUIDE.md)** - Development tools
- **[Git Best Practices](docs/guides/GIT_BEST_PRACTICES_GUIDE.md)** - Git workflow

### API Documentation

- **[API Integration Success](docs/api/API_INTEGRATION_SUCCESS.md)** - API integration guide
- **[API Client Usage](docs/api/API_CLIENT_USAGE_REVIEW.md)** - How to use API client
- **[Integration Checklist](docs/api/INTEGRATION_CHECKLIST.md)** - Integration steps

### Architecture

- **[Implementation Guide](docs/architecture/IMPLEMENTATION_GUIDE.md)** - Architecture overview
- **[No-Scroll Principle](docs/guides/NO_SCROLL_PRINCIPLE_GUIDE.md)** - Design philosophy
- **[Test Results Analysis](docs/architecture/TEST_RESULTS_ANALYSIS.md)** - Test insights

---

## 📦 Dependencies

### Python (Testing)

```
selenium==4.39.0      # Browser automation
colorama==0.4.6       # Terminal colors
```

### JavaScript (Runtime)

- **jQuery** - DOM manipulation
- **Bootstrap Wizard** - Multi-step forms
- **Daterangepicker** - Date selection
- **Moment.js** - Date formatting
- **Select2** - Enhanced dropdowns
- **Font Awesome** - Icons

### Development

- **Chrome/Chromium** - Browser testing
- **ChromeDriver** - Selenium driver
- **Python HTTP Server** - Local web server
- **Node.js** - API server

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
```

### API Client Configuration

Set in `public/services/apiClient.js`:

```javascript
timeout: {
  default: 30000,      // 30 seconds
  search: 60000,       // 60 seconds
  weekendSearch: 600000 // 10 minutes
}
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
**📅 Last Updated**: 2025-12-09  
**🚀 Version**: 1.3.1
