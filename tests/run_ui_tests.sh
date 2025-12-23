#!/bin/bash
#
# Web UI Test Setup and Runner
# Sets up the testing environment and runs Selenium UI tests
#
# Version: 1.0.0
# Last Updated: 2024-12-23
#
# Usage:
#   ./run_ui_tests.sh
#
# Prerequisites:
#   - Python 3.x
#   - pip
#   - Chrome browser
#   - Internet connection (first-time setup)
#
# Environment Variables:
#   UI_TEST_SERVER_PORT - Web server port (default: 8080)
#   UI_TEST_HEADLESS    - Headless mode (default: 1, 0 for visible browser)
#

set -e  # Exit on any error

echo "========================================================"
echo "Trade Union Hotel Search Platform - Web UI Test Setup"
echo "========================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Python 3 is installed
check_python() {
    print_status "Checking Python installation..."
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version)
        print_success "Python found: $PYTHON_VERSION"
    else
        print_error "Python 3 is not installed. Please install Python 3.8 or higher."
        exit 1
    fi
}

# Check if Chrome/Chromium is installed
check_chrome() {
    print_status "Checking Chrome/Chromium installation..."
    if command -v google-chrome &> /dev/null; then
        CHROME_VERSION=$(google-chrome --version)
        print_success "Chrome found: $CHROME_VERSION"
    elif command -v chromium-browser &> /dev/null; then
        CHROME_VERSION=$(chromium-browser --version)
        print_success "Chromium found: $CHROME_VERSION"
    elif command -v chromium &> /dev/null; then
        CHROME_VERSION=$(chromium --version)
        print_success "Chromium found: $CHROME_VERSION"
    else
        print_warning "Chrome/Chromium not found. Please install Google Chrome or Chromium."
        print_status "Installation commands:"
        print_status "  Ubuntu/Debian: sudo apt install google-chrome-stable"
        print_status "  Fedora: sudo dnf install google-chrome-stable"
        print_status "  Arch: sudo pacman -S google-chrome"
    fi
}

# Install Python dependencies
install_dependencies() {
    print_status "Installing Python dependencies..."
    
    # Check if pip is available
    if ! command -v pip3 &> /dev/null; then
        print_error "pip3 is not installed. Please install pip for Python 3."
        exit 1
    fi
    
    # Install requirements
    if [ -f "test_requirements.txt" ]; then
        pip3 install -r test_requirements.txt
        print_success "Dependencies installed successfully"
    else
        print_error "test_requirements.txt not found"
        exit 1
    fi
}

# Download ChromeDriver automatically
setup_chromedriver() {
    print_status "Setting up ChromeDriver..."
    
    # Create a simple Python script to install chromedriver
    python3 -c "
import sys
try:
    from webdriver_manager.chrome import ChromeDriverManager
    from selenium import webdriver
    from selenium.webdriver.chrome.service import Service
    
    # Download and setup ChromeDriver
    service = Service(ChromeDriverManager().install())
    print('ChromeDriver setup completed successfully')
except ImportError:
    print('webdriver-manager not available, assuming chromedriver is in PATH')
except Exception as e:
    print(f'ChromeDriver setup failed: {e}')
    sys.exit(1)
"
    
    if [ $? -eq 0 ]; then
        print_success "ChromeDriver setup completed"
    else
        print_warning "ChromeDriver automatic setup failed"
        print_status "Please ensure chromedriver is in your PATH or install it manually:"
        print_status "  1. Download from: https://chromedriver.chromium.org/"
        print_status "  2. Extract and place in /usr/local/bin/ or add to PATH"
    fi
}

# Run the tests
run_tests() {
    print_status "Running Web UI tests..."
    echo ""
    
    # Set environment variables
    export PYTHONPATH="${PYTHONPATH}:$(pwd)"
    
    # Change to tests directory if not already there
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
    
    # Run tests with different options based on arguments
    if [ "$1" = "headless" ]; then
        print_status "Running tests in headless mode..."
        export HEADLESS=true
        python3 "$SCRIPT_DIR/test_web_ui.py"
    elif [ "$1" = "verbose" ]; then
        print_status "Running tests in verbose mode..."
        python3 "$SCRIPT_DIR/test_web_ui.py" -v
    else
        python3 "$SCRIPT_DIR/test_web_ui.py"
    fi
    
    TEST_EXIT_CODE=$?
    
    echo ""
    if [ $TEST_EXIT_CODE -eq 0 ]; then
        print_success "All tests passed! ✅"
    else
        print_error "Some tests failed! ❌"
    fi
    
    # Check for screenshots
    if [ -d "$PROJECT_ROOT/test_screenshots" ]; then
        SCREENSHOT_COUNT=$(ls "$PROJECT_ROOT/test_screenshots"/*.png 2>/dev/null | wc -l)
        if [ $SCREENSHOT_COUNT -gt 0 ]; then
            print_status "Screenshots saved in test_screenshots/ directory ($SCREENSHOT_COUNT files)"
        fi
    fi
    
    return $TEST_EXIT_CODE
}

# Display help
show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  setup     - Install dependencies and setup testing environment"
    echo "  test      - Run the web UI tests (default)"
    echo "  headless  - Run tests in headless mode (no browser window)"
    echo "  verbose   - Run tests with verbose output"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                # Run tests with GUI"
    echo "  $0 setup          # Setup testing environment"
    echo "  $0 headless       # Run tests without browser window"
    echo "  $0 verbose        # Run tests with detailed output"
}

# Main execution
case "${1:-test}" in
    "setup")
        check_python
        check_chrome
        install_dependencies
        setup_chromedriver
        print_success "Setup completed! You can now run tests with: $0 test"
        ;;
    "test")
        check_python
        run_tests
        ;;
    "headless")
        check_python
        run_tests headless
        ;;
    "verbose")
        check_python
        run_tests verbose
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac