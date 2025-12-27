"""
Pytest Shared Fixtures and Configuration
Provides reusable test fixtures for Selenium, API, and utility functions
"""
import pytest
import os
import sys
from pathlib import Path

# Add src to path for imports
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root / 'src'))

# ============================================================================
# Selenium Fixtures
# ============================================================================

@pytest.fixture(scope="session")
def chrome_options():
    """
    Session-scoped Chrome options configuration
    Reused across all tests requiring Selenium
    """
    try:
        # Use centralized configuration
        from config.selenium_config import get_chrome_options
        return get_chrome_options()
    except ImportError:
        # Fallback to basic configuration
        from selenium.webdriver.chrome.options import Options
        
        options = Options()
        # DON'T set binary_location - let ChromeDriver auto-detect
        options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--disable-extensions")
        options.add_argument("--log-level=3")
        
        return options

@pytest.fixture(scope="session")
def driver_session(chrome_options):
    """
    Session-scoped WebDriver (shared across all tests)
    Use for tests that don't modify browser state
    
    CAUTION: Tests using this fixture must be independent
    and clean up after themselves
    """
    from selenium import webdriver
    from selenium.webdriver.chrome.service import Service
    
    try:
        # Try to use configuration module
        from config.selenium_config import get_chromedriver_path
        service = Service(executable_path=get_chromedriver_path())
        driver = webdriver.Chrome(service=service, options=chrome_options)
    except ImportError:
        # Fallback to default
        driver = webdriver.Chrome(options=chrome_options)
    
    yield driver
    
    # Cleanup
    driver.quit()

@pytest.fixture(scope="function")
def driver_function(chrome_options):
    """
    Function-scoped WebDriver (new driver per test)
    Use for tests that modify browser state or require isolation
    
    Slower but safer - each test gets fresh driver
    """
    from selenium import webdriver
    from selenium.webdriver.chrome.service import Service
    
    try:
        from config.selenium_config import get_chromedriver_path
        service = Service(executable_path=get_chromedriver_path())
        driver = webdriver.Chrome(service=service, options=chrome_options)
    except ImportError:
        driver = webdriver.Chrome(options=chrome_options)
    
    yield driver
    
    # Cleanup
    driver.quit()

# ============================================================================
# Web Server Fixtures
# ============================================================================

@pytest.fixture(scope="session")
def web_server():
    """
    Session-scoped local web server (shared across all tests)
    Serves application files for testing
    
    Benefits:
    - Single server instance for entire test session
    - No 2s startup delay per test
    - Automatic cleanup after all tests complete
    - Port reuse across tests
    """
    import http.server
    import socketserver
    import threading
    import socket
    import time
    from pathlib import Path
    
    # Find free port
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        s.listen(1)
        port = s.getsockname()[1]
    
    # Setup server
    public_dir = Path(__file__).parent.parent / 'public'
    
    if not public_dir.exists():
        raise RuntimeError(f"Public directory not found: {public_dir}")
    
    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(public_dir), **kwargs)
        
        def log_message(self, format, *args):
            # Suppress server logs during tests
            pass
    
    # Allow port reuse
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("", port), Handler)
    
    # Start server in background thread
    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    server_thread.start()
    
    # Wait for server to be ready (reduced from 2s to 0.5s)
    time.sleep(0.5)
    
    # Verify server is responding
    import urllib.request
    base_url = f"http://localhost:{port}"
    try:
        urllib.request.urlopen(f"{base_url}/", timeout=2)
    except Exception as e:
        httpd.shutdown()
        raise RuntimeError(f"Server failed to start: {e}")
    
    print(f"✅ Test server started on {base_url}")
    
    yield base_url
    
    # Cleanup
    print(f"🛑 Shutting down test server on port {port}")
    httpd.shutdown()
    httpd.server_close()

# ============================================================================
# Utility Fixtures
# ============================================================================

@pytest.fixture
def screenshot_dir(tmp_path):
    """
    Function-scoped temporary directory for test screenshots
    Automatically cleaned up after test
    """
    screenshot_path = tmp_path / "screenshots"
    screenshot_path.mkdir()
    return screenshot_path

@pytest.fixture
def capture_screenshot_on_failure(request, screenshot_dir):
    """
    Screenshot capture fixture (opt-in, not autouse)
    Use by adding it to test parameters when needed
    """
    driver = None
    
    def set_driver(drv):
        nonlocal driver
        driver = drv
    
    yield set_driver
    
    if driver and hasattr(request.node, 'rep_call') and request.node.rep_call.failed:
        try:
            test_name = request.node.name
            screenshot_file = screenshot_dir / f"{test_name}_failure.png"
            driver.save_screenshot(str(screenshot_file))
            print(f"\n📸 Screenshot saved: {screenshot_file}")
        except Exception as e:
            print(f"\n⚠️ Could not capture screenshot: {e}")

# Pytest hook to add failure info
@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """
    Make test failure information available to fixtures
    """
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)

# ============================================================================
# Test Data Fixtures
# ============================================================================

@pytest.fixture
def sample_hotel_data():
    """
    Sample hotel data for testing
    """
    return {
        "success": True,
        "data": [
            {"id": 1, "name": "Hotel A", "capacity": 10},
            {"id": 2, "name": "Hotel B", "capacity": 20},
            {"id": 3, "name": "Hotel C", "capacity": 15},
        ]
    }

@pytest.fixture
def sample_search_params():
    """
    Sample search parameters for testing
    """
    from datetime import datetime, timedelta
    
    today = datetime.now()
    checkin = today + timedelta(days=7)
    checkout = checkin + timedelta(days=3)
    
    return {
        "hotel": "Hotel A",
        "checkin": checkin.strftime("%Y-%m-%d"),
        "checkout": checkout.strftime("%Y-%m-%d"),
        "weekend_count": 1
    }

# ============================================================================
# Cleanup Fixtures
# ============================================================================

@pytest.fixture(autouse=True)
def reset_environment():
    """
    Reset environment variables after each test
    """
    original_env = os.environ.copy()
    yield
    os.environ.clear()
    os.environ.update(original_env)

# ============================================================================
# Configuration
# ============================================================================

def pytest_configure(config):
    """
    Pytest configuration hook
    """
    # Add custom markers
    config.addinivalue_line(
        "markers", "selenium: mark test as requiring Selenium WebDriver"
    )
    config.addinivalue_line(
        "markers", "slow: mark test as slow (>5s)"
    )
    config.addinivalue_line(
        "markers", "api: mark test as API integration test"
    )

def pytest_collection_modifyitems(config, items):
    """
    Modify test collection
    Skip Selenium tests if not available
    """
    skip_selenium = pytest.mark.skip(reason="Selenium not available")
    
    try:
        import selenium
    except ImportError:
        for item in items:
            if "selenium" in item.keywords:
                item.add_marker(skip_selenium)
