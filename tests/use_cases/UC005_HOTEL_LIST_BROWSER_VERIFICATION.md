# UC-005: Hotel List Browser Verification

## Use Case Information

**Use Case ID:** UC-005  
**Use Case Name:** Hotel List Browser Verification  
**Priority:** High  
**Category:** UI Integration Testing  
**Related Functional Requirements:** FR-001, FR-002  
**Test Framework:** Selenium WebDriver, Playwright  

---

## Overview

This use case validates that the hotel list is correctly loaded and displayed in the web browser. Unlike the API-only test (`test_hotel_list_verification.py`), these tests verify the actual user interface elements and interactions.

## Objectives

1. Verify hotel dropdown element exists and is visible
2. Validate all 25 hotels are loaded in the UI
3. Confirm hotels match expected list
4. Ensure no duplicate hotels
5. Verify hotel selection functionality
6. Test load time performance
7. Validate API integration through UI

---

## Test Implementations

### Implementation 1: Selenium WebDriver

**File:** `test_uc005_hotel_list_selenium.py`

**Technology:** 
- Selenium WebDriver 4.39.0
- Python 3.11+
- Chrome/Chromium browser

**Advantages:**
- ✅ Mature and stable
- ✅ Already installed in project
- ✅ Extensive documentation
- ✅ Cross-browser support

**Test Cases:**

| Test ID | Test Case | Description |
|---------|-----------|-------------|
| TC-005-01 | Page loads successfully | Verifies page loads and is ready |
| TC-005-02 | Hotel select exists | Validates dropdown element is present |
| TC-005-03 | Hotel count correct | Confirms 25 hotels are loaded |
| TC-005-04 | All expected hotels present | Checks each expected hotel exists |
| TC-005-05 | No duplicate hotels | Ensures no duplicates in list |
| TC-005-06 | Hotel options have values | Validates option values are set |
| TC-005-07 | Hotel selection works | Tests selecting a hotel |
| TC-005-08 | Hotel list load time | Performance test (< 5 seconds) |
| TC-005-09 | Display complete hotel list | Shows all hotels found |

### Implementation 2: Playwright

**File:** `test_uc005_hotel_list_playwright.py`

**Technology:**
- Playwright 1.40.0 (optional)
- Python 3.11+
- Chromium browser

**Advantages:**
- ✅ Modern and fast
- ✅ Built-in auto-wait
- ✅ Better async handling
- ✅ Network monitoring
- ✅ Advanced debugging tools

**Test Cases:**

| Test ID | Test Case | Description |
|---------|-----------|-------------|
| TC-005-01 | Page loads successfully | Verifies page loads and is ready |
| TC-005-02 | Hotel select exists | Validates dropdown element is present |
| TC-005-03 | Hotel count correct | Confirms 25 hotels are loaded |
| TC-005-04 | All expected hotels present | Checks each expected hotel exists |
| TC-005-05 | No duplicate hotels | Ensures no duplicates in list |
| TC-005-06 | Hotel options have values | Validates option values are set |
| TC-005-07 | Hotel selection works | Tests selecting a hotel |
| TC-005-08 | Hotel list load time | Performance test (< 5 seconds) |
| TC-005-09 | API integration verification | Monitors network calls |
| TC-005-10 | Display complete hotel list | Shows all hotels found |

---

## Expected Hotels List

```python
EXPECTED_HOTELS = [
    "Todas", "Amparo", "Appenzell", "Areado", "Avaré", "Boraceia",
    "Campos do Jordão", "Caraguatatuba", "Fazenda Ibirá", "Guarujá",
    "Itanhaém", "Lindoia", "Maresias", "Monte Verde", "Peruíbe I",
    "Peruíbe II", "Poços de Caldas", "Saha", "São Lourenço", "São Pedro",
    "Serra Negra", "Socorro", "Termas de Ibirá", "Ubatuba", "Unidade Capital"
]
```

Total: **25 hotels**

---

## Test Preconditions

### For Selenium Tests

1. **Python Environment**
   ```bash
   python3 --version  # Should be 3.11+
   ```

2. **Dependencies Installed**
   ```bash
   pip install selenium==4.39.0 colorama==0.4.6
   ```

3. **Chrome/Chromium Browser**
   ```bash
   google-chrome --version
   # or
   chromium --version
   ```

4. **Application Running**
   ```bash
   # Local testing
   npm run dev
   # Access at: http://localhost:8080/public/index.html
   
   # Production testing
   export TEST_BASE_URL=https://www.mpbarbosa.com/vagas/
   ```

### For Playwright Tests

1. **Additional Installation**
   ```bash
   pip install playwright==1.40.0
   python -m playwright install chromium
   ```

2. **Verify Installation**
   ```bash
   python -m playwright --version
   ```

---

## Running the Tests

### Quick Start

```bash
# Run Selenium tests (default)
python3 tests/use_cases/test_uc005_hotel_list_selenium.py

# Run Playwright tests (if installed)
python3 tests/use_cases/test_uc005_hotel_list_playwright.py
```

### With NPM Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test:browser:selenium": "python3 tests/use_cases/test_uc005_hotel_list_selenium.py",
    "test:browser:playwright": "python3 tests/use_cases/test_uc005_hotel_list_playwright.py",
    "test:browser:all": "npm run test:browser:selenium && npm run test:browser:playwright",
    "test:browser:selenium:prod": "TEST_BASE_URL=https://www.mpbarbosa.com/vagas/ npm run test:browser:selenium"
  }
}
```

Then run:

```bash
npm run test:browser:selenium
npm run test:browser:playwright
npm run test:browser:all
```

### Environment Variables

```bash
# Test against local development server
export TEST_BASE_URL=http://localhost:8080/public/index.html
python3 tests/use_cases/test_uc005_hotel_list_selenium.py

# Test against production
export TEST_BASE_URL=https://www.mpbarbosa.com/vagas/
python3 tests/use_cases/test_uc005_hotel_list_selenium.py

# Test against staging
export TEST_BASE_URL=https://staging.mpbarbosa.com/vagas/
python3 tests/use_cases/test_uc005_hotel_list_selenium.py
```

---

## Test Execution Flow

### Selenium Test Flow

```
1. setUpClass()
   ├─ Initialize Chrome driver (headless)
   ├─ Configure browser options
   ├─ Set implicit wait (10s)
   └─ Create WebDriverWait (30s timeout)

2. setUp() (before each test)
   ├─ Navigate to application URL
   └─ Wait 2 seconds for page load

3. test_TC_005_XX()
   ├─ Wait for elements
   ├─ Perform assertions
   └─ Record results

4. tearDown() (after each test)
   └─ (No action - page reloaded in setUp)

5. tearDownClass()
   ├─ Quit browser
   ├─ Print summary
   └─ Display results
```

### Playwright Test Flow

```
1. setUpClass()
   ├─ Start Playwright
   ├─ Launch browser (headless)
   └─ Create browser context

2. setUp() (before each test)
   ├─ Create new page
   ├─ Navigate to application URL
   └─ Wait for networkidle

3. test_TC_005_XX()
   ├─ Use auto-wait locators
   ├─ Perform assertions
   └─ Record results

4. tearDown() (after each test)
   └─ Close page

5. tearDownClass()
   ├─ Close context
   ├─ Close browser
   ├─ Stop Playwright
   └─ Display results
```

---

## Expected Results

### Successful Test Run

```
================================================================================
UC-005: Hotel List Browser Verification (Selenium)
================================================================================

Testing URL: http://localhost:8080/public/index.html
Start Time: 2025-12-25 16:55:21

Running TC-005-01: Page loads successfully
✅ TC-005-01 PASSED

Running TC-005-02: Hotel select dropdown exists
✅ TC-005-02 PASSED

Running TC-005-03: Hotel count is 25
   Expected: 25 hotels
   Actual: 25 hotels
✅ TC-005-03 PASSED

Running TC-005-04: All expected hotels present
✅ TC-005-04 PASSED - All 25 hotels present

Running TC-005-05: No duplicate hotels
✅ TC-005-05 PASSED - No duplicates

