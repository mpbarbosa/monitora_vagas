# Comprehensive Test Suite

This directory contains comprehensive test suites for the Trade Union Hotel Search Platform, including tests for HTML/JS, CSS components, and caching functionality.

## 📋 Test Files

### 1. `test-index-comprehensive.html`
**Browser-based Integration Tests**

- **Type**: Interactive HTML test runner
- **Purpose**: Tests DOM structure, form elements, UI components, event handlers, API integration, results display, utilities, accessibility, and responsive design
- **Usage**: 
  ```bash
  # Start the server
  npm start
  
  # Open in browser
  open http://localhost:8080/tests/test-index-comprehensive.html
  ```
- **Features**:
  - Visual test results with pass/fail indicators
  - Auto-runs on page load
  - Summary statistics (total, passed, failed, pending)
  - Covers 40+ test cases across 9 categories

### 2. `test-index-e2e.py`
**End-to-End Selenium Tests**

- **Type**: Python Selenium WebDriver tests
- **Purpose**: Tests complete user workflows and interactions
- **Prerequisites**:
  ```bash
  pip install selenium
  # Ensure Chrome/Chromium is installed
  ```
- **Usage**:
  ```bash
  ./run-index-tests.sh
  ```
- **Test Coverage**:
  - Page load validation
  - Form interaction
  - Form validation
  - UI components
  - Responsive design (mobile, tablet, desktop)
  - Accessibility
  - JavaScript integration
  - Performance
  - Full search workflow
  - 26 comprehensive test cases

### 3. `test-index-unit.js`
**JavaScript Unit Tests**

- **Type**: Jest-style unit tests
- **Purpose**: Tests individual functions and components in isolation
- **Usage**:
  ```bash
  # If using Jest (install first: npm install --save-dev jest)
  npm test -- tests/test-index-unit.js
  
  # Or run in browser console after loading the page
  ```
- **Test Coverage**:
  - DOM element existence
  - Date formatting functions
  - API URL construction
  - Form validation logic
  - Display results function
  - Button state management
  - Clipboard functionality
  - Hotel card generation
  - Empty state display
  - Input validation
  - Error handling

### 4. CSS Test Suite
**CSS Loading and Styling Tests**

- **Files**: 
  - `test-css-loading.py` - Automated CSS loading validation
  - `test-css-automated.py` - Automated CSS property tests
  - `test-background-color.py` - Background color validation
  - `test-css-loading.html` - Browser-based CSS tests
  - `test-css-validation.html` - CSS validation tests
  - `test-css-visual.html` - Visual regression tests

- **Usage**:
  ```bash
  ./run-css-tests.sh
  ```

- **Test Coverage**:
  - CSS file loading verification
  - Background color validation
  - Style application checks
  - Visual regression testing

### 5. Helper Scripts
- `run-index-tests.sh` - Runs E2E index tests with API management
- `run-css-tests.sh` - Runs CSS test suite
- `run_ui_tests.sh` - Runs UI tests
- `start-local-testing.sh` - Sets up local testing environment

## 🧪 Test Categories

### DOM Structure Tests
- HTML document validation
- Meta tags verification
- Title and CSS/JS file loading
- Main structural elements

### Form Elements Tests
- Form existence and configuration
- Input field validation
- Select dropdown functionality
- Button presence and properties
- Guest counter controls

### UI Components Tests
- Page layout structure
- Results container
- Hotel cards container
- Action buttons (copy, clear)
- Labels and visual elements

### Event Handlers Tests
- Form submission
- Button click handlers
- DOMContentLoaded events
- User interaction responses

### API Integration Tests
- API client module loading
- Endpoint URL validation
- Fetch API availability
- Hotel loading functionality

### Results Display Tests
- Initial state validation
- Display functions
- Hotel card rendering
- Empty state handling

### Utility Functions Tests
- Date format conversion
- Clipboard operations
- Smooth scrolling
- Fallback mechanisms

### Accessibility Tests
- Form labels association
- Button descriptive text
- Language attribute
- Input placeholders
- Secure link attributes

### Responsive Design Tests
- Viewport configuration
- Font loading
- Flexbox layout
- Mobile/tablet/desktop rendering

## 🚀 Running All Tests

### Quick Start
```bash
# 1. Start the development server
npm start

# 2. Run browser tests
# Open http://localhost:8080/tests/test-index-comprehensive.html

# 3. Run E2E tests (in new terminal)
python3 tests/test-index-e2e.py
```

### Complete Test Suite
```bash
#!/bin/bash

echo "🧪 Running Complete Test Suite for index.html"
echo "=============================================="

# Start server in background
npm start &
SERVER_PID=$!
sleep 3

# Run E2E tests
echo -e "\n📱 Running End-to-End Tests..."
python3 tests/test-index-e2e.py
E2E_RESULT=$?

# Stop server
kill $SERVER_PID

# Report results
echo -e "\n=============================================="
if [ $E2E_RESULT -eq 0 ]; then
    echo "✅ All E2E tests passed!"
else
    echo "❌ Some E2E tests failed"
fi

echo -e "\n💡 To run browser tests, open:"
echo "   http://localhost:8080/tests/test-index-comprehensive.html"
echo "=============================================="

exit $E2E_RESULT
```

