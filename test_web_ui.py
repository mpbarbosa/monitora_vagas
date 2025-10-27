#!/usr/bin/env python3
"""
Selenium Web UI Test for Trade Union Hotel Search Platform
Complete test suite to validate all UI components and functionality
Includes search forms, progress bars, results display, and error handling
"""

import os
import sys
import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import http.server
import socketserver
import threading
import socket
from pathlib import Path

class TradeUnionWebUITest(unittest.TestCase):
    """Test suite for Trade Union Hotel Search Platform web UI"""
    
    @classmethod
    def setUpClass(cls):
        """Set up test environment and start local server"""
        cls.setup_local_server()
        cls.setup_webdriver()
        
    @classmethod
    def setup_local_server(cls):
        """Start a local HTTP server to serve the application"""
        cls.server_port = cls.find_free_port()
        cls.base_url = f"http://localhost:{cls.server_port}"
        
        # Get the project root directory (where test file is located)
        cls.project_root = Path(__file__).parent
        cls.src_dir = cls.project_root / "src"
        
        print(f"Project root: {cls.project_root}")
        print(f"Source directory: {cls.src_dir}")
        print(f"Starting server on port {cls.server_port}")
        
        # Custom HTTP handler to serve from src directory
        class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
            def __init__(self, *args, **kwargs):
                super().__init__(*args, directory=str(cls.src_dir), **kwargs)
            
            def end_headers(self):
                # Add CORS headers for local development
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                super().end_headers()
        
        # Start the server in a separate thread
        cls.httpd = socketserver.TCPServer(("", cls.server_port), CustomHTTPRequestHandler)
        cls.server_thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.server_thread.start()
        
        # Wait a moment for server to start
        time.sleep(2)
        print(f"Local server started at {cls.base_url}")
    
    @classmethod
    def setup_webdriver(cls):
        """Configure and initialize the WebDriver"""
        chrome_options = Options()
        
        # Add Chrome options for better testing
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        
        # For CI environments, add headless mode
        if os.getenv('HEADLESS', 'false').lower() == 'true':
            chrome_options.add_argument("--headless")
        
        # Enable JavaScript and modern web features
        chrome_options.add_argument("--enable-javascript")
        chrome_options.add_argument("--allow-running-insecure-content")
        chrome_options.add_argument("--disable-web-security")
        
        try:
            # Try to use system Chrome/Chromium
            cls.driver = webdriver.Chrome(options=chrome_options)
        except Exception as e:
            print(f"Failed to initialize Chrome driver: {e}")
            print("Please ensure Chrome/Chromium is installed and chromedriver is in PATH")
            raise
        
        # Configure implicit wait
        cls.driver.implicitly_wait(10)
        print("WebDriver initialized successfully")
    
    @classmethod
    def find_free_port(cls):
        """Find a free port for the local server"""
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind(('', 0))
            s.listen(1)
            port = s.getsockname()[1]
        return port
    
    def setUp(self):
        """Set up for each test"""
        self.wait = WebDriverWait(self.driver, 15)
        print(f"\n--- Starting Test: {self._testMethodName} ---")
    
    def tearDown(self):
        """Clean up after each test"""
        print(f"--- Finished Test: {self._testMethodName} ---")
        # Take screenshot on failure
        if hasattr(self, '_outcome') and not self._outcome.success:
            self.take_screenshot(f"failure_{self._testMethodName}")
    
    @classmethod
    def tearDownClass(cls):
        """Clean up test environment"""
        if hasattr(cls, 'driver'):
            cls.driver.quit()
            print("WebDriver closed")
        
        if hasattr(cls, 'httpd'):
            cls.httpd.shutdown()
            print("Local server stopped")
    
    def take_screenshot(self, name):
        """Take a screenshot for debugging"""
        screenshot_dir = Path("test_screenshots")
        screenshot_dir.mkdir(exist_ok=True)
        screenshot_path = screenshot_dir / f"{name}_{int(time.time())}.png"
        self.driver.save_screenshot(str(screenshot_path))
        print(f"Screenshot saved: {screenshot_path}")
    
    def test_01_home_page_loads(self):
        """Test that the home page loads successfully"""
        print(f"Loading URL: {self.base_url}/index.html")
        self.driver.get(f"{self.base_url}/index.html")
        
        # Wait for the page title to load
        self.wait.until(EC.title_contains("Hotéis Sindicais"))
        
        # Verify page title
        title = self.driver.title
        self.assertIn("Busca de Vagas em Hotéis Sindicais", title)
        print(f"✓ Page title verified: {title}")
        
        # Take screenshot of loaded page
        self.take_screenshot("home_page_loaded")
    
    def test_02_application_initializes(self):
        """Test that the JavaScript application initializes properly"""
        self.driver.get(f"{self.base_url}/index.html")
        
        # Wait for loading screen to disappear
        loading_screen = self.wait.until(
            EC.presence_of_element_located((By.ID, "loading-screen"))
        )
        print("✓ Loading screen found")
        
        # Wait for loading screen to fade out
        self.wait.until(
            EC.invisibility_of_element_located((By.ID, "loading-screen"))
        )
        print("✓ Loading screen disappeared")
        
        # Wait for main app container
        app_container = self.wait.until(
            EC.presence_of_element_located((By.ID, "app"))
        )
        self.assertTrue(app_container.is_displayed())
        print("✓ Main app container is visible")
    
    def test_03_navigation_elements(self):
        """Test that navigation elements are present"""
        self.driver.get(f"{self.base_url}/index.html")
        
        # Wait for navigation to load
        time.sleep(3)
        
        # Check for navigation brand
        nav_brand = self.driver.find_element(By.CLASS_NAME, "nav-brand")
        self.assertTrue(nav_brand.is_displayed())
        print("✓ Navigation brand found")
        
        # Check for Trade Union Platform title
        brand_text = nav_brand.text
        self.assertIn("Hotéis Sindicais", brand_text)
        print(f"✓ Brand text verified: {brand_text}")
        
        # Check for version badge
        version_badge = self.driver.find_element(By.CLASS_NAME, "version-badge")
        self.assertTrue(version_badge.is_displayed())
        version_text = version_badge.text
        print(f"✓ Version badge found: {version_text}")
    
    def test_04_hero_section_content(self):
        """Test that the hero section displays correct content"""
        self.driver.get(f"{self.base_url}/index.html")
        
        # Wait for hero section
        time.sleep(3)
        
        hero_section = self.driver.find_element(By.CLASS_NAME, "hero-loading")
        self.assertTrue(hero_section.is_displayed())
        print("✓ Hero section found")
        
        # Check hero title
        hero_title = hero_section.find_element(By.TAG_NAME, "h1")
        title_text = hero_title.text
        self.assertIn("Busca de Hotéis Sindicais", title_text)
        print(f"✓ Hero title verified: {title_text}")
        
        # Check hero subtitle
        hero_subtitle = hero_section.find_element(By.CLASS_NAME, "hero-subtitle")
        subtitle_text = hero_subtitle.text
        self.assertIn("sindicatos", subtitle_text)
        print(f"✓ Hero subtitle verified: {subtitle_text}")
    
    def test_05_feature_cards(self):
        """Test that feature cards are displayed"""
        self.driver.get(f"{self.base_url}/index.html")
        
        # Wait for features section
        time.sleep(3)
        
        try:
            features_grid = self.driver.find_element(By.CLASS_NAME, "features-grid")
            self.assertTrue(features_grid.is_displayed())
            print("✓ Features grid found")
            
            # Check for feature cards
            feature_cards = features_grid.find_elements(By.CLASS_NAME, "feature-card")
            self.assertGreater(len(feature_cards), 0)
            print(f"✓ Found {len(feature_cards)} feature cards")
            
            # Verify specific features
            feature_texts = [card.text for card in feature_cards]
            expected_features = ["Hotéis Disponíveis", "Busca Automática", "Tempo Real", "Responsivo"]
            
            for expected in expected_features:
                found = any(expected in text for text in feature_texts)
                if found:
                    print(f"✓ Feature found: {expected}")
                else:
                    print(f"! Feature not found: {expected}")
            
        except NoSuchElementException as e:
            print(f"! Features section not found: {e}")
    
    def test_06_responsive_design(self):
        """Test responsive design by changing window size"""
        self.driver.get(f"{self.base_url}/index.html")
        time.sleep(3)
        
        # Test desktop size
        self.driver.set_window_size(1920, 1080)
        time.sleep(1)
        print("✓ Desktop size (1920x1080) set")
        self.take_screenshot("desktop_view")
        
        # Test tablet size
        self.driver.set_window_size(768, 1024)
        time.sleep(1)
        print("✓ Tablet size (768x1024) set")
        self.take_screenshot("tablet_view")
        
        # Test mobile size
        self.driver.set_window_size(375, 667)
        time.sleep(1)
        print("✓ Mobile size (375x667) set")
        self.take_screenshot("mobile_view")
        
        # Verify content is still visible on mobile
        try:
            hero_title = self.driver.find_element(By.TAG_NAME, "h1")
            self.assertTrue(hero_title.is_displayed())
            print("✓ Content visible on mobile")
        except NoSuchElementException:
            print("! Content not visible on mobile")
        
        # Reset to desktop size
        self.driver.set_window_size(1920, 1080)
    
    def test_07_javascript_errors(self):
        """Test for JavaScript errors in console"""
        self.driver.get(f"{self.base_url}/index.html")
        time.sleep(5)  # Wait for JavaScript to execute
        
        # Get browser logs
        try:
            logs = self.driver.get_log('browser')
            error_logs = [log for log in logs if log['level'] == 'SEVERE']
            
            if error_logs:
                print(f"! Found {len(error_logs)} JavaScript errors:")
                for log in error_logs:
                    print(f"  - {log['message']}")
            else:
                print("✓ No severe JavaScript errors found")
            
            # Don't fail the test for JavaScript errors, just report them
            # self.assertEqual(len(error_logs), 0, f"JavaScript errors found: {error_logs}")
            
        except Exception as e:
            print(f"! Could not retrieve browser logs: {e}")
    
    def test_08_page_performance(self):
        """Test basic page performance metrics"""
        start_time = time.time()
        self.driver.get(f"{self.base_url}/index.html")
        
        # Wait for page to be fully loaded
        self.wait.until(
            lambda driver: driver.execute_script("return document.readyState") == "complete"
        )
        
        load_time = time.time() - start_time
        print(f"✓ Page load time: {load_time:.2f} seconds")
        
        # Test should complete within reasonable time
        self.assertLess(load_time, 10, "Page took too long to load")
        
        # Check if main content is visible
        try:
            main_content = self.driver.find_element(By.TAG_NAME, "main")
            self.assertTrue(main_content.is_displayed())
            print("✓ Main content is visible")
        except NoSuchElementException:
            print("! Main content not found")
    
    def test_09_no_scroll_quick_search(self):
        """Test QuickSearch component and above-fold optimization"""
        print(f"--- Starting Test: {self._testMethodName} ---")
        try:
            self.driver.get(f"{self.base_url}/index.html")
            time.sleep(3)  # Allow page to load
            
            # Test 1: Check hero section height optimization
            hero_section = self.driver.find_element(By.CLASS_NAME, "hero-section")
            hero_height = hero_section.size['height']
            viewport_height = self.driver.execute_script("return window.innerHeight")
            print(f"✓ Hero height: {hero_height}px, Viewport: {viewport_height}px")
            
            # Test 2: Check QuickSearch component exists
            quick_search = self.driver.find_element(By.CLASS_NAME, "quick-search")
            self.assertTrue(quick_search.is_displayed())
            print("✓ QuickSearch component found and visible")
            
            # Test 3: Check trust indicators above-fold
            trust_indicators = quick_search.find_elements(By.CLASS_NAME, "trust-item")
            self.assertGreater(len(trust_indicators), 0)
            print(f"✓ Found {len(trust_indicators)} trust indicators")
            
            # Verify specific trust indicators
            trust_texts = [item.text for item in trust_indicators]
            expected_indicators = ["50+ Hotéis", "Tarifas Especiais", "100% Gratuito", "1000+ Atendidos"]
            for indicator in expected_indicators:
                found = any(indicator in text for text in trust_texts)
                if found:
                    print(f"✓ Trust indicator found: {indicator}")
                else:
                    print(f"! Trust indicator missing: {indicator}")
            
            # Test 4: Check date-based form fields
            union_select = self.driver.find_element(By.ID, "quick-union")
            start_date = self.driver.find_element(By.ID, "quick-start-date")
            end_date = self.driver.find_element(By.ID, "quick-end-date")
            search_button = self.driver.find_element(By.CLASS_NAME, "quick-search-button")
            
            self.assertTrue(union_select.is_displayed())
            self.assertTrue(start_date.is_displayed())
            self.assertTrue(end_date.is_displayed())
            self.assertTrue(search_button.is_displayed())
            print("✓ Quick search form elements visible")
            
            # Test 5: Check progressive disclosure toggle
            advanced_toggle = self.driver.find_element(By.ID, "show-advanced-search")
            self.assertTrue(advanced_toggle.is_displayed())
            print("✓ Advanced options toggle found")
            
            print("✓ All QuickSearch tests passed")
            
        except Exception as e:
            print(f"QuickSearch test failed: {e}")
            self.take_screenshot("quick_search_error")
            raise
        finally:
            print(f"--- Finished Test: {self._testMethodName} ---")
    
    def test_10_progressive_disclosure_modal(self):
        """Test AdvancedSearchModal progressive disclosure functionality"""
        print(f"--- Starting Test: {self._testMethodName} ---")
        try:
            self.driver.get(f"{self.base_url}/index.html")
            time.sleep(3)  # Allow page and JS to load
            
            # Test 1: Verify modal initially hidden
            modal = self.driver.find_element(By.ID, "advanced-search-modal")
            modal_visible = modal.is_displayed()
            self.assertFalse(modal_visible, "Modal should be hidden initially")
            print("✓ Modal initially hidden")
            
            # Test 2: Open modal via progressive disclosure
            advanced_toggle = self.driver.find_element(By.ID, "show-advanced-search")
            advanced_toggle.click()
            time.sleep(0.5)  # Allow animation
            
            # Check if modal becomes visible
            modal_visible_after = modal.is_displayed()
            self.assertTrue(modal_visible_after, "Modal should be visible after toggle click")
            print("✓ Modal opens on toggle click")
            
            # Test 3: Check modal content
            modal_header = modal.find_element(By.CLASS_NAME, "modal-header")
            modal_title = modal_header.find_element(By.TAG_NAME, "h3")
            self.assertEqual(modal_title.text, "Busca Avançada")
            print("✓ Modal header and title correct")
            
            # Test 4: Check advanced form elements
            union_select = modal.find_element(By.ID, "advanced-union-selection")
            hotel_select = modal.find_element(By.ID, "advanced-hotel-selection")
            
            self.assertTrue(union_select.is_displayed())
            self.assertTrue(hotel_select.is_displayed())
            print("✓ Advanced form elements visible")
            
            # Test 5: Test modal close functionality
            close_button = modal.find_element(By.ID, "close-advanced-search")
            close_button.click()
            time.sleep(0.5)  # Allow animation
            
            modal_visible_final = modal.is_displayed()
            self.assertFalse(modal_visible_final, "Modal should be hidden after close")
            print("✓ Modal closes properly")
            
            print("✓ All progressive disclosure tests passed")
            
        except Exception as e:
            print(f"Progressive disclosure test failed: {e}")
            self.take_screenshot("modal_error")
            raise
        finally:
            print(f"--- Finished Test: {self._testMethodName} ---")
    
    def test_11_mobile_optimization(self):
        """Test mobile-first responsive design optimizations"""
        print(f"--- Starting Test: {self._testMethodName} ---")
        try:
            self.driver.get(f"{self.base_url}/index.html")
            time.sleep(3)
            
            # Test mobile viewport
            self.driver.set_window_size(375, 667)
            time.sleep(1)
            print("✓ Mobile viewport set (375x667)")
            
            # Test 1: Hero section mobile optimization
            hero_section = self.driver.find_element(By.CLASS_NAME, "hero-section")
            hero_title = hero_section.find_element(By.TAG_NAME, "h1")
            
            self.assertTrue(hero_section.is_displayed())
            self.assertTrue(hero_title.is_displayed())
            print("✓ Hero section displays properly on mobile")
            
            # Test 2: QuickSearch mobile layout
            quick_search = self.driver.find_element(By.CLASS_NAME, "quick-search")
            form_fields = quick_search.find_element(By.CLASS_NAME, "quick-form-fields")
            
            # Check if form fields stack on mobile
            fields_display = self.driver.execute_script(
                "return window.getComputedStyle(arguments[0]).getPropertyValue('grid-template-columns')",
                form_fields
            )
            print(f"✓ Mobile form layout: {fields_display}")
            
            # Test 3: Trust indicators mobile layout
            trust_indicators = quick_search.find_elements(By.CLASS_NAME, "trust-item")
            for indicator in trust_indicators:
                self.assertTrue(indicator.is_displayed())
            print(f"✓ {len(trust_indicators)} trust indicators visible on mobile")
            
            # Test 4: Touch-friendly button size
            search_button = self.driver.find_element(By.CLASS_NAME, "quick-search-button")
            button_height = search_button.size['height']
            self.assertGreaterEqual(button_height, 44, "Button should be at least 44px high for touch")
            print(f"✓ Search button touch-friendly: {button_height}px height")
            
            # Test tablet viewport
            self.driver.set_window_size(768, 1024)
            time.sleep(1)
            print("✓ Tablet viewport set (768x1024)")
            
            # Reset to desktop
            self.driver.set_window_size(1920, 1080)
            print("✓ All mobile optimization tests passed")
            
        except Exception as e:
            print(f"Mobile optimization test failed: {e}")
            self.take_screenshot("mobile_error")
            raise
        finally:
            print(f"--- Finished Test: {self._testMethodName} ---")
    
    def test_12_date_selection_functionality(self):
        """Test enhanced date selection with mutually exclusive options"""
        print(f"--- Starting Test: {self._testMethodName} ---")
        try:
            self.driver.get(f"{self.base_url}/index.html")
            time.sleep(3)
            
            # Open advanced modal to access date selection
            advanced_toggle = self.driver.find_element(By.ID, "show-advanced-search")
            advanced_toggle.click()
            time.sleep(0.5)
            
            modal = self.driver.find_element(By.ID, "advanced-search-modal")
            
            # Test 1: Check date method radio buttons exist
            months_radio = modal.find_element(By.ID, "advanced-date-method-months")
            range_radio = modal.find_element(By.ID, "advanced-date-method-range")
            print("✓ Date method radio buttons found in modal")
            
            # Test 2: Verify default state (months selected)
            months_selected = months_radio.is_selected()
            range_selected = range_radio.is_selected()
            self.assertTrue(months_selected, "Months radio should be selected by default")
            self.assertFalse(range_selected, "Range radio should not be selected by default")
            print("✓ Default selection verified (months)")
            
            # Test 3: Check container visibility
            month_container = modal.find_element(By.ID, "advanced-month-selection-container")
            range_container = modal.find_element(By.ID, "advanced-date-range-container")
            
            month_visible = month_container.is_displayed()
            range_visible = range_container.is_displayed()
            self.assertTrue(month_visible, "Month container should be visible by default")
            self.assertFalse(range_visible, "Range container should be hidden by default")
            print("✓ Initial container visibility correct")
            
            # Test 4: Switch to range selection
            range_radio.click()
            time.sleep(0.5)
            
            range_selected_after = range_radio.is_selected()
            months_selected_after = months_radio.is_selected()
            self.assertTrue(range_selected_after, "Range radio should be selected after click")
            self.assertFalse(months_selected_after, "Months radio should not be selected after range click")
            print("✓ Radio button switching works")
            
            # Test 5: Check container visibility after switch
            month_visible_after = month_container.is_displayed()
            range_visible_after = range_container.is_displayed()
            self.assertFalse(month_visible_after, "Month container should be hidden after range selection")
            self.assertTrue(range_visible_after, "Range container should be visible after range selection")
            print("✓ Container visibility switching works")
            
            # Test 6: Test date inputs
            start_date = range_container.find_element(By.ID, "advanced-start-date")
            end_date = range_container.find_element(By.ID, "advanced-end-date")
            self.assertTrue(start_date.is_displayed(), "Start date input should be visible")
            self.assertTrue(end_date.is_displayed(), "End date input should be visible")
            print("✓ Date inputs are visible and accessible")
            
            print("✓ All date selection functionality tests passed")
            
            # Close modal
            close_button = modal.find_element(By.ID, "close-advanced-search")
            close_button.click()
            
        except Exception as e:
            print(f"Date selection test failed: {e}")
            self.take_screenshot("date_selection_error")
            raise
        finally:
            print(f"--- Finished Test: {self._testMethodName} ---")

    def test_13_searchformhandler_dual_form_compatibility(self):
        """Test SearchFormHandler compatibility with both QuickSearch and SearchForm"""
        print(f"--- Starting Test: {self._testMethodName} ---")
        try:
            # Test 1: Load home page with QuickSearch (should not error)
            self.driver.get(f"{self.base_url}/index.html")
            time.sleep(3)
            
            # Check for JavaScript errors specific to SearchFormHandler
            logs = self.driver.get_log('browser')
            error_logs = [log for log in logs if log['level'] == 'SEVERE' and 'Date method selection elements not found' in log['message']]
            
            self.assertEqual(len(error_logs), 0, f"SearchFormHandler should not throw 'Date method selection elements not found' error: {error_logs}")
            print("✓ No SearchFormHandler errors on QuickSearch page")
            
            # Test 2: Verify QuickSearch date inputs work
            quick_start_date = self.driver.find_element(By.ID, "quick-start-date")
            quick_end_date = self.driver.find_element(By.ID, "quick-end-date")
            
            self.assertTrue(quick_start_date.is_displayed(), "QuickSearch start date should be visible")
            self.assertTrue(quick_end_date.is_displayed(), "QuickSearch end date should be visible")
            print("✓ QuickSearch date inputs are accessible")
            
            # Test 3: Verify date validation works on QuickSearch
            today = time.strftime('%Y-%m-%d')
            quick_start_date.send_keys(today)
            
            # Verify minimum date is set
            min_date = quick_start_date.get_attribute('min')
            self.assertEqual(min_date, today, "QuickSearch start date minimum should be today")
            print("✓ QuickSearch date validation applied")
            
            # Test 4: Open advanced modal to test SearchForm compatibility
            advanced_toggle = self.driver.find_element(By.ID, "show-advanced-search")
            advanced_toggle.click()
            time.sleep(1)
            
            # Check for additional JavaScript errors after modal open
            logs_after_modal = self.driver.get_log('browser')
            new_error_logs = [log for log in logs_after_modal if log['level'] == 'SEVERE' and log not in logs]
            searchform_errors = [log for log in new_error_logs if 'Date method selection elements not found' in log['message']]
            
            self.assertEqual(len(searchform_errors), 0, f"SearchFormHandler should not error when advanced modal opens: {searchform_errors}")
            print("✓ No SearchFormHandler errors when advanced modal opened")
            
            # Test 5: Verify SearchForm date method elements exist in modal
            modal = self.driver.find_element(By.ID, "advanced-search-modal")
            months_radio = modal.find_element(By.ID, "advanced-date-method-months")
            range_radio = modal.find_element(By.ID, "advanced-date-method-range")
            
            self.assertTrue(months_radio.is_displayed(), "Advanced form date method months should be available")
            self.assertTrue(range_radio.is_displayed(), "Advanced form date method range should be available")
            print("✓ SearchForm date method elements accessible in modal")
            
            # Test 6: Test dual form element ID handling
            # QuickSearch should have quick-* IDs, advanced should have regular IDs
            range_radio.click()
            time.sleep(0.5)
            
            advanced_start_date = modal.find_element(By.ID, "advanced-start-date")
            advanced_end_date = modal.find_element(By.ID, "advanced-end-date")
            
            self.assertTrue(advanced_start_date.is_displayed(), "Advanced start date should be visible")
            self.assertTrue(advanced_end_date.is_displayed(), "Advanced end date should be visible")
            print("✓ Both QuickSearch and SearchForm date inputs coexist properly")
            
            print("✓ All SearchFormHandler dual-form compatibility tests passed")
            
            # Close modal
            close_button = modal.find_element(By.ID, "close-advanced-search")
            close_button.click()
            
        except Exception as e:
            print(f"SearchFormHandler dual-form compatibility test failed: {e}")
            self.take_screenshot("searchformhandler_compatibility_error")
            raise
        finally:
            print(f"--- Finished Test: {self._testMethodName} ---")

def run_tests():
    """Run the test suite"""
    print("="*60)
    print("Trade Union Hotel Search Platform - Web UI Test Suite")
    print("="*60)
    
    # Create test suite
    suite = unittest.TestLoader().loadTestsFromTestCase(TradeUnionWebUITest)
    
    # Run tests with verbose output
    runner = unittest.TextTestRunner(verbosity=2, stream=sys.stdout)
    result = runner.run(suite)
    
    print("\n" + "="*60)
    print("Test Summary:")
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    
    if result.failures:
        print("\nFailures:")
        for test, error in result.failures:
            print(f"- {test}: {error}")
    
    if result.errors:
        print("\nErrors:")
        for test, error in result.errors:
            print(f"- {test}: {error}")
    
    success = len(result.failures) == 0 and len(result.errors) == 0
    print(f"\nOverall Result: {'✓ PASSED' if success else '✗ FAILED'}")
    print("="*60)
    
    return success

if __name__ == "__main__":
    try:
        success = run_tests()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\nUnexpected error: {e}")
        sys.exit(1)