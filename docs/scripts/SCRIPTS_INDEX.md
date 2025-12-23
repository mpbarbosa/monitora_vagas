# Scripts Index and Documentation

**Version:** 1.0.0  
**Last Updated:** 2024-12-23  
**Maintainer:** Development Team

This document provides a comprehensive index of all scripts in the Monitora Vagas project, including their purpose, usage, dependencies, and troubleshooting tips.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Utility Scripts](#utility-scripts)
- [Test Scripts](#test-scripts)
- [Script Standards](#script-standards)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The project includes 13 scripts organized into two categories:

1. **Utility Scripts** (3) - Development and maintenance tools
2. **Test Scripts** (10) - Automated testing and validation

All scripts follow consistent standards for headers, error handling, and color-coded output.

---

## 🔧 Utility Scripts

### 1. fix-css-symlink.sh

**Location:** Root  
**Purpose:** Fix CSS loading for file:// URLs  
**Runtime:** <1 minute

Replaces CSS symlink with real files to enable local file browsing.

**Usage:**
```bash
./fix-css-symlink.sh
```

**Alternatives:**
```bash
# Python HTTP Server
cd public && python3 -m http.server 8080

# Node.js HTTP Server  
npx http-server public -p 8080

# Keep files synced
rsync -av --delete src/styles/ public/css/
```

---

### 2. scripts/update-dependencies.sh

**Location:** scripts/  
**Purpose:** Phased npm dependency updates  
**Runtime:** 1-2 minutes per phase

Safely updates dependencies following documented phased approach.

**Usage:**
```bash
# All safe phases (0 + 1)
./scripts/update-dependencies.sh all

# Phase 0: Critical fixes
./scripts/update-dependencies.sh 0

# Phase 1: Safe updates (Bootstrap, markdownlint)
./scripts/update-dependencies.sh 1

# Phase 2: Jest upgrade (requires confirmation)
./scripts/update-dependencies.sh 2

# Run tests only
./scripts/update-dependencies.sh test
```

**Phases:**
- **Phase 0:** selenium-webdriver → devDependencies
- **Phase 1:** Bootstrap 5.3.8, markdownlint-cli 0.47.0
- **Phase 2:** Jest 30.2.0 (major upgrade)

---

### 3. run-tests.sh

**Location:** Root  
**Purpose:** Master test runner for CSS tests  
**Runtime:** 1-2 minutes

Interactive menu for running background color tests.

**Usage:**
```bash
./run-tests.sh

# Options:
# 1) Browser Test (visual)
# 2) Python Test (automated)
# 3) Start Web Server
# 4) All tests
# 5) Exit
```

---

## 🧪 Test Scripts

### Quick Reference Table

| Script | Tests | Runtime | Port | Prerequisites |
|--------|-------|---------|------|--------------|
| run-index-tests.sh | 36 E2E tests | 3-5 min | 8080 | Python, Selenium, Chrome |
| run-fr008a-tests.sh | Search lifecycle | 2-3 min | 3001 | Python, pytest, Selenium |
| run-booking-rules-tests.sh | BR-18, BR-19 | 2-3 min | 8766 | Python, pytest, Selenium |
| run-css-tests.sh | CSS validation | 1-2 min | 8080 | Python, Selenium |
| run_ui_tests.sh | Web UI suite | 3-5 min | 8080 | Python, Selenium |
| run-version-tests.sh | Version check | <1 min | N/A | Python, Node.js |
| start-local-testing.sh | Server setup | N/A | 3000/8080 | Node.js, Python |
| test_api_integration.sh | API validation | 1-2 min | N/A | curl |
| test-md3-migration.sh | MD3 migration | 2-3 min | 8080 | Python, Selenium |

---

### 4. tests/run-index-tests.sh

**36 comprehensive E2E tests for index.html**

**Coverage:**
- Page load & rendering (6)
- Form elements (5)
- Form validation (2)
- UI components (3)
- API integration (26)
- Responsive design (3)
- Accessibility (3)
- JavaScript (2)
- Performance (2)
- Integration workflows (2)
- Date picker (10)

**Usage:**
```bash
cd tests
./run-index-tests.sh [options]

# Options:
#   --e2e-only      E2E tests only
#   --browser-only  Browser tests only
#   --no-server     Skip server startup
#   --verbose       Detailed output
#   --help          Show help
```

---

### 5. tests/run-fr008a-tests.sh

**FR-008A: Search Lifecycle State Management**

**Tests:**
- Initial state validation
- During search state
- After search state
- Start New Search button
- Input enable/disable
- State transitions

**Usage:**
```bash
cd tests
./run-fr008a-tests.sh
```

**Environment:**
```bash
FR008A_TEST_URL="http://localhost:3001"
```

---

### 6. tests/run-booking-rules-tests.sh

**FR-014: Booking Rules Toggle (8 tests)**

**Coverage:**
- Toggle existence (AC-014.1)
- Default state enabled (AC-014.3)
- Label clarity (AC-014.2)
- State changes (AC-014.8)
- Accessibility attributes
- Form integration
- Visual feedback (AC-014.7)
- Container placement

**Usage:**
```bash
cd tests
./run-booking-rules-tests.sh
```

**Related Docs:**
- `docs/testing/FR-014-TEST-DOCUMENTATION.md`
- `docs/features/FR-014-IMPLEMENTATION-SUMMARY.md`

---

### 7. tests/run-css-tests.sh

**CSS Loading & Style Validation**

**Tests:**
- CSS file loading
- Background color validation
- Style application
- Visual regression

**Usage:**
```bash
cd tests
./run-css-tests.sh
```

---

### 8. tests/run_ui_tests.sh

**Web UI Selenium Test Suite**

**Features:**
- Auto environment setup
- Dependency checking
- Server management
- Screenshot capture
- Detailed reporting

**Usage:**
```bash
cd tests
./run_ui_tests.sh
```

**Environment:**
```bash
UI_TEST_SERVER_PORT=8080
UI_TEST_HEADLESS=1  # 0 for visible browser
```

---

### 9. tests/run-version-tests.sh

**Semantic Version Validation**

**Validates:**
- package.json version
- Python module versions
- Documentation versions
- CHANGELOG.md entries

**Usage:**
```bash
./tests/run-version-tests.sh
```

Must run from project root.

---

### 10. tests/start-local-testing.sh

**Local Development Server Setup**

**Starts:**
- Mock API server (port 3000)
- Web server (port 8080)

**Usage:**
```bash
cd tests
./start-local-testing.sh
```

**Access:**
- App: `http://localhost:8080/public/index.html`
- API: `http://localhost:3000/api`

Press Ctrl+C to stop servers.

---

### 11. tests/test_api_integration.sh

**API Integration Validation**

**Tests:**
- Health check endpoint
- Hotels list endpoint
- Search endpoint
- Weekend search endpoint
- Response format validation
- Error handling

**Usage:**
```bash
cd tests
./test_api_integration.sh
```

**Environment:**
```bash
API_BASE_URL="https://www.mpbarbosa.com/api"
API_TIMEOUT=30
```

---

### 12. tests/test-md3-migration.sh

**Material Design 3 Migration Tests**

**Coverage:**
- MD3 component existence
- Theming and colors
- Typography system
- Elevation and shadows
- State layers

**Usage:**
```bash
cd tests
./test-md3-migration.sh
```

---

## 📝 Script Standards

All scripts follow these standards:

### Header Format

```bash
#!/bin/bash
#
# Script Name
# Brief description
#
# Version: X.Y.Z
# Last Updated: YYYY-MM-DD
#
# Usage:
#   ./script-name.sh [options]
#
# Prerequisites:
#   - Requirement 1
#   - Requirement 2
#

set -e  # Exit on error
```

### Color Coding

```bash
RED='\033[0;31m'      # Errors
GREEN='\033[0;32m'    # Success
YELLOW='\033[1;33m'   # Warnings
BLUE='\033[0;34m'     # Info
NC='\033[0m'          # No Color

echo -e "${GREEN}✅ Success${NC}"
echo -e "${RED}❌ Error${NC}"
echo -e "${YELLOW}⚠️  Warning${NC}"
echo -e "${BLUE}ℹ️  Info${NC}"
```

### Error Handling

```bash
set -e  # Exit on error
trap 'echo "Error on line $LINENO"' ERR
```

---

## 🌍 Environment Variables

### Global Variables

| Variable | Default | Purpose | Scripts |
|----------|---------|---------|---------|
| `TEST_URL` | `http://localhost:8080` | Base test URL | Most test scripts |
| `API_BASE_URL` | `https://www.mpbarbosa.com/api` | API endpoint | test_api_integration.sh |
| `SERVER_PORT` | `8080` | Web server port | Multiple |
| `API_PORT` | `3000` | Mock API port | start-local-testing.sh |
| `HEADLESS` | `1` | Headless browser mode | Selenium scripts |
| `VERBOSE` | `0` | Verbose output | Multiple |

### Setting Variables

```bash
# Temporary
export VERBOSE=1
./tests/run-index-tests.sh

# Inline
VERBOSE=1 ./tests/run-index-tests.sh

# Permanent (~/.bashrc)
echo 'export VERBOSE=1' >> ~/.bashrc
```

---

## 🔧 Troubleshooting

### 1. Permission Denied

```bash
# Error: Permission denied
chmod +x script.sh
./script.sh
```

### 2. Port Already in Use

```bash
# Find and kill process
lsof -ti:8080
kill -9 $(lsof -ti:8080)

# Or use different port
SERVER_PORT=8081 ./script.sh
```

### 3. Python Dependencies Missing

```bash
# Install all dependencies
pip install -r requirements.txt

# Or specific package
pip install selenium
```

### 4. ChromeDriver Version Mismatch

```bash
# Update Chrome
google-chrome --version

# Upgrade Selenium (auto-manages ChromeDriver)
pip install --upgrade selenium
```

### 5. API Connection Timeout

```bash
# Check API availability
curl https://www.mpbarbosa.com/api/health

# Increase timeout
API_TIMEOUT=60 ./tests/test_api_integration.sh

# Use local mock API
cd tests && ./start-local-testing.sh
```

### 6. Test Hanging

```bash
# Run with verbose mode
VERBOSE=1 ./tests/script.sh

# Check zombie processes
ps aux | grep python
ps aux | grep chrome

# Kill hanging processes
pkill -f "python.*test"
pkill -f chrome

# Run with timeout
timeout 300 ./tests/script.sh
```

### 7. CSS Files Not Loading

```bash
# Use CSS fix script
./fix-css-symlink.sh

# Or start web server
cd public && python3 -m http.server 8080
```

### 8. Jest Tests Failing

```bash
# Clear Jest cache
npm run test:clear-cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Verbose test output
npm run test:api -- --verbose
```

### Debug Mode

```bash
# Show all commands
bash -x ./script.sh

# Or add temporarily
set -x  # Enable
# ... code ...
set +x  # Disable
```

---

## 📚 Related Documentation

- **[README.md](../../README.md)** - Project overview
- **[E2E Testing Guide](../guides/E2E_TESTING_GUIDE.md)** - Testing documentation
- **[Local Testing Guide](../guides/LOCAL_TESTING_GUIDE.md)** - Local setup
- **[FR-014 Test Documentation](../testing/FR-014-TEST-DOCUMENTATION.md)** - Booking rules tests
- **[DEPENDENCY_ANALYSIS_REPORT.md](../../DEPENDENCY_ANALYSIS_REPORT.md)** - Dependency updates

---

**Version:** 1.0.0  
**Last Updated:** 2024-12-23  
**Maintained by:** Development Team