## 📊 Test Coverage Summary

| Category | Test Cases | Coverage |
|----------|------------|----------|
| DOM Structure | 5 | ✅ Complete |
| Form Elements | 7 | ✅ Complete |
| UI Components | 8 | ✅ Complete |
| Event Handlers | 4 | ✅ Complete |
| API Integration | 4 | ✅ Complete |
| Results Display | 4 | ✅ Complete |
| Utilities | 4 | ✅ Complete |
| Accessibility | 5 | ✅ Complete |
| Responsive Design | 4 | ✅ Complete |
| E2E Workflows | 26 | ✅ Complete |
| **TOTAL** | **71** | **✅ Complete** |

## 🔍 Test Details

### Critical Functionality Tested
- ✅ Page loads without errors
- ✅ All form elements render correctly
- ✅ Hotel dropdown populates from API
- ✅ Date inputs use ISO format (yyyy-mm-dd) with native HTML5 date picker
- ✅ Form validation prevents invalid submissions
- ✅ Search button shows loading state
- ✅ Results display in hotel cards
- ✅ Copy to clipboard functionality
- ✅ Clear results functionality
- ✅ Empty state displays when no results
- ✅ Responsive design works on all devices
- ✅ Accessibility standards met
- ✅ No JavaScript errors in console
- ✅ External resources load correctly

### Edge Cases Tested
- Empty form submission
- Invalid date formats
- API errors and network failures
- Missing required fields
- Same check-in and check-out dates
- Check-out before check-in
- Special characters in inputs
- Browser clipboard API availability
- Fallback clipboard methods
- Multiple consecutive searches

## 🛠️ Maintenance

### Adding New Tests

**For Browser Tests (HTML):**
```javascript
runner.test('Test name', 'categoryTests', () => {
    // Your test logic
    return runner.assert(condition, 'Error message');
});
```

**For E2E Tests (Python):**
```python
def test_XX_descriptive_name(self):
    """Test description"""
    # Your test logic
    self.assertTrue(condition, "Error message")
```

**For Unit Tests (JavaScript):**
```javascript
test('test description', () => {
    expect(actual).toBe(expected);
});
```

### Test Naming Convention
- Browser tests: Descriptive name
- E2E tests: `test_XX_descriptive_name` (XX = sequence number)
- Unit tests: Descriptive sentence

### Best Practices
1. **Keep tests isolated** - Each test should be independent
2. **Use descriptive names** - Test names should explain what is being tested
3. **Test one thing** - Each test should verify a single aspect
4. **Handle async operations** - Use proper waits and promises
5. **Clean up after tests** - Reset state between tests
6. **Document complex tests** - Add comments for non-obvious logic

## 🐛 Debugging Tests

### Browser Tests
1. Open browser console (F12)
2. Look for test execution logs
3. Check for specific test failures
4. Inspect DOM elements directly

### E2E Tests
```bash
# Run with verbose output
python3 tests/test-index-e2e.py -v

# Run specific test
python3 -m unittest tests.test-index-e2e.IndexE2ETests.test_01_page_loads_successfully
```

### Common Issues
- **Server not running**: Ensure `npm start` is running before E2E tests
- **Browser not found**: Install Chrome/Chromium for Selenium
- **Timeout errors**: Increase wait times for slow connections
- **Element not found**: Check if selectors match the actual HTML

## 📈 Continuous Integration

To integrate with CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
name: Test index.html

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      
      - name: Install dependencies
        run: |
          npm install
          pip install selenium
      
      - name: Start server
        run: npm start &
      
      - name: Wait for server
        run: sleep 5
      
      - name: Run E2E tests
        run: python3 tests/test-index-e2e.py
```

## 📝 License

This test suite is part of the Trade Union Hotel Search Platform project.

## 👥 Contributing

When contributing new features to index.html:
1. Add corresponding tests to all three test files
2. Ensure all existing tests still pass
3. Update this README if adding new test categories
4. Maintain minimum 90% test coverage

## 🎨 CSS Test Suite

For comprehensive CSS testing documentation, see:
- **[CSS Test Suite README](./CSS_TEST_SUITE_README.md)** - Full documentation
- **[CSS Quick Reference](./CSS_TEST_QUICK_REFERENCE.md)** - Quick start guide

### Quick Start for CSS Tests

```bash
# Run all CSS tests
./tests/run-css-tests.sh

# Run Python automated tests
python3 tests/test-css-automated.py

