#!/bin/bash

echo "🔍 Validating Inline Parameter Editor Implementation"
echo "=================================================="
echo ""

# Check if files exist
echo "📁 Checking files..."
files=(
    "src/js/inlineParameterEditor.js"
    "src/styles/components/inline-editor.css"
    "docs/features/INLINE_PARAMETER_EDITOR.md"
)

all_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (missing)"
        all_exist=false
    fi
done
echo ""

# Check imports in main.css
echo "📦 Checking CSS imports..."
if grep -q "inline-editor.css" src/styles/main.css; then
    echo "  ✅ inline-editor.css imported in main.css"
else
    echo "  ❌ inline-editor.css NOT imported in main.css"
fi
echo ""

# Check integration in hotelSearch.js
echo "🔗 Checking hotelSearch.js integration..."
if grep -q "inlineEditor" src/js/hotelSearch.js; then
    echo "  ✅ inlineEditor imported"
else
    echo "  ❌ inlineEditor NOT imported"
fi

if grep -q "handleInlineParamChange" src/js/hotelSearch.js; then
    echo "  ✅ handleInlineParamChange function present"
else
    echo "  ❌ handleInlineParamChange function missing"
fi

if grep -q "performSearch" src/js/hotelSearch.js; then
    echo "  ✅ performSearch function present"
else
    echo "  ❌ performSearch function missing"
fi
echo ""

# Check ESLint
echo "🧹 Running ESLint..."
if npx eslint src/js/inlineParameterEditor.js --quiet; then
    echo "  ✅ No ESLint errors in inlineParameterEditor.js"
else
    echo "  ❌ ESLint errors found"
fi

if npx eslint src/js/hotelSearch.js --quiet; then
    echo "  ✅ No ESLint errors in hotelSearch.js"
else
    echo "  ❌ ESLint errors found"
fi
echo ""

# Check file sizes
echo "📊 File sizes..."
printf "  %-50s %10s\n" "File" "Size"
printf "  %-50s %10s\n" "----" "----"
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        size=$(wc -c < "$file" | numfmt --to=iec --suffix=B)
        printf "  %-50s %10s\n" "$file" "$size"
    fi
done
echo ""

# Check documentation
echo "📝 Checking documentation..."
if grep -q "FR-016" docs/features/INLINE_PARAMETER_EDITOR.md; then
    echo "  ✅ Feature ID (FR-016) documented"
else
    echo "  ⚠️  Feature ID not found in documentation"
fi

if grep -q "WCAG" docs/features/INLINE_PARAMETER_EDITOR.md; then
    echo "  ✅ Accessibility (WCAG) documented"
else
    echo "  ⚠️  WCAG not mentioned in documentation"
fi

if grep -q "Dark Mode" docs/features/INLINE_PARAMETER_EDITOR.md; then
    echo "  ✅ Dark mode documented"
else
    echo "  ⚠️  Dark mode not documented"
fi
echo ""

# Summary
echo "=================================================="
if $all_exist; then
    echo "✅ All validations passed!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Open test_inline_editor.html in browser"
    echo "   2. Test component rendering and interactions"
    echo "   3. Perform end-to-end testing in main app"
    echo "   4. Review documentation in docs/features/"
    exit 0
else
    echo "❌ Some validations failed. Please check above."
    exit 1
fi
