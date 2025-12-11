#!/usr/bin/env python3
"""
Test to verify empty state message displays "Sem vagas disponíveis"
"""

import sys
from pathlib import Path

def test_empty_state_message():
    """Verify the empty state message in index.html"""
    
    # Get the project root and HTML file path
    project_root = Path(__file__).parent.parent
    html_file = project_root / "public" / "index.html"
    
    print(f"Testing empty state message in: {html_file}")
    
    # Read the HTML file
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for the new message
    if "Sem vagas disponíveis" in content:
        print("✅ PASS: Empty state message 'Sem vagas disponíveis' found in HTML")
        
        # Count occurrences (should be in main code and possibly comments)
        count = content.count("Sem vagas disponíveis")
        print(f"   Found {count} occurrence(s) of the message")
        return True
    else:
        print("❌ FAIL: Empty state message 'Sem vagas disponíveis' NOT found in HTML")
        
        # Check if old message still exists
        if "Nenhuma Vaga Encontrada" in content:
            print("   ERROR: Old message 'Nenhuma Vaga Encontrada' still present!")
        
        return False

def test_unit_test_expectations():
    """Verify the unit test expectations were updated"""
    
    project_root = Path(__file__).parent.parent
    unit_test_file = project_root / "tests" / "test-index-unit.js"
    
    print(f"\nTesting unit test expectations in: {unit_test_file}")
    
    # Read the unit test file
    with open(unit_test_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for the new message in test expectations
    if "Sem vagas disponíveis" in content:
        print("✅ PASS: Unit test expectations updated with 'Sem vagas disponíveis'")
        return True
    else:
        print("❌ FAIL: Unit test expectations NOT updated")
        
        # Check if old message still exists
        if "Nenhuma Vaga Encontrada" in content:
            print("   ERROR: Old message 'Nenhuma Vaga Encontrada' still in unit tests!")
        
        return False

def main():
    """Run all tests"""
    print("="*70)
    print("Empty State Message Test Suite")
    print("="*70)
    print()
    
    # Run tests
    test1_passed = test_empty_state_message()
    test2_passed = test_unit_test_expectations()
    
    # Summary
    print()
    print("="*70)
    print("Test Summary:")
    print(f"  HTML File: {'✅ PASS' if test1_passed else '❌ FAIL'}")
    print(f"  Unit Tests: {'✅ PASS' if test2_passed else '❌ FAIL'}")
    print("="*70)
    
    # Exit with appropriate code
    if test1_passed and test2_passed:
        print("\n🎉 All tests passed!")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