Running TC-005-06: Hotel options have valid values
✅ TC-005-06 PASSED - All options have valid values

Running TC-005-07: Hotel selection works
   Selected hotel: Guarujá
✅ TC-005-07 PASSED

Running TC-005-08: Hotel list load time < 5s
   Load time: 1.23 seconds
✅ TC-005-08 PASSED - Loaded in 1.23s

Running TC-005-09: Display complete hotel list

================================================================================
HOTEL LIST DISPLAYED IN BROWSER (25 hotels)
================================================================================

 1. 🏨 Todas                      (value: )
 2. 🏨 Amparo                     (value: 11)
 3. 🏨 Appenzell                  (value: 12)
...
25. 🏨 Unidade Capital            (value: 35)

================================================================================

✅ TC-005-09 PASSED

================================================================================
TEST SUMMARY
================================================================================

End Time: 2025-12-25 16:55:45

Total Tests: 9
Passed: 9
Failed: 0
Pass Rate: 100.0%

Detailed Results:

  ✅ TC-005-01: Page loads successfully                  PASS   - Page loaded successfully
  ✅ TC-005-02: Hotel select dropdown exists             PASS   - Hotel select found and enabled
  ✅ TC-005-03: Hotel count is 25                        PASS   - 25 hotels loaded
  ✅ TC-005-04: All expected hotels present              PASS   - All 25 hotels present
  ✅ TC-005-05: No duplicate hotels                      PASS   - No duplicates found
  ✅ TC-005-06: Hotel options have valid values          PASS   - All options have valid values
  ✅ TC-005-07: Hotel selection works                    PASS   - Successfully selected Guarujá
  ✅ TC-005-08: Hotel list load time < 5s                PASS   - Loaded in 1.23s
  ✅ TC-005-09: Display complete hotel list              PASS   - Displayed 25 hotels

✅ ALL HOTEL LIST BROWSER TESTS PASSED!

================================================================================
```

---

## Failure Scenarios

### Scenario 1: Missing Hotels

```
Running TC-005-04: All expected hotels present
   Missing hotels: Guarujá, Ubatuba
❌ TC-005-04 FAILED: Missing hotels: Guarujá, Ubatuba
```

**Possible Causes:**
- API returning incomplete data
- Network issues
- Caching problems

**Resolution:**
1. Check API endpoint manually
2. Verify network connectivity
3. Clear browser cache
4. Check for JavaScript errors

### Scenario 2: Timeout Waiting for Element

```
Running TC-005-02: Hotel select dropdown exists
❌ TC-005-02 FAILED: Timeout waiting for element #hotelSelect
```

**Possible Causes:**
- Page not loading completely
- Element ID changed
- JavaScript error preventing render
- Slow network/API

**Resolution:**
1. Increase timeout (WebDriverWait)
2. Check browser console for errors
3. Verify element selector is correct
4. Check if API endpoint is responding

### Scenario 3: Performance Issues

```
Running TC-005-08: Hotel list load time < 5s
   Load time: 7.45 seconds
❌ TC-005-08 FAILED: Hotel list took 7.45s to load (max 5s)
```

**Possible Causes:**
- Slow API response
- Network latency
- Resource loading issues
- Server overload

**Resolution:**
1. Check API response time
2. Test network speed
3. Optimize API calls
4. Consider caching strategy

---

## Integration with Test Suite

### Add to Main Test Runner

**File:** `tests/use_cases/run_use_case_tests.sh`

```bash
#!/bin/bash

echo "Running Use Case Tests..."

# Run UC-005 Browser Tests
echo ""
echo "=== UC-005: Hotel List Browser Verification (Selenium) ==="
python3 tests/use_cases/test_uc005_hotel_list_selenium.py
UC005_SELENIUM=$?

# Run Playwright tests if available
if python3 -c "import playwright" 2>/dev/null; then
    echo ""
    echo "=== UC-005: Hotel List Browser Verification (Playwright) ==="
    python3 tests/use_cases/test_uc005_hotel_list_playwright.py
    UC005_PLAYWRIGHT=$?
