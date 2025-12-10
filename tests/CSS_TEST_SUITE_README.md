# CSS Test Suite Documentation

## Overview

This comprehensive test suite validates all CSS files in the `public/css` directory. It includes automated tests, visual validation, and browser-based testing.

## Test Files

### 1. `test-css-validation.html`
**Browser-based CSS Variable and Property Validation**

- Tests CSS custom properties (variables) existence
- Validates color formats (hex, RGB)
- Tests shadow syntax
- Validates spacing values
- Tests border-radius values
- Validates typography variables
- Tests CSS class rendering

**How to run:**
```bash
# Open in browser
xdg-open tests/test-css-validation.html
# Or navigate to: file:///path/to/tests/test-css-validation.html
```

**Features:**
- Real-time validation
- Visual test results
- Pass/fail summary
- Tests run automatically on page load

### 2. `test-css-visual.html`
**Visual CSS Component Testing**

Tests visual rendering of all CSS components:
- Color system (primary, gray scale, semantic colors)
- Typography (font sizes, weights)
- Spacing system
- Shadow levels
- Border radius variations
- Button styles (search, reload)
- Form components (search form, inputs, radio buttons)
- Layout components (containers, feature cards)
- Loading states (spinner, pulse animation)
- Hero section
- Footer
- Responsive design breakpoints

**How to run:**
```bash
# Open in browser
xdg-open tests/test-css-visual.html
# Or navigate to: file:///path/to/tests/test-css-visual.html
```

**Features:**
- Complete visual showcase
- All components rendered
- Responsive viewport indicator
- Interactive elements

### 3. `test-css-automated.py`
**Automated Python-based CSS Testing**

Comprehensive automated tests including:
- CSS syntax validation (balanced braces)
- CSS variable declarations and usage
- Color value format validation
- Responsive design patterns (media queries)
- Accessibility features (focus states, hover states)
- Transitions and animations
- Modern layout usage (Grid, Flexbox)
- Import validation

**How to run:**
```bash
# Direct execution
python3 tests/test-css-automated.py

# Or use the test runner
./tests/run-css-tests.sh
```

**Test Categories:**
1. **Syntax Tests** - Validates CSS syntax correctness
2. **Variable Tests** - Checks CSS custom properties
3. **Color Tests** - Validates color formats
4. **Responsive Tests** - Checks media queries and breakpoints
5. **Accessibility Tests** - Validates focus/hover states
6. **Animation Tests** - Checks transitions and keyframes
7. **Layout Tests** - Validates Grid and Flexbox usage
8. **Import Tests** - Verifies @import statements

### 4. `run-css-tests.sh`
**Master Test Runner Script**

Runs all CSS tests in sequence:
- Directory structure validation
- Required CSS files check
- Content validation
- Syntax validation (balanced braces)
- Python automated tests
- CSS variable usage verification
- Responsive design check
- Test file existence

**How to run:**
```bash
./tests/run-css-tests.sh
```

**Output:**
- Color-coded test results (✓ PASS, ✗ FAIL)
- Test summary with pass rate
- Instructions for HTML tests

## CSS Files Being Tested

```
public/css/
├── main.css                          # Main application styles
├── no-scroll-optimizations.css       # Scroll optimization
├── global/
│   ├── reset.css                     # CSS reset
│   ├── variables.css                 # CSS custom properties
│   └── base.css                      # Base styles
├── components/
│   ├── search-form.css               # Search form component
│   └── progress-bar.css              # Progress bar component
└── pages/
    └── home.css                      # Home page styles
```

## Test Coverage

### Variables Tested
- **Colors**: Primary, secondary, accent, semantic (success, warning, danger, info), gray scale
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: All spacing scale values (1-24)
- **Border Radius**: sm, base, md, lg, xl, full
- **Shadows**: sm, base, md, lg, xl, card, card-hover
- **Transitions**: fast, base, slow
- **Containers**: sm, md, lg, xl, xxl
- **Z-index**: dropdown, sticky, fixed, modal, popover, tooltip

### Components Tested
- Search form (with grid layout, radio buttons)
- Buttons (search, reload, CTA)
- Feature cards
- Hero section
- Footer
- Loading states
- Error boundaries
- Navigation

