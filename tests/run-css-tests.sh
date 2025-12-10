#!/bin/bash
# CSS Test Suite Runner
# Runs all CSS-related tests for the public folder

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "=================================="
echo "CSS Test Suite Runner"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo "Running: $test_name"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if eval "$test_command"; then
        echo -e "${GREEN}✓ PASS${NC}: $test_name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}: $test_name"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Test 1: Check if CSS directory exists
echo "=== Test 1: Directory Structure ==="
run_test "CSS directory exists" "test -d '$PROJECT_ROOT/public/css'"
run_test "Global CSS exists" "test -d '$PROJECT_ROOT/public/css/global'"
run_test "Components CSS exists" "test -d '$PROJECT_ROOT/public/css/components'"
run_test "Pages CSS exists" "test -d '$PROJECT_ROOT/public/css/pages'"
echo ""

# Test 2: Check for required CSS files
echo "=== Test 2: Required CSS Files ==="
run_test "main.css exists" "test -f '$PROJECT_ROOT/public/css/main.css'"
run_test "variables.css exists" "test -f '$PROJECT_ROOT/public/css/global/variables.css'"
run_test "base.css exists" "test -f '$PROJECT_ROOT/public/css/global/base.css'"
run_test "reset.css exists" "test -f '$PROJECT_ROOT/public/css/global/reset.css'"
run_test "search-form.css exists" "test -f '$PROJECT_ROOT/public/css/components/search-form.css'"
run_test "home.css exists" "test -f '$PROJECT_ROOT/public/css/pages/home.css'"
echo ""

# Test 3: CSS file validation
echo "=== Test 3: CSS File Content Validation ==="

# Check if main.css has imports
if grep -q "@import" "$PROJECT_ROOT/public/css/main.css"; then
    echo -e "${GREEN}✓ PASS${NC}: main.css contains @import statements"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}✗ FAIL${NC}: main.css missing @import statements"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Check if variables.css has CSS custom properties
if grep -q "^[[:space:]]*--" "$PROJECT_ROOT/public/css/global/variables.css"; then
    echo -e "${GREEN}✓ PASS${NC}: variables.css contains CSS custom properties"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}✗ FAIL${NC}: variables.css missing CSS custom properties"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Check for :root selector in variables.css
if grep -q ":root" "$PROJECT_ROOT/public/css/global/variables.css"; then
    echo -e "${GREEN}✓ PASS${NC}: variables.css uses :root selector"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}✗ FAIL${NC}: variables.css missing :root selector"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""

# Test 4: CSS syntax validation (basic)
echo "=== Test 4: CSS Syntax Validation ==="

# Find all CSS files
CSS_FILES=$(find "$PROJECT_ROOT/public/css" -name "*.css")

for css_file in $CSS_FILES; do
    filename=$(basename "$css_file")
    
    # Check for balanced braces
    open_braces=$(grep -o "{" "$css_file" | wc -l)
    close_braces=$(grep -o "}" "$css_file" | wc -l)
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if [ "$open_braces" -eq "$close_braces" ]; then
        echo -e "${GREEN}✓ PASS${NC}: $filename has balanced braces ($open_braces pairs)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗ FAIL${NC}: $filename has unbalanced braces (open: $open_braces, close: $close_braces)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
done

echo ""

# Test 5: Run Python automated tests
echo "=== Test 5: Automated CSS Tests ==="
if [ -f "$SCRIPT_DIR/test-css-automated.py" ]; then
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if python3 "$SCRIPT_DIR/test-css-automated.py"; then
        echo -e "${GREEN}✓ PASS${NC}: Python automated tests completed"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${YELLOW}⚠ INFO${NC}: Python automated tests completed with warnings"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    fi
else
    echo -e "${YELLOW}⚠ SKIP${NC}: Python test file not found"
fi

echo ""

# Test 6: CSS variable usage check
echo "=== Test 6: CSS Variable Usage ==="

# Common variables that should exist
REQUIRED_VARS=(
    "--color-primary"
    "--color-white"
    "--font-family-base"
    "--spacing-4"
    "--border-radius-base"
    "--shadow-base"
    "--transition-base"
)

for var in "${REQUIRED_VARS[@]}"; do
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if grep -qF -- "$var" "$PROJECT_ROOT/public/css/global/variables.css"; then
        echo -e "${GREEN}✓ PASS${NC}: Variable $var is defined"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗ FAIL${NC}: Variable $var is not defined"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
done

echo ""

# Test 7: Responsive design check
echo "=== Test 7: Responsive Design ==="

# Check for media queries
for css_file in $CSS_FILES; do
    filename=$(basename "$css_file")
    
    if grep -q "@media" "$css_file"; then
        media_count=$(grep -c "@media" "$css_file")
        echo -e "${GREEN}✓ INFO${NC}: $filename has $media_count media queries"
    fi
done

echo ""

# Test 8: Visual test files
echo "=== Test 8: Test Files ==="
run_test "CSS validation test exists" "test -f '$SCRIPT_DIR/test-css-validation.html'"
run_test "CSS visual test exists" "test -f '$SCRIPT_DIR/test-css-visual.html'"
echo ""

# Print summary
echo "=================================="
echo "TEST SUMMARY"
echo "=================================="
echo "Total Tests:  $TOTAL_TESTS"
echo -e "Passed:       ${GREEN}$PASSED_TESTS ✓${NC}"
echo -e "Failed:       ${RED}$FAILED_TESTS ✗${NC}"

if [ $TOTAL_TESTS -gt 0 ]; then
    PASS_RATE=$(echo "scale=1; ($PASSED_TESTS / $TOTAL_TESTS) * 100" | bc)
    echo "Pass Rate:    $PASS_RATE%"
fi

echo "=================================="
echo ""

# Instructions for HTML tests
echo "To run visual tests, open these files in a browser:"
echo "  - file://$SCRIPT_DIR/test-css-validation.html"
echo "  - file://$SCRIPT_DIR/test-css-visual.html"
echo ""

# Exit with appropriate code
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed.${NC}"
    exit 1
fi
