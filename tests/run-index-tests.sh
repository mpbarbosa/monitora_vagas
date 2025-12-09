#!/bin/bash

###############################################################################
# Comprehensive Test Runner for index.html
# Version: 1.0.0
# 
# This script runs all tests for the public/index.html file:
# - End-to-End tests (Selenium)
# - Browser-based integration tests (opens in browser)
#
# Usage:
#   ./run-index-tests.sh [options]
#
# Options:
#   --e2e-only      Run only E2E tests
#   --browser-only  Run only browser tests
#   --no-server     Skip starting the server (assumes already running)
#   --verbose       Enable verbose output
#   --echo          Echo commands without executing them (dry-run mode)
#   --help          Show this help message
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SERVER_PORT=8080
SERVER_URL="http://localhost:$SERVER_PORT"
TEST_DIR="tests"
SERVER_PID=""
RUN_E2E=true
RUN_BROWSER=true
START_SERVER=true
VERBOSE=false
ECHO_MODE=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --e2e-only)
            RUN_BROWSER=false
            shift
            ;;
        --browser-only)
            RUN_E2E=false
            shift
            ;;
        --no-server)
            START_SERVER=false
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --echo)
            ECHO_MODE=true
            shift
            ;;
        --help)
            grep "^#" "$0" | tail -n +2 | head -n -1 | sed 's/^# //'
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Function to print info
print_info() {
    echo -e "${MAGENTA}ℹ️  $1${NC}"
}

# Function to execute or echo commands
execute_or_echo() {
    if [ "$ECHO_MODE" = true ]; then
        echo -e "${CYAN}[ECHO]${NC} $*"
    else
        eval "$@"
    fi
}

# Function to print info
print_info() {
    echo -e "${MAGENTA}ℹ️  $1${NC}"
}

# Function to print section headers
print_header() {
    echo -e "\n${CYAN}╔══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC} $1"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════╝${NC}\n"
}

