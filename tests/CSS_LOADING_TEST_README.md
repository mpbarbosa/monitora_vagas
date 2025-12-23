# CSS Loading Test Suite

## Overview

This test suite validates that all CSS files are loaded correctly and styles are properly applied to the page. It includes three different test implementations for maximum flexibility.

## Test Files

### 1. Browser-based Test (HTML/JavaScript)
**File**: `test-css-loading.html`  
**Type**: Interactive browser test  
**Size**: 25KB

**Features:**
- Real-time visual feedback
- No dependencies required
- Runs directly in browser
- Beautiful UI with test results
- 10 test groups with 30+ individual tests

**How to run:**
```bash
# Open in browser
xdg-open tests/test-css-loading.html

# Or navigate to:
file:///path/to/tests/test-css-loading.html
```

**Tests include:**
- Stylesheet loading verification
- Web fonts loading (Google Fonts)
- CSS rules accessibility
- CSS custom properties (variables)
- Icon fonts (Font Awesome, Material Design)
- CSS class application
- Responsive design (media queries)
- CSS loading order
- Visual rendering tests
- Performance metrics

---

### 2. Python/Selenium Test
**File**: `test-css-loading.py`  
**Type**: Automated Selenium test  
**Size**: 18KB

**Requirements:**
```bash
pip install selenium
```

**How to run:**
```bash
# Default URL (localhost:8080)
python3 tests/test-css-loading.py

# Custom URL
python3 tests/test-css-loading.py --url http://localhost:3000
```

**Features:**
- Automated testing
- Headless Chrome
- Command-line output
- CI/CD ready
- Detailed error reporting

**Test Groups:**
1. Page loading
2. Stylesheet loading (5 files)
3. CSS rules loaded
4. CSS variables (5 variables)
5. Font families
6. Icon fonts
7. CSS classes (6 classes)
8. Responsive breakpoints
9. CSS load order
10. Performance metrics

---

### 3. Node.js/Puppeteer Test
**File**: `test-css-loading.js`  
**Type**: Automated Puppeteer test  
**Size**: 17KB

**Requirements:**
```bash
npm install puppeteer
```

**How to run:**
```bash
# Default URL (localhost:8080)
node tests/test-css-loading.js

# Custom URL
node tests/test-css-loading.js http://localhost:3000
```

**Features:**
- Fast execution
- Headless browser
- Modern async/await syntax
- Easy integration with npm scripts
- Detailed logging

---

## What Gets Tested

### Stylesheet Loading
- ✅ material-design-iconic-font.min.css
- ✅ font-awesome.min.css
- ✅ select2.min.css
- ✅ daterangepicker.css
- ✅ main.css
- ✅ Google Fonts (Roboto)

### CSS Rules
- ✅ Total CSS rules count
- ✅ Rules accessibility (CORS check)
- ✅ Rule distribution across files

### CSS Variables
- ✅ --color-primary
- ✅ --font-family-base
- ✅ --spacing-4
- ✅ --border-radius-base
- ✅ --shadow-base

### Font Families
- ✅ Body font family
- ✅ Roboto font loading
- ✅ Font Awesome icons
- ✅ Material Design icons

### CSS Classes
- ✅ .page-wrapper
- ✅ .wrapper
- ✅ .card
- ✅ .form
- ✅ .btn
- ✅ .input-group

### Responsive Design
- ✅ Media queries count
- ✅ Breakpoint detection
- ✅ Mobile/tablet/desktop support

### Load Order
- ✅ Vendor CSS before main.css
- ✅ main.css loaded last
- ✅ Proper cascade order

### Performance
- ✅ Load times for each CSS file
- ✅ Average load time
- ✅ Maximum load time
- ✅ Performance under 1 second

---

## Expected Results

### All Tests Should Pass

```
=================================================================
TEST SUMMARY
=================================================================
Total Tests:  30+
Passed:       30+ ✓
Failed:       0 ✗
Pass Rate:    100.0%
=================================================================
```

### Common Test Scenarios

**Scenario 1: All CSS Files Loaded**
- All 5 main CSS files detected
- Google Fonts loaded
- Total 6+ stylesheets

**Scenario 2: CSS Rules Accessible**
- 100+ CSS rules loaded
- Variables defined
- Classes have styles

