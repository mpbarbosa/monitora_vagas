#!/usr/bin/env python3
"""
Comprehensive Test Runner for Recent Updates
Tests all components affected by recent changes:
- Guest buttons visibility (icon-con wrapper)
- Cache status tooltip
- Top alignment (padding removal)
- Reset button functionality
"""

import subprocess
import sys
from pathlib import Path


def run_test(test_file, description):
    """Run a single test file and return result"""
    print("\n" + "=" * 70)
    print(f"🧪 {description}")
    print("=" * 70)
    
    test_path = Path(__file__).parent / test_file
    
    try:
        result = subprocess.run(
            [sys.executable, str(test_path)],
            capture_output=True,
            text=True,
            timeout=120
        )
        
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        
        return result.returncode == 0
    except subprocess.TimeoutExpired:
        print(f"❌ Test timed out after 120 seconds")
        return False
    except Exception as e:
        print(f"❌ Test failed with exception: {e}")
        return False


def main():
    """Run all updated tests"""
    print("\n" + "=" * 70)
    print("🚀 COMPREHENSIVE TEST SUITE - RECENT UPDATES")
    print("=" * 70)
    print("\nTesting recent changes:")
    print("  • Guest buttons visibility (icon-con wrapper restored)")
    print("  • Cache status converted to tooltip")
    print("  • Top alignment (padding removal)")
    print("  • Reset button renamed and fixed")
    print("  • Guest input width constraints (overlap prevention)")
    print("=" * 70)
    
    tests = [
        ("test_guest_buttons_visibility.py", "Guest Buttons Visibility - Icon-Con Wrapper"),
        ("test_guest_button_states.py", "Guest Button State Transitions"),
        ("test_cache_status_tooltip.py", "Cache Status Tooltip Implementation"),
        ("test_top_alignment.py", "Top Alignment - Padding Removal"),
        ("test_reset_button_compliance.py", "Reset Button Compliance"),
        ("test_guest_input_width.py", "Guest Input Width - Overlap Prevention"),
    ]
    
    results = []
    
    for test_file, description in tests:
        passed = run_test(test_file, description)
        results.append((description, passed))
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 COMPREHENSIVE TEST RESULTS")
    print("=" * 70)
    
    passed_count = sum(1 for _, passed in results if passed)
    failed_count = len(results) - passed_count
    
    for description, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{status}: {description}")
    
    print("=" * 70)
    print(f"Total: {len(results)} test suites")
    print(f"✅ Passed: {passed_count}")
    print(f"❌ Failed: {failed_count}")
    print("=" * 70)
    
    if failed_count == 0:
        print("\n🎉 ALL TESTS PASSED!")
        print("\n✅ Recent Updates Verified:")
        print("   • Guest buttons with icon-con wrapper: Working")
        print("   • Cache status as tooltip: Working")
        print("   • Top alignment (0px padding): Working")
        print("   • Reset button: Working")
        print("   • Guest input width constraints: Working")
        return 0
    else:
        print(f"\n⚠️  {failed_count} test suite(s) failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())
