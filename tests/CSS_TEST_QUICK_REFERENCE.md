# CSS Test Suite - Quick Reference

## Quick Start

```bash
# Run all CSS tests
./tests/run-css-tests.sh

# Run Python automated tests only
python3 tests/test-css-automated.py

# Open visual tests in browser
xdg-open tests/test-css-validation.html
xdg-open tests/test-css-visual.html
```

## Test Files Overview

| File | Type | Purpose | Run Command |
|------|------|---------|-------------|
| `run-css-tests.sh` | Shell | Master test runner | `./tests/run-css-tests.sh` |
| `test-css-automated.py` | Python | Automated CSS validation | `python3 tests/test-css-automated.py` |
| `test-css-validation.html` | HTML/JS | Browser variable testing | Open in browser |
| `test-css-visual.html` | HTML | Visual component testing | Open in browser |

## What Gets Tested

### ✅ Automated Tests (Shell/Python)
- Directory structure (4 tests)
- Required CSS files (6 tests)
- CSS syntax validation (balanced braces)
- CSS variable definitions (7 key variables)
- Import statements
- Color formats
- Media queries
- Accessibility features
- Animations & transitions
- Grid & Flexbox usage

### ✅ Browser Tests (HTML/JS)
- CSS variable existence (~30 tests)
- Color format validation
- Shadow syntax
- Spacing values
- Border radius values
- Typography variables
- CSS class rendering

### ✅ Visual Tests (HTML)
- Color system display
- Typography scale
- Spacing system
- Shadow levels
- Border radius variations
- Button components
- Form components
- Layout components
- Loading states
- Responsive design

## Expected Results

### run-css-tests.sh
```
Total Tests:  23
Passed:       23 ✓
Failed:       0 ✗
Pass Rate:    100.0%
```

### test-css-automated.py
```
Total Tests:  111
Passed:       110 ✓
Failed:       1 ✗
Pass Rate:    99.1%
```

### test-css-validation.html
- Should show ~30 tests
- All tests should PASS (green)
- Variables should show their values
- Pass rate: 100%

### test-css-visual.html
- All components render correctly
- Colors display properly
- Typography scales correctly
- Shadows visible
- Animations work
- Responsive layout adapts

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "CSS directory not found" | Run from project root |
| "Unbalanced braces" | Check CSS syntax in file |
| "Variable not defined" | Add to `variables.css` |
| "Import file not found" | Check file path |
| Browser tests not running | Check console for errors |
| Variables show empty | Verify CSS imports |

## Test Coverage

### Files Tested
```
public/css/
├── main.css ✓
├── global/
│   ├── variables.css ✓ (114 variables)
│   ├── base.css ✓
│   └── reset.css ✓
├── components/
│   ├── search-form.css ✓
│   └── progress-bar.css ✓
└── pages/
    └── home.css ✓
```

### Variables Validated
- Colors (40+)
- Typography (13+)
- Spacing (12+)
- Shadows (7+)
- Border radius (6+)
- Transitions (3+)
- Containers (5+)

### Components Tested
- Search form with grid
- Buttons (search, reload, CTA)
- Feature cards
- Hero section
- Footer
- Loading states
- Error boundaries

## Integration

### Add to package.json
```json
"scripts": {
  "test:css": "./tests/run-css-tests.sh",
  "test:css:visual": "xdg-open tests/test-css-validation.html"
}
```

### Add to CI/CD
```yaml
- name: CSS Tests
  run: ./tests/run-css-tests.sh
```

## Development Workflow

1. **Make CSS changes**
2. **Run automated tests**: `./tests/run-css-tests.sh`
3. **Check visual tests**: Open HTML files in browser
4. **Fix any failures**
5. **Commit changes**

## File Locations

```
tests/
├── run-css-tests.sh              ← Main runner
├── test-css-automated.py         ← Python tests
├── test-css-validation.html      ← Variable validation
├── test-css-visual.html          ← Visual showcase
└── CSS_TEST_SUITE_README.md      ← Full documentation
```

## Test Execution Time

- `run-css-tests.sh`: ~5-10 seconds
- `test-css-automated.py`: ~2-3 seconds
- Browser tests: Instant (auto-run on load)

## Exit Codes

- **0**: All tests passed
- **1**: Some tests failed

## Support

See full documentation: `tests/CSS_TEST_SUITE_README.md`

---

**Version**: 1.0.0
**Last Updated**: December 2024
