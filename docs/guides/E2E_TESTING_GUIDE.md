# 🧪 End-to-End Testing Guide

> Comprehensive guide for running and maintaining E2E tests for the Monitora Vagas web application

**Last Updated**: 2025-12-09  
**Version**: 1.0.0  
**Test Framework**: Selenium + Python unittest

---

## 📋 Table of Contents

- [Overview](#overview)
- [Test Infrastructure](#test-infrastructure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Test Architecture](#test-architecture)
- [Running Tests](#running-tests)
- [Test Suite Details](#test-suite-details)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Overview

The E2E test suite validates the complete user workflow for the Monitora Vagas hotel vacancy search application. Tests run in headless Chrome and verify:

- Page load and rendering
- Form element interactions
- API integration
- Responsive design
- Accessibility features
- JavaScript functionality

### Test Coverage

- **26 Test Cases** covering:
  - Page Load Tests (6 tests)
  - Form Interaction Tests (5 tests)
  - Form Validation Tests (2 tests)
  - UI Component Tests (3 tests)
  - Responsive Design Tests (3 tests)
  - Accessibility Tests (3 tests)
  - JavaScript Integration Tests (2 tests)
  - Performance Tests (2 tests)

---

## 🏗️ Test Infrastructure

### Directory Structure

```
tests/
├── test-index-e2e.py           # Main E2E test suite
├── run-index-tests.sh          # Test runner shell script
└── README.md                   # Test documentation
```

### Key Features

✅ **Automatic API Server Management**
- Attempts to start local API server on port 3001
- Falls back to production API if local unavailable
- Automatic cleanup after tests

✅ **Browser Automation**
- Headless Chrome for CI/CD compatibility
- Browser console logging for debugging
- Screenshot capabilities

✅ **Comprehensive Validation**
- Syntax checking for shell scripts
- Python dependencies verification
- API health checks

---

## 📦 Prerequisites

### System Requirements

- **Python**: 3.8+ (tested with 3.13)
- **Node.js**: 14+ (for local API server)
- **Chrome/Chromium**: Latest version
- **ChromeDriver**: Matching Chrome version

### Python Dependencies

Install required packages:

```bash
pip install selenium colorama
```

Or use requirements.txt:

```bash
pip install -r requirements.txt
```

### Node.js API Server

The local API server must be available at:
```
~/Documents/GitHub/busca_vagas/src/server.js
```

---

## 🚀 Quick Start

### Running All Tests

```bash
cd tests
./run-index-tests.sh
```

### Running Specific Test Types

```bash
# E2E tests only
./run-index-tests.sh --e2e-only

# Browser tests only
./run-index-tests.sh --browser-only

# With verbose output
./run-index-tests.sh --verbose

# Dry-run mode (see commands without executing)
./run-index-tests.sh --echo
```

### Running Individual Tests

```bash
# Run single test
python3 test-index-e2e.py IndexE2ETests.test_04_hotel_select_has_options

# Run all tests
python3 test-index-e2e.py
```

---

## 🏛️ Test Architecture

### API Server Strategy

The test suite implements an intelligent API server selection strategy:

1. **Local Server Priority**: Attempts to start local API on port 3001
2. **Health Check Validation**: Verifies server responds to `/api/health`
3. **Production Fallback**: Uses production API if local unavailable
4. **Automatic Cleanup**: Stops local server after tests complete

```python
# Test flow
setUpClass() → _start_api_server() → _check_api_server()
    ↓
Tests execute with selected API
    ↓
tearDownClass() → Stop API server (if started)
```

### Browser Configuration

```python
chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument('--window-size=1920,1080')
chrome_options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})
```

### Environment Detection

The test uses query parameters to override environment detection:

- **Local API**: `http://localhost:8080/index.html`
- **Production API**: `http://localhost:8080/index.html?useProductionAPI=true`

---

## 🧪 Test Suite Details

### test_04_hotel_select_has_options

**Purpose**: Validates hotel dropdown loads correctly from API

**Flow**:
1. Navigate to page
2. Wait for API response (7 seconds)
3. Check browser console for errors
4. Verify hotel select has ≥25 options
5. Log results

**Assertion**:
```python
self.assertGreaterEqual(len(options), 25, 
    "Hotel select should have at least 25 hotel options")
```

**Expected Output**:
- 26 total options (25 hotels + 1 default "Select a hotel")
- Grey-colored console logs
- Success message in green

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Selenium WebDriver Not Found

**Error**: `WebDriverException: 'chromedriver' executable needs to be in PATH`

**Solution**:
```bash
# Install ChromeDriver
sudo apt install chromium-chromedriver

# Or download manually
wget https://chromedriver.storage.googleapis.com/LATEST_RELEASE
```

#### 2. API Server Not Starting

**Error**: `Local API server not available on port 3001`

**Solution**:
```bash
# Check if API server path exists
ls ~/Documents/GitHub/busca_vagas/src/server.js

# Manually start server to check for errors
cd ~/Documents/GitHub/busca_vagas
PORT=3001 node src/server.js
```

#### 3. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3001`

**Solution**:
```bash
# Find and kill process using port 3001
lsof -ti:3001 | xargs kill -9

# Or use different port in test configuration
```

#### 4. Hotels Not Loading

**Error**: `Error loading hotels` in select dropdown

**Checks**:
- API server is running
- CORS is enabled (`Access-Control-Allow-Origin: *`)
- Network connectivity
- Browser console errors

**Debug**:
```python
# Add to test for debugging
logs = self.driver.get_log('browser')
for log in logs:
    print(log)
```

#### 5. Failed to Fetch Error

**Common Causes**:
- API server not fully initialized
- CORS misconfiguration
- Wrong API endpoint URL
- Network timeout

**Solution**:
- Increase wait time in test
- Verify API URL in browser console
- Check API server CORS headers
- Use `getHotels()` instead of `scrapeHotels()`

---

## 🎨 Test Output Styling

### Color Codes

- 🟢 **Green**: Success messages
- 🟡 **Yellow**: Warnings and info
- 🔴 **Red**: Errors and failures
- ⚪ **Grey**: Browser console logs (dimmed)

### Example Output

```
🔍 Checking API server availability...
✅ Local API server started and responding (PID: 12345)

🧪 test_04_hotel_select_has_options
Browser console logs:
  INFO: ✅ BuscaVagasAPIClient initialized with base URL: http://localhost:3001/api
  INFO: 🏨 Retrieved 25 hotels
Current URL: http://localhost:8080/index.html
Found 26 hotel options.
✅ 🏨 Hotel select has 26 option(s)
```

---

## 📊 Continuous Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          
      - name: Install Chrome
        run: |
          sudo apt-get update
          sudo apt-get install -y chromium-browser chromium-chromedriver
          
      - name: Run tests
        run: |
          cd tests
          ./run-index-tests.sh --e2e-only
```

---

## 🤝 Contributing

### Adding New Tests

1. Follow the existing test naming convention:
   ```python
   def test_##_descriptive_name(self):
       """📝 Description with emoji"""
   ```

2. Use colorama for output:
   ```python
   print(f"{Fore.GREEN}✅ Test passed{Style.RESET_ALL}")
   ```

3. Add proper wait times for async operations
4. Include browser console log checking
5. Update test count in class docstring

### Code Style

- Use descriptive test names
- Add docstrings with emoji indicators
- Include assertion messages
- Log test progress with colors
- Handle cleanup in tearDown methods

---

## 📚 Related Documentation

- [Local Testing Guide](./LOCAL_TESTING_GUIDE.md)
- [API Integration Guide](../api/API_INTEGRATION_SUCCESS.md)
- [Development Tools Guide](./DEVELOPMENT_TOOLS_GUIDE.md)
- [Quick Start Guide](./QUICK_START.md)

---

## 📝 Changelog

### Version 1.0.0 (2025-12-09)
- Initial E2E test suite implementation
- Automatic API server management
- 26 comprehensive test cases
- Browser console logging
- Production API fallback
- Grey-styled console output

---

**✅ Tests Maintained By**: Monitora Vagas Development Team  
**📧 Questions?**: Open an issue on GitHub
