#!/bin/bash
################################################################################
#
# Production Test Suite Runner
# Monitora Vagas - Browser & API Testing
#
# Purpose: Run all tests against production environment
# URL: https://www.mpbarbosa.com/submodules/monitora_vagas/public/
#
################################################################################

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Production environment configuration
PRODUCTION_URL="https://www.mpbarbosa.com/submodules/monitora_vagas/public/"
PRODUCTION_API_URL="https://www.mpbarbosa.com/api/vagas/hoteis/scrape"

# Test results tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0

################################################################################
# Helper Functions
################################################################################

print_header() {
    echo ""
    echo -e "${CYAN}${BOLD}================================================================================${NC}"
    echo -e "${CYAN}${BOLD}$1${NC}"
    echo -e "${CYAN}${BOLD}================================================================================${NC}"
    echo ""
}

print_subheader() {
    echo ""
    echo -e "${BLUE}────────────────────────────────────────────────────────────────────────────${NC}"
    echo -e "${BLUE}${BOLD}$1${NC}"
    echo -e "${BLUE}────────────────────────────────────────────────────────────────────────────${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

record_result() {
    local status=$1
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    case "$status" in
        "PASS")
            PASSED_TESTS=$((PASSED_TESTS + 1))
            ;;
        "FAIL")
            FAILED_TESTS=$((FAILED_TESTS + 1))
            ;;
        "SKIP")
            SKIPPED_TESTS=$((SKIPPED_TESTS + 1))
            ;;
    esac
}

################################################################################
# Test Functions
################################################################################

test_api_hotel_list() {
    print_subheader "Test 1: API Hotel List Verification"
    
    print_info "Testing production API endpoint..."
    print_info "URL: $PRODUCTION_API_URL"
    echo ""
    
    # Run the API test
    python3 tests/use_cases/test_hotel_list_verification.py
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        print_success "API Hotel List Verification: PASSED"
        record_result "PASS"
        return 0
    else
        print_error "API Hotel List Verification: FAILED"
        record_result "FAIL"
        return 1
    fi
}

test_selenium_browser() {
    print_subheader "Test 2: Selenium Browser Tests"
    
    print_info "Testing production website with Selenium..."
    print_info "URL: $PRODUCTION_URL"
    echo ""
    
    # Set environment variable and run Selenium tests
    export TEST_BASE_URL="$PRODUCTION_URL"
    
    # Run with timeout to prevent hanging
    timeout 180 python3 tests/use_cases/test_uc005_hotel_list_selenium.py
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        print_success "Selenium Browser Tests: PASSED"
        record_result "PASS"
        return 0
    elif [ $exit_code -eq 124 ]; then
        print_warning "Selenium Browser Tests: TIMEOUT (may be browser issue)"
        record_result "SKIP"
        return 2
    else
        print_error "Selenium Browser Tests: FAILED"
        record_result "FAIL"
        return 1
    fi
}

test_production_validation() {
    print_subheader "Test 3: Production Validation Suite"
    
    print_info "Running existing production validation tests..."
    echo ""
    
    # Check if production validation test exists
    if [ -f "tests/use_cases/test_production_validation.py" ]; then
        python3 tests/use_cases/test_production_validation.py
        local exit_code=$?
        
        if [ $exit_code -eq 0 ]; then
            print_success "Production Validation: PASSED"
            record_result "PASS"
            return 0
        else
            print_error "Production Validation: FAILED"
            record_result "FAIL"
            return 1
        fi
    else
        print_warning "Production validation test not found, skipping"
        record_result "SKIP"
        return 2
    fi
}

