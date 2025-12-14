#!/bin/bash
#
# Booking Rules Test Runner
# Runs the complete booking rules test suite for BR-18 and BR-19
#
# Usage:
#   ./run-booking-rules-tests.sh
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "=================================================================="
echo "🎄 BOOKING RULES TEST RUNNER"
echo "=================================================================="
echo ""

# Check if we're in the tests directory
if [ ! -f "test_booking_rules.py" ]; then
    echo -e "${RED}❌ Error: test_booking_rules.py not found${NC}"
    echo "   Please run this script from the tests directory"
    exit 1
fi

# Check Python
echo -e "${BLUE}🔍 Checking Python...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 not found${NC}"
    exit 1
fi
PYTHON_VERSION=$(python3 --version)
echo -e "${GREEN}✅ $PYTHON_VERSION${NC}"

# Check Selenium
echo -e "${BLUE}🔍 Checking Selenium...${NC}"
if ! python3 -c "import selenium" 2>/dev/null; then
    echo -e "${RED}❌ Selenium not installed${NC}"
    echo -e "${YELLOW}💡 Install with: pip install selenium${NC}"
    exit 1
fi
SELENIUM_VERSION=$(python3 -c "import selenium; print(selenium.__version__)")
echo -e "${GREEN}✅ Selenium $SELENIUM_VERSION${NC}"

# Check Chrome/Chromium
echo -e "${BLUE}🔍 Checking Chrome/Chromium...${NC}"
CHROME_FOUND=false
for cmd in google-chrome chromium-browser chromium; do
    if command -v $cmd &> /dev/null; then
        CHROME_VERSION=$($cmd --version)
        echo -e "${GREEN}✅ $CHROME_VERSION${NC}"
        CHROME_FOUND=true
        break
    fi
done

if [ "$CHROME_FOUND" = false ]; then
    echo -e "${RED}❌ Chrome/Chromium not found${NC}"
    echo -e "${YELLOW}💡 Install Chrome or Chromium browser${NC}"
    exit 1
fi

echo ""
echo "=================================================================="
echo "🚀 Running Booking Rules Test Suite..."
echo "=================================================================="
echo ""

# Run the tests
python3 test_booking_rules.py

# Capture exit code
EXIT_CODE=$?

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}=================================================================="
    echo "✅ ALL TESTS PASSED!"
    echo "==================================================================${NC}"
else
    echo -e "${RED}=================================================================="
    echo "❌ SOME TESTS FAILED"
    echo "==================================================================${NC}"
fi
echo ""

exit $EXIT_CODE
