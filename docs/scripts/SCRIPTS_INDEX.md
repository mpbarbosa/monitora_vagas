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

The project includes 15 scripts organized into two categories:

1. **Utility Scripts** (5) - Development and maintenance tools
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

### 2. scripts/cleanup-artifacts.sh

**Location:** scripts/  
**Purpose:** Remove untracked workflow artifacts and temporary documentation  
**Runtime:** <1 minute

Cleans up temporary files generated during development, testing, or documentation workflows.

**Usage:**
```bash
# Preview what would be deleted (recommended first)
./scripts/cleanup-artifacts.sh --dry-run

# Interactive mode (asks for confirmation)
./scripts/cleanup-artifacts.sh --interactive

# Automatic cleanup (no prompts)
./scripts/cleanup-artifacts.sh

# Show help
./scripts/cleanup-artifacts.sh --help
```

**What It Cleans:**
- Workflow summary files (`*_SUMMARY.md`, `*_COMPLETE.md`)
- Analysis files (`*_ANALYSIS.md`, `ai_*.txt`)
- Test artifacts (`TEST_RESULTS.txt`, `test_screenshots/`)
- Temporary scripts (`check-*.sh`, `fix-*.sh`)

**Protected Files:**
- `README.md`, `CHANGELOG.md`, `KNOWN_ISSUES.md`
- All files in `docs/**/*.md`
- All files in `.github/**/*.md`

**Example Output:**
```
Found 42 workflow artifact(s):
  ✗ ALL_ISSUES_FIXED_SUMMARY.md (16K)
  ✗ TEST_GAP_RESOLUTION_SUMMARY.md (16K)
  ...
Total size: 440K

[DRY RUN] No files were deleted
```

**Best Practices:**
1. Run `--dry-run` first to preview
2. Use before commits to keep diffs clean
3. Run weekly during active development

**See Also:** [Artifact Management Guide](../guides/ARTIFACT_MANAGEMENT.md)

---

### 3. scripts/update-dependencies.sh

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

### 4. scripts/validate-config.sh

**Location:** scripts/  
**Purpose:** Config file validation  
**Runtime:** <30 seconds

Validates project configuration files (package.json, .nvmrc, etc.) for consistency.

**Usage:**
```bash
./scripts/validate-config.sh
```

---

## 🧪 Test Scripts

### 1. run-tests.sh

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

### 2. run-production-tests.sh

**Location:** Root  
**Purpose:** Production environment test suite runner  
**Runtime:** 3-5 minutes

Executes comprehensive tests against live production deployment.

**Usage:**
```bash
./run-production-tests.sh
```

**Tests Executed:**
1. **API Hotel List Verification** (`tests/use_cases/test_hotel_list_verification.py`)
   - Validates production API hotel list
- 📈 Pass rate calculation and reporting
- ⏱️ Timeout protection (180s for Selenium tests)
- 🎨 Color-coded output (green=pass, red=fail, yellow=skip)
- 📋 Comprehensive test summary
- ❌ Graceful failure handling

**Output Example:**
```
================================================================================
PRODUCTION TEST SUITE - MONITORA VAGAS
================================================================================

Target: https://www.mpbarbosa.com/submodules/monitora_vagas/public/

────────────────────────────────────────────────────────────────────────────
1. API Hotel List Verification
────────────────────────────────────────────────────────────────────────────
✅ PASSED (Hotel list API validation successful)

────────────────────────────────────────────────────────────────────────────
2. Selenium Browser Tests (UC-005)
────────────────────────────────────────────────────────────────────────────
✅ PASSED (Hotel dropdown populated correctly)

────────────────────────────────────────────────────────────────────────────
3. Production Validation Suite
────────────────────────────────────────────────────────────────────────────
✅ PASSED (All production validations passed)

================================================================================
TEST SUMMARY
================================================================================
Total Tests: 3
✅ Passed: 3
❌ Failed: 0
⏭️  Skipped: 0
📊 Pass Rate: 100.0%

🎉 ALL TESTS PASSED!
```

**Exit Codes:**
- `0`: All tests passed
- `1`: Some tests failed or prerequisites not met

**npm Integration:**
```bash
# Run from npm scripts
npm run test:production

# Or with custom URL (full path)
npm run test:production:full
```

**When to Use:**
- ✅ Before deploying new releases
- ✅ After production updates
- ✅ Weekly production health checks
- ✅ Incident investigation
- ✅ Regression testing

**Troubleshooting:**

**Issue:** `selenium not found`
```bash
pip install selenium
```

**Issue:** `ChromeDriver version mismatch`
```bash
# Update ChromeDriver to match Chrome version
# Download from: https://chromedriver.chromium.org/
```

**Issue:** `Connection timeout`
```bash
# Check production site accessibility
curl -I https://www.mpbarbosa.com/submodules/monitora_vagas/public/
```

**Issue:** `Tests skip with warnings`
- Check that test files exist in `tests/use_cases/`
- Verify Python test files are executable
- Check for missing dependencies

**Related:**
- [Production Test Documentation](../testing/PRODUCTION_TESTS.md)
- [Test Standards](./SCRIPT_STANDARDS.md)
- [CI/CD Integration](../workflow-automation/GITHUB_ACTIONS_CI.md)

---

## 🧪 Test Scripts

### Quick Reference Table

| Script | Tests | Runtime | Port | Prerequisites |
|--------|-------|---------|------|--------------|
| **run-production-tests.sh** | **Production suite** | **3-5 min** | **N/A** | **Python, Selenium, Internet** |
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

### 5. tests/run-index-tests.sh

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

### 6. tests/run-fr008a-tests.sh

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

### 7. tests/run-booking-rules-tests.sh

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

### 8. tests/run-css-tests.sh

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

### 9. tests/run_ui_tests.sh

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

### 10. tests/run-version-tests.sh

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

### 11. tests/start-local-testing.sh

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

### 12. tests/test_api_integration.sh

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

### 13. tests/test-md3-migration.sh

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
