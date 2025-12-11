#!/usr/bin/env python3
"""
Test Suite for FR-004B: Client-Side Guest Number Filtering
Tests the parsing, filtering, and display of vacancy results based on guest count
"""

import sys
import time
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import http.server
import socketserver
import threading
import socket

class GuestNumberFilterTest:
    """Test suite for Guest Number Filtering (FR-004B)"""
    
    def __init__(self):
        self.setup_local_server()
        self.setup_webdriver()
        self.test_results = []
    
    def setup_local_server(self):
        """Start a local HTTP server"""
        self.server_port = self.find_free_port()
        self.base_url = f"http://localhost:{self.server_port}"
        
        project_root = Path(__file__).parent.parent
        public_dir = project_root / "public"
        
        print(f"Starting server on port {self.server_port}")
        print(f"Serving from: {public_dir}")
        
        class Handler(http.server.SimpleHTTPRequestHandler):
            def __init__(self, *args, **kwargs):
                super().__init__(*args, directory=str(public_dir), **kwargs)
            
            def log_message(self, format, *args):
                pass  # Suppress server logs
        
        self.httpd = socketserver.TCPServer(("", self.server_port), Handler)
        self.server_thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)
        self.server_thread.start()
        time.sleep(1)
        print(f"✓ Server started at {self.base_url}\n")
    
    def setup_webdriver(self):
        """Configure Chrome WebDriver"""
        chrome_options = Options()
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--headless")
        
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.implicitly_wait(5)
        self.wait = WebDriverWait(self.driver, 10)
    
    def find_free_port(self):
        """Find an available port"""
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind(('', 0))
            s.listen(1)
            port = s.getsockname()[1]
        return port
    
    def log_test(self, name, passed, message=""):
        """Log test result"""
        status = "✅ PASS" if passed else "❌ FAIL"
        self.test_results.append((name, passed, message))
        print(f"{status}: {name}")
        if message:
            print(f"    {message}")
    
    def create_mock_results(self):
        """Create mock hotel results with various capacity values"""
        script = """
        // Create mock hotel cards for testing
        const container = document.getElementById('hotels-cards-container');
        container.innerHTML = '';
        
        const mockHotels = [
            {
                name: 'Hotel A',
                vacancies: [
                    'ANDRADE (até 2 pessoas)13/12 - 15/12 (2 dias livres) - 24 Quarto(s)',
                    'Suite (até 2 pessoas)15/12 - 17/12 (2 dias livres) - 10 Quarto(s)'
                ]
            },
            {
                name: 'Hotel B',
                vacancies: [
                    'PRAIA GRANDE (até 3 pessoas)13/12 - 15/12 - 15 Quarto(s)',
                    'Standard (até 3 pessoas)16/12 - 18/12 - 8 Quarto(s)'
                ]
            },
            {
                name: 'Hotel C',
                vacancies: [
                    'GUARUJÁ (até 4 pessoas)14/12 - 16/12 - 20 Quarto(s)'
                ]
            },
            {
                name: 'Hotel D',
                vacancies: [
                    'Room without capacity info 14/12 - 16/12 - 5 Quarto(s)'
                ]
            }
        ];
        
        mockHotels.forEach(hotel => {
            const hotelCard = document.createElement('div');
            hotelCard.className = 'hotel-card';
            hotelCard.style.cssText = `
                background: white;
                border: 2px solid #e0e0e0;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 10px;
            `;
            
            const header = document.createElement('h4');
            header.textContent = hotel.name;
            hotelCard.appendChild(header);
            
            hotel.vacancies.forEach(vacancy => {
                const vacancyItem = document.createElement('div');
                vacancyItem.className = 'vacancy-item';
                vacancyItem.setAttribute('data-vacancy-text', vacancy);
                vacancyItem.textContent = vacancy;
                vacancyItem.style.cssText = 'padding: 10px; background: #f8f9fa; margin: 5px 0;';
                hotelCard.appendChild(vacancyItem);
            });
            
            container.appendChild(hotelCard);
        });
        
        // Show results container
        document.getElementById('results-container').style.display = 'block';
        """
        self.driver.execute_script(script)
        time.sleep(0.5)
    
    def test_01_filter_module_loaded(self):
        """Test AC-004B.1: Filter module loads correctly"""
        print("\n--- Test 1: Filter Module Loaded ---")
        self.driver.get(f"{self.base_url}/index.html")
        time.sleep(2)
        
        try:
            module_loaded = self.driver.execute_script("""
                return typeof window.GuestNumberFilter !== 'undefined';
            """)
            
            self.log_test("GuestNumberFilter module loaded", module_loaded)
            return module_loaded
        except Exception as e:
            self.log_test("GuestNumberFilter module loaded", False, f"Error: {e}")
            return False
    
    def test_02_parsing_capacity(self):
        """Test AC-004B.2 & AC-004B.3: Parse capacity from vacancy text"""
        print("\n--- Test 2: Parsing Capacity (AC-004B.2, AC-004B.3) ---")
        self.driver.get(f"{self.base_url}/index.html")
        time.sleep(2)
        
        test_cases = [
            ("até 2 pessoas", 2),
            ("até 3 pessoas", 3),
            ("Até 4 Pessoas", 4),
            ("ATE 5 pessoas", 5),
            ("ate 1 pessoa", 1),
            ("no capacity info", None),
            ("até pessoas", None),
        ]
        
        all_passed = True
        for text, expected in test_cases:
            try:
                result = self.driver.execute_script(f"""
                    return window.GuestNumberFilter.parseCapacity('{text}');
                """)
                
                passed = result == expected
                all_passed = all_passed and passed
                
                status = "✅" if passed else "❌"
                print(f"  {status} '{text}' → {result} (expected: {expected})")
            except Exception as e:
                print(f"  ❌ Error parsing '{text}': {e}")
                all_passed = False
        
        self.log_test("Capacity parsing works correctly", all_passed)
        return all_passed
    
    def test_03_filter_shows_matching_cards(self):
        """Test AC-004B.4: Show cards with capacity >= guest count"""
        print("\n--- Test 3: Show Matching Cards (AC-004B.4) ---")
        self.driver.get(f"{self.base_url}/index.html")
        time.sleep(2)
        
        try:
            # Create mock results
            self.create_mock_results()
            
            # Apply filter with 2 guests
            self.driver.execute_script("""
                window.GuestNumberFilter.applyFilter(2);
            """)
            time.sleep(0.5)
            
            # All hotels should be visible (all have capacity >= 2)
            visible_cards = self.driver.execute_script("""
                const cards = document.querySelectorAll('.hotel-card');
                return Array.from(cards).filter(card => 
                    card.style.display !== 'none'
                ).length;
            """)
            
            # Should show all 4 hotels
            passed = visible_cards == 4
            self.log_test("Shows all cards with capacity >= 2", passed, 
                         f"Visible: {visible_cards}/4 hotels")
            return passed
        except Exception as e:
            self.log_test("Shows matching cards", False, f"Error: {e}")
            return False
    
    def test_04_filter_hides_non_matching_cards(self):
        """Test AC-004B.5: Hide cards with capacity < guest count"""
        print("\n--- Test 4: Hide Non-Matching Cards (AC-004B.5) ---")
        self.driver.get(f"{self.base_url}/index.html")
        time.sleep(2)
        
        try:
            # Create mock results
            self.create_mock_results()
            
            # Apply filter with 4 guests
            self.driver.execute_script("""
                window.GuestNumberFilter.applyFilter(4);
            """)
            time.sleep(0.5)
            
            # Only Hotel C (4 pessoas) and Hotel D (no info) should be visible
            visible_cards = self.driver.execute_script("""
                const cards = document.querySelectorAll('.hotel-card');
                return Array.from(cards).filter(card => 
                    card.style.display !== 'none'
                ).length;
            """)
            
            passed = visible_cards == 2
            self.log_test("Hides cards with capacity < 4", passed, 
                         f"Visible: {visible_cards}/4 hotels (expected 2)")
            return passed
        except Exception as e:
            self.log_test("Hides non-matching cards", False, f"Error: {e}")
            return False
    
    def test_05_filter_triggers_on_guest_change(self):
        """Test AC-004B.6: Filter applies immediately on guest count change"""
        print("\n--- Test 5: Filter Triggers on Change (AC-004B.6) ---")
        self.driver.get(f"{self.base_url}/index.html")
        time.sleep(2)
        
        try:
            # Enable filter and create results
            self.driver.execute_script("""
                if (window.GuestFilterStateManager) {
                    window.GuestFilterStateManager.enable();
                }
            """)
            self.create_mock_results()
            
            # Get initial visible count (should be 4 with default 2 guests)
            initial_count = self.driver.execute_script("""
                window.GuestNumberFilter.applyFilter(2);
                return window.GuestNumberFilter.getStats().visibleHotels;
            """)
            
            # Simulate clicking plus button (increase to 3 guests)
            self.driver.execute_script("""
                const plusBtn = document.querySelector('.plus');
                if (plusBtn) plusBtn.click();
            """)
            time.sleep(0.5)
            
            # Check new visible count (should be 3: Hotel B, C, D)
            new_count = self.driver.execute_script("""
                return window.GuestNumberFilter.getStats().visibleHotels;
            """)
            
            passed = new_count < initial_count
            self.log_test("Filter triggers on + button click", passed, 
                         f"Initial: {initial_count}, After +: {new_count}")
            return passed
        except Exception as e:
            self.log_test("Filter triggers on change", False, f"Error: {e}")
            return False
    
    def test_06_filter_re_evaluates_all_cards(self):
        """Test AC-004B.7: Filter re-evaluates all cards on each change"""
        print("\n--- Test 6: Re-evaluate All Cards (AC-004B.7) ---")
        self.driver.get(f"{self.base_url}/index.html")
        time.sleep(2)
        
        try:
            self.create_mock_results()
            
            # Apply filter with 5 guests (hide all)
            self.driver.execute_script("""
                window.GuestNumberFilter.applyFilter(5);
            """)
            time.sleep(0.5)
            
            hidden_count = self.driver.execute_script("""
                const cards = document.querySelectorAll('.hotel-card');
                return Array.from(cards).filter(card => 
                    card.style.display === 'none'
                ).length;
            """)
            
            # Apply filter with 2 guests (show all)
            self.driver.execute_script("""
                window.GuestNumberFilter.applyFilter(2);
            """)
            time.sleep(0.5)
            
            visible_count = self.driver.execute_script("""
                const cards = document.querySelectorAll('.hotel-card');
                return Array.from(cards).filter(card => 
                    card.style.display !== 'none'
                ).length;
            """)
            
            passed = hidden_count > 0 and visible_count == 4
            self.log_test("Re-evaluates and shows previously hidden cards", passed, 
                         f"Hidden at 5 guests: {hidden_count}, Visible at 2 guests: {visible_count}")
            return passed
        except Exception as e:
            self.log_test("Re-evaluates all cards", False, f"Error: {e}")
            return False
    
    def test_07_filter_uses_css_display(self):
        """Test AC-004B.8: Uses CSS display property (doesn't remove from DOM)"""
        print("\n--- Test 7: CSS Display Property (AC-004B.8) ---")
        self.driver.get(f"{self.base_url}/index.html")
        time.sleep(2)
        
        try:
            self.create_mock_results()
            
            # Get initial card count
            initial_count = self.driver.execute_script("""
                return document.querySelectorAll('.hotel-card').length;
            """)
            
            # Apply filter that hides some cards
            self.driver.execute_script("""
                window.GuestNumberFilter.applyFilter(4);
            """)
            time.sleep(0.5)
            
            # Get card count after filtering
            after_count = self.driver.execute_script("""
                return document.querySelectorAll('.hotel-card').length;
            """)
            
            passed = initial_count == after_count
            self.log_test("Cards remain in DOM (not removed)", passed, 
                         f"Initial: {initial_count}, After filter: {after_count}")
            return passed
        except Exception as e:
            self.log_test("Uses CSS display property", False, f"Error: {e}")
            return False
    
    def test_08_filter_handles_missing_capacity(self):
        """Test: Filter handles missing capacity gracefully (fail-safe)"""
        print("\n--- Test 8: Handle Missing Capacity (Fail-Safe) ---")
        self.driver.get(f"{self.base_url}/index.html")
        time.sleep(2)
        
        try:
            self.create_mock_results()
            
            # Apply filter with high guest count
            self.driver.execute_script("""
                window.GuestNumberFilter.applyFilter(10);
            """)
            time.sleep(0.5)
            
            # Hotel D (no capacity info) should still be visible
            hotel_d_visible = self.driver.execute_script("""
                const cards = document.querySelectorAll('.hotel-card');
                const hotelD = Array.from(cards).find(card => 
                    card.textContent.includes('Room without capacity info')
                );
                return hotelD ? hotelD.style.display !== 'none' : false;
            """)
            
            self.log_test("Keeps cards without capacity info visible (fail-safe)", hotel_d_visible)
            return hotel_d_visible
        except Exception as e:
            self.log_test("Handles missing capacity", False, f"Error: {e}")
            return False
    
    def run_all_tests(self):
        """Run all test cases"""
        print("="*70)
        print("FR-004B: Client-Side Guest Number Filtering Test Suite")
        print("="*70)
        
        tests = [
            self.test_01_filter_module_loaded,
            self.test_02_parsing_capacity,
            self.test_03_filter_shows_matching_cards,
            self.test_04_filter_hides_non_matching_cards,
            self.test_05_filter_triggers_on_guest_change,
            self.test_06_filter_re_evaluates_all_cards,
            self.test_07_filter_uses_css_display,
            self.test_08_filter_handles_missing_capacity,
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                print(f"❌ Test failed with exception: {e}")
        
        # Print summary
        print("\n" + "="*70)
        print("Test Summary")
        print("="*70)
        
        passed = sum(1 for _, result, _ in self.test_results if result)
        total = len(self.test_results)
        
        print(f"\nTests Run: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Pass Rate: {(passed/total*100):.1f}%")
        
        print("\nDetailed Results:")
        for name, result, message in self.test_results:
            status = "✅" if result else "❌"
            print(f"{status} {name}")
            if message and not result:
                print(f"   {message}")
        
        print("\n" + "="*70)
        
        return passed == total
    
    def cleanup(self):
        """Clean up resources"""
        if hasattr(self, 'driver'):
            self.driver.quit()
        if hasattr(self, 'httpd'):
            self.httpd.shutdown()

def main():
    """Main test execution"""
    test_suite = GuestNumberFilterTest()
    
    try:
        success = test_suite.run_all_tests()
        test_suite.cleanup()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
        test_suite.cleanup()
        sys.exit(1)
    except Exception as e:
        print(f"\nUnexpected error: {e}")
        test_suite.cleanup()
        sys.exit(1)

if __name__ == "__main__":
    main()
