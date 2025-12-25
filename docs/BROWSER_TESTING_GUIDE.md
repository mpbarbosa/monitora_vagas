# Browser Testing Guide - Monitora Vagas

## Overview

This document provides comprehensive guidance for implementing browser-based UI tests using **Selenium** and **Playwright** for the Monitora Vagas application.

## Table of Contents

1. [Testing Tools Comparison](#testing-tools-comparison)
2. [Selenium Setup & Usage](#selenium-setup--usage)
3. [Playwright Setup & Usage](#playwright-setup--usage)
4. [Test Scenarios](#test-scenarios)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Testing Tools Comparison

### Selenium WebDriver

**Pros:**
- ✅ Mature and stable (10+ years)
- ✅ Large community and extensive documentation
- ✅ Multi-language support (Python, Java, JavaScript, C#, Ruby)
- ✅ Works with all major browsers
- ✅ Already installed in project (`selenium==4.39.0`)

**Cons:**
- ❌ Slower execution compared to Playwright
- ❌ More verbose API
- ❌ Requires separate driver management
- ❌ No built-in auto-wait (manual WebDriverWait needed)

**Best For:**
- Cross-browser compatibility testing
- Legacy test migration
- Teams familiar with Selenium ecosystem

### Playwright

**Pros:**
- ✅ Modern and fast
- ✅ Built-in auto-wait functionality
- ✅ Better handling of modern web apps (SPA, PWA)
- ✅ Parallel test execution out-of-the-box
- ✅ Better debugging tools (trace viewer, screenshots, videos)
- ✅ Native support for multiple contexts and devices

**Cons:**
- ❌ Newer tool (less mature than Selenium)
- ❌ Smaller community
- ❌ Not currently installed in project

**Best For:**
- Modern web applications
- Fast execution requirements
- Advanced features (network mocking, parallel execution)

---

## Selenium Setup & Usage

### Current Installation

```bash
# Already installed via requirements.txt
selenium==4.39.0
colorama==0.4.6
```

### Chrome Driver Configuration

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument('--headless')  # Run without GUI
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument('--window-size=1920,1080')
chrome_options.add_argument('--disable-gpu')
chrome_options.binary_location = '/opt/google/chrome/chrome'

driver = webdriver.Chrome(options=chrome_options)
```

### Basic Test Structure

```python
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class MyTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome(options=chrome_options)
        cls.wait = WebDriverWait(cls.driver, 30)
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()
    
    def test_something(self):
        self.driver.get('http://localhost:8080/public/index.html')
        element = self.wait.until(
            EC.presence_of_element_located((By.ID, 'element-id'))
        )
        self.assertTrue(element.is_displayed())
```

---

## Playwright Setup & Usage

### Installation

```bash
# Install Playwright for Python
pip install playwright==1.40.0

# Install browser binaries
python -m playwright install chromium

# Or install all browsers
python -m playwright install
```

### Add to requirements.txt

```
playwright==1.40.0
pytest-playwright==0.4.4
```

### Basic Test Structure (Pytest)

```python
import pytest
from playwright.sync_api import Page, expect

def test_hotel_list_loads(page: Page):
    page.goto('http://localhost:8080/public/index.html')
    
    # Playwright has built-in auto-wait
    hotel_select = page.locator('#hotelSelect')
    expect(hotel_select).to_be_visible()
    
    # Count options
    options = page.locator('#hotelSelect option')
    expect(options).to_have_count(25)
```

### Basic Test Structure (Unittest)

```python
import unittest
from playwright.sync_api import sync_playwright

class MyTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=True)
        cls.context = cls.browser.new_context(viewport={'width': 1920, 'height': 1080})
    
    @classmethod
    def tearDownClass(cls):
        cls.context.close()
        cls.browser.close()
        cls.playwright.stop()
    
    def setUp(self):
        self.page = self.context.new_page()
    
    def tearDown(self):
        self.page.close()
    
    def test_something(self):
        self.page.goto('http://localhost:8080/public/index.html')
        hotel_select = self.page.locator('#hotelSelect')
        self.assertTrue(hotel_select.is_visible())
```

---

## Test Scenarios

### Scenario 1: Hotel List Verification

**Purpose:** Verify all 25 hotels are loaded in the dropdown

#### Selenium Implementation

```python
def test_hotel_list_loads(self):
    """Verify all 25 hotels load in dropdown"""
    self.driver.get(self.base_url)
    
    hotel_select = self.wait.until(
        EC.presence_of_element_located((By.ID, 'hotelSelect'))
    )
    
    options = hotel_select.find_elements(By.TAG_NAME, 'option')
    self.assertEqual(len(options), 25, "Should have 25 hotel options")
    
    expected_hotels = ['Todas', 'Amparo', 'Appenzell', ...]
    actual_hotels = [opt.text for opt in options]
    
    for expected in expected_hotels:
        self.assertIn(expected, actual_hotels)
```

#### Playwright Implementation

```python
def test_hotel_list_loads(self):
    """Verify all 25 hotels load in dropdown"""
    self.page.goto(self.base_url)
    
    # Auto-wait for element
    hotel_select = self.page.locator('#hotelSelect')
    expect(hotel_select).to_be_visible()
    
    # Check option count
    options = self.page.locator('#hotelSelect option')
    expect(options).to_have_count(25)
    
    # Verify specific hotels
    expect(self.page.locator('option:has-text("Amparo")')).to_be_visible()
    expect(self.page.locator('option:has-text("Guarujá")')).to_be_visible()
```

### Scenario 2: Hotel List API Integration

**Purpose:** Verify hotel dropdown is populated from API

#### Selenium Implementation

```python
def test_hotel_list_api_integration(self):
    """Verify hotels are loaded from API"""
    self.driver.get(self.base_url)
    
    # Wait for API call to complete (check loading indicator)
    self.wait.until(
        EC.invisibility_of_element_located((By.CLASS_NAME, 'loading-spinner'))
    )
    
    # Verify dropdown is populated
    hotel_select = self.wait.until(
        EC.presence_of_element_located((By.ID, 'hotelSelect'))
    )
    
    # Check that options have valid hotelId attributes
    options = hotel_select.find_elements(By.TAG_NAME, 'option')
    
    for option in options[1:]:  # Skip "Todas"
        hotel_id = option.get_attribute('value')
        self.assertIsNotNone(hotel_id)
        self.assertTrue(len(hotel_id) > 0)
```

#### Playwright Implementation

```python
def test_hotel_list_api_integration(self):
    """Verify hotels are loaded from API"""
    # Intercept API call
    api_response = None
    
    def handle_response(response):
        if 'hoteis/scrape' in response.url:
            nonlocal api_response
            api_response = response
    
    self.page.on('response', handle_response)
    self.page.goto(self.base_url)
    
    # Wait for API response
    self.page.wait_for_selector('#hotelSelect option[value]')
    
    # Verify API was called
    self.assertIsNotNone(api_response)
    self.assertEqual(api_response.status, 200)
    
    # Verify dropdown populated
    options = self.page.locator('#hotelSelect option')
    expect(options).to_have_count(25)
```

### Scenario 3: Hotel Selection and UI Update

**Purpose:** Verify selecting a hotel updates the UI correctly

#### Selenium Implementation

```python
def test_hotel_selection_updates_ui(self):
    """Verify hotel selection updates UI"""
    self.driver.get(self.base_url)
    
    hotel_select = self.wait.until(
        EC.presence_of_element_located((By.ID, 'hotelSelect'))
    )
    
    # Select a specific hotel
    hotel_select.send_keys('Guarujá')
    time.sleep(1)  # Wait for UI update
    
    # Verify search button is enabled
    search_button = self.driver.find_element(By.ID, 'searchButton')
    self.assertTrue(search_button.is_enabled())
    
    # Verify selected value
    selected_option = hotel_select.find_element(By.CSS_SELECTOR, 'option:checked')
    self.assertEqual(selected_option.text, 'Guarujá')
```

#### Playwright Implementation

```python
def test_hotel_selection_updates_ui(self):
    """Verify hotel selection updates UI"""
    self.page.goto(self.base_url)
    
    # Select hotel by visible text
    self.page.select_option('#hotelSelect', label='Guarujá')
    
    # Verify search button is enabled
    search_button = self.page.locator('#searchButton')
    expect(search_button).to_be_enabled()
    
    # Verify selected value
    selected_value = self.page.locator('#hotelSelect').input_value()
    self.assertIsNotNone(selected_value)
```

### Scenario 4: Hotel List Performance

**Purpose:** Verify hotel list loads within acceptable time

#### Selenium Implementation

```python
def test_hotel_list_loads_performance(self):
    """Verify hotel list loads within 5 seconds"""
    start_time = time.time()
    self.driver.get(self.base_url)
    
    hotel_select = self.wait.until(
        EC.presence_of_element_located((By.ID, 'hotelSelect'))
    )
    
    options = hotel_select.find_elements(By.TAG_NAME, 'option')
    load_time = time.time() - start_time
    
    self.assertEqual(len(options), 25)
    self.assertLess(load_time, 5.0, f"Hotel list took {load_time:.2f}s to load")
    print(f"Hotel list loaded in {load_time:.2f}s")
```

#### Playwright Implementation

```python
def test_hotel_list_loads_performance(self):
    """Verify hotel list loads within 5 seconds"""
    start_time = time.time()
    self.page.goto(self.base_url)
    
    # Wait for all options to load
    self.page.wait_for_selector('#hotelSelect option:nth-child(25)')
    load_time = time.time() - start_time
    
    options = self.page.locator('#hotelSelect option')
    expect(options).to_have_count(25)
    
    self.assertLess(load_time, 5.0, f"Hotel list took {load_time:.2f}s to load")
    print(f"Hotel list loaded in {load_time:.2f}s")
```

---

## Best Practices

### General Guidelines

1. **Use Explicit Waits** - Always wait for elements before interacting
2. **Unique Selectors** - Prefer IDs over CSS classes or XPath
3. **Test Isolation** - Each test should be independent
4. **Descriptive Names** - Use clear test method names
5. **Assertions First** - Put most important assertions first
6. **Clean Up** - Always close browsers in tearDown

### Selenium Best Practices

```python
# ✅ Good - Explicit wait
element = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, 'hotelSelect'))
)

# ❌ Bad - Implicit time.sleep()
time.sleep(5)
element = driver.find_element(By.ID, 'hotelSelect')

# ✅ Good - Check element state
if element.is_displayed() and element.is_enabled():
    element.click()

# ❌ Bad - Direct click without checking
element.click()
```

### Playwright Best Practices

```python
# ✅ Good - Use built-in assertions
expect(page.locator('#hotelSelect')).to_be_visible()

# ❌ Bad - Manual wait
time.sleep(2)
assert page.locator('#hotelSelect').is_visible()

# ✅ Good - Use locator chaining
page.locator('#hotelSelect').locator('option').first.click()

# ✅ Good - Network waiting
page.wait_for_load_state('networkidle')
```

### Common Selectors

```python
# By ID (preferred)
By.ID, 'hotelSelect'
page.locator('#hotelSelect')

# By CSS Class
By.CLASS_NAME, 'hotel-option'
page.locator('.hotel-option')

# By CSS Selector
By.CSS_SELECTOR, '#hotelSelect option[value="123"]'
page.locator('#hotelSelect option[value="123"]')

# By XPath (use sparingly)
By.XPATH, '//select[@id="hotelSelect"]/option'
page.locator('xpath=//select[@id="hotelSelect"]/option')

# By Text Content
# Selenium
driver.find_element(By.XPATH, "//*[contains(text(), 'Guarujá')]")
# Playwright
page.locator('text=Guarujá')
```

---

## Troubleshooting

### Selenium Issues

**Problem:** Element not found
```python
# Solution: Increase timeout
wait = WebDriverWait(driver, 30)  # Increase from 10 to 30

# Solution: Wait for specific condition
wait.until(EC.visibility_of_element_located((By.ID, 'hotelSelect')))
```

**Problem:** Element not clickable
```python
# Solution: Wait for element to be clickable
element = wait.until(EC.element_to_be_clickable((By.ID, 'button')))
element.click()

# Solution: Scroll into view
driver.execute_script("arguments[0].scrollIntoView(true);", element)
element.click()
```

**Problem:** Stale element reference
```python
# Solution: Re-find element
def safe_click(driver, by, locator):
    for _ in range(3):
        try:
            element = driver.find_element(by, locator)
            element.click()
            break
        except StaleElementReferenceException:
            time.sleep(0.5)
```

### Playwright Issues

**Problem:** Timeout waiting for element
```python
# Solution: Increase timeout
page.locator('#hotelSelect').wait_for(timeout=30000)  # 30 seconds

# Solution: Wait for specific state
page.wait_for_load_state('networkidle')
```

**Problem:** Element covered by another element
```python
# Solution: Force click
page.locator('#button').click(force=True)

# Solution: Wait for animations
page.wait_for_timeout(500)
```

### Browser-Specific Issues

**Chrome Headless Issues:**
```python
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
```

**SSL Certificate Issues:**
```python
# Selenium
chrome_options.add_argument('--ignore-certificate-errors')

# Playwright
context = browser.new_context(ignore_https_errors=True)
```

---

## Running Tests

### Selenium Tests

```bash
# Run specific test file
python3 tests/use_cases/test_uc005_hotel_list_selenium.py

# Run with pytest
pytest tests/use_cases/test_uc005_hotel_list_selenium.py -v

# Run with unittest
python3 -m unittest tests.use_cases.test_uc005_hotel_list_selenium
```

### Playwright Tests

```bash
# Run with pytest (recommended)
pytest tests/use_cases/test_uc005_hotel_list_playwright.py -v

# Run with headed browser (see what's happening)
pytest tests/use_cases/test_uc005_hotel_list_playwright.py -v --headed

# Generate trace for debugging
pytest tests/use_cases/test_uc005_hotel_list_playwright.py --tracing=on
```

### NPM Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "test:browser:selenium": "python3 tests/use_cases/test_uc005_hotel_list_selenium.py",
    "test:browser:playwright": "pytest tests/use_cases/test_uc005_hotel_list_playwright.py -v",
    "test:browser:all": "npm run test:browser:selenium && npm run test:browser:playwright"
  }
}
```

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: Browser Tests

on: [push, pull_request]

jobs:
  selenium-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
      
      - name: Run Selenium tests
        run: python3 tests/use_cases/test_uc005_hotel_list_selenium.py
  
  playwright-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          python -m playwright install chromium
      
      - name: Run Playwright tests
        run: pytest tests/use_cases/test_uc005_hotel_list_playwright.py -v
```

---

## Conclusion

Both Selenium and Playwright are excellent tools for browser testing:

- **Choose Selenium** for stability, wide browser support, and team familiarity
- **Choose Playwright** for speed, modern features, and better developer experience

The Monitora Vagas project currently uses **Selenium**, which is suitable for the application's testing needs. Playwright can be added later if advanced features are required.

## References

- [Selenium Documentation](https://www.selenium.dev/documentation/)
- [Playwright Python Documentation](https://playwright.dev/python/)
- [WebDriver Best Practices](https://www.selenium.dev/documentation/test_practices/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
