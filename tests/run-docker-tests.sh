#!/bin/bash
################################################################################
#
# Docker Selenium Test Runner
# Runs tests in Docker container with Chrome/ChromeDriver pre-configured
#
################################################################################

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}================================================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================================================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        echo "Install Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi
    print_success "Docker found: $(docker --version)"
}

# Check if Docker Compose is installed
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        echo "Install Docker Compose: https://docs.docker.com/compose/install/"
        exit 1
    fi
    print_success "Docker Compose found: $(docker-compose --version)"
}

# Main execution
main() {
    print_header "Docker Selenium Test Runner"
    
    # Check prerequisites
    check_docker
    check_docker_compose
    
    echo ""
    print_info "Test Options:"
    echo "  1) Run tests with Docker Compose (recommended)"
    echo "  2) Build and run Dockerfile directly"
    echo "  3) View VNC (watch tests run live)"
    echo "  4) Clean up containers"
    echo "  5) Exit"
    echo ""
    
    read -p "Select option [1-5]: " choice
    
    case $choice in
        1)
            print_header "Running Tests with Docker Compose"
            docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
            ;;
        2)
            print_header "Building and Running Dockerfile"
            docker build -t monitora-vagas-selenium -f tests/Dockerfile.selenium .
            docker run --rm monitora-vagas-selenium
            ;;
        3)
            print_header "VNC Access Information"
            echo ""
            print_info "1. Start tests: docker-compose -f docker-compose.test.yml up"
            print_info "2. Open VNC viewer: http://localhost:7900"
            print_info "3. Password: secret (or no password if SE_VNC_NO_PASSWORD=1)"
            echo ""
            print_success "You can watch the tests execute in real-time!"
            ;;
        4)
            print_header "Cleaning Up Docker Containers"
            docker-compose -f docker-compose.test.yml down -v
            docker rmi monitora-vagas-selenium 2>/dev/null || true
            print_success "Cleanup complete"
            ;;
        5)
            print_info "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid option"
            exit 1
            ;;
    esac
    
    echo ""
    print_header "Test Execution Complete"
}

# Run main function
main "$@"
