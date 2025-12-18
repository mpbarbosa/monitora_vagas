#!/usr/bin/env python3
"""
Test Guest Input Width to Prevent Button Overlap
Tests that the guest quantity input field has appropriate width constraints
to prevent overlapping with the plus/minus buttons.

Test Coverage:
- Input max-width constraint
- Input flex properties
- No overlap with icon-con buttons
- Visual positioning
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time

class TestGuestInputWidth(unittest.TestCase):
    """Test suite for guest input width constraints"""

    @classmethod
    def setUpClass(cls):
        """Set up Chrome driver once for all tests"""
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--window-size=1920,1080')
        cls.driver = webdriver.Chrome(options=chrome_options)
        
        # Load the page
        html_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'public', 'index.html'))
        cls.driver.get(f'file://{html_path}')
        
        # Wait for page to load
        WebDriverWait(cls.driver, 10).until(
            EC.presence_of_element_located((By.ID, "guest-filter-card"))
        )
        time.sleep(1)  # Additional wait for CSS

    @classmethod
    def tearDownClass(cls):
        """Close browser after all tests"""
        cls.driver.quit()

    def test_01_input_max_width_constraint(self):
        """Test 1: Verify input has max-width constraint"""
        print("\n" + "="*70)
        print("🧪 Test 1: Input Max-Width Constraint")
        print("="*70)
        
        # Find the quantity input
        quantity_input = self.driver.find_element(By.CSS_SELECTOR, "#guest-filter-card input.quantity")
        
        # Get computed styles
        max_width = quantity_input.value_of_css_property("max-width")
        
        print(f"  Input max-width: {max_width}")
        
        # Verify max-width is set
        self.assertIsNotNone(max_width, "Max-width should be defined")
        self.assertNotEqual(max_width, "none", "Max-width should not be 'none'")
        
        # Parse pixel value
        if max_width.endswith('px'):
            width_value = float(max_width.replace('px', ''))
            print(f"  Width value: {width_value}px")
            
            # Should be constrained (less than 150px is reasonable)
            self.assertLessEqual(width_value, 150, f"Max-width should be <= 150px, got {width_value}px")
            self.assertGreaterEqual(width_value, 100, f"Max-width should be >= 100px for readability, got {width_value}px")
            
            print(f"✅ Max-width is properly constrained: {max_width}")
        
        print("✅ Test PASSED: Input has appropriate max-width constraint")

    def test_02_input_flex_properties(self):
        """Test 2: Verify input flex properties prevent expansion"""
        print("\n" + "="*70)
        print("🧪 Test 2: Input Flex Properties")
        print("="*70)
        
        # Find the quantity input
        quantity_input = self.driver.find_element(By.CSS_SELECTOR, "#guest-filter-card input.quantity")
        
        # Get flex properties
        flex_grow = quantity_input.value_of_css_property("flex-grow")
        flex_shrink = quantity_input.value_of_css_property("flex-shrink")
        flex_basis = quantity_input.value_of_css_property("flex-basis")
        
        print(f"  Flex-grow: {flex_grow}")
        print(f"  Flex-shrink: {flex_shrink}")
        print(f"  Flex-basis: {flex_basis}")
        
        # flex-grow should be 0 (doesn't grow)
        self.assertEqual(flex_grow, "0", "Flex-grow should be 0 to prevent expansion")
        print("✅ Flex-grow is 0 (input won't expand)")
        
        print("✅ Test PASSED: Input flex properties prevent unwanted expansion")

    def test_03_no_overlap_with_buttons(self):
        """Test 3: Verify input doesn't overlap with plus/minus buttons"""
        print("\n" + "="*70)
        print("🧪 Test 3: No Overlap with Buttons")
        print("="*70)
        
        # Find elements
        icon_con = self.driver.find_element(By.CSS_SELECTOR, "#guest-filter-card .icon-con")
        quantity_input = self.driver.find_element(By.CSS_SELECTOR, "#guest-filter-card input.quantity")
        
        # Get positions and dimensions
        icon_rect = icon_con.rect
        input_rect = quantity_input.rect
        
        print(f"  Icon-con position: left={icon_rect['x']}, width={icon_rect['width']}")
        print(f"  Input position: left={input_rect['x']}, width={input_rect['width']}")
        
        # Icon-con right edge
        icon_right = icon_rect['x'] + icon_rect['width']
        # Input left edge
        input_left = input_rect['x']
        
        print(f"  Icon-con right edge: {icon_right}")
        print(f"  Input left edge: {input_left}")
        
        # Input should start at or after icon-con ends (no overlap)
        gap = input_left - icon_right
        print(f"  Gap between elements: {gap}px")
        
        self.assertGreaterEqual(gap, -2, f"Input overlaps buttons by {abs(gap)}px")
        
        if gap >= -2:
            print("✅ No overlap detected between input and buttons")
        
        print("✅ Test PASSED: Input and buttons don't overlap")

    def test_04_visual_positioning(self):
        """Test 4: Verify overall visual positioning in header"""
        print("\n" + "="*70)
        print("🧪 Test 4: Visual Positioning in Header")
        print("="*70)
        
        # Find the guest filter card container
        guest_filter = self.driver.find_element(By.ID, "guest-filter-card")
        input_group = guest_filter.find_element(By.CLASS_NAME, "input-group")
        
        # Get dimensions
        filter_width = guest_filter.rect['width']
        group_width = input_group.rect['width']
        
        print(f"  Guest filter card width: {filter_width}px")
        print(f"  Input group width: {group_width}px")
        
        # Input group should fit within the container
        self.assertLessEqual(group_width, filter_width + 5, 
                            "Input group should fit within container")
        
        print("✅ Input group fits within container")
        
        # Check that all child elements are visible
        icon_con = guest_filter.find_element(By.CLASS_NAME, "icon-con")
        quantity_input = guest_filter.find_element(By.CLASS_NAME, "quantity")
        
        self.assertTrue(icon_con.is_displayed(), "Icon-con should be visible")
        self.assertTrue(quantity_input.is_displayed(), "Quantity input should be visible")
        
        print("✅ All elements are visible")
        print("✅ Test PASSED: Visual positioning is correct")

    def test_05_input_actual_width(self):
        """Test 5: Verify input actual rendered width"""
        print("\n" + "="*70)
        print("🧪 Test 5: Input Actual Rendered Width")
        print("="*70)
        
        # Find the quantity input
        quantity_input = self.driver.find_element(By.CSS_SELECTOR, "#guest-filter-card input.quantity")
        
        # Get actual rendered width
        actual_width = quantity_input.rect['width']
        
        print(f"  Actual rendered width: {actual_width}px")
        
        # Should be constrained to reasonable size
        self.assertLessEqual(actual_width, 150, 
                            f"Actual width should be <= 150px, got {actual_width}px")
        self.assertGreaterEqual(actual_width, 100, 
                               f"Actual width should be >= 100px for usability, got {actual_width}px")
        
        print(f"✅ Actual width is within acceptable range: {actual_width}px")
        print("✅ Test PASSED: Input actual width is properly constrained")

def run_tests():
    """Run all tests and generate report"""
    print("\n" + "="*70)
    print("🚀 Guest Input Width Test Suite")
    print("="*70)
    print("Testing width constraints to prevent button overlap")
    print("="*70 + "\n")
    
    # Create test suite
    suite = unittest.TestLoader().loadTestsFromTestCase(TestGuestInputWidth)
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Summary
    print("\n" + "="*70)
    print("📊 Test Results")
    print("="*70)
    
    total_tests = result.testsRun
    passed = total_tests - len(result.failures) - len(result.errors)
    failed = len(result.failures) + len(result.errors)
    
    print(f"Total Tests: {total_tests}")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print("="*70)
    
    if failed == 0:
        print("\n🎉 ALL TESTS PASSED!")
        print("\n✅ Input Width Verified:")
        print("   • Max-width constraint applied")
        print("   • Flex properties prevent expansion")
        print("   • No overlap with buttons")
        print("   • Visual positioning correct")
        print("   • Actual width within bounds")
    
    return result.wasSuccessful()

if __name__ == '__main__':
    success = run_tests()
    sys.exit(0 if success else 1)