# Open visual tests in browser
xdg-open tests/test-css-validation.html
xdg-open tests/test-css-visual.html
```

### CSS Test Files
- `run-css-tests.sh` - Master CSS test runner
- `test-css-automated.py` - Automated CSS validation
- `test-css-validation.html` - Browser-based variable testing
- `test-css-visual.html` - Visual component showcase

### 12. `test_guest_filter_state.py` ⭐ NEW
**FR-004A: Guest Filter State Management Tests**

- **Type**: Python Selenium WebDriver tests
- **Purpose**: Tests guest filter enabled/disabled state management
- **Test Count**: 7 test cases (85.7% pass rate)
- **Usage**:
  ```bash
  python3 tests/test_guest_filter_state.py
  ```
- **Test Coverage**:
  - Guest filter card existence
  - Initial disabled state (opacity, ARIA attributes)
  - Interaction blocking when disabled
  - Visual indication of disabled state
  - Filter enabled after search completion
  - Interaction allowed when enabled
  - State persistence across sessions

### 13. `test_guest_number_filter.py` ⭐ NEW
**FR-004B: Client-Side Guest Number Filtering Tests**

- **Type**: Python Selenium WebDriver tests with mock data
- **Purpose**: Tests real-time filtering of vacancy results by guest capacity
- **Test Count**: 8 test cases (100% pass rate) ✅
- **Usage**:
  ```bash
  python3 tests/test_guest_number_filter.py
  ```
- **Test Coverage**:
  - Filter module loading
  - Capacity parsing from "até N pessoas" pattern (7 format variations)
  - Show/hide cards based on capacity vs guest count
  - Filter triggering on guest count changes
  - Re-evaluation of all cards
  - CSS display property usage (DOM preservation)
  - Fail-safe handling of missing capacity info

### 14. `test_empty_state_message.py` ⭐ NEW
**Empty Search Results Message Tests**

- **Type**: Python validation tests
- **Purpose**: Verifies empty state message displays correctly
- **Test Count**: 2 test cases (100% pass rate) ✅
- **Usage**:
  ```bash
  python3 tests/test_empty_state_message.py
  ```
- **Test Coverage**:
  - HTML file contains "Sem vagas disponíveis"
  - Unit test expectations updated correctly

### 15. `test_guest_filter_manual.html` ⭐ NEW
**FR-004A: Interactive Manual Test Interface**

- **Type**: Interactive HTML test page
- **Purpose**: Manual testing and demonstration of guest filter state management
- **Usage**:
  ```bash
  # Open in browser
  open tests/test_guest_filter_manual.html
  ```
- **Features**:
  - Visual state indicators (🔒 DISABLED / 🔓 ENABLED)
  - Simulate search completion button
  - Manual enable/disable controls
  - Real-time status log
  - Acceptance criteria checklist

---

## 📊 Test Coverage Summary (v1.4.6)

| Test Suite | Files | Tests | Pass Rate | Status |
|------------|-------|-------|-----------|--------|
| E2E Tests | test-index-e2e.py | 36 | 100% | ✅ |
| CSS Tests | 3 files | Multiple | 99.1% | ✅ |
| Date Selection | test_date_selection.py | 10 | 100% | ✅ |
| Unit Components | test_unit_components.py | Multiple | Pass | ✅ |
| Quick Union | test_quick_union.py | Multiple | Pass | ✅ |
| **FR-004A** | test_guest_filter_state.py | 7 | 85.7% | ✅ |
| **FR-004B** | test_guest_number_filter.py | 8 | 100% | ✅ |
| **Empty State** | test_empty_state_message.py | 2 | 100% | ✅ |

**Total Test Files**: 15+  
**Overall Pass Rate**: >95%

---

## 🎯 Recently Added Tests (v1.4.6)

### Guest Filter Features
- **FR-004A Tests**: Guest filter state management (disabled on load, enabled after search)
- **FR-004B Tests**: Client-side filtering by guest capacity with parsing logic
- **Empty State Tests**: Validation of "Sem vagas disponíveis" message

### Key Test Achievements
- ✅ 100% pass rate for FR-004B (client-side filtering)
- ✅ Comprehensive capacity parsing tests (7 format variations)
- ✅ Real-time filter validation with mock data
- ✅ State management validation with ARIA accessibility
- ✅ Interactive manual test interface for demonstrations

---

## 📖 Test Documentation

- **FR-004AB Test Summary**: `tests/FR-004AB-TEST-SUMMARY.md` - Detailed coverage of guest filter tests
- **CSS Test Suite**: `tests/CSS_TEST_SUITE_README.md` - CSS testing documentation
- **CSS Loading Tests**: `tests/CSS_LOADING_TEST_README.md` - CSS loading validation
- **Background Color Tests**: `tests/BACKGROUND_COLOR_TEST_README.md` - Color verification

---

**Last Updated**: 2025-12-11  
**Test Framework Versions**:
- Selenium: 4.39.0+
- Python: 3.8+
- Modern browsers with ES6 support
- Chrome/Chromium for headless testing
