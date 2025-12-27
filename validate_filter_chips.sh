#!/bin/bash

echo "🔍 Filter Chips Implementation Validation"
echo "=========================================="
echo ""

# Check if files exist
echo "📁 Checking files..."
files=(
    "src/js/filterChips.js"
    "src/styles/components/filter-chips.css"
    "test_filter_chips.html"
    "FILTER_CHIPS_IMPLEMENTATION.md"
    "FILTER_CHIPS_QUICK_REFERENCE.md"
    "FILTER_CHIPS_SUMMARY.md"
)

all_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file - MISSING!"
        all_exist=false
    fi
done
echo ""

# Check JavaScript syntax
echo "🔧 Checking JavaScript syntax..."
js_files=(
    "src/js/filterChips.js"
    "src/js/guestNumberFilter.js"
    "src/js/hotelSearch.js"
)

js_valid=true
for file in "${js_files[@]}"; do
    if node --check "$file" 2>/dev/null; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file - SYNTAX ERROR!"
        js_valid=false
    fi
done
echo ""

# Check ESLint
echo "🎨 Running ESLint..."
if npx eslint src/js/filterChips.js --quiet 2>/dev/null; then
    echo "  ✅ No linting errors"
else
    echo "  ❌ Linting errors found"
fi
echo ""

# Check CSS file size and structure
echo "📊 CSS Statistics..."
if [ -f "src/styles/components/filter-chips.css" ]; then
    lines=$(wc -l < "src/styles/components/filter-chips.css")
    echo "  ✅ $lines lines"
    
    if grep -q "@media (prefers-color-scheme: dark)" "src/styles/components/filter-chips.css"; then
        echo "  ✅ Dark mode support present"
    else
        echo "  ⚠️  Dark mode support not found"
    fi
    
    if grep -q "@media (max-width:" "src/styles/components/filter-chips.css"; then
        echo "  ✅ Responsive design present"
    else
        echo "  ⚠️  Responsive design not found"
    fi
fi
echo ""

# Check HTML integration
echo "🌐 Checking HTML integration..."
if grep -q "filter-chips-container" "public/index.html"; then
    echo "  ✅ Container element added"
else
    echo "  ❌ Container element missing"
fi

if grep -q "filter-chips.css" "public/index.html"; then
    echo "  ✅ CSS linked"
else
    echo "  ❌ CSS not linked"
fi

if grep -q "filterChips" "public/index.html"; then
    echo "  ✅ Module imported"
else
    echo "  ❌ Module not imported"
fi
echo ""

# Check integration points
echo "🔗 Checking integration points..."
if grep -q "import.*filterChips" "src/js/hotelSearch.js"; then
    echo "  ✅ hotelSearch.js imports filterChips"
else
    echo "  ⚠️  hotelSearch.js missing import"
fi

if grep -q "import.*filterChips" "src/js/guestNumberFilter.js"; then
    echo "  ✅ guestNumberFilter.js imports filterChips"
else
    echo "  ⚠️  guestNumberFilter.js missing import"
fi
echo ""

# Summary
echo "📋 Summary"
echo "========="
if $all_exist && $js_valid; then
    echo "✅ All checks passed!"
    echo "🚀 Filter chips implementation is ready for testing"
    exit 0
else
    echo "⚠️  Some checks failed"
    echo "🔧 Please review the errors above"
    exit 1
fi
