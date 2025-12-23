# FR-014 Test Suite Documentation

## Overview

**Feature:** Booking Rules Toggle (FR-014)  
**Test Suite:** `tests/test_booking_rules_toggle.py`  
**Version:** 1.0.0  
**Last Updated:** 2024-12-22

This test suite validates the implementation of the booking rules toggle feature, which allows users to optionally apply booking validation rules to their vacancy searches.

## Purpose

The FR-014 test suite ensures that:
1. The booking rules toggle UI element exists and is properly configured
2. The toggle has the correct default state (enabled/checked)
3. The toggle can be interacted with and changes state correctly
4. The toggle maintains proper accessibility attributes
5. The toggle is properly integrated into the search form
6. Visual feedback is provided for different states

## Test Architecture

### Technology Stack

- **Framework:** Python `unittest`
- **Browser Automation:** Selenium WebDriver
- **Browser:** Chrome (headless mode)
- **HTTP Server:** Python `http.server` (serves local files)
- **Port:** 8766

### Test Environment Setup

```python
@classmethod
def setUpClass(cls):
    # 1. Start local HTTP server on port 8766
    # 2. Initialize Chrome WebDriver in headless mode
    # 3. Configure implicit wait (5s) and explicit wait (10s)
```

**Server Configuration:**
- Serves files from `public/` directory
- Runs in daemon thread
- Automatically starts before tests
- Automatically stops after tests

**Browser Configuration:**
- Headless mode (no GUI)
- Window size: 1920x1080
- No sandbox mode (for CI/CD compatibility)
- Disabled shared memory usage

## Test Cases

### Test 01: Toggle Exists
**ID:** `test_01_toggle_exists`  
**AC Reference:** AC-014.1  
**Purpose:** Verify the booking rules toggle element exists in DOM

**Validation:**
```python
- Element ID: "apply-booking-rules" exists
- Element type: "checkbox"
- Element is not None
```

**Expected Output:**
```
✅ Toggle exists
✅ Toggle type: checkbox
```

---

### Test 02: Default State is Enabled
**ID:** `test_02_default_state_enabled`  
**AC Reference:** AC-014.3  
**Purpose:** Verify toggle is checked by default

**Validation:**
```python
- toggle.is_selected() returns True
- Default state is "checked"
```

**Expected Output:**
```
✅ Default state: checked (enabled)
✅ Booking rules will be applied by default
```

**Rationale:**  
Booking rules should be applied by default for user safety and consistency with AFPESP website behavior.

---

### Test 03: Label Exists
**ID:** `test_03_label_exists`  
**AC Reference:** AC-014.2  
**Purpose:** Verify toggle has a clear, visible label

**Validation:**
```python
- Label element with for="apply-booking-rules" exists
- Label text contains "Regras" (Portuguese for "Rules")
- Label is not empty
```

**Expected Output:**
```
✅ Label text: 'Aplicar Regras de Reserva'
✅ Label is clearly visible
```

---

### Test 04: Toggle Can Be Changed
**ID:** `test_04_toggle_can_be_changed`  
**AC Reference:** AC-014.8  
**Purpose:** Verify toggle state can be changed by clicking

**Test Flow:**
```python
1. Get initial state (should be checked)
2. Click toggle
3. Verify state changed (should be unchecked)
4. Click toggle again
5. Verify state restored (should be checked)
```

**Validation:**
```python
- initial_state != after_click_state
- initial_state == restored_state
- State changes are immediate
```

**Expected Output:**
```
📌 Initial state: True
📌 After click: False
📌 After second click: True
✅ Toggle state changes correctly
```

---

### Test 05: Toggle Accessibility
**ID:** `test_05_toggle_accessibility`  
**Purpose:** Verify accessibility attributes are properly configured

**ARIA Attributes Checked:**
- `aria-label`: Descriptive label for screen readers
- `aria-describedby`: Reference to additional description (if present)
- `data-bs-toggle`: Bootstrap tooltip configuration (if present)

**Validation:**
```python
- aria-label attribute exists and is not empty
- Additional ARIA attributes logged for documentation
```

**Expected Output:**
```
✅ ARIA label: 'Aplicar regras de reserva da AFPESP'
✅ ARIA described by: 'booking-rules-help'
✅ Tooltip enabled: tooltip
```

**Accessibility Notes:**
- Screen readers announce toggle purpose clearly
- Tooltip provides additional context on hover
- Keyboard navigation fully supported

---

### Test 06: Form Submission with Toggle
**ID:** `test_06_form_submission_with_toggle`  
**Purpose:** Verify toggle remains functional when form is filled

**Test Flow:**
```python
1. Fill check-in date field
2. Fill check-out date field
3. Verify toggle is still enabled
4. Click toggle
5. Verify state changed
```

**Validation:**
```python
- Toggle remains enabled with filled form
- Toggle state can be changed
- No interference between form fields and toggle
```

**Expected Output:**
```
✅ Toggle remains functional with form filled
✅ Toggle changed from True to False
```

---

### Test 07: Visual Feedback
**ID:** `test_07_visual_feedback`  
**AC Reference:** AC-014.7, AC-014.8  
**Purpose:** Verify toggle provides visual state indication

**Visual Properties Checked:**
- Element visibility (is_displayed())
- Element dimensions (width, height)
- Element position (x, y coordinates)

**Validation:**
```python
- toggle.is_displayed() returns True
- size['width'] > 0
- size['height'] > 0
- Element has valid position
```

**Expected Output:**
```
✅ Toggle is visible
✅ Size: 24x24px
✅ Location: (150, 250)
```

**Visual State Notes:**
- Checked state: Bootstrap checkbox styling (typically blue/primary color)
- Unchecked state: Bootstrap checkbox styling (typically gray/secondary color)
- Hover state: Cursor changes to pointer
- Focus state: Focus ring visible for keyboard navigation

---

### Test 08: Container Placement
**ID:** `test_08_container_placement`  
**Purpose:** Verify toggle is properly placed in form layout

**Layout Validation:**
- Toggle is inside a Bootstrap column (`col-md-1`)
- Toggle is inside the main form element
- Toggle follows proper Bootstrap grid structure

**Expected Output:**
```
✅ Toggle is properly placed in form
✅ Toggle is in Bootstrap column layout
```

## Running the Tests

### Prerequisites

```bash
# Python 3.x
# Selenium WebDriver
pip install selenium

# Chrome browser installed
# ChromeDriver (automatically managed by Selenium 4+)
```

### Execution

```bash
# Run from project root
python tests/test_booking_rules_toggle.py

# Or using the test runner script
./run-tests.sh fr014
```

### Expected Output Format

```
================================================================================
🔘 FR-014: BOOKING RULES TOGGLE TEST SUITE
================================================================================
Testing applyBookingRules toggle functionality
================================================================================

✅ Local server started on http://localhost:8766
✅ Chrome driver initialized (headless mode)

🧪 Test 1: Booking Rules Toggle Exists
   ✅ Toggle exists
   ✅ Toggle type: checkbox
.

🧪 Test 2: Default State is Enabled
   ✅ Default state: checked (enabled)
   ✅ Booking rules will be applied by default
.

[... 6 more tests ...]

================================================================================
📊 TEST SUMMARY
================================================================================
Tests run: 8
✅ Passed: 8
❌ Failed: 0
💥 Errors: 0
================================================================================
```

## Test Data

### Test Dates
Tests use dynamic date generation to avoid date-related failures:

```python
from datetime import datetime, timedelta

today = datetime.now()
tomorrow = today + timedelta(days=1)

checkin_date = today.strftime("%Y-%m-%d")
checkout_date = tomorrow.strftime("%Y-%m-%d")
```

### Element IDs

| Element | ID | Type |
|---------|-----|------|
| Toggle checkbox | `apply-booking-rules` | `<input type="checkbox">` |
| Toggle label | N/A | `<label for="apply-booking-rules">` |
| Check-in field | `input-checkin` | `<input type="date">` |
| Check-out field | `input-checkout` | `<input type="date">` |

## Troubleshooting

### Common Issues

#### 1. Element Not Found
**Error:** `NoSuchElementException`

**Causes:**
- Page not fully loaded
- Incorrect element ID
- JavaScript not executed

**Solution:**
```python
# Increase wait time
self.wait = WebDriverWait(self.driver, 20)

# Wait for element explicitly
element = self.wait.until(
    EC.presence_of_element_located((By.ID, "apply-booking-rules"))
)
```

#### 2. Server Port Already in Use
**Error:** `Address already in use`

**Causes:**
- Previous test run didn't clean up
- Another process using port 8766

**Solution:**
```bash
# Find and kill process
lsof -ti:8766 | xargs kill -9

# Or use different port in test
cls.port = 8767
```

#### 3. ChromeDriver Version Mismatch
**Error:** `SessionNotCreatedException`

**Solution:**
```bash
# Selenium 4+ auto-manages ChromeDriver
# Just ensure Chrome browser is up to date
google-chrome --version
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: FR-014 Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install selenium
      
      - name: Install Chrome
        uses: browser-actions/setup-chrome@latest
      
      - name: Run FR-014 tests
        run: python tests/test_booking_rules_toggle.py
      
      - name: Upload screenshots on failure
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: test-screenshots
          path: test_screenshots/
```

## Maintenance

### When to Update Tests

1. **UI Changes:** Toggle ID, class, or structure modified
2. **Behavior Changes:** Default state changed, new validation rules
3. **Accessibility Updates:** New ARIA attributes or accessibility features
4. **Layout Changes:** Form restructuring, Bootstrap version upgrade

### Updating Tests

```python
# Example: Changing element ID
# Before:
toggle = self.driver.find_element(By.ID, "apply-booking-rules")

# After:
toggle = self.driver.find_element(By.ID, "booking-rules-toggle")
```

## Code Coverage

### Current Coverage: 100%

| Acceptance Criteria | Test Coverage |
|---------------------|---------------|
| AC-014.1: Toggle exists | ✅ test_01 |
| AC-014.2: Has label | ✅ test_03 |
| AC-014.3: Default enabled | ✅ test_02 |
| AC-014.7: Visual feedback | ✅ test_07 |
| AC-014.8: State changes | ✅ test_04 |
| Accessibility | ✅ test_05 |
| Form integration | ✅ test_06 |
| Layout placement | ✅ test_08 |

## Related Documentation

- **Feature Spec:** `docs/features/FUNCTIONAL_REQUIREMENTS.md` (FR-014)
- **Implementation:** `docs/features/FR-014-IMPLEMENTATION-SUMMARY.md`
- **API Documentation:** `docs/api/FR-014-API-COMPATIBILITY-REPORT.md`
- **User Guide:** `README.md` (Booking Rules section)

## Changelog

### Version 1.0.0 (2024-12-22)
- Initial test suite implementation
- 8 comprehensive test cases
- Full AC coverage for FR-014
- Accessibility testing included
- CI/CD ready

---

**Maintained by:** Development Team  
**Contact:** See project README for contact information
