# Semantic Version Test Suite

## Overview

This test suite validates the semantic versioning implementation in `public/index.html`. It ensures that the version number is properly displayed, follows semantic versioning standards, and maintains consistency with `package.json`.

## Test Coverage

### Python Tests (`test_semantic_version.py`)

Using Selenium WebDriver for browser automation:

1. **Version in HTML File** - Verifies version-footer class exists and version number is present
2. **Version Format Validation** - Validates semantic versioning format (MAJOR.MINOR.PATCH)
3. **Version Matches package.json** - Ensures HTML version matches package.json version
4. **CSS Styling** - Confirms version-footer CSS class and styling properties exist
5. **Version Display (Selenium)** - Tests actual rendering in browser with WebDriver
6. **Accessibility** - Validates semantic HTML usage (footer, small tags)

### JavaScript Tests (`test-semantic-version.test.js`)

Using Jest with JSDOM:

#### HTML Structure Tests
- Version-footer class presence
- Semantic footer tag usage
- Small tag for version text
- Version number presence

#### Version Format Tests
- Semantic versioning format validation
- MAJOR.MINOR.PATCH structure
- Valid numeric version parts
- Pre-release and build metadata support

#### Version Consistency Tests
- Version matches package.json
- Package.json has valid semver

#### CSS Styling Tests
- .version-footer class defined
- Text-align property
- Padding property
- Color property
- Font-size property

#### Accessibility Tests
- HTML5 footer element
- Semantic small element
- Readable version text

#### Version Location Tests
- Inside page-wrapper div
- Positioned after main content

#### Edge Cases
- Version with 'v' prefix handling
- No multiple version declarations
- Non-empty footer

#### Utility Functions Tests
- isValidSemver validation
- extractVersionFromHTML extraction

## Running Tests

### Run All Version Tests
```bash
npm run test:version:all
# or
./tests/run-version-tests.sh
```

### Run JavaScript Tests Only
```bash
npm run test:version
```

### Run Python Tests Only
```bash
npm run test:version:py
# or
python3 tests/test_semantic_version.py
```

### Watch Mode (JavaScript)
```bash
npm run test:version -- --watch
```

### Coverage Report (JavaScript)
```bash
npm run test:version -- --coverage
```

## Requirements

### Python Tests
- Python 3.x
- Selenium WebDriver
- Chrome/Chromium browser
- ChromeDriver (managed automatically by Selenium 4+)

```bash
pip install selenium
```

### JavaScript Tests
- Node.js
- Jest
- jest-environment-jsdom

```bash
npm install
```

## Semantic Versioning Format

The tests validate the following semantic versioning format:

```
MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
```

### Valid Examples
- `2.0.0`
- `v2.0.0`
- `1.2.3-alpha`
- `1.2.3-beta.1`
- `1.2.3+build.123`
- `1.2.3-rc.1+build.456`

### Invalid Examples
- `1.0` (missing PATCH)
- `1` (missing MINOR and PATCH)
- `abc` (not numeric)
- `1.0.0.` (trailing dot)

## Test Results

All tests validate:
1. ✅ Version exists in HTML
2. ✅ Follows semantic versioning (MAJOR.MINOR.PATCH)
3. ✅ Matches package.json version
4. ✅ CSS styling is properly defined
5. ✅ Renders correctly in browser
6. ✅ Uses semantic HTML for accessibility

## Updating Version

When updating the application version:

1. Update `package.json` version:
   ```json
   {
     "version": "2.1.0"
   }
   ```

2. Update `public/index.html` version footer:
   ```html
   <footer class="version-footer">
       <small>v2.1.0</small>
   </footer>
   ```

3. Run tests to verify:
   ```bash
   npm run test:version:all
   ```

## CI/CD Integration

Add to your CI/CD pipeline:

```yaml
- name: Run Version Tests
  run: npm run test:version:all
```

## Troubleshooting

### Selenium Tests Fail
- Ensure Chrome/Chromium is installed
- Check ChromeDriver compatibility
- Run in headless mode (already configured)

### Version Mismatch
- Check `package.json` version field
- Check `public/index.html` version footer
- Ensure both use same MAJOR.MINOR.PATCH format

### CSS Tests Fail
- Verify `public/src/styles/index-page.css` exists
- Check .version-footer class definition
- Ensure all required CSS properties are present

## Test Files

- `tests/test_semantic_version.py` - Python/Selenium tests
- `tests/test-semantic-version.test.js` - Jest/JSDOM tests
- `tests/run-version-tests.sh` - Test runner script

## Related Files

- `public/index.html` - Version display location
- `public/src/styles/index-page.css` - Version styling
- `package.json` - Source of truth for version number
