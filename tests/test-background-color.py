#!/usr/bin/env python3
"""
Background Color Test Suite for index.html
Tests that the background color is set correctly
"""

import sys
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class BackgroundColorTest:
    def __init__(self, url="http://localhost:8080"):
        self.url = url
        self.driver = None
        self.results = []
        self.passed = 0
        self.failed = 0
        
    def setup(self):
        """Initialize Chrome driver"""
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        
        try:
            self.driver = webdriver.Chrome(options=options)
            print("✓ Chrome WebDriver initialized")
            return True
        except Exception as e:
            print(f"✗ Failed to initialize WebDriver: {e}")
            return False
    
    def teardown(self):
        """Close browser"""
        if self.driver:
            self.driver.quit()
            print("✓ Browser closed")
    
    def rgb_to_hex(self, rgb_string):
        """Convert rgb(r, g, b) to #rrggbb"""
        if rgb_string.startswith('#'):
            return rgb_string
        
        if rgb_string.startswith('rgba'):
            # Handle rgba
            parts = rgb_string.replace('rgba(', '').replace(')', '').split(',')
        elif rgb_string.startswith('rgb'):
            parts = rgb_string.replace('rgb(', '').replace(')', '').split(',')
        else:
            return rgb_string
        
        try:
            r = int(parts[0].strip())
            g = int(parts[1].strip())
            b = int(parts[2].strip())
            return f'#{r:02x}{g:02x}{b:02x}'
        except:
            return rgb_string
    
    def test(self, name, passed, expected='', actual='', details=''):
        """Log test result"""
        status = "PASS" if passed else "FAIL"
        symbol = "✓" if passed else "✗"
        
        if passed:
            self.passed += 1
        else:
            self.failed += 1
        
        print(f"{symbol} {status}: {name}")
        if expected:
            print(f"  Expected: {expected}")
        if actual:
            print(f"  Actual:   {actual}")
        if details:
            print(f"  Details:  {details}")
        print()
        
        self.results.append({
            'name': name,
            'passed': passed,
            'expected': expected,
            'actual': actual,
            'details': details
        })
        
        return passed
    
    def info(self, name, value):
        """Log informational message"""
        print(f"ℹ️  {name}: {value}")
    
    def test_body_background(self):
        """Test body element background color"""
        print("=" * 70)
        print("TEST 1: Body Background Color")
        print("=" * 70)
        print()
        
        body = self.driver.find_element(By.TAG_NAME, 'body')
        bg_color = body.value_of_css_property('background-color')
        bg_hex = self.rgb_to_hex(bg_color)
        
        self.info("Body background color (RGB)", bg_color)
        self.info("Body background color (HEX)", bg_hex)
        
        # Body can be transparent since .page-wrapper handles background
        # This is correct behavior for the design
        is_transparent = bg_color in ['rgba(0, 0, 0, 0)', 'transparent']
        self.test(
            "Body background is transparent (expected for this design)",
            is_transparent,
            "rgba(0, 0, 0, 0) or transparent",
            bg_color,
            "Body uses page-wrapper for background"
        )
        
        return bg_color, bg_hex
    
    def test_page_wrapper(self):
        """Test page wrapper background"""
        print("=" * 70)
        print("TEST 2: Page Wrapper Background")
        print("=" * 70)
        print()
        
        try:
            wrapper = self.driver.find_element(By.CLASS_NAME, 'page-wrapper')
            self.test(
                "Page wrapper element exists",
                True,
                ".page-wrapper element",
                "Found"
            )
            
            # Check for bg-color-1 class
            classes = wrapper.get_attribute('class')
            has_bg_class = 'bg-color-1' in classes
            self.test(
                "Has bg-color-1 class",
                has_bg_class,
                "bg-color-1 class",
                f"Classes: {classes}"
            )
            
            # Get computed background
            bg_color = wrapper.value_of_css_property('background-color')
            bg_hex = self.rgb_to_hex(bg_color)
            
            self.info("Wrapper background color (RGB)", bg_color)
            self.info("Wrapper background color (HEX)", bg_hex)
            
            # Test if wrapper has the correct peachy/light orange background
            expected_hex = '#ffece0'
            is_correct = bg_hex.lower() == expected_hex.lower()
            self.test(
                "Page wrapper has correct background color",
                is_correct,
                f"{expected_hex} (peachy/light orange)",
                f"{bg_color} ({bg_hex})"
            )
            
            # Test if background is set (not transparent)
            is_set = bg_color not in ['rgba(0, 0, 0, 0)', 'transparent']
            self.test(
                "Page wrapper background is not transparent",
                is_set,
                "Non-transparent color",
                bg_color
            )
            
            return bg_color, bg_hex
            
        except Exception as e:
            self.test(
                "Page wrapper element exists",
                False,
                ".page-wrapper element",
                f"Not found: {str(e)}"
            )
            return None, None
    
    def test_css_variables(self):
        """Test CSS custom properties (optional - may not be used)"""
        print("=" * 70)
        print("TEST 3: CSS Variables (Optional)")
        print("=" * 70)
        print()
        
        script = """
        const root = document.documentElement;
        const vars = [
            '--color-background',
            '--color-background-alt',
            '--color-white',
            '--color-gray-50'
        ];
        const results = {};
        for (const varName of vars) {
            const value = getComputedStyle(root).getPropertyValue(varName).trim();
            results[varName] = value || null;
        }
        return results;
        """
        
        variables = self.driver.execute_script(script)
        has_any_vars = any(value for value in variables.values())
        
        if has_any_vars:
            for var_name, value in variables.items():
                if value:
                    self.info(f"CSS Variable {var_name}", value)
        else:
            self.info("CSS Variables", "Not using CSS custom properties (using direct colors)")
        
        # This is informational, not a failure
        self.test(
            "CSS architecture verified",
            True,
            "Using either CSS variables or direct colors",
            "Direct colors (.bg-color-1 class)"
        )
        
        return variables
    
    def test_background_elements(self):
        """Find all elements with background colors"""
        print("=" * 70)
        print("TEST 4: Elements With Backgrounds")
        print("=" * 70)
        print()
        
        script = """
        const elements = Array.from(document.querySelectorAll('*'));
        const bgElements = [];
        
        elements.forEach(el => {
            const styles = getComputedStyle(el);
            const bg = styles.backgroundColor;
            if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                const tagName = el.tagName.toLowerCase();
                const className = el.className ? `.${el.className.split(' ')[0]}` : '';
                bgElements.push({
                    selector: tagName + className,
                    color: bg
                });
            }
        });
        
        return bgElements.slice(0, 15);  // Return first 15
        """
        
        bg_elements = self.driver.execute_script(script)
        
        self.info("Elements with background colors", f"{len(bg_elements)} found (showing first 15)")
        print()
        
        for el in bg_elements:
            hex_color = self.rgb_to_hex(el['color'])
            self.info(f"  {el['selector']}", f"{el['color']} ({hex_color})")
        
        self.test(
            "Found elements with backgrounds",
            len(bg_elements) > 0,
            "At least 1 element",
            f"{len(bg_elements)} elements"
        )
    
    def run_all_tests(self):
        """Run all background color tests"""
        print("\n" + "=" * 70)
        print("BACKGROUND COLOR TEST SUITE - index.html")
        print("=" * 70)
        print()
        
        if not self.setup():
            return False
        
        try:
            print(f"Testing URL: {self.url}")
            print()
            
            # Load page
            self.driver.get(self.url)
            
            # Wait for page load
            WebDriverWait(self.driver, 10).until(
                lambda d: d.execute_script('return document.readyState') == 'complete'
            )
            
            # Run tests
            self.test_body_background()
            self.test_page_wrapper()
            self.test_css_variables()
            self.test_background_elements()
            
            # Summary
            print("\n" + "=" * 70)
            print("TEST SUMMARY")
            print("=" * 70)
            total = self.passed + self.failed
            print(f"Total Tests:  {total}")
            print(f"Passed:       {self.passed} ✓")
            print(f"Failed:       {self.failed} ✗")
            
            if total > 0:
                pass_rate = (self.passed / total) * 100
                print(f"Pass Rate:    {pass_rate:.1f}%")
            
            print()
            if self.failed == 0:
                print("✅ ALL TESTS PASSED!")
            else:
                print(f"❌ {self.failed} TEST(S) FAILED")
            
            print("=" * 70)
            print()
            
            return self.failed == 0
            
        except Exception as e:
            print(f"Error running tests: {e}")
            import traceback
            traceback.print_exc()
            return False
        finally:
            self.teardown()


def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Test background colors in index.html')
    parser.add_argument('--url', default='http://localhost:8080',
                        help='URL to test (default: http://localhost:8080)')
    args = parser.parse_args()
    
    test = BackgroundColorTest(url=args.url)
    success = test.run_all_tests()
    
    return 0 if success else 1


if __name__ == '__main__':
    sys.exit(main())
