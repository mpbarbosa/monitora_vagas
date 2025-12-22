#!/bin/bash

# Dependency Update Script
# Implements the phased update plan from DEPENDENCY_ANALYSIS_REPORT.md

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Phase selection
PHASE=${1:-"all"}

echo "========================================"
echo "Dependency Update Script"
echo "========================================"
echo ""

# Phase 0: Critical Fix
phase0_critical() {
    log_info "Phase 0: Critical Fixes"
    echo ""
    
    log_info "Moving selenium-webdriver to devDependencies..."
    npm uninstall selenium-webdriver
    npm install --save-dev selenium-webdriver@^4.39.0
    
    log_success "Phase 0 completed!"
    echo ""
}

# Phase 1: Safe Updates
phase1_safe() {
    log_info "Phase 1: Safe Updates (No Breaking Changes)"
    echo ""
    
    log_info "Updating Bootstrap to 5.3.8..."
    npm install bootstrap@5.3.8
    
    log_info "Updating markdownlint-cli to 0.47.0..."
    npm install --save-dev markdownlint-cli@0.47.0
    
    log_success "Phase 1 completed!"
    echo ""
    
    log_warning "Please run tests: npm run test:all"
}

# Phase 2: Jest Upgrade
phase2_jest() {
    log_info "Phase 2: Jest Ecosystem Upgrade"
    echo ""
    
    log_warning "This will upgrade Jest to v30 (major version change)"
    read -p "Continue? (y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Upgrading Jest packages..."
        npm install --save-dev jest@30.2.0 @jest/globals@30.2.0 jest-environment-jsdom@30.2.0
        
        log_success "Phase 2 completed!"
        echo ""
        
        log_warning "IMPORTANT: Run full test suite!"
        log_info "  npm run test:all:js"
        log_info "  npm run test:api:coverage"
        log_info "  npm run test:e2e"
    else
        log_info "Phase 2 skipped"
    fi
    
    echo ""
}

# Run tests
run_tests() {
    log_info "Running test suite..."
    echo ""
    
    log_info "1. JavaScript tests..."
    npm run test:all:js || log_error "JavaScript tests failed"
    
    log_info "2. API tests with coverage..."
    npm run test:api:coverage || log_error "API tests failed"
    
    log_info "3. Linting..."
    npm run lint || log_error "Linting failed"
    npm run lint:md || log_error "Markdown linting failed"
    
    log_info "4. Security audit..."
    npm audit || log_warning "Security issues found"
    
    log_success "Test suite completed!"
}

# Main execution
case $PHASE in
    "0"|"critical")
        phase0_critical
        ;;
    "1"|"safe")
        phase1_safe
        ;;
    "2"|"jest")
        phase2_jest
        ;;
    "test")
        run_tests
        ;;
    "all")
        phase0_critical
        phase1_safe
        
        log_warning "Phase 2 (Jest upgrade) requires manual confirmation"
        log_info "Run: ./scripts/update-dependencies.sh 2"
        ;;
    *)
        echo "Usage: $0 {0|1|2|test|all}"
        echo ""
        echo "Phases:"
        echo "  0, critical  - Critical fixes (selenium classification)"
        echo "  1, safe      - Safe updates (bootstrap, markdownlint)"
        echo "  2, jest      - Jest upgrade (requires confirmation)"
        echo "  test         - Run test suite"
        echo "  all          - Run phases 0 and 1 (default)"
        exit 1
        ;;
esac

log_success "Update script completed!"
echo ""
log_info "Next steps:"
echo "  1. Review changes: git diff package.json"
echo "  2. Run tests: npm run test:all"
echo "  3. Commit: git add package.json package-lock.json && git commit"