**Scenario 3: Fonts Loaded**
- Roboto font family detected
- Icon fonts applied
- Font Awesome works
- Material Design Icons work

**Scenario 4: Performance Good**
- Average load time < 500ms
- Maximum load time < 1000ms
- No blocking resources

---

## Integration

### Add to package.json

```json
{
  "scripts": {
    "test:css-loading": "node tests/test-css-loading.js",
    "test:css-loading:python": "python3 tests/test-css-loading.py"
  }
}
```

### Add to CI/CD Pipeline

```yaml
# .github/workflows/test.yml
- name: Test CSS Loading
  run: |
    npm start &
    sleep 5
    python3 tests/test-css-loading.py
```

### Run Before Deployment

```bash
#!/bin/bash
# pre-deploy.sh

echo "Running CSS loading tests..."
python3 tests/test-css-loading.py --url http://localhost:8080

if [ $? -eq 0 ]; then
    echo "✓ CSS tests passed"
else
    echo "✗ CSS tests failed - deployment aborted"
    exit 1
fi
```

---

## Troubleshooting

### Issue: "Page not loading"

**Solution:**
- Ensure server is running: `npm start`
- Check URL is correct
- Verify port is available

### Issue: "Stylesheets not found"

**Solution:**
- Check file paths in index.html
- Verify CSS files exist in public/ folder
- Check console for 404 errors

### Issue: "CORS errors for external CSS"

**Solution:**
- This is expected for external stylesheets
- Tests mark these as "CORS restricted" (still passing)
- Font files from CDNs may be inaccessible

### Issue: "CSS variables not defined"

**Solution:**
- Check that variables.css is loaded
- Verify :root selector exists
- Ensure main.css imports variables.css

### Issue: "Icon fonts not loading"

**Solution:**
- Check font file paths
- Verify font-face declarations
- Check network tab for font loading

### Issue: "Performance test failing"

**Solution:**
- Optimize CSS file sizes
- Enable gzip compression
- Use CDN for vendor files
- Minify CSS files

---

## Test Output Examples

### HTML Test (Browser)
![Visual test interface with green/red indicators]
- Color-coded results
- Detailed messages
- Visual test elements
- Summary statistics

### Python Test (CLI)
```
=================================================================
CSS LOADING TEST SUITE - Python/Selenium
=================================================================

Testing URL: http://localhost:8080

--- Test Group 1: Page Loading ---
✓ PASS: Page loads - Page title: 'Au Form Wizard'

--- Test Group 2: Stylesheet Loading ---
✓ PASS: Stylesheet material-design-iconic-font.min.css - Loaded
✓ PASS: Stylesheet font-awesome.min.css - Loaded
✓ PASS: Stylesheet select2.min.css - Loaded
✓ PASS: Stylesheet daterangepicker.css - Loaded
✓ PASS: Stylesheet main.css - Loaded
✓ PASS: Total stylesheets - 6 stylesheets found (expected at least 5)

...

=================================================================
TEST SUMMARY
=================================================================
Total Tests:  32
Passed:       32 ✓
Failed:       0 ✗
Pass Rate:    100.0%
=================================================================
```

### Node.js Test (CLI)
```
======================================================================
CSS LOADING TEST SUITE - Node.js/Puppeteer
======================================================================

Testing URL: http://localhost:8080

--- Test Group 1: Page Loading ---
✓ PASS: Page loads - Page title: 'Au Form Wizard'

...
```

---

## Best Practices

1. **Run tests regularly** during development
2. **Run before deployment** to catch issues early
3. **Monitor performance** metrics over time
4. **Check all browsers** if possible
5. **Verify on different devices** (mobile, tablet, desktop)
6. **Test with slow connections** (throttling)

---

## Related Documentation

- [CSS Test Suite](./CSS_TEST_SUITE_README.md) - Main CSS validation tests
- [Test Suite README](./TEST_SUITE_README.md) - Complete test documentation
- [HTML Specification](../docs/specifications/HTML_SPECIFICATION.md) - Formal HTML specs

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-12-10 | Initial CSS loading tests |

---

**Last Updated**: December 10, 2024  
**Maintained By**: Development Team  
**Status**: Active