else
    echo ""
    echo "⚠️  Playwright not installed, skipping Playwright tests"
    UC005_PLAYWRIGHT=0
fi

# Exit with error if any test failed
if [ $UC005_SELENIUM -ne 0 ] || [ $UC005_PLAYWRIGHT -ne 0 ]; then
    exit 1
fi

exit 0
```

---

## Comparison: Selenium vs Playwright

| Feature | Selenium | Playwright |
|---------|----------|------------|
| **Setup Complexity** | Medium | Medium-High |
| **Execution Speed** | Slower | Faster |
| **Auto-Wait** | No (manual WebDriverWait) | Yes (built-in) |
| **Network Monitoring** | Limited | Excellent |
| **Debugging Tools** | Basic | Advanced (trace viewer) |
| **Browser Support** | Chrome, Firefox, Safari, Edge | Chromium, Firefox, WebKit |
| **Community** | Large, mature | Growing, modern |
| **Learning Curve** | Lower | Moderate |
| **Best For** | Traditional web apps | Modern SPAs, PWAs |
| **Installed** | ✅ Yes | ❌ No (optional) |

---

## Best Practices

### Do's ✅

1. **Use explicit waits** - Always wait for elements before interaction
2. **Use descriptive test names** - Make test purpose clear
3. **Clean up resources** - Close browsers in tearDown
4. **Test in isolation** - Each test should be independent
5. **Handle timeouts gracefully** - Provide clear error messages
6. **Log important information** - Help debugging
7. **Use page objects** - For complex applications (future enhancement)

### Don'ts ❌

1. **Don't use time.sleep()** - Use explicit waits instead
2. **Don't test implementation details** - Test user-visible behavior
3. **Don't share state between tests** - Keep tests independent
4. **Don't ignore errors** - Always assert expected behavior
5. **Don't test in production only** - Test locally first
6. **Don't hardcode URLs** - Use environment variables

---

## Troubleshooting

### Common Issues

#### 1. Chrome Driver Not Found

**Error:** `selenium.common.exceptions.WebDriverException: Message: 'chromedriver' executable needs to be in PATH`

**Solution:**
```bash
# Install ChromeDriver
sudo apt-get install chromium-chromedriver

# Or use webdriver-manager
pip install webdriver-manager
```

#### 2. Element Not Found

**Error:** `selenium.common.exceptions.NoSuchElementException: Message: no such element: Unable to locate element`

**Solution:**
- Check element selector is correct
- Wait for element to load (increase timeout)
- Verify page is fully loaded
- Check for iframe context

#### 3. Playwright Not Installed

**Error:** `ModuleNotFoundError: No module named 'playwright'`

**Solution:**
```bash
pip install playwright==1.40.0
python -m playwright install chromium
```

#### 4. Tests Pass Locally but Fail in CI

**Possible Causes:**
- Different screen size
- Missing dependencies
- Network restrictions
- Timing issues

**Solution:**
- Use headless mode
- Install all dependencies in CI
- Increase timeouts
- Check CI logs carefully

---

## Future Enhancements

1. **Page Object Pattern**
   - Create reusable page objects
   - Improve maintainability

2. **Visual Regression Testing**
   - Screenshot comparison
   - Detect UI changes

3. **Cross-Browser Testing**
   - Test on Firefox, Safari
   - Use Selenium Grid

4. **Parallel Execution**
   - Run tests concurrently
   - Reduce execution time

5. **CI/CD Integration**
   - Add to GitHub Actions
   - Automated test reports

6. **Test Data Management**
   - External test data files
   - Dynamic test generation

---

## References

- [Selenium Documentation](https://www.selenium.dev/documentation/)
- [Playwright Python Documentation](https://playwright.dev/python/)
- [Browser Testing Guide](../docs/BROWSER_TESTING_GUIDE.md)
- [Use Case Tests README](./README.md)

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-25 | System | Initial documentation |

---

**Document Status:** ✅ Complete  
**Last Updated:** 2025-12-25  
**Maintained By:** QA Team