# Function to print step
print_step() {
    echo -e "${BLUE}⚙️  $1${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

if [ "$VERBOSE" = true ]; then
    print_info "Verbose mode enabled"
fi

if [ "$ECHO_MODE" = true ]; then
    print_warning "ECHO MODE: Commands will be displayed but not executed"
fi

# Cleanup function
cleanup() {
    if [ -n "$SERVER_PID" ] && kill -0 $SERVER_PID 2>/dev/null; then
        print_step "🛑 Stopping test server (PID: $SERVER_PID)..."
        kill $SERVER_PID 2>/dev/null || true
        wait $SERVER_PID 2>/dev/null || true
        print_success "Server stopped"
    fi
}

# Set up cleanup trap
trap cleanup EXIT INT TERM

# Main execution
print_header "🧪 COMPREHENSIVE TEST SUITE FOR INDEX.HTML"

# Check dependencies
print_step "🔍 Checking dependencies..."

if ! command -v curl &> /dev/null; then
    print_error "curl is not installed"
    exit 1
fi
print_success "curl: $(curl --version | head -n 1)"
if ! command -v lsof &> /dev/null; then
    print_error "lsof is not installed"
    exit 1
fi
print_success "lsof: $(lsof --version | head -n 1 | awk '{print $2}')"
if [ "$VERBOSE" = true ]; then
    if ! command -v sleep &> /dev/null; then
        print_error "sleep command not found"
        exit 1
    fi
    print_success "⏱️  sleep command found"
fi
if [ "$VERBOSE" = true ]; then
    if ! command -v kill &> /dev/null; then
        print_error "kill command not found"
        exit 1
    fi
    print_success "kill command found"
fi
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed"
    exit 1
fi
print_success "🐍 Python 3: $(python3 --version)"

# Check if server needs to be started
if [ "$VERBOSE" = true ]; then
    print_info "Preparing to start development server..."
    print_info "Server URL: $SERVER_URL"
    print_info "Server Port: $SERVER_PORT"
    print_info "Test Directory: $TEST_DIR"
    print_info "E2E Tests: $RUN_E2E"
    print_info "Browser Tests: $RUN_BROWSER"
    print_info "Start Server: $START_SERVER"
fi
if [ "$START_SERVER" = true ]; then
    print_step "🚀 Starting development server on port $SERVER_PORT..."
    
    # Check if port is already in use
    if lsof -Pi :$SERVER_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port $SERVER_PORT is already in use"
        print_info "Assuming server is already running..."
        START_SERVER=false
    else
        # Start server in background
        if [ "$ECHO_MODE" = true ]; then
            echo -e "${CYAN}[ECHO]${NC} python3 -m http.server $SERVER_PORT --directory public > /dev/null 2>&1 &"
            echo -e "${CYAN}[ECHO]${NC} SERVER_PID=\$!"
        else
            python3 -m http.server $SERVER_PORT --directory public > /dev/null 2>&1 &
            SERVER_PID=$!
        fi
        
        # Wait for server to start
        print_step "⏳ Waiting for server to start..."
        if [ "$ECHO_MODE" = true ]; then
            echo -e "${CYAN}[ECHO]${NC} sleep 3"
        else
            sleep 3
        fi
        
        # Verify server is running
        if [ "$ECHO_MODE" = false ]; then
            if ! kill -0 $SERVER_PID 2>/dev/null; then
                print_error "Failed to start server"
                exit 1
            fi
        fi
        
        # Test server connectivity
        if [ "$ECHO_MODE" = true ]; then
            echo -e "${CYAN}[ECHO]${NC} curl -s \"$SERVER_URL\" > /dev/null"
            print_success "Server started successfully (PID: \$SERVER_PID)"
        else
            if curl -s "$SERVER_URL" > /dev/null; then
                print_success "Server started successfully (PID: $SERVER_PID)"
            else
                print_error "Server started but not responding"
                exit 1
            fi
        fi
    fi
else
    print_info "Skipping server start (--no-server flag)"
fi

# Run E2E Tests
if [ "$RUN_E2E" = true ]; then
    print_header "📱 RUNNING END-TO-END TESTS"
    
    # Check if Selenium is installed
    if ! python3 -c "import selenium" 2>/dev/null; then
        print_warning "Selenium is not installed"
        print_info "💡 Install with: pip install selenium"
        print_warning "⏭️  Skipping E2E tests..."
        E2E_RESULT=2  # Skip
    else
        # Check if test file exists
        if [ ! -f "$TEST_DIR/test-index-e2e.py" ]; then
            print_error "E2E test file not found: $TEST_DIR/test-index-e2e.py"
            E2E_RESULT=1
        else
            # Run E2E tests
            print_step "🔄 Executing Selenium tests..."
            if [ "$ECHO_MODE" = true ]; then
                echo -e "${CYAN}[ECHO]${NC} python3 \"$TEST_DIR/test-index-e2e.py\""
                E2E_RESULT=0
                print_success "All E2E tests passed! 🎉"
            else
                if python3 "$TEST_DIR/test-index-e2e.py"; then
                    E2E_RESULT=0
                    print_success "All E2E tests passed! 🎉"
                else
                    E2E_RESULT=1
                    print_error "Some E2E tests failed"
                fi
            fi
        fi
    fi
else
    print_info "Skipping E2E tests (--browser-only flag)"
    E2E_RESULT=2  # Skip
fi

# Run Browser Tests
if [ "$RUN_BROWSER" = true ]; then
    print_header "🌐 BROWSER-BASED INTEGRATION TESTS"
    
    BROWSER_TEST_URL="$SERVER_URL/tests/test-index-comprehensive.html"
    
    print_info "Browser tests available at:"
    echo -e "${CYAN}    🔗 $BROWSER_TEST_URL${NC}"
    
    # Try to open in default browser
    print_step "🌐 Opening browser tests..."
    
    if [ "$ECHO_MODE" = true ]; then
        if command -v xdg-open &> /dev/null; then
            echo -e "${CYAN}[ECHO]${NC} xdg-open \"$BROWSER_TEST_URL\" 2>/dev/null &"
            print_success "Browser opened (🐧 Linux)"
        elif command -v open &> /dev/null; then
            echo -e "${CYAN}[ECHO]${NC} open \"$BROWSER_TEST_URL\" 2>/dev/null &"
            print_success "Browser opened (🍎 macOS)"
        elif command -v start &> /dev/null; then
            echo -e "${CYAN}[ECHO]${NC} start \"$BROWSER_TEST_URL\" 2>/dev/null &"
            print_success "Browser opened (🪟 Windows)"
        else
            print_warning "Could not detect default browser"
            print_info "Please manually open: $BROWSER_TEST_URL"
        fi
    else
        if command -v xdg-open &> /dev/null; then
            # Linux
            xdg-open "$BROWSER_TEST_URL" 2>/dev/null &
            print_success "Browser opened (🐧 Linux)"
        elif command -v open &> /dev/null; then
            # macOS
            open "$BROWSER_TEST_URL" 2>/dev/null &
            print_success "Browser opened (🍎 macOS)"
        elif command -v start &> /dev/null; then
            # Windows
            start "$BROWSER_TEST_URL" 2>/dev/null &
            print_success "Browser opened (🪟 Windows)"
        else
            print_warning "Could not detect default browser"
            print_info "Please manually open: $BROWSER_TEST_URL"
        fi
    fi
    
    print_info "Browser tests run interactively - check the browser window"
    BROWSER_RESULT=0
else
    print_info "Skipping browser tests (--e2e-only flag)"
    BROWSER_RESULT=2  # Skip
fi

# Print Summary
print_header "📊 TEST SUMMARY"

echo -e "${CYAN}Test Results:${NC}"
echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$RUN_E2E" = true ]; then
    if [ $E2E_RESULT -eq 0 ]; then
        echo -e "  ${GREEN}✅ E2E Tests:        PASSED${NC}"
    elif [ $E2E_RESULT -eq 2 ]; then
        echo -e "  ${YELLOW}⏭️  E2E Tests:        SKIPPED${NC}"
    else
        echo -e "  ${RED}❌ E2E Tests:        FAILED${NC}"
    fi
fi

if [ "$RUN_BROWSER" = true ]; then
    echo -e "  ${BLUE}🌐 Browser Tests:    CHECK BROWSER${NC}"
fi

echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Print additional info
print_info "Test files location: $TEST_DIR/"
echo -e "  - 🌐 test-index-comprehensive.html  (Browser integration tests)"
echo -e "  - 🐍 test-index-e2e.py              (End-to-end Selenium tests)"
echo -e "  - 📗 test-index-unit.js             (JavaScript unit tests)"
echo -e "  - 📋 TEST_SUITE_README.md           (Documentation)"

# Print next steps
print_header "📝 NEXT STEPS"

if [ "$RUN_BROWSER" = true ]; then
    print_info "🔍 Review browser test results in the opened browser window"
fi

if [ $E2E_RESULT -ne 0 ] && [ $E2E_RESULT -ne 2 ]; then
    print_warning "Review E2E test failures above"
    print_info "💡 Run with increased verbosity: python3 -m unittest $TEST_DIR/test-index-e2e.py -v"
fi

print_info "For detailed documentation, see: $TEST_DIR/TEST_SUITE_README.md"

# Keep server running if browser tests were run
if [ "$RUN_BROWSER" = true ] && [ "$START_SERVER" = true ]; then
    echo ""
    print_info "🚀 Server will keep running for browser tests..."
    print_warning "⏸️  Press Ctrl+C to stop the server and exit"
    
    # Wait for user interrupt
    if [ "$ECHO_MODE" = true ]; then
        echo -e "${CYAN}[ECHO]${NC} wait \$SERVER_PID 2>/dev/null || true"
    else
        wait $SERVER_PID 2>/dev/null || true
    fi
else
    # Exit with appropriate code
    if [ $E2E_RESULT -eq 0 ] || [ $E2E_RESULT -eq 2 ]; then
        exit 0
    else
        exit 1
    fi
fi