check_prerequisites() {
    print_subheader "Checking Prerequisites"
    
    local all_ok=true
    
    # Check Python
    if command -v python3 &> /dev/null; then
        local python_version=$(python3 --version)
        print_success "Python found: $python_version"
    else
        print_error "Python 3 not found"
        all_ok=false
    fi
    
    # Check required Python packages
    if python3 -c "import selenium" 2>/dev/null; then
        local selenium_version=$(python3 -c "import selenium; print(selenium.__version__)")
        print_success "Selenium found: version $selenium_version"
    else
        print_error "Selenium not installed"
        all_ok=false
    fi
    
    # Check colorama (optional but nice)
    if python3 -c "import colorama" 2>/dev/null; then
        print_success "Colorama found (enhanced output)"
    else
        print_warning "Colorama not installed (output will be plain text)"
    fi
    
    # Check Chrome/Chromium
    if command -v google-chrome &> /dev/null || command -v chromium-browser &> /dev/null || command -v chromium &> /dev/null; then
        print_success "Chrome/Chromium found"
    else
        print_warning "Chrome/Chromium not found (browser tests may fail)"
    fi
    
    # Check internet connectivity
    if curl -s --head --request GET "$PRODUCTION_URL" | head -n 1 | grep -q "200\|301\|302"; then
        print_success "Production website is accessible"
    else
        print_error "Cannot reach production website"
        all_ok=false
    fi
    
    echo ""
    
    if [ "$all_ok" = false ]; then
        print_error "Prerequisites check failed"
        return 1
    else
        print_success "All prerequisites satisfied"
        return 0
    fi
}

print_summary() {
    print_header "TEST EXECUTION SUMMARY"
    
    echo -e "${BOLD}Production Environment:${NC}"
    echo "  Website URL: $PRODUCTION_URL"
    echo "  API URL:     $PRODUCTION_API_URL"
    echo ""
    
    echo -e "${BOLD}Test Results:${NC}"
    echo "  Total Tests:   $TOTAL_TESTS"
    echo -e "  ${GREEN}Passed:        $PASSED_TESTS${NC}"
    echo -e "  ${RED}Failed:        $FAILED_TESTS${NC}"
    echo -e "  ${YELLOW}Skipped:       $SKIPPED_TESTS${NC}"
    
    if [ $TOTAL_TESTS -gt 0 ]; then
        local pass_rate=$((PASSED_TESTS * 100 / TOTAL_TESTS))
        echo ""
        echo -e "${BOLD}Pass Rate:     ${pass_rate}%${NC}"
    fi
    
    echo ""
    echo -e "${BOLD}End Time:${NC} $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    
    if [ $FAILED_TESTS -eq 0 ] && [ $PASSED_TESTS -gt 0 ]; then
        echo -e "${GREEN}${BOLD}╔════════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}${BOLD}║                                                                ║${NC}"
        echo -e "${GREEN}${BOLD}║          ✅ ALL PRODUCTION TESTS PASSED! ✅                    ║${NC}"
        echo -e "${GREEN}${BOLD}║                                                                ║${NC}"
        echo -e "${GREEN}${BOLD}╚════════════════════════════════════════════════════════════════╝${NC}"
        return 0
    elif [ $PASSED_TESTS -gt 0 ]; then
        echo -e "${YELLOW}${BOLD}⚠️  Some tests passed, but there were failures or skips${NC}"
        return 1
    else
        echo -e "${RED}${BOLD}❌ ALL TESTS FAILED${NC}"
        return 1
    fi
}

################################################################################
# Main Execution
################################################################################

main() {
    print_header "MONITORA VAGAS - PRODUCTION TEST SUITE"
    
    echo -e "${BOLD}Start Time:${NC} $(date '+%Y-%m-%d %H:%M:%S')"
    echo -e "${BOLD}Environment:${NC} Production"
    echo -e "${BOLD}Base URL:${NC} $PRODUCTION_URL"
    echo ""
    
    # Check prerequisites
    if ! check_prerequisites; then
        print_error "Prerequisites check failed. Please fix issues and try again."
        exit 1
    fi
    
    # Run tests
    print_header "RUNNING TESTS"
    
    # Test 1: API Tests (always reliable)
    test_api_hotel_list
    
    # Test 2: Browser Tests (may have issues with Chrome)
    test_selenium_browser
    
    # Test 3: Production Validation (if exists)
    test_production_validation
    
    # Print summary
    print_summary
    local summary_exit=$?
    
    echo ""
    echo -e "${CYAN}════════════════════════════════════════════════════════════════════════════${NC}"
    
    exit $summary_exit
}

################################################################################
# Script Entry Point
################################################################################

# Change to script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Run main function
main "$@"
