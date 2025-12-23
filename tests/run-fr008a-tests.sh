#!/bin/bash
#
# FR-008A Test Runner
# Tests for Search Lifecycle UI State Management
#
# Version: 1.0.0
# Last Updated: 2024-12-23
#
# Usage:
#   ./run-fr008a-tests.sh
#
# Prerequisites:
#   - Python 3.x
#   - pytest
#   - selenium
#   - Chrome browser
#   - Local test server running on port 3001
#
# Environment Variables:
#   FR008A_TEST_URL - Test server URL (default: http://localhost:3001)
#   VERBOSE         - Enable verbose output (default: 0)
#

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "═══════════════════════════════════════════════════════════"
echo "  FR-008A: Search Lifecycle UI State Management Tests"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check if Python virtual environment exists
if [ ! -d "$PROJECT_ROOT/venv" ]; then
    echo "❌ Error: Python virtual environment not found"
    echo "   Please create it first: python3 -m venv venv"
    exit 1
fi

# Activate virtual environment
source "$PROJECT_ROOT/venv/bin/activate"

# Check if pytest is installed
if ! python -m pytest --version > /dev/null 2>&1; then
    echo "📦 Installing pytest and selenium..."
    pip install pytest selenium --quiet
fi

# Check if local server is running
if ! curl -s http://localhost:3001/index.html > /dev/null 2>&1; then
    echo "⚠️  Warning: Local test server not detected on port 3001"
    echo "   Starting test server in background..."
    
    # Start server in background
    cd "$PROJECT_ROOT/public"
    python -m http.server 3001 > /dev/null 2>&1 &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 2
    
    # Check if server started successfully
    if ! curl -s http://localhost:3001/index.html > /dev/null 2>&1; then
        echo "❌ Error: Failed to start test server"
        kill $SERVER_PID 2>/dev/null || true
        exit 1
    fi
    
    echo "✅ Test server started (PID: $SERVER_PID)"
    CLEANUP_SERVER=true
else
    echo "✅ Test server already running on port 3001"
    CLEANUP_SERVER=false
fi

echo ""
echo "Running FR-008A Tests..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Run tests with verbose output
cd "$PROJECT_ROOT"
python -m pytest tests/test_search_lifecycle_state.py -v --tb=short

# Capture exit code
TEST_EXIT_CODE=$?

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Cleanup: Stop server if we started it
if [ "$CLEANUP_SERVER" = true ]; then
    echo ""
    echo "🧹 Cleaning up: Stopping test server (PID: $SERVER_PID)..."
    kill $SERVER_PID 2>/dev/null || true
    wait $SERVER_PID 2>/dev/null || true
fi

echo ""

# Summary
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ All FR-008A tests passed!"
    echo ""
    echo "Test Coverage:"
    echo "  • Initial Page Load State: 4 tests"
    echo "  • Searching State: 3 tests"
    echo "  • Results State: 4 tests"
    echo "  • Start New Search Action: 7 tests"
    echo "  • Button State Transitions: 1 test"
    echo "  ─────────────────────────────────"
    echo "  Total: 19 tests (100% pass rate)"
    echo ""
else
    echo "❌ Some tests failed. Please review the output above."
    echo ""
fi

exit $TEST_EXIT_CODE
