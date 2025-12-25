#!/bin/bash
# Master Use Case Test Runner Script
# Runs all use case tests from USE_CASE_TEST_SPECIFICATION.md

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${CYAN}========================================================================${NC}"
echo -e "${CYAN}         USE CASE TEST SUITE - Monitora Vagas${NC}"
echo -e "${CYAN}========================================================================${NC}"
echo ""

# Check if colorama is installed
if ! python3 -c "import colorama" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Installing colorama for colored output...${NC}"
    pip3 install colorama --quiet
fi

# Check if selenium is installed
if ! python3 -c "import selenium" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Installing selenium...${NC}"
    pip3 install selenium --quiet
fi

# Parse command line arguments
ENV="local"
SPECIFIC_UC=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --env)
            ENV="$2"
            shift 2
            ;;
        --uc)
            SPECIFIC_UC="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --env ENV       Test environment: local, production, or both (default: local)"
            echo "  --uc UC-NNN     Run specific use case (e.g., UC-001)"
            echo "  -h, --help      Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                          # Run all tests locally"
            echo "  $0 --env production         # Run all tests in production"
            echo "  $0 --env both               # Run all tests in both environments"
            echo "  $0 --uc UC-001              # Run only UC-001 tests"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

echo -e "${CYAN}Configuration:${NC}"
echo -e "  Environment: ${GREEN}${ENV}${NC}"
if [ -n "$SPECIFIC_UC" ]; then
    echo -e "  Specific UC: ${GREEN}${SPECIFIC_UC}${NC}"
else
    echo -e "  Running: ${GREEN}All Use Cases${NC}"
fi
echo ""

# Function to run comprehensive test suite
run_comprehensive_tests() {
    local test_env=$1
    echo -e "${CYAN}Running comprehensive use case tests in ${test_env} environment...${NC}"
    python3 "${SCRIPT_DIR}/test_all_use_cases.py" "$test_env"
}

# Function to run specific use case
run_specific_uc() {
    local uc=$1
    local test_env=$2
    
    echo -e "${CYAN}Running ${uc} in ${test_env} environment...${NC}"
    
    case $uc in
        UC-001)
            TEST_BASE_URL="${BASE_URL}" python3 "${SCRIPT_DIR}/test_uc001_first_time_user_search.py"
            ;;
        UC-002)
            TEST_BASE_URL="${BASE_URL}" python3 "${SCRIPT_DIR}/test_uc002_advanced_search_filters.py"
            ;;
        UC-003)
            TEST_BASE_URL="${BASE_URL}" python3 "${SCRIPT_DIR}/test_uc003_date_range_validation.py"
            ;;
        UC-004)
            TEST_BASE_URL="${BASE_URL}" python3 "${SCRIPT_DIR}/test_uc004_search_lifecycle.py"
            ;;
        *)
            echo -e "${YELLOW}⚠️  Specific test file for ${uc} not found, running comprehensive suite${NC}"
            run_comprehensive_tests "$test_env"
            ;;
    esac
}

# Set base URL based on environment
set_base_url() {
    local env=$1
    if [ "$env" == "production" ]; then
        export TEST_BASE_URL="https://www.mpbarbosa.com/public/index.html"
        BASE_URL="https://www.mpbarbosa.com/public/index.html"
    else
        export TEST_BASE_URL="http://localhost:8080/public/index.html"
        BASE_URL="http://localhost:8080/public/index.html"
    fi
}

# Main execution
START_TIME=$(date +%s)

if [ "$ENV" == "both" ]; then
    # Run in both environments
    echo -e "${CYAN}========================================================================${NC}"
    echo -e "${CYAN}         TESTING LOCAL ENVIRONMENT${NC}"
    echo -e "${CYAN}========================================================================${NC}"
    echo ""
    
    set_base_url "local"
    if [ -n "$SPECIFIC_UC" ]; then
        run_specific_uc "$SPECIFIC_UC" "local"
    else
        run_comprehensive_tests "local"
    fi
    
    LOCAL_RESULT=$?
    
    echo ""
    echo -e "${CYAN}========================================================================${NC}"
    echo -e "${CYAN}         TESTING PRODUCTION ENVIRONMENT${NC}"
    echo -e "${CYAN}========================================================================${NC}"
    echo ""
    
    set_base_url "production"
    if [ -n "$SPECIFIC_UC" ]; then
        run_specific_uc "$SPECIFIC_UC" "production"
    else
        run_comprehensive_tests "production"
    fi
    
    PROD_RESULT=$?
    
    # Summary
    echo ""
    echo -e "${CYAN}========================================================================${NC}"
    echo -e "${CYAN}         TEST EXECUTION SUMMARY${NC}"
    echo -e "${CYAN}========================================================================${NC}"
    echo ""
    
    if [ $LOCAL_RESULT -eq 0 ]; then
        echo -e "Local:      ${GREEN}✅ PASSED${NC}"
    else
        echo -e "Local:      ${RED}❌ FAILED${NC}"
    fi
    
    if [ $PROD_RESULT -eq 0 ]; then
        echo -e "Production: ${GREEN}✅ PASSED${NC}"
    else
        echo -e "Production: ${RED}❌ FAILED${NC}"
    fi
    
    EXIT_CODE=$((LOCAL_RESULT + PROD_RESULT))
else
    # Run in single environment
    set_base_url "$ENV"
    
    if [ -n "$SPECIFIC_UC" ]; then
        run_specific_uc "$SPECIFIC_UC" "$ENV"
    else
        run_comprehensive_tests "$ENV"
    fi
    
    EXIT_CODE=$?
fi

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo -e "${CYAN}========================================================================${NC}"
echo -e "${CYAN}Total execution time: ${DURATION}s${NC}"
echo -e "${CYAN}========================================================================${NC}"

if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}${NC}"
    echo -e "${GREEN}✅ ALL USE CASE TESTS PASSED${NC}"
    echo -e "${GREEN}${NC}"
else
    echo -e "${RED}${NC}"
    echo -e "${RED}❌ SOME USE CASE TESTS FAILED${NC}"
    echo -e "${RED}${NC}"
fi

exit $EXIT_CODE
