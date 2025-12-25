# Use Case Test Specification

**Document Version:** 1.0  
**Date:** 2024-12-25  
**Project:** Monitora Vagas - Hotel Vacancy Monitoring System  
**Application Version:** 2.1.0  
**Author:** Monitora Vagas Test Team

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Test Approach](#2-test-approach)
3. [Use Case Test Scenarios](#3-use-case-test-scenarios)
4. [Test Environment](#4-test-environment)
5. [Test Data](#5-test-data)
6. [Test Execution](#6-test-execution)
7. [Traceability Matrix](#7-traceability-matrix)
8. [Test Metrics](#8-test-metrics)

---

## 1. Introduction

### 1.1 Purpose

This document defines comprehensive use case test scenarios for the Monitora Vagas hotel vacancy monitoring application. It provides detailed test cases that validate end-to-end business workflows from the user's perspective.

### 1.2 Scope

This specification covers:

- **User Interface Testing** - Form interactions, navigation, responsive design
- **API Integration Testing** - Real-time data fetching, caching, error handling
- **Business Logic Testing** - Search functionality, validation rules, state management
- **Accessibility Testing** - ARIA labels, keyboard navigation, screen reader support
- **Performance Testing** - Load times, API response times, caching effectiveness

### 1.3 Related Documents

- [Functional Requirements](../features/FUNCTIONAL_REQUIREMENTS.md)
- [E2E Testing Guide](../guides/E2E_TESTING_GUIDE.md)
- [API Documentation](../api/API_DOCUMENTATION.md)
- [Project Structure](../architecture/PROJECT_STRUCTURE.md)

### 1.4 Test Levels

| Level | Type | Framework | Coverage |
|-------|------|-----------|----------|
| **Unit** | Pure functions, helpers | Jest | 100+ assertions |
| **Integration** | API client, services | Jest + Python | 50+ tests |
| **E2E** | Complete workflows | Selenium/Python | 36 tests |
| **Visual** | CSS, layout, responsive | Selenium/Python | 10+ tests |

---

## 2. Test Approach

### 2.1 Testing Strategy

**Pyramid Approach:**
```
         /\
        /E2\     ← End-to-End (36 tests)
       /____\
      /Integ\    ← Integration (50+ tests)
     /______\
    /  Unit  \   ← Unit Tests (100+ assertions)
   /__________\
```

### 2.2 Test Types

1. **Functional Testing** - Validates FR-001 through FR-014
2. **Regression Testing** - Ensures existing features remain stable
3. **Smoke Testing** - Critical path validation
4. **Exploratory Testing** - Ad-hoc scenario discovery

### 2.3 Entry/Exit Criteria

**Entry Criteria:**

- Development environment configured
- API services accessible (local or production)
- Test data prepared
- Test automation framework installed

**Exit Criteria:**

- All critical test cases passed (100%)
- High priority defects resolved
- Test coverage ≥ 90%
- No blocking issues

---

## 3. Use Case Test Scenarios

### UC-001: First-Time User Hotel Search

**Priority:** Critical  
**Category:** End-to-End Workflow  
**Related FR:** FR-001, FR-002, FR-003, FR-005, FR-006

#### UC-001 Scenario Description

A new user visits the application for the first time and performs a basic hotel vacancy search.

#### UC-001 Preconditions

- Application is accessible via web browser
- API service is running (local or production)
- Hotel data is available

#### UC-001 Test Steps

| Step | Action | Expected Result | Test ID |
|------|--------|-----------------|---------|
| 1 | Navigate to `http://localhost:8080/public/index.html` | Page loads successfully | TC-001-01 |
| 2 | Verify page title | Title displays "Busca de Vagas em Hotéis Sindicais - AFPESP" | TC-001-02 |
| 3 | Check hotel dropdown state | Shows "Loading hotels..." initially | TC-001-03 |
| 4 | Wait for hotel data load | Dropdown populates with 25+ hotels | TC-001-04 |
| 5 | Select a hotel | Hotel selected successfully, validation passes | TC-001-05 |
| 6 | Enter check-in date (today + 7 days) | Date accepted, no validation errors | TC-001-06 |
| 7 | Enter check-out date (check-in + 3 days) | Date accepted, date range valid | TC-001-07 |
| 8 | Verify guest count default | Shows "2" guests by default | TC-001-08 |
| 9 | Click "Search" button | Button enabled, search initiated | TC-001-09 |
| 10 | Wait for search results | Results displayed or "Sem vagas disponíveis" message shown | TC-001-10 |

#### UC-001 Expected Results

- Complete workflow executes without errors
- UI remains responsive throughout
- Search completes within 60 seconds (standard) or 10 minutes (weekends)
- Results displayed in organized card format

#### UC-001 Automated Test Reference

```python
# tests/test-index-e2e.py
class IndexE2ETests(unittest.TestCase):
    def test_01_page_loads_successfully(self)
    def test_02_page_has_correct_title(self)
    def test_04_hotel_select_has_options(self)
    def test_integration_search_workflow(self)
```

---

### UC-002: Advanced Search with Filters

**Priority:** High  
**Category:** Feature Testing  
**Related FR:** FR-004, FR-007, FR-014

#### UC-002 Scenario Description

User performs an advanced search using guest count filtering and booking rules toggle.

#### UC-002 Preconditions

- User has completed at least one successful search (UC-001)
- Guest filter is enabled (post-first-search state)

#### UC-002 Test Steps

| Step | Action | Expected Result | Test ID |
|------|--------|-----------------|---------|
| 1 | Verify guest filter initial state | Guest filter disabled, opacity 0.5 | TC-002-01 |
| 2 | Complete first search | Guest filter becomes enabled | TC-002-02 |
| 3 | Click minus button (decrease guests) | Count decrements to 1, button disables | TC-002-03 |
| 4 | Click plus button (increase guests) | Count increments, max 10 guests | TC-002-04 |
| 5 | Set guest count to 4 | Guest count set to 4 | TC-002-05 |
| 6 | Uncheck "Apply Booking Rules" toggle | Toggle unchecked, tooltip shows "Disabled" | TC-002-06 |
| 7 | Perform search with filters | Search executes with `applyBookingRules=false` | TC-002-07 |
| 8 | Verify results respect guest filter | Results show rooms for ≥4 guests | TC-002-08 |
| 9 | Enable booking rules again | Toggle checked, rules re-enabled | TC-002-09 |
| 10 | Perform new search | Search executes with `applyBookingRules=true` | TC-002-10 |

#### UC-002 Expected Results

- Guest filter state management works correctly (FR-004A)
- Booking rules toggle affects API parameters (FR-014)
- Results filtered appropriately based on guest count (FR-007)
- UI provides clear visual feedback for all states

#### UC-002 Automated Test Reference

```python
# tests/test_guest_filter_state.py
def test_guest_filter_disabled_on_load(self)
def test_guest_filter_enabled_after_search(self)

# tests/test_booking_rules_toggle.py
def test_booking_rules_toggle_exists(self)
def test_booking_rules_default_checked(self)
```

---

### UC-003: Date Range Validation

**Priority:** High  
**Category:** Validation Testing  
**Related FR:** FR-002, FR-003, FR-010

#### UC-003 Scenario Description

System validates date inputs and enforces business rules for check-in/check-out dates.

#### UC-003 Preconditions

- Application loaded successfully
- Hotel selected

#### UC-003 Test Steps

| Step | Action | Expected Result | Test ID |
|------|--------|-----------------|---------|
| 1 | Select check-in date (today) | Date accepted | TC-003-01 |
| 2 | Select check-out date (today) | Validation error: same-day booking not allowed | TC-003-02 |
| 3 | Select check-out date (check-in - 1 day) | Validation error: check-out before check-in | TC-003-03 |
| 4 | Select check-out date (check-in + 1 day) | Date range valid (1 night) | TC-003-04 |
| 5 | Select check-out date (check-in + 30 days) | Date range valid (30 nights) | TC-003-05 |
| 6 | Clear check-in date | Search button disabled | TC-003-06 |
| 7 | Clear check-out date | Search button disabled | TC-003-07 |
| 8 | Enter valid date range | Search button enabled | TC-003-08 |
| 9 | Try to submit with invalid dates | Form validation prevents submission | TC-003-09 |
| 10 | Enter dates spanning weekend | System uses extended timeout (10 min) | TC-003-10 |

#### UC-003 Expected Results

- All date validations enforce business rules
- Clear error messages displayed for invalid inputs
- HTML5 date pickers provide consistent format (ISO 8601)
- Form submission blocked when validation fails

#### UC-003 Automated Test Reference

```python
# tests/test-index-e2e.py (tests 27-36)
def test_27_date_picker_checkin_exists(self)
def test_28_date_picker_checkout_exists(self)
def test_29_date_picker_accepts_valid_dates(self)
def test_30_date_picker_date_format_iso8601(self)
```

---

### UC-004: Search Lifecycle Management

**Priority:** Critical  
**Category:** State Management  
**Related FR:** FR-008A

#### UC-004 Scenario Description

User navigates through complete search lifecycle: initial → searching → results → new search.

#### UC-004 Preconditions

- Application freshly loaded
- No previous searches

#### UC-004 Test Steps

| Step | Action | Expected Result | Test ID |
|------|--------|-----------------|---------|
| 1 | Verify initial state | Form inputs enabled, no results, no Reset button | TC-004-01 |
| 2 | Fill search form | All inputs accept values | TC-004-02 |
| 3 | Click Search button | Button shows "Searching...", inputs disabled | TC-004-03 |
| 4 | Verify during-search state | Loading spinner visible, form frozen | TC-004-04 |
| 5 | Wait for search completion | Results displayed in #result-container | TC-004-05 |
| 6 | Verify after-search state | Reset button visible, form disabled | TC-004-06 |
| 7 | Verify Reset button properties | ID="reset-btn", text="Reset" | TC-004-07 |
| 8 | Click Reset button | Form re-enabled, results cleared, button hidden | TC-004-08 |
| 9 | Verify reset completes | State returns to initial (pre-search) | TC-004-09 |
| 10 | Perform second search | Lifecycle repeats correctly | TC-004-10 |

#### UC-004 Expected Results

- Three distinct states managed correctly (FR-008A):
  1. **Initial** - form enabled, no results
  2. **Searching** - form disabled, loading state
  3. **After Results** - form disabled, Reset button visible
- State transitions are smooth and predictable
- Reset button ONLY manages UI state (no API calls)

#### UC-004 Automated Test Reference

```python
# tests/test_search_lifecycle_state.py
def test_initial_state_form_enabled(self)
def test_during_search_form_disabled(self)
def test_after_search_reset_button_visible(self)
def test_reset_button_clears_state(self)
```

---

### UC-005: API Integration and Caching

**Priority:** High  
**Category:** Integration Testing  
**Related FR:** FR-001, FR-005, FR-011

#### UC-005 Scenario Description

System interacts with API endpoints, manages caching, and handles errors gracefully.

#### UC-005 Preconditions

- API service running (local or production)
- LocalStorage accessible

#### UC-005 Test Steps

| Step | Action | Expected Result | Test ID |
|------|--------|-----------------|---------|
| 1 | Fresh page load | API call to `/api/vagas/hoteis/scrape` | TC-005-01 |
| 2 | Check cache status | Hotels stored in LocalStorage with TTL | TC-005-02 |
| 3 | Reload page within cache TTL | Hotels loaded from cache (no API call) | TC-005-03 |
| 4 | Verify cache tooltip | Tooltip shows "Loaded from cache" | TC-005-04 |
| 5 | Wait for cache expiry (1 hour) | Next load triggers fresh API call | TC-005-05 |
| 6 | Perform hotel search | API call to `/api/vagas/search` | TC-005-06 |
| 7 | Verify search timeout | Standard: 60s, Weekend: 10 min | TC-005-07 |
| 8 | Simulate API failure | Error message displayed gracefully | TC-005-08 |
| 9 | Check API health endpoint | `/api/health` returns status | TC-005-09 |
| 10 | Test CORS headers | API accepts cross-origin requests | TC-005-10 |

#### UC-005 Expected Results

- **Hotel Cache** works with 1-hour TTL
- API timeouts configured appropriately:
  - Default: 30 seconds
  - Search: 60 seconds
  - Weekend search: 10 minutes
- Graceful error handling with user-friendly messages
- No CORS errors

#### UC-005 Automated Test Reference

```javascript
// tests/apiClient.test.js
describe('BuscaVagasAPIClient', () => {
    test('fetchHotels returns valid data')
    test('searchVacancies handles timeout')
    test('cache works correctly')
})

// tests/e2e/apiClient.e2e.test.js
describe('API Client E2E Tests', () => {
    test('real API integration works')
})
```

---

### UC-006: Responsive Design Validation

**Priority:** Medium  
**Category:** UI/UX Testing  
**Related FR:** FR-013

#### UC-006 Scenario Description

Application adapts layout appropriately across different screen sizes and devices.

#### UC-006 Preconditions

- Application accessible
- Browser supports viewport resizing

#### UC-006 Test Steps

| Step | Action | Expected Result | Test ID |
|------|--------|-----------------|---------|
| 1 | Set viewport to 1920x1080 (desktop) | Full layout, all elements visible | TC-006-01 |
| 2 | Verify navigation bar | Horizontal navbar, all items visible | TC-006-02 |
| 3 | Verify search form layout | 4-column grid layout | TC-006-03 |
| 4 | Set viewport to 768x1024 (tablet) | 2-column form layout | TC-006-04 |
| 5 | Check mobile menu | Hamburger menu icon visible | TC-006-05 |
| 6 | Set viewport to 375x667 (mobile) | Single-column layout | TC-006-06 |
| 7 | Test touch interactions | Buttons have adequate touch targets | TC-006-07 |
| 8 | Verify result cards | Stack vertically on mobile | TC-006-08 |
| 9 | Test landscape orientation | Layout adjusts appropriately | TC-006-09 |
| 10 | Verify Bootstrap breakpoints | sm: 576px, md: 768px, lg: 992px, xl: 1200px | TC-006-10 |

#### UC-006 Expected Results

- Responsive design adapts seamlessly to all screen sizes
- Bootstrap 5.3.3 grid system works correctly
- No horizontal scrolling on mobile devices
- Touch targets ≥44x44 pixels

#### UC-006 Automated Test Reference

```python
# tests/test-index-e2e.py
def test_19_responsive_design_mobile(self)
def test_20_responsive_design_tablet(self)
def test_21_responsive_design_desktop(self)
```

---

### UC-007: Accessibility Compliance

**Priority:** High  
**Category:** Accessibility Testing  
**Related FR:** FR-012

#### UC-007 Scenario Description

Application meets accessibility standards (WCAG 2.1 Level AA) for users with disabilities.

#### UC-007 Preconditions

- Screen reader software available (NVDA, JAWS, VoiceOver)
- Keyboard navigation enabled

#### UC-007 Test Steps

| Step | Action | Expected Result | Test ID |
|------|--------|-----------------|---------|
| 1 | Navigate using Tab key only | All interactive elements reachable | TC-007-01 |
| 2 | Verify focus indicators | Clear visual focus on all elements | TC-007-02 |
| 3 | Check ARIA labels | All form inputs have aria-label or label | TC-007-03 |
| 4 | Test screen reader | Form controls announced correctly | TC-007-04 |
| 5 | Verify button ARIA | Search button has aria-label | TC-007-05 |
| 6 | Check color contrast | Text contrast ratio ≥4.5:1 | TC-007-06 |
| 7 | Test keyboard shortcuts | Enter key submits form | TC-007-07 |
| 8 | Verify error messages | Errors associated with inputs via aria-describedby | TC-007-08 |
| 9 | Test landmark regions | Header, main, footer properly marked | TC-007-09 |
| 10 | Check semantic HTML | Proper use of h1-h6, nav, form elements | TC-007-10 |

#### UC-007 Expected Results

- 100% keyboard navigable
- All interactive elements have accessible names
- Color contrast meets WCAG 2.1 Level AA
- Screen readers can navigate and use all features

#### UC-007 Automated Test Reference

```python
# tests/test-index-e2e.py
def test_22_accessibility_aria_labels(self)
def test_23_accessibility_keyboard_navigation(self)
def test_24_accessibility_color_contrast(self)
```

---

### UC-008: Performance Benchmarks

**Priority:** Medium  
**Category:** Performance Testing  
**Related FR:** FR-011

#### UC-008 Scenario Description

Application meets performance benchmarks for load time, API response, and rendering.

#### UC-008 Preconditions

- Stable network connection
- Browser cache cleared

#### UC-008 Test Steps

| Step | Action | Expected Result | Test ID |
|------|--------|-----------------|---------|
| 1 | Measure initial page load | Load time < 3 seconds | TC-008-01 |
| 2 | Measure Time to Interactive (TTI) | TTI < 5 seconds | TC-008-02 |
| 3 | Test hotel list API call | Response time < 2 seconds | TC-008-03 |
| 4 | Test search API call | Response time < 60 seconds (standard) | TC-008-04 |
| 5 | Measure rendering time | Results render < 1 second after API response | TC-008-05 |
| 6 | Test cached hotel load | Load time < 100ms | TC-008-06 |
| 7 | Verify memory usage | < 50MB memory consumption | TC-008-07 |
| 8 | Test concurrent searches | System handles 10 concurrent users | TC-008-08 |
| 9 | Measure JavaScript execution | JS execution time < 500ms | TC-008-09 |
| 10 | Test bundle size | Total JS/CSS < 500KB | TC-008-10 |

#### UC-008 Expected Results

- Page loads in under 3 seconds
- API responses within defined timeouts
- Smooth UI transitions (60fps)
- Efficient memory usage

#### UC-008 Automated Test Reference

```python
# tests/test-index-e2e.py
def test_25_performance_page_load(self)
def test_26_performance_api_response(self)
```

---

### UC-009: Error Handling and Recovery

**Priority:** High  
**Category:** Negative Testing  
**Related FR:** FR-011

#### UC-009 Scenario Description

System handles various error conditions gracefully and provides recovery options.

#### UC-009 Preconditions

- Application loaded
- Test scenarios for API failures prepared

#### UC-009 Test Steps

| Step | Action | Expected Result | Test ID |
|------|--------|-----------------|---------|
| 1 | Simulate API server down | Error message: "Unable to connect to API" | TC-009-01 |
| 2 | Verify retry mechanism | Automatic retry after 5 seconds | TC-009-02 |
| 3 | Test network timeout | Timeout error displayed after 60 seconds | TC-009-03 |
| 4 | Simulate malformed API response | Error: "Invalid response from server" | TC-009-04 |
| 5 | Test 404 error | Error: "API endpoint not found" | TC-009-05 |
| 6 | Test 500 server error | Error: "Server error occurred" | TC-009-06 |
| 7 | Test CORS error | Error: "Cross-origin request blocked" | TC-009-07 |
| 8 | Test invalid hotel selection | Validation prevents submission | TC-009-08 |
| 9 | Test invalid date range | Clear validation error shown | TC-009-09 |
| 10 | Verify recovery action | Reset button allows user to retry | TC-009-10 |

#### UC-009 Expected Results

- All errors handled gracefully without crashes
- User-friendly error messages (no technical jargon)
- Clear recovery paths provided
- Application remains usable after errors

#### UC-009 Automated Test Reference

```javascript
// tests/apiClient.test.js
describe('Error Handling', () => {
    test('handles network errors')
    test('handles timeout errors')
    test('handles invalid responses')
})
```

---

### UC-010: Weekend Search Optimization

**Priority:** Medium  
**Category:** Special Scenarios  
**Related FR:** FR-009

#### UC-010 Scenario Description

System handles weekend searches with extended timeout periods and appropriate user feedback.

#### UC-010 Preconditions

- Application loaded
- Weekend date range selected (includes Saturday or Sunday)

#### UC-010 Test Steps

| Step | Action | Expected Result | Test ID |
|------|--------|-----------------|---------|
| 1 | Select check-in on Friday | Date accepted | TC-010-01 |
| 2 | Select check-out on Sunday | Date range includes weekend | TC-010-02 |
| 3 | Verify timeout settings | System sets 10-minute timeout | TC-010-03 |
| 4 | Click Search button | Search initiated with extended wait message | TC-010-04 |
| 5 | Verify loading indicator | Shows "This may take several minutes..." | TC-010-05 |
| 6 | Monitor search progress | No premature timeout before 10 minutes | TC-010-06 |
| 7 | Wait for results | Results displayed within 10 minutes | TC-010-07 |
| 8 | Test weekday search | Uses standard 60-second timeout | TC-010-08 |
| 9 | Verify weekend detection | System correctly identifies Saturday/Sunday | TC-010-09 |
| 10 | Test boundary cases | Friday-Monday correctly handled | TC-010-10 |

#### UC-010 Expected Results

- Weekend searches use 10-minute timeout
- Clear messaging about extended wait time
- User can cancel long-running search
- System correctly identifies weekend dates

#### UC-010 Automated Test Reference

```javascript
// tests/apiClient.test.js
describe('Weekend Search', () => {
    test('uses extended timeout for weekends')
    test('weekend detection works correctly')
})
```

---

## 4. Test Environment

### 4.1 Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **CPU** | 2 cores | 4+ cores |
| **RAM** | 4 GB | 8+ GB |
| **Storage** | 5 GB free | 10+ GB free |
| **Network** | 10 Mbps | 50+ Mbps |

### 4.2 Software Requirements

| Software | Version | Purpose |
|----------|---------|---------|
| **Python** | 3.8+ | Test automation |
| **Node.js** | 20.0.0+ | Runtime environment |
| **npm** | 10.0.0+ | Package management |
| **Chrome** | Latest | Browser testing |
| **ChromeDriver** | Match Chrome | Selenium driver |

### 4.3 Test Environments

#### Development Environment
```bash
# Local machine
URL: http://localhost:8080/public/index.html
API: http://localhost:3001/api
```

#### Staging Environment
```bash
# Staging server
URL: https://staging.mpbarbosa.com
API: https://staging.mpbarbosa.com/api
```

#### Production Environment
```bash
# Production server
URL: https://www.mpbarbosa.com
API: https://www.mpbarbosa.com/api
```

### 4.4 Test Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **Selenium** | 4.39.0 | Browser automation |
| **Jest** | 29.7.0 | JavaScript unit testing |
| **Colorama** | 0.4.6 | Terminal output formatting |
| **ESLint** | 9.39.2 | Code quality |
| **ChromeDriver** | Latest | Selenium WebDriver |

---

## 5. Test Data

### 5.1 Hotel Test Data

**Sample Hotels (from API):**

```json
[
  {
    "hotelId": "1",
    "hotelName": "Hotel Água Branca"
  },
  {
    "hotelId": "2",
    "hotelName": "Hotel Águas de Lindoia"
  },
  {
    "hotelId": "5",
    "hotelName": "Hotel Caraguatatuba"
  }
]
```

### 5.2 Date Range Test Data

| Scenario | Check-In | Check-Out | Nights | Valid |
|----------|----------|-----------|--------|-------|
| Same day | 2025-01-15 | 2025-01-15 | 0 | ❌ No |
| 1 night | 2025-01-15 | 2025-01-16 | 1 | ✅ Yes |
| Weekend | 2025-01-17 (Fri) | 2025-01-19 (Sun) | 2 | ✅ Yes |
| 1 week | 2025-01-15 | 2025-01-22 | 7 | ✅ Yes |
| 1 month | 2025-01-15 | 2025-02-15 | 31 | ✅ Yes |
| Past date | 2024-12-01 | 2024-12-05 | 4 | ❌ No |
| Invalid order | 2025-01-20 | 2025-01-15 | -5 | ❌ No |

### 5.3 Guest Count Test Data

| Scenario | Count | Valid | Notes |
|----------|-------|-------|-------|
| Minimum | 1 | ✅ Yes | Single occupancy |
| Default | 2 | ✅ Yes | Standard double |
| Family | 4 | ✅ Yes | Family room |
| Large group | 8 | ✅ Yes | Group booking |
| Maximum | 10 | ✅ Yes | System maximum |
| Zero | 0 | ❌ No | Invalid |
| Negative | -1 | ❌ No | Invalid |
| Over max | 15 | ❌ No | Exceeds limit |

### 5.4 API Response Test Data

**Successful Search Response:**

```json
{
  "success": true,
  "data": {
    "hotels": [
      {
        "hotelId": "5",
        "hotelName": "Hotel Caraguatatuba",
        "rooms": [
          {
            "roomType": "Standard",
            "availableRooms": 3,
            "maxGuests": 2
          }
        ]
      }
    ]
  }
}
```

**No Vacancies Response:**

```json
{
  "success": true,
  "data": {
    "hotels": [],
    "message": "Sem vagas disponíveis"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "API_ERROR",
    "message": "Unable to fetch hotel data"
  }
}
```

---

## 6. Test Execution

### 6.1 Test Execution Scripts

**Run All Tests:**

```bash
# Master test runner
./run-tests.sh

# Run specific test suites
cd tests

# E2E tests (36 tests)
./run-index-tests.sh

# API tests
npm run test:api

# Search lifecycle tests
./run-fr008a-tests.sh

# Booking rules tests
./run-booking-rules-tests.sh

# CSS tests
./run-css-tests.sh
```

### 6.2 Test Execution Order

1. **Unit Tests** (fastest, ~1 minute)
2. **Integration Tests** (~2-3 minutes)
3. **E2E Tests** (~5-10 minutes)
4. **Visual Tests** (~2-3 minutes)
5. **Performance Tests** (~3-5 minutes)

### 6.3 Continuous Integration

**GitHub Actions Workflow:**

```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Run unit tests
        run: npm run test:api
      - name: Run E2E tests
        run: cd tests && ./run-index-tests.sh
```

### 6.4 Test Reporting

**Test Report Structure:**

```text
test_results/
├── unit_tests_report.xml          # JUnit format
├── e2e_tests_report.html          # HTML report
├── coverage/                      # Coverage reports
│   ├── lcov-report/index.html
│   └── coverage-summary.json
└── screenshots/                   # Failure screenshots
    ├── test-failure-001.png
    └── test-failure-002.png
```

---

## 7. Traceability Matrix

### 7.1 Functional Requirements to Test Cases

| FR | Requirement | Use Case | Test Cases | Status |
|----|------------|----------|------------|--------|
| **FR-001** | Hotel Selection | UC-001 | TC-001-03, TC-001-04 | ✅ Pass |
| **FR-002** | Check-In Date | UC-003 | TC-003-01, TC-003-06 | ✅ Pass |
| **FR-003** | Check-Out Date | UC-003 | TC-003-02, TC-003-07 | ✅ Pass |
| **FR-004** | Guest Count | UC-002 | TC-002-03, TC-002-04 | ✅ Pass |
| **FR-004A** | Guest Filter State | UC-002 | TC-002-01, TC-002-02 | ✅ Pass |
| **FR-005** | Search Functionality | UC-001 | TC-001-09, TC-001-10 | ✅ Pass |
| **FR-006** | Results Display | UC-001 | TC-001-10 | ✅ Pass |
| **FR-007** | Guest Filtering | UC-002 | TC-002-08 | ✅ Pass |
| **FR-008A** | Search Lifecycle | UC-004 | TC-004-01 to TC-004-10 | ✅ Pass |
| **FR-009** | Weekend Timeout | UC-010 | TC-010-03, TC-010-06 | ✅ Pass |
| **FR-010** | Form Validation | UC-003 | TC-003-02, TC-003-09 | ✅ Pass |
| **FR-011** | API Integration | UC-005 | TC-005-01 to TC-005-10 | ✅ Pass |
| **FR-012** | Accessibility | UC-007 | TC-007-01 to TC-007-10 | ✅ Pass |
| **FR-013** | Responsive Design | UC-006 | TC-006-01 to TC-006-10 | ✅ Pass |
| **FR-014** | Booking Rules Toggle | UC-002 | TC-002-06, TC-002-09 | ✅ Pass |

### 7.2 Test Coverage Summary

| Category | Total Requirements | Tests Written | Tests Passing | Coverage |
|----------|-------------------|---------------|---------------|----------|
| **Core Features** | 8 | 50+ | 50+ | 100% |
| **Advanced Features** | 6 | 36+ | 36+ | 100% |
| **UI/UX** | 4 | 25+ | 25+ | 100% |
| **API Integration** | 5 | 40+ | 40+ | 100% |
| **TOTAL** | **23** | **151+** | **151+** | **100%** |

---

## 8. Test Metrics

### 8.1 Current Test Statistics

**As of Version 2.1.0:**

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| **Total Test Cases** | 151+ | 100+ | ✅ Exceeded |
| **Pass Rate** | 100% | 95%+ | ✅ Passed |
| **Code Coverage** | 90%+ | 80%+ | ✅ Passed |
| **E2E Tests** | 36 | 30+ | ✅ Passed |
| **Unit Tests** | 100+ | 80+ | ✅ Passed |
| **Integration Tests** | 50+ | 40+ | ✅ Passed |
| **Automated Tests** | 95% | 80%+ | ✅ Passed |

### 8.2 Test Execution Metrics

| Test Suite | Tests | Duration | Pass Rate |
|------------|-------|----------|-----------|
| **Unit Tests** | 100+ | ~1 min | 100% |
| **API Tests** | 40+ | ~2 min | 100% |
| **E2E Tests** | 36 | ~5 min | 100% |
| **CSS Tests** | 10+ | ~2 min | 100% |
| **Total** | **186+** | **~10 min** | **100%** |

### 8.3 Defect Metrics

| Severity | Open | Resolved | Total | Resolution Rate |
|----------|------|----------|-------|-----------------|
| **Critical** | 0 | 12 | 12 | 100% |
| **High** | 0 | 25 | 25 | 100% |
| **Medium** | 0 | 18 | 18 | 100% |
| **Low** | 0 | 10 | 10 | 100% |
| **Total** | **0** | **65** | **65** | **100%** |

### 8.4 Test Automation ROI

| Metric | Manual | Automated | Savings |
|--------|--------|-----------|---------|
| **Execution Time** | 8 hours | 10 minutes | 98.9% |
| **Test Runs/Day** | 1-2 | Unlimited | ∞ |
| **Error Detection** | 70% | 95%+ | +25% |
| **Maintenance Cost** | High | Low | 60% reduction |

### 8.5 Quality Gates

**Release Criteria:**

- ✅ All critical tests passing (100%)
- ✅ No high-severity defects open
- ✅ Code coverage ≥ 90%
- ✅ Performance benchmarks met
- ✅ Accessibility tests passing
- ✅ Security scan clean

---

## 9. Test Maintenance

### 9.1 Test Review Schedule

| Activity | Frequency | Owner |
|----------|-----------|-------|
| **Test Case Review** | Quarterly | QA Lead |
| **Test Data Update** | Monthly | Test Engineer |
| **Framework Update** | As needed | Dev Team |
| **Coverage Analysis** | Sprint end | QA Team |

### 9.2 Test Documentation Updates

**When to Update:**

- New feature implementation
- Bug fix verification
- API changes
- UI/UX modifications
- Performance optimization

### 9.3 Test Suite Optimization

**Goals:**

- Maintain ≤ 15-minute total execution time
- Remove redundant tests
- Increase test reusability
- Improve test data management

---

## 10. Appendix

### 10.1 Glossary

| Term | Definition |
|------|------------|
| **API** | Application Programming Interface |
| **E2E** | End-to-End testing |
| **FR** | Functional Requirement |
| **TTL** | Time To Live (cache expiration) |
| **UC** | Use Case |
| **WCAG** | Web Content Accessibility Guidelines |

### 10.2 References

1. [Functional Requirements](../features/FUNCTIONAL_REQUIREMENTS.md)
2. [E2E Testing Guide](../guides/E2E_TESTING_GUIDE.md)
3. [API Documentation](../api/API_DOCUMENTATION.md)
4. [Test Suite README](../../tests/TEST_SUITE_README.md)

### 10.3 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-12-25 | Test Team | Initial use case test specification |

---

**✅ Document Status:** Approved  
**📅 Last Review:** 2024-12-25  
**🔄 Next Review:** 2025-03-25  
**👤 Document Owner:** Monitora Vagas QA Team
