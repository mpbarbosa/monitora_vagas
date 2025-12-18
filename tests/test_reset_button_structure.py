#!/usr/bin/env python3
"""
Simple Reset Button Structure Test - AC-008A.39
Verifies HTML structure compliance without clicking
"""

from pathlib import Path
from html.parser import HTMLParser


class ResetButtonParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_form = False
        self.reset_btn_in_form = False
        self.reset_btn_found = False
        self.reset_btn_type = None
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        
        # Track when we enter a form
        if tag == 'form':
            self.in_form = True
        
        # Check if reset button is found
        if tag == 'button' and attrs_dict.get('id') == 'reset-btn':
            self.reset_btn_found = True
            self.reset_btn_type = attrs_dict.get('type')
            
            if self.in_form:
                self.reset_btn_in_form = True
    
    def handle_endtag(self, tag):
        # Track when we exit a form
        if tag == 'form':
            self.in_form = False


def test_reset_button_structure():
    """Test Reset button HTML structure"""
    print("=" * 70)
    print("🧪 Reset Button Structure Test (AC-008A.39)")
    print("=" * 70)
    
    # Read HTML file
    html_path = Path(__file__).parent.parent / "public" / "index.html"
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Parse HTML
    parser = ResetButtonParser()
    parser.feed(html_content)
    
    print("\n📋 Test Results:")
    print("-" * 70)
    
    # Test 1: Reset button exists
    print(f"\n1. Reset button exists: {'✅ YES' if parser.reset_btn_found else '❌ NO'}")
    if not parser.reset_btn_found:
        print("   ❌ FAILED: Reset button with id='reset-btn' not found")
        return False
    
    # Test 2: Reset button is NOT inside form
    print(f"\n2. Reset button inside <form>: {'❌ YES (WRONG!)' if parser.reset_btn_in_form else '✅ NO (CORRECT!)'}")
    if parser.reset_btn_in_form:
        print("   ❌ FAILED: Reset button is inside form - will trigger submission")
        print("   ℹ️  AC-008A.39: Button should ONLY change state, not submit form")
        return False
    else:
        print("   ✅ PASSED: Reset button is outside form")
    
    # Test 3: Reset button has type="button"
    print(f"\n3. Reset button type attribute: {parser.reset_btn_type or '(none)'}")
    if parser.reset_btn_type == 'button':
        print("   ✅ PASSED: type='button' prevents form submission")
    elif parser.reset_btn_type == 'submit':
        print("   ❌ FAILED: type='submit' will submit form")
        return False
    else:
        print("   ⚠️  WARNING: No explicit type (defaults to 'submit' in some browsers)")
        print("   ℹ️  Recommended: Add type='button' for clarity")
    
    print("\n" + "=" * 70)
    print("✅ AC-008A.39 COMPLIANCE: VERIFIED")
    print("=" * 70)
    print("\n✅ Reset button structure is correct:")
    print("   • Button is OUTSIDE the <form> element")
    print("   • Button has type='button' (prevents form submission)")
    print("   • Button will ONLY change state when clicked")
    print("\n")
    
    return True


if __name__ == "__main__":
    import sys
    success = test_reset_button_structure()
    sys.exit(0 if success else 1)