### Layout Features Tested
- CSS Grid usage
- Flexbox layouts
- Container widths
- Responsive breakpoints
- Media queries

### Accessibility Features Tested
- Focus states
- Hover states
- Outline properties
- Color contrast (visual)
- Interactive elements

## Running All Tests

### Quick Start
```bash
# Run all automated tests
./tests/run-css-tests.sh

# Run Python tests only
python3 tests/test-css-automated.py

# Open visual tests in browser
xdg-open tests/test-css-validation.html
xdg-open tests/test-css-visual.html
```

### Complete Test Workflow
1. **Automated Tests**: `./tests/run-css-tests.sh`
2. **Visual Validation**: Open `test-css-validation.html` in browser
3. **Component Review**: Open `test-css-visual.html` in browser
4. **Responsive Testing**: Resize browser window while viewing visual tests

## Test Results Interpretation

### Automated Tests (Shell/Python)
- **✓ PASS**: Test passed successfully
- **✗ FAIL**: Test failed, needs attention
- **⚠ INFO**: Informational message
- **⚠ SKIP**: Test was skipped

### Browser Tests
- **✓ PASS**: Test passed (green background)
- **✗ FAIL**: Test failed (red background)
- **ℹ INFO**: Informational (blue background)

## Expected Results

### run-css-tests.sh
- Should find all CSS directories
- Should find all required CSS files
- Should validate CSS syntax (balanced braces)
- Should find CSS custom properties
- Should detect media queries
- Should achieve 95%+ pass rate

### test-css-automated.py
- Should find 6-8 CSS files
- Should validate all syntax
- Should find 100+ CSS variables (in variables.css)
- Should detect responsive patterns
- Should find accessibility features

### test-css-validation.html
- Should pass all variable existence tests
- Should validate all color formats
- Should validate spacing/shadow/border values
- Should render CSS classes correctly
- Should achieve 100% pass rate

### test-css-visual.html
- All components should render correctly
- Colors should display properly
- Typography should scale correctly
- Shadows should be visible
- Animations should work
- Responsive layout should adapt to viewport

## Troubleshooting

### Test Failures

**"CSS directory not found"**
- Ensure you're running tests from project root
- Check that `public/css` directory exists

**"Unbalanced braces"**
- Open the failing CSS file
- Check for missing `{` or `}`
- Use a code editor with syntax highlighting

**"Variable not defined"**
- Check `public/css/global/variables.css`
- Ensure the variable is declared in `:root {}`

**"Import file not found"**
- Check file paths in `@import` statements
- Ensure imported files exist

### Browser Test Issues

**"No tests running"**
- Check browser console for errors
- Ensure CSS files are loading correctly
- Verify file paths in HTML

**"Variables showing empty values"**
- Check that `main.css` is loaded
- Verify CSS import chain
- Check browser compatibility

## Integration with CI/CD

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
- name: Run CSS Tests
  run: |
    chmod +x tests/run-css-tests.sh
    ./tests/run-css-tests.sh
```

## Maintenance

### Adding New Tests

**For new CSS variables:**
1. Add variable to `variables.css`
2. Update `test-css-validation.html` test cases
3. Update `run-css-tests.sh` REQUIRED_VARS array

**For new components:**
1. Create component CSS file
2. Add visual test section in `test-css-visual.html`
3. Add file check in `run-css-tests.sh`

**For new test categories:**
1. Add test function in `test-css-automated.py`
2. Call function in `run_all_tests()`

## Best Practices

1. **Run tests before committing** CSS changes
2. **Update visual tests** when adding new components
3. **Document new CSS variables** in variables.css comments
4. **Test responsive behavior** manually in browser
5. **Check accessibility** with browser dev tools
6. **Validate colors** meet contrast requirements

## Related Documentation

- [Main Test Suite README](./TEST_SUITE_README.md)
- [Project README](../README.md)
- CSS Architecture documentation (if available)

## Support

For issues or questions:
1. Check this documentation
2. Review test output carefully
3. Check CSS file syntax
4. Verify file paths and imports
5. Test in browser developer tools

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Maintainer**: Development Team
