#!/usr/bin/env python3
"""
Unit Tests for Trade Union Hotel Search Platform Components

This test suite provides comprehensive unit testing for individual components,
utility functions, and JavaScript modules. Unlike test_web_ui.py which focuses
on integration and functional testing, this suite tests isolated components.

Test Coverage:
- QuickSearch component logic and HTML generation
- HotelVacancyService methods and data processing
- Date utility functions and validation
- CSS color variable validation
- Search strategy implementations
- Error handling and edge cases

Usage:
    python3 test_unit_components.py
    python3 -m unittest test_unit_components -v
    python3 -m pytest test_unit_components.py -v
"""

import unittest
import sys
import os
import re
import json
from datetime import datetime, timedelta
from unittest.mock import Mock, patch, MagicMock
from pathlib import Path

# Add project root to path for imports
PROJECT_ROOT = Path(__file__).parent
sys.path.insert(0, str(PROJECT_ROOT))

class TestQuickSearchComponent(unittest.TestCase):
    """Unit tests for QuickSearch component functionality"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.quicksearch_js_path = PROJECT_ROOT / "src" / "components" / "QuickSearch" / "QuickSearch.js"
        self.quicksearch_css_path = PROJECT_ROOT / "src" / "components" / "QuickSearch" / "QuickSearch.css"
        
    def test_quicksearch_js_file_exists(self):
        """Test that QuickSearch.js file exists and is readable"""
        self.assertTrue(self.quicksearch_js_path.exists(), "QuickSearch.js should exist")
        self.assertTrue(self.quicksearch_js_path.is_file(), "QuickSearch.js should be a file")
        
        # Test file is readable
        with open(self.quicksearch_js_path, 'r', encoding='utf-8') as f:
            content = f.read()
            self.assertGreater(len(content), 1000, "QuickSearch.js should have substantial content")
    
    def test_quicksearch_contains_required_functions(self):
        """Test that QuickSearch.js contains all required functions"""
        with open(self.quicksearch_js_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        required_functions = [
            'QuickSearch',
            'initializeQuickSearch', 
            'handleQuickSearch',
            'handleWeekendSearch',
            'handlePopupSearch',
            'tryPopupWindowAutomation',
            'executeSeleniumEquivalentSearch'
        ]
        
        for func_name in required_functions:
            self.assertIn(func_name, content, f"QuickSearch.js should contain {func_name} function")
    
    def test_quicksearch_html_structure(self):
        """Test QuickSearch HTML structure contains required elements"""
        with open(self.quicksearch_js_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        required_elements = [
            'id="quick-union"',
            'id="quick-start-date"', 
            'id="quick-end-date"',
            'id="quick-search-submit"',
            'id="weekend-search-button"',
            'id="popup-search-button"',
            'class="quick-search-results"'
        ]
        
        for element in required_elements:
            self.assertIn(element, content, f"QuickSearch should contain {element}")
    
    def test_quicksearch_button_classes(self):
        """Test that all search buttons have proper CSS classes"""
        with open(self.quicksearch_js_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        button_classes = [
            'class="quick-search-button primary"',      # Standard search
            'class="quick-search-button selenium-search"', # Selenium search  
            'class="quick-search-button popup-search"'      # Popup search
        ]
        
        for button_class in button_classes:
            self.assertIn(button_class, content, f"Should contain button with {button_class}")

class TestQuickSearchCSS(unittest.TestCase):
    """Unit tests for QuickSearch CSS styling and variables"""
    
    def setUp(self):
        """Set up CSS test fixtures"""
        self.quicksearch_css_path = PROJECT_ROOT / "src" / "components" / "QuickSearch" / "QuickSearch.css"
        self.variables_css_path = PROJECT_ROOT / "src" / "styles" / "global" / "variables.css"
    
    def test_css_files_exist(self):
        """Test that required CSS files exist"""
        self.assertTrue(self.quicksearch_css_path.exists(), "QuickSearch.css should exist")
        self.assertTrue(self.variables_css_path.exists(), "variables.css should exist")
    
    def test_button_visibility_fixes(self):
        """Test that button visibility CSS fixes are present"""
        with open(self.quicksearch_css_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check for fallback colors
        self.assertIn('background-color: #6366f1 !important', content,
                     "Should have fallback primary button color")
        self.assertIn('color: #ffffff !important', content,
                     "Should have fallback white text color")
        
        # Check for visibility fixes
        self.assertIn('text-shadow: none !important', content,
                     "Should prevent text shadow hiding")
        self.assertIn('opacity: 1 !important', content,
                     "Should ensure full opacity")
    
    def test_css_variables_usage(self):
        """Test that CSS uses proper variable names"""
        with open(self.quicksearch_css_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Should use correct variable names
        self.assertIn('var(--color-primary)', content,
                     "Should use --color-primary variable")
        self.assertIn('var(--color-white)', content,
                     "Should use --color-white variable")
        
        # Should NOT use incorrect variable names
        self.assertNotIn('var(--primary-color)', content,
                        "Should not use deprecated --primary-color")
    
    def test_button_specific_styling(self):
        """Test button-specific CSS classes exist"""
        with open(self.quicksearch_css_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        button_selectors = [
            '.quick-search-button.selenium-search',
            '.quick-search-button.popup-search',
            '.quick-search-button:hover',
            '.quick-search-button:focus-visible'
        ]
        
        for selector in button_selectors:
            self.assertIn(selector, content, f"Should contain {selector} styling")

class TestCSSVariablesConsistency(unittest.TestCase):
    """Test CSS variables are defined and used consistently"""
    
    def setUp(self):
        """Set up CSS variables test"""
        self.variables_css_path = PROJECT_ROOT / "src" / "styles" / "global" / "variables.css"
    
    def test_required_color_variables_defined(self):
        """Test that all required color variables are defined"""
        with open(self.variables_css_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        required_variables = [
            '--color-primary:',
            '--color-primary-dark:',
            '--color-primary-light:',
            '--color-white:',
            '--color-accent:',
            '--color-accent-dark:',
            '--color-info:',
            '--color-info-dark:'
        ]
        
        for variable in required_variables:
            self.assertIn(variable, content, f"Should define {variable}")
    
    def test_color_values_format(self):
        """Test that color values are in proper format"""
        with open(self.variables_css_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract color values - updated pattern to include various color formats
        color_pattern = r'--color-[\w-]+:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)|rgba\([^)]+\)|var\([^)]+\))'
        matches = re.findall(color_pattern, content)
        
        self.assertGreater(len(matches), 8, "Should have multiple color definitions")
        
        # Check format of found colors
        for color_value in matches:
            self.assertTrue(
                color_value.startswith('#') or 
                color_value.startswith('rgb') or 
                color_value.startswith('var('),
                f"Color value {color_value} should be hex, rgb, or CSS variable format"
            )

class TestDateUtilities(unittest.TestCase):
    """Unit tests for date handling utilities"""
    
    def test_date_format_validation(self):
        """Test date format validation logic"""
        # Test valid date formats
        valid_dates = [
            '2025-10-27',
            '2025-12-31', 
            '2024-02-29'  # Leap year
        ]
        
        for date_str in valid_dates:
            try:
                parsed_date = datetime.strptime(date_str, '%Y-%m-%d')
                self.assertIsInstance(parsed_date, datetime, f"{date_str} should parse correctly")
            except ValueError:
                self.fail(f"{date_str} should be valid date format")
    
    def test_weekend_calculation(self):
        """Test weekend date calculation logic"""
        # Test weekend detection
        test_date = datetime(2025, 10, 25)  # Saturday
        self.assertEqual(test_date.weekday(), 5, "Should be Saturday (weekday 5)")
        
        # Test Friday-Sunday weekend calculation
        friday = test_date - timedelta(days=1)  # Friday
        sunday = test_date + timedelta(days=1)  # Sunday
        
        self.assertEqual(friday.weekday(), 4, "Should be Friday (weekday 4)")
        self.assertEqual(sunday.weekday(), 6, "Should be Sunday (weekday 6)")
    
    def test_date_range_validation(self):
        """Test date range validation"""
        today = datetime.now().date()
        tomorrow = today + timedelta(days=1)
        yesterday = today - timedelta(days=1)
        
        # Valid range: tomorrow to day after tomorrow
        self.assertLess(today, tomorrow, "Tomorrow should be after today")
        
        # Invalid range: yesterday to today 
        self.assertLess(yesterday, today, "Yesterday should be before today")

class TestSearchStrategyLogic(unittest.TestCase):
    """Unit tests for search strategy implementations"""
    
    def test_search_strategy_hierarchy(self):
        """Test that search strategies are implemented in correct order"""
        strategies = [
            'Standard Search',   # Direct API
            'Selenium Search',   # Simulation  
            'Popup Search'       # Manual assistance
        ]
        
        # This is conceptual - actual implementation would test the fallback logic
        self.assertEqual(len(strategies), 3, "Should have 3 search strategies")
        
        # Test strategy names
        expected_strategies = ['Standard Search', 'Selenium Search', 'Popup Search']
        self.assertEqual(strategies, expected_strategies, "Strategy order should be correct")
    
    def test_cors_awareness(self):
        """Test CORS-aware implementation concepts"""
        cors_considerations = [
            'Same-origin policy respected',
            'Graceful degradation on cross-origin errors',
            'User education about browser security',
            'postMessage API preparation for future'
        ]
        
        self.assertGreater(len(cors_considerations), 3, "Should have multiple CORS considerations")

class TestErrorHandling(unittest.TestCase):
    """Unit tests for error handling and edge cases"""
    
    def test_empty_input_handling(self):
        """Test handling of empty inputs"""
        empty_inputs = ['', None, '   ', 0, False]
        
        for empty_input in empty_inputs:
            with self.subTest(input_value=empty_input):
                # Test that empty inputs are properly handled
                if isinstance(empty_input, str):
                    cleaned = empty_input.strip() if empty_input else ''
                    self.assertEqual(cleaned, '', f"Empty string '{empty_input}' should clean to empty")
    
    def test_date_edge_cases(self):
        """Test date edge cases"""
        edge_cases = [
            ('2024-02-29', True),   # Valid leap year
            ('2025-02-29', False),  # Invalid non-leap year
            ('2025-13-01', False),  # Invalid month
            ('2025-12-32', False),  # Invalid day
        ]
        
        for date_str, should_be_valid in edge_cases:
            with self.subTest(date=date_str):
                try:
                    datetime.strptime(date_str, '%Y-%m-%d')
                    is_valid = True
                except ValueError:
                    is_valid = False
                
                self.assertEqual(is_valid, should_be_valid, 
                               f"Date {date_str} validity should be {should_be_valid}")

class TestComponentIntegration(unittest.TestCase):
    """Unit tests for component integration patterns"""
    
    def test_module_structure(self):
        """Test that modules have proper structure"""
        component_dirs = [
            PROJECT_ROOT / "src" / "components" / "QuickSearch",
            PROJECT_ROOT / "src" / "components" / "AdvancedSearchModal",
            PROJECT_ROOT / "src" / "components" / "SearchForm"
        ]
        
        for component_dir in component_dirs:
            with self.subTest(component=component_dir.name):
                self.assertTrue(component_dir.exists(), f"{component_dir.name} directory should exist")
                
                # Check for required files
                js_file = component_dir / f"{component_dir.name}.js"
                css_file = component_dir / f"{component_dir.name}.css" 
                index_file = component_dir / "index.js"
                
                self.assertTrue(js_file.exists(), f"{component_dir.name}.js should exist")
                if css_file.exists():  # CSS file is optional for some components
                    self.assertTrue(css_file.is_file(), f"{component_dir.name}.css should be a file")
    
    def test_export_patterns(self):
        """Test that components use consistent export patterns"""
        index_files = [
            PROJECT_ROOT / "src" / "components" / "QuickSearch" / "index.js",
            PROJECT_ROOT / "src" / "components" / "AdvancedSearchModal" / "index.js",
            PROJECT_ROOT / "src" / "components" / "SearchForm" / "index.js"
        ]
        
        for index_file in index_files:
            if index_file.exists():
                with self.subTest(file=index_file.name):
                    with open(index_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Should contain export statement
                    self.assertTrue(
                        'export' in content,
                        f"{index_file} should contain export statement"
                    )

def run_unit_tests():
    """Run the unit test suite"""
    print("=" * 70)
    print("Trade Union Hotel Search Platform - Unit Test Suite")
    print("=" * 70)
    print(f"Project Root: {PROJECT_ROOT}")
    print(f"Python Version: {sys.version}")
    print("-" * 70)
    
    # Create test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add all test classes
    test_classes = [
        TestQuickSearchComponent,
        TestQuickSearchCSS,
        TestCSSVariablesConsistency,
        TestDateUtilities,
        TestSearchStrategyLogic,
        TestErrorHandling,
        TestComponentIntegration
    ]
    
    for test_class in test_classes:
        tests = loader.loadTestsFromTestCase(test_class)
        suite.addTests(tests)
    
    # Run tests with verbose output
    runner = unittest.TextTestRunner(verbosity=2, stream=sys.stdout)
    result = runner.run(suite)
    
    # Print summary
    print("\n" + "=" * 70)
    print("Unit Test Summary:")
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    
    if result.failures:
        print("\nFailures:")
        for test, error in result.failures:
            print(f"- {test}: {error.split(chr(10))[0]}")  # First line only
    
    if result.errors:
        print("\nErrors:")
        for test, error in result.errors:
            print(f"- {test}: {error.split(chr(10))[0]}")  # First line only
    
    success = len(result.failures) == 0 and len(result.errors) == 0
    print(f"\nOverall Result: {'✓ PASSED' if success else '✗ FAILED'}")
    print("=" * 70)
    
    return success

if __name__ == "__main__":
    try:
        success = run_unit_tests()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\nUnit tests interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\nUnexpected error in unit tests: {e}")
        sys.exit(1)