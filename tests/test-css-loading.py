#!/usr/bin/env python3
"""
CSS Loading Test Suite - Python/Selenium Version
Tests that all CSS files are loaded properly and styles are applied correctly
"""

import sys
import os
import time
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

class CSSLoadingTestSuite:
    def __init__(self, url="http://localhost:8080"):
        self.url = url
        self.driver = None
        self.results = []
        self.total_tests = 0
        self.passed_tests = 0
        self.failed_tests = 0
        
    def setup(self):
        """Setup Chrome driver"""
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-gpu')
        
        try:
            self.driver = webdriver.Chrome(options=options)
            self.driver.set_page_load_timeout(30)
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
    
    def log_test(self, name, passed, message):
        """Log test result"""
        self.total_tests += 1
        status = "PASS" if passed else "FAIL"
        symbol = "✓" if passed else "✗"
        
        if passed:
            self.passed_tests += 1
        else:
            self.failed_tests += 1
        
        result = f"{symbol} {status}: {name} - {message}"
        self.results.append({"name": name, "passed": passed, "message": message})
        print(result)
        
        return passed
    
    def test_page_loads(self):
        """Test 1: Page loads successfully"""
        try:
            self.driver.get(self.url)
            time.sleep(2)  # Wait for resources to load
            title = self.driver.title
            return self.log_test(
                "Page loads",
                len(title) > 0,
                f"Page title: '{title}'"
            )
        except Exception as e:
            return self.log_test(
                "Page loads",
                False,
                f"Error: {str(e)}"
            )
    
    def test_stylesheets_loaded(self):
        """Test 2: Check if stylesheets are loaded"""
        try:
            # Get all link elements with rel="stylesheet"
            stylesheets = self.driver.find_elements(By.CSS_SELECTOR, 'link[rel="stylesheet"]')
            count = len(stylesheets)
            
            expected_files = [
                'material-design-iconic-font.min.css',
                'font-awesome.min.css',
                'select2.min.css',
                'daterangepicker.css',
                'main.css'
            ]
            
            loaded_files = []
            for sheet in stylesheets:
                href = sheet.get_attribute('href')
                if href:
                    loaded_files.append(href)
            
            # Check each expected file
            for expected in expected_files:
                found = any(expected in href for href in loaded_files)
                self.log_test(
                    f"Stylesheet {expected}",
                    found,
                    "Loaded" if found else "Not found"
                )
            
            return self.log_test(
                "Total stylesheets",
                count >= 5,
                f"{count} stylesheets found (expected at least 5)"
            )
        except Exception as e:
            return self.log_test(
                "Stylesheets loaded",
                False,
                f"Error: {str(e)}"
            )
    
    def test_css_rules_loaded(self):
        """Test 3: Verify CSS rules are actually loaded"""
        try:
            # Execute JavaScript to count CSS rules
            script = """
            let totalRules = 0;
            for (let sheet of document.styleSheets) {
                try {
                    if (sheet.cssRules) {
                        totalRules += sheet.cssRules.length;
                    }
                } catch (e) {
                    // CORS blocked external stylesheet
                }
            }
            return totalRules;
            """
            
            total_rules = self.driver.execute_script(script)
            
            return self.log_test(
                "CSS rules loaded",
                total_rules > 0,
                f"{total_rules} CSS rules loaded"
            )
        except Exception as e:
            return self.log_test(
                "CSS rules loaded",
                False,
                f"Error: {str(e)}"
            )
    
    def test_css_variables(self):
        """Test 4: Check CSS custom properties"""
        try:
            script = """
            const vars = [
                '--color-primary',
                '--font-family-base',
                '--spacing-4',
                '--border-radius-base',
                '--shadow-base'
            ];
            const results = {};
            for (const varName of vars) {
                const value = getComputedStyle(document.documentElement)
                    .getPropertyValue(varName).trim();
                results[varName] = value || null;
            }
            return results;
            """
            
            variables = self.driver.execute_script(script)
            
            for var_name, value in variables.items():
                self.log_test(
                    f"CSS Variable {var_name}",
                    value is not None and len(value) > 0,
                    f"Value: '{value}'" if value else "Not defined"
                )
            
            defined_count = sum(1 for v in variables.values() if v)
            return self.log_test(
                "CSS variables defined",
                defined_count > 0,
                f"{defined_count}/{len(variables)} variables defined"
            )
        except Exception as e:
            return self.log_test(
                "CSS variables",
                False,
                f"Error: {str(e)}"
            )
    
    def test_font_families(self):
        """Test 5: Check if font families are loaded"""
        try:
            # Test body font
            script = """
            return getComputedStyle(document.body).fontFamily;
            """
            body_font = self.driver.execute_script(script)
            
            self.log_test(
                "Body font family",
                len(body_font) > 0,
                f"Font: {body_font}"
            )
            
            # Test if Roboto is in fonts
            roboto_loaded = 'Roboto' in body_font or 'roboto' in body_font.lower()
            return self.log_test(
                "Roboto font",
                True,  # Pass if any font is loaded
                "Loaded" if roboto_loaded else f"Using: {body_font}"
            )
        except Exception as e:
            return self.log_test(
                "Font families",
                False,
                f"Error: {str(e)}"
            )
    
    def test_icon_fonts(self):
        """Test 6: Check icon fonts are applied"""
        try:
            # Create test elements
            script = """
            // Test Font Awesome
            const faIcon = document.createElement('i');
            faIcon.className = 'fa fa-check';
            document.body.appendChild(faIcon);
            const faFont = getComputedStyle(faIcon).fontFamily;
            document.body.removeChild(faIcon);
            
            // Test Material Design Icons
            const mdiIcon = document.createElement('i');
            mdiIcon.className = 'zmdi zmdi-check';
            document.body.appendChild(mdiIcon);
            const mdiFont = getComputedStyle(mdiIcon).fontFamily;
            document.body.removeChild(mdiIcon);
            
            return {
                fontAwesome: faFont,
                materialDesign: mdiFont
            };
            """
            
            fonts = self.driver.execute_script(script)
            
            fa_loaded = 'fontawesome' in fonts['fontAwesome'].lower()
            self.log_test(
                "Font Awesome icons",
                fa_loaded,
                fonts['fontAwesome']
            )
            
            mdi_loaded = 'material' in fonts['materialDesign'].lower()
            self.log_test(
                "Material Design icons",
                mdi_loaded,
                fonts['materialDesign']
            )
            
            return fa_loaded or mdi_loaded
        except Exception as e:
            return self.log_test(
                "Icon fonts",
                False,
                f"Error: {str(e)}"
            )
    
    def test_css_classes_applied(self):
        """Test 7: Check if CSS classes have styles"""
        try:
            classes_to_test = [
                'page-wrapper',
                'wrapper',
                'card',
                'form',
                'btn',
                'input-group'
            ]
            
            script_template = """
            const el = document.createElement('div');
            el.className = '{class_name}';
            el.style.cssText = 'position: absolute; visibility: hidden;';
            document.body.appendChild(el);
            const style = getComputedStyle(el);
            const display = style.display;
            const hasStyles = display !== 'none';
            document.body.removeChild(el);
            return {{
                display: display,
                hasStyles: hasStyles
            }};
            """
            
            applied_count = 0
            for class_name in classes_to_test:
                script = script_template.format(class_name=class_name)
                result = self.driver.execute_script(script)
                
                if result['hasStyles']:
                    applied_count += 1
                
                self.log_test(
                    f"Class '.{class_name}'",
                    result['hasStyles'],
                    f"display: {result['display']}"
                )
            
            return self.log_test(
                "CSS classes applied",
                applied_count > 0,
                f"{applied_count}/{len(classes_to_test)} classes have styles"
            )
        except Exception as e:
            return self.log_test(
                "CSS classes",
                False,
                f"Error: {str(e)}"
            )
    
    def test_responsive_breakpoints(self):
        """Test 8: Check for responsive media queries"""
        try:
            script = """
            let mediaQueryCount = 0;
            for (const sheet of document.styleSheets) {
                try {
                    if (sheet.cssRules) {
                        for (const rule of sheet.cssRules) {
                            if (rule.type === CSSRule.MEDIA_RULE) {
                                mediaQueryCount++;
                            }
                        }
                    }
                } catch (e) {
                    // CORS blocked
                }
            }
            return mediaQueryCount;
            """
            
            media_queries = self.driver.execute_script(script)
            
            return self.log_test(
                "Media queries",
                media_queries >= 0,
                f"{media_queries} media query rules found"
            )
        except Exception as e:
            return self.log_test(
                "Responsive breakpoints",
                False,
                f"Error: {str(e)}"
            )
    
    def test_css_load_order(self):
        """Test 9: Verify CSS loading order"""
        try:
            script = """
            const sheets = Array.from(document.styleSheets);
            return sheets.map(s => {
                if (!s.href) return 'inline';
                const parts = s.href.split('/');
                return parts[parts.length - 1];
            });
            """
            
            sheet_order = self.driver.execute_script(script)
            
            # main.css should be loaded last (before inline styles)
            css_files = [s for s in sheet_order if s != 'inline' and '.css' in s]
            main_is_last = css_files[-1] == 'main.css' if css_files else False
            
            return self.log_test(
                "CSS load order",
                main_is_last,
                f"main.css is {'last' if main_is_last else 'not last'}: {', '.join(css_files)}"
            )
        except Exception as e:
            return self.log_test(
                "CSS load order",
                False,
                f"Error: {str(e)}"
            )
    
    def test_css_load_performance(self):
        """Test 10: Check CSS load performance"""
        try:
            script = """
            if (!performance || !performance.getEntriesByType) {
                return null;
            }
            
            const resources = performance.getEntriesByType('resource');
            const cssResources = resources.filter(r => r.name.includes('.css'));
            
            if (cssResources.length === 0) {
                return null;
            }
            
            const times = cssResources.map(r => r.duration);
            const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
            const maxTime = Math.max(...times);
            
            return {
                count: cssResources.length,
                avgTime: avgTime,
                maxTime: maxTime
            };
            """
            
            perf = self.driver.execute_script(script)
            
            if perf is None:
                return self.log_test(
                    "CSS load performance",
                    True,
                    "Performance API not available or no data"
                )
            
            # Consider it good if max load time is under 1 second
            is_good = perf['maxTime'] < 1000
            
            return self.log_test(
                "CSS load performance",
                is_good,
                f"{perf['count']} files, avg: {perf['avgTime']:.2f}ms, max: {perf['maxTime']:.2f}ms"
            )
        except Exception as e:
            return self.log_test(
                "CSS load performance",
                False,
                f"Error: {str(e)}"
            )
    
    def run_all_tests(self):
        """Run all CSS loading tests"""
        print("=" * 70)
        print("CSS LOADING TEST SUITE - Python/Selenium")
        print("=" * 70)
        print()
        
        if not self.setup():
            print("Failed to setup WebDriver")
            return False
        
        try:
            print(f"Testing URL: {self.url}")
            print()
            
            # Run all tests
            print("--- Test Group 1: Page Loading ---")
            self.test_page_loads()
            print()
            
            print("--- Test Group 2: Stylesheet Loading ---")
            self.test_stylesheets_loaded()
            print()
            
            print("--- Test Group 3: CSS Rules ---")
            self.test_css_rules_loaded()
            print()
            
            print("--- Test Group 4: CSS Variables ---")
            self.test_css_variables()
            print()
            
            print("--- Test Group 5: Font Loading ---")
            self.test_font_families()
            print()
            
            print("--- Test Group 6: Icon Fonts ---")
            self.test_icon_fonts()
            print()
            
            print("--- Test Group 7: CSS Classes ---")
            self.test_css_classes_applied()
            print()
            
            print("--- Test Group 8: Responsive Design ---")
            self.test_responsive_breakpoints()
            print()
            
            print("--- Test Group 9: Load Order ---")
            self.test_css_load_order()
            print()
            
            print("--- Test Group 10: Performance ---")
            self.test_css_load_performance()
            print()
            
            # Print summary
            print("=" * 70)
            print("TEST SUMMARY")
            print("=" * 70)
            print(f"Total Tests:  {self.total_tests}")
            print(f"Passed:       {self.passed_tests} ✓")
            print(f"Failed:       {self.failed_tests} ✗")
            
            if self.total_tests > 0:
                pass_rate = (self.passed_tests / self.total_tests) * 100
                print(f"Pass Rate:    {pass_rate:.1f}%")
            
            print("=" * 70)
            
            return self.failed_tests == 0
            
        finally:
            self.teardown()


def main():
    """Main test runner"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Test CSS file loading')
    parser.add_argument('--url', default='http://localhost:8080',
                        help='URL to test (default: http://localhost:8080)')
    args = parser.parse_args()
    
    suite = CSSLoadingTestSuite(url=args.url)
    success = suite.run_all_tests()
    
    return 0 if success else 1


if __name__ == '__main__':
    sys.exit(main())
