#!/bin/bash
#
# Semantic Version Tests Runner
# Runs both Python and JavaScript version tests
#
# Version: 1.0.0
# Last Updated: 2024-12-23
#
# Usage:
#   ./run-version-tests.sh
#
# Prerequisites:
#   - Python 3.x
#   - Node.js
#   - Must run from project root
#
# Environment Variables:
#   None required
#

set -e

echo "======================================"
echo "🚀 Semantic Version Test Suite"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must be run from project root"
    exit 1
fi

# Run Python tests
echo ""
echo "📝 Running Python tests..."
echo "--------------------------------------"
python3 tests/test_semantic_version.py
PYTHON_EXIT=$?

# Run JavaScript tests
echo ""
echo "📝 Running JavaScript tests..."
echo "--------------------------------------"
node --experimental-vm-modules node_modules/jest/bin/jest.js tests/test-semantic-version.test.js --verbose
JEST_EXIT=$?

# Summary
echo ""
echo "======================================"
echo "📊 Test Summary"
echo "======================================"

if [ $PYTHON_EXIT -eq 0 ]; then
    echo "✅ Python tests: PASSED"
else
    echo "❌ Python tests: FAILED"
fi

if [ $JEST_EXIT -eq 0 ]; then
    echo "✅ JavaScript tests: PASSED"
else
    echo "❌ JavaScript tests: FAILED"
fi

# Exit with error if any test failed
if [ $PYTHON_EXIT -ne 0 ] || [ $JEST_EXIT -ne 0 ]; then
    echo ""
    echo "❌ Some tests failed"
    exit 1
fi

echo ""
echo "✅ All tests passed!"
exit 0
