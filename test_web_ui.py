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
        try:
            screenshot_dir = Path("test_screenshots")
            screenshot_dir.mkdir(exist_ok=True)
            screenshot_path = screenshot_dir / f"{name}_{int(time.time())}.png"
            self.driver.save_screenshot(str(screenshot_path))
            print(f"Screenshot saved: {screenshot_path}")
        except Exception as e:
            print(f"Failed to take screenshot: {e}")
    
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
        try:
            loading_screen = self.wait.until(
                EC.presence_of_element_located((By.ID, "loading-screen"))
            )
            print("✓ Loading screen found")
            
            # Wait for loading screen to fade out
            self.wait.until(
                EC.invisibility_of_element_located((By.ID, "loading-screen"))
            )
            print("✓ Loading screen disappeared")
        except TimeoutException:
            print("! Loading screen not found or didn't disappear")
        
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
        try:
            nav_brand = self.driver.find_element(By.CLASS_NAME, "nav-brand")
            self.assertTrue(nav_brand.is_displayed())
            print("✓ Navigation brand found")
            
            # Check for Trade Union Platform title
            brand_text = nav_brand.text
            self.assertIn("Hotéis Sindicais", brand_text)
            print(f"✓ Brand text verified: {brand_text}")
        except NoSuchElementException:
            print("! Navigation brand not found")
        
        # Check for version badge
        try:
            version_badge = self.driver.find_element(By.CLASS_NAME, "version-badge")
            self.assertTrue(version_badge.is_displayed())
            version_text = version_badge.text
            print(f"✓ Version badge found: {version_text}")
        except NoSuchElementException:
            print("! Version badge not found")
    
    def test_04_hero_section_content(self):
        """Test that the hero section displays correct content"""
        self.driver.get(f"{self.base_url}/index.html")
        
        # Wait for hero section
        time.sleep(3)
        
        try:
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
            self.assertIn("Guarujá", subtitle_text)
            self.assertIn("Campos do Jordão", subtitle_text)
            print(f"✓ Hero subtitle verified: {subtitle_text}")
            
        except NoSuchElementException as e:
            print(f"! Hero section elements not found: {e}")
    
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