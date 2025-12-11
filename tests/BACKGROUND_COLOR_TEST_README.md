# Background Color Tests

## Overview

Tests to verify that the background colors in `index.html` are set correctly.

## Test Files

### 1. Interactive Browser Test
**File**: `test-background-color.html`  
**Type**: Visual interactive test  
**Size**: ~18KB

**Features:**
- Live preview of index.html in iframe
- Visual color comparison
- Detailed test results
- Color sample swatches
- Auto-run on load

**How to run:**
```bash
# Open directly in browser
xdg-open tests/test-background-color.html

# Or with a web server
cd tests
python3 -m http.server 8080
# Then open http://localhost:8080/test-background-color.html
```

**What it tests:**
- ✅ Body background color
- ✅ Page wrapper background
- ✅ CSS variables (--color-background, etc.)
- ✅ All elements with backgrounds
- ✅ Color format validation (RGB → HEX)
- ✅ Visual comparison (expected vs actual)

---

### 2. Python/Selenium Test
**File**: `test-background-color.py`  
**Type**: Automated command-line test  
**Size**: ~11KB

**Requirements:**
```bash
pip install selenium
```

**How to run:**
```bash
# Default URL (localhost:8080)
python3 tests/test-background-color.py

# Custom URL
python3 tests/test-background-color.py --url http://localhost:3000

# Make executable and run
chmod +x tests/test-background-color.py
./tests/test-background-color.py
```

**What it tests:**
- ✅ Body background color (transparent - correct for this design)
- ✅ Page wrapper element exists
- ✅ Page wrapper has bg-color-1 class
- ✅ Page wrapper background color (#ffece0 - peachy/light orange)
- ✅ CSS architecture (variables or direct colors)
- ✅ All background elements enumeration

---

## What Gets Tested

### Body Background Color

**Expected:**
- Color: `rgba(0, 0, 0, 0)` (transparent)
- **Why transparent?** The design uses `.page-wrapper` with `.bg-color-1` class for the actual background

**Tests:**
1. Background color is transparent (expected behavior)
2. This is correct for the design architecture

### Page Wrapper

**Expected:**
- Element: `.page-wrapper` exists
- Class: `bg-color-1` present
- Background: `#ffece0` (peachy/light orange)

**Tests:**
1. `.page-wrapper` element found
2. Has `bg-color-1` class
3. Background color is `#ffece0`
4. Background is not transparent

### CSS Architecture

**Design Choice:**
This project uses **direct color classes** (e.g., `.bg-color-1`) rather than CSS custom properties.

**Tests:**
1. Verify CSS architecture (variables or direct colors)
2. This is informational, not a failure condition

### All Background Elements

**Tests:**
1. Find all elements with background colors
2. List selectors and colors
3. Verify non-transparent backgrounds

---

## Expected Test Results

### ✅ All Tests Passing

```
======================================================================
BACKGROUND COLOR TEST SUITE - index.html
======================================================================

Testing URL: http://localhost:8080

======================================================================
TEST 1: Body Background Color
======================================================================

ℹ️  Body background color (RGB): rgba(0, 0, 0, 0)
ℹ️  Body background color (HEX): #000000

✓ PASS: Body background is transparent (expected for this design)
  Expected: rgba(0, 0, 0, 0) or transparent
  Actual:   rgba(0, 0, 0, 0)
  Details:  Body uses page-wrapper for background

======================================================================
TEST 2: Page Wrapper Background
======================================================================

✓ PASS: Page wrapper element exists
  Expected: .page-wrapper element
  Actual:   Found

✓ PASS: Has bg-color-1 class
  Expected: bg-color-1 class
  Actual:   Classes: page-wrapper bg-color-1 p-t-395 p-b-120

ℹ️  Wrapper background color (RGB): rgba(255, 236, 224, 1)
ℹ️  Wrapper background color (HEX): #ffece0

✓ PASS: Page wrapper has correct background color
  Expected: #ffece0 (peachy/light orange)
  Actual:   rgba(255, 236, 224, 1) (#ffece0)

======================================================================
TEST SUMMARY
======================================================================
Total Tests:  7
Passed:       7 ✓
Failed:       0 ✗
Pass Rate:    100.0%

✅ ALL TESTS PASSED!
======================================================================
```

### ❌ When CSS Not Loaded

```
✗ FAIL: Page wrapper has correct background color
  Expected: #ffece0 (peachy/light orange)
  Actual:   rgba(0, 0, 0, 0) (#000000)

✗ FAIL: Page wrapper background is not transparent
  Expected: Non-transparent color
  Actual:   rgba(0, 0, 0, 0)
```

This indicates CSS files are not loading (see `docs/CSS_LOADING_ISSUE.md`).

---

## Common Issues

### Issue: "Page wrapper background is transparent"

**Cause**: CSS files not loaded

**Solution:**
1. Start a web server: `cd public && python3 -m http.server 8080`
2. Access via: `http://localhost:8080`
3. See: `docs/CSS_LOADING_ISSUE.md`

### Issue: "Page wrapper not found"

**Cause**: HTML structure changed or JavaScript disabled

**Solution:**
1. Check `public/index.html` has `<div class="page-wrapper">`
2. Enable JavaScript in browser
3. Check browser console for errors

### Issue: "CSS variables not defined"

**Cause**: CSS custom properties not loaded

**Solution:**
1. Verify `src/styles/global/variables.css` exists
2. Check `src/styles/main.css` imports variables
3. Ensure CSS files are being served correctly

### Issue: "Tests fail but page looks styled"

**Cause**: CSS loaded but colors don't match expected

**Solution:**
1. Check if CSS files were modified
2. Verify variable values in `variables.css`
3. Update test expectations if colors intentionally changed

---

## Integration

### Add to package.json

```json
{
  "scripts": {
    "test:bg-color": "python3 tests/test-background-color.py",
    "test:bg-color:html": "xdg-open tests/test-background-color.html"
  }
}
```

### Run Before Deployment

```bash
#!/bin/bash
# Test background colors before deploying

echo "Testing background colors..."
python3 tests/test-background-color.py --url http://localhost:8080

if [ $? -eq 0 ]; then
    echo "✓ Background color tests passed"
else
    echo "✗ Background color tests failed"
    exit 1
fi
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
- name: Test Background Colors
  run: |
    python3 -m http.server 8080 --directory public &
    sleep 2
    python3 tests/test-background-color.py
```

---

## Understanding Background Colors

### CSS Color Formats

#### HEX (Hexadecimal)
```css
background-color: #ffffff;  /* White */
background-color: #000000;  /* Black */
background-color: #f8fafc;  /* Light gray */
```

#### RGB (Red, Green, Blue)
```css
background-color: rgb(255, 255, 255);  /* White */
background-color: rgb(0, 0, 0);        /* Black */
background-color: rgb(248, 250, 252);  /* Light gray */
```

#### RGBA (with transparency)
```css
background-color: rgba(255, 255, 255, 1);    /* Opaque white */
background-color: rgba(0, 0, 0, 0.5);        /* 50% transparent black */
background-color: rgba(0, 0, 0, 0);          /* Fully transparent */
```

#### CSS Variables
```css
:root {
    --color-background: #ffffff;
}

body {
    background-color: var(--color-background);
}
```

### How Tests Check Colors

1. **Get Computed Style**: Browser resolves all CSS and returns final value
2. **Convert to HEX**: RGB values converted to hexadecimal for comparison
3. **Normalize**: Both lowercase for comparison
4. **Compare**: Check if colors match expected values

### Why White Background?

The default body background is white (`#ffffff`) because:
- ✅ High contrast with text
- ✅ Standard web convention
- ✅ Better readability
- ✅ Professional appearance
- ✅ Lighter on eyes in light mode

---

## Troubleshooting

### Test Not Finding Elements

```bash
# Check if server is running
curl http://localhost:8080

# Check HTML structure
curl http://localhost:8080 | grep "page-wrapper"

# Check CSS loaded
curl http://localhost:8080/css/main.css | head
```

### Color Mismatch

```python
# Manually check color in browser console
document.body.style.backgroundColor
getComputedStyle(document.body).backgroundColor
```

### Python Test Errors

```bash
# Check Selenium installation
pip list | grep selenium

# Check ChromeDriver
which chromedriver
chromedriver --version

# Install/update if needed
pip install --upgrade selenium
```

---

## Test Output Examples

### Browser Test (HTML)

- **Visual Interface**: Color swatches showing expected vs actual
- **Live Preview**: iframe with actual page
- **Interactive**: Click to rerun tests
- **Stats Dashboard**: Total/Passed/Failed counters

### Python Test (CLI)

```
======================================================================
BACKGROUND COLOR TEST SUITE - index.html
======================================================================

✓ Chrome WebDriver initialized

Testing URL: http://localhost:8080

======================================================================
TEST 1: Body Background Color
======================================================================

ℹ️  Body background color (RGB): rgb(255, 255, 255)
ℹ️  Body background color (HEX): #ffffff

✓ PASS: Body has background color set
  Expected: Non-transparent color
  Actual:   rgb(255, 255, 255)

✓ PASS: Body background is white
  Expected: #ffffff or rgb(255, 255, 255)
  Actual:   rgb(255, 255, 255) (#ffffff)

... (more tests) ...

======================================================================
TEST SUMMARY
======================================================================
Total Tests:  12
Passed:       12 ✓
Failed:       0 ✗
Pass Rate:    100.0%

✅ ALL TESTS PASSED!
======================================================================

✓ Browser closed
```

---

## Related Documentation

- [CSS Loading Issue](../docs/CSS_LOADING_ISSUE.md) - Fix CSS not loading
- [CSS Loading Tests](./CSS_LOADING_TEST_README.md) - Test CSS file loading
- [Quick Start](../QUICKSTART.md) - Get started quickly

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-12-10 | Initial background color tests |

---

**Last Updated**: December 10, 2024  
**Test Type**: Visual & Functional  
**Status**: Active
