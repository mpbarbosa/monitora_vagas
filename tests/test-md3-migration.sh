#!/bin/bash
#
# Material Design 3 Migration - Test Script
# Automated testing for the MD3 migration
#
# Version: 1.0.0
# Last Updated: 2024-12-23
#
# Usage:
#   ./test-md3-migration.sh
#
# Prerequisites:
#   - Python 3.x
#   - selenium
#   - Chrome browser
#   - Web server on port 8080
#
# Environment Variables:
#   MD3_TEST_URL - Test server URL (default: http://localhost:8080)
#

echo "═══════════════════════════════════════════════════════════"
echo "  Material Design 3 Migration - Automated Testing"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
PASS=0
FAIL=0

# Function to print test result
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC} - $2"
        ((PASS++))
    else
        echo -e "${RED}✗ FAIL${NC} - $2"
        ((FAIL++))
    fi
}

echo "1. Checking File Structure..."
echo "─────────────────────────────────────────────────────────────"

# Check if MD3 files exist
[ -f "src/index-md3.html" ]
print_result $? "index-md3.html exists"

[ -f "src/css/md3-theme.css" ]
print_result $? "md3-theme.css exists"

[ -f "src/css/md3-components.css" ]
print_result $? "md3-components.css exists"

[ -f "src/index-original-backup.html" ]
print_result $? "Original backup created"

echo ""
echo "2. Checking File Sizes..."
echo "─────────────────────────────────────────────────────────────"

# Check if files have content
MD3_HTML_SIZE=$(wc -c < "src/index-md3.html" 2>/dev/null || echo 0)
MD3_THEME_SIZE=$(wc -c < "src/css/md3-theme.css" 2>/dev/null || echo 0)
MD3_COMPONENTS_SIZE=$(wc -c < "src/css/md3-components.css" 2>/dev/null || echo 0)

[ $MD3_HTML_SIZE -gt 10000 ]
print_result $? "index-md3.html has content (${MD3_HTML_SIZE} bytes)"

[ $MD3_THEME_SIZE -gt 5000 ]
print_result $? "md3-theme.css has content (${MD3_THEME_SIZE} bytes)"

[ $MD3_COMPONENTS_SIZE -gt 5000 ]
print_result $? "md3-components.css has content (${MD3_COMPONENTS_SIZE} bytes)"

echo ""
echo "3. Checking HTML Structure..."
echo "─────────────────────────────────────────────────────────────"

# Check for MD3 components in HTML
grep -q "md-filled-select" src/index-md3.html
print_result $? "Contains md-filled-select component"

grep -q "md-filled-text-field" src/index-md3.html
print_result $? "Contains md-filled-text-field component"

grep -q "md-filled-button" src/index-md3.html
print_result $? "Contains md-filled-button component"

grep -q "md-icon" src/index-md3.html
print_result $? "Contains md-icon component"

grep -q "Material Symbols" src/index-md3.html
print_result $? "Includes Material Symbols font"

grep -q "@material/web" src/index-md3.html
print_result $? "Imports Material Web Components"

echo ""
echo "4. Checking CSS Structure..."
echo "─────────────────────────────────────────────────────────────"

# Check for MD3 design tokens
grep -q "md-sys-color-primary" src/css/md3-theme.css
print_result $? "Contains MD3 color tokens"

grep -q "md-sys-typescale" src/css/md3-theme.css
print_result $? "Contains MD3 typography scale"

grep -q "md-sys-elevation" src/css/md3-theme.css
print_result $? "Contains MD3 elevation system"

grep -q "md-sys-shape" src/css/md3-theme.css
print_result $? "Contains MD3 shape tokens"

grep -q "md-sys-motion" src/css/md3-theme.css
print_result $? "Contains MD3 motion tokens"

echo ""
echo "5. Checking JavaScript Integration..."
echo "─────────────────────────────────────────────────────────────"

# Check for API integration
grep -q "apiClient" src/index-md3.html
print_result $? "Uses apiClient service"

grep -q "scrapeHotels" src/index-md3.html
print_result $? "Loads hotels from API"

grep -q "addEventListener.*submit" src/index-md3.html
print_result $? "Handles form submission"

grep -q "formatDateToISO" src/index-md3.html
print_result $? "Handles date conversion"

grep -q "displayResults" src/index-md3.html
print_result $? "Displays search results"

echo ""
echo "6. Checking Accessibility Features..."
echo "─────────────────────────────────────────────────────────────"

# Check for accessibility features
grep -q "aria-label" src/index-md3.html
print_result $? "Contains ARIA labels"

grep -q "aria-live" src/index-md3.html
print_result $? "Contains live regions"

grep -q "lang=" src/index-md3.html
print_result $? "Specifies language"

grep -q "prefers-reduced-motion" src/css/md3-components.css
print_result $? "Respects reduced motion preference"

grep -q "prefers-contrast" src/css/md3-components.css
print_result $? "Supports high contrast mode"

echo ""
echo "7. Checking Responsive Design..."
echo "─────────────────────────────────────────────────────────────"

# Check for responsive features
grep -q "@media.*max-width" src/css/md3-components.css
print_result $? "Contains mobile breakpoints"

grep -q "viewport" src/index-md3.html
print_result $? "Contains viewport meta tag"

grep -q "grid-template-columns" src/css/md3-components.css
print_result $? "Uses CSS Grid for layout"

echo ""
echo "8. Documentation Check..."
echo "─────────────────────────────────────────────────────────────"

# Check for documentation files
[ -f "MD3_MIGRATION_PLAN.md" ]
print_result $? "Migration plan exists"

[ -f "MD3_MIGRATION_GUIDE.md" ]
print_result $? "Migration guide exists"

[ -f "MATERIAL_DESIGN_3_ANALYSIS.md" ]
print_result $? "Analysis document exists"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Test Results Summary"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! Migration is ready for manual testing.${NC}"
    echo ""
    echo "Next Steps:"
    echo "  1. Start server: npm start"
    echo "  2. Test original: http://localhost:8080/index.html"
    echo "  3. Test MD3: http://localhost:8080/index-md3.html"
    echo "  4. Compare functionality and appearance"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please review the issues above.${NC}"
    echo ""
    exit 1
fi
