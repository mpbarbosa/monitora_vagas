#!/usr/bin/env python3
"""
Production Environment Validation Test
Tests production site availability and key functionality using HTTP requests.
"""

import sys
import urllib.request
import urllib.error
import json
from datetime import datetime

try:
    from colorama import Fore, Style, init
    init(autoreset=True)
except ImportError:
    class Fore:
        GREEN = RED = YELLOW = CYAN = BLUE = MAGENTA = ''
    class Style:
        BRIGHT = RESET_ALL = ''


def print_header(message):
    print(f"\n{Fore.CYAN}{Style.BRIGHT}{'='*80}")
    print(f"{Fore.CYAN}{Style.BRIGHT}{message:^80}")
    print(f"{Fore.CYAN}{Style.BRIGHT}{'='*80}{Style.RESET_ALL}\n")


def test_api_hotels_count(url, description=""):
    """Test if API returns correct number of hotels"""
    try:
        # Check the API endpoint
        api_url = "https://www.mpbarbosa.com/api/vagas/hoteis/scrape"
        req = urllib.request.Request(api_url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req, timeout=10)
        content = response.read().decode('utf-8')
        
        import json
        data = json.loads(content)
        
        if data.get('success') and data.get('count'):
            hotel_count = data.get('count')
            hotels = data.get('data', [])
            actual_count = len(hotels)
            
            if actual_count == hotel_count and actual_count >= 25:
                print(f"{Fore.GREEN}✅ {description}: {actual_count} hotels returned (expected: {hotel_count}){Style.RESET_ALL}")
                
                # Print first few hotel names for verification
                hotel_names = [h.get('name') for h in hotels[:5]]
                print(f"   Sample hotels: {', '.join(hotel_names)}...")
                
                return True
            else:
                print(f"{Fore.RED}❌ {description}: Hotel count mismatch (got {actual_count}, expected {hotel_count}){Style.RESET_ALL}")
                return False
        else:
            print(f"{Fore.RED}❌ {description}: Invalid API response{Style.RESET_ALL}")
            return False
            
    except Exception as e:
        print(f"{Fore.RED}❌ {description}: {str(e)}{Style.RESET_ALL}")
        return False


def test_url(url, expected_status=200, description=""):
    """Test URL availability"""
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req, timeout=10)
        status = response.getcode()
        
        if status == expected_status:
            print(f"{Fore.GREEN}✅ {description or url}: HTTP {status}{Style.RESET_ALL}")
            return True
        else:
            print(f"{Fore.RED}❌ {description or url}: HTTP {status} (expected {expected_status}){Style.RESET_ALL}")
            return False
    except urllib.error.HTTPError as e:
        print(f"{Fore.RED}❌ {description or url}: HTTP {e.code}{Style.RESET_ALL}")
        return False
    except Exception as e:
        print(f"{Fore.RED}❌ {description or url}: {str(e)}{Style.RESET_ALL}")
        return False


def test_content(url, expected_strings, description=""):
    """Test if URL contains expected content"""
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req, timeout=10)
        content = response.read().decode('utf-8')
        
        all_found = True
        for expected in expected_strings:
            if expected not in content:
                print(f"{Fore.RED}❌ {description}: Missing '{expected[:50]}...'{Style.RESET_ALL}")
                all_found = False
        
        if all_found:
            print(f"{Fore.GREEN}✅ {description}: All expected content found{Style.RESET_ALL}")
            return True
        return False
    except Exception as e:
        print(f"{Fore.RED}❌ {description}: {str(e)}{Style.RESET_ALL}")
        return False


def main():
    print_header("PRODUCTION ENVIRONMENT VALIDATION")
    print(f"Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    production_url = "https://www.mpbarbosa.com/submodules/monitora_vagas/public"
    app_url = production_url  # index.html is served by default
    
    results = {
        'total': 0,
        'passed': 0,
        'failed': 0
    }
    
    tests = [
        # UC-001: Page Availability Tests
        {
            'name': 'UC-001-01: Production site accessible',
            'test': lambda: test_url(production_url, description="Production root")
        },
        {
            'name': 'UC-001-02: Application page loads',
            'test': lambda: test_url(app_url, description="Application page")
        },
        {
            'name': 'UC-001-03: Page title correct',
            'test': lambda: test_content(
                app_url,
                ["Busca de Vagas em Hotéis Sindicais - AFPESP"],
                "Page title"
            )
        },
        {
            'name': 'UC-001-04: Hotel API returns all hotels',
            'test': lambda: test_api_hotels_count(
                app_url,
                "Hotel API"
            )
        },
        {
            'name': 'UC-001-05: Form elements present',
            'test': lambda: test_content(
                app_url,
                ['id="hotel-select"', 'id="input-checkin"', 'id="input-checkout"'],
                "Form elements"
            )
        },
        {
            'name': 'UC-001-06: Search button present',
            'test': lambda: test_content(
                app_url,
                ['id="search-button"'],
                "Search button"
            )
        },
        {
            'name': 'UC-002-01: Guest filter controls present',
            'test': lambda: test_content(
                app_url,
                ['id="guest-filter-card"'],
                "Guest filter controls"
            )
        },
        {
            'name': 'UC-002-02: Booking rules toggle present',
            'test': lambda: test_content(
                app_url,
                ['id="apply-booking-rules"'],
                "Booking rules toggle"
            )
        },
        {
            'name': 'UC-004-01: Result container present',
            'test': lambda: test_content(
                app_url,
                ['id="results-container"'],
                "Result container"
            )
        },
        {
            'name': 'UC-005-01: Bootstrap CSS loaded',
            'test': lambda: test_content(
                app_url,
                ['bootstrap'],
                "Bootstrap CSS"
            )
        },
        {
            'name': 'UC-005-02: Application JavaScript present',
            'test': lambda: test_content(
                app_url,
                ['type="module"', 'src="../src/js/'],
                "Application JavaScript"
            )
        },
    ]
    
    print(f"{Fore.MAGENTA}{Style.BRIGHT}Running Production Tests:{Style.RESET_ALL}\n")
    
    for test_item in tests:
        results['total'] += 1
        print(f"{Fore.YELLOW}Testing: {test_item['name']}{Style.RESET_ALL}")
        
        try:
            if test_item['test']():
                results['passed'] += 1
            else:
                results['failed'] += 1
        except Exception as e:
            print(f"{Fore.RED}❌ Exception: {str(e)}{Style.RESET_ALL}")
            results['failed'] += 1
        
        print()
    
    # Summary
    print_header("TEST SUMMARY")
    print(f"End Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    print(f"Total Tests: {results['total']}")
    print(f"{Fore.GREEN}Passed: {results['passed']}{Style.RESET_ALL}")
    print(f"{Fore.RED}Failed: {results['failed']}{Style.RESET_ALL}")
    pass_rate = (results['passed'] / results['total'] * 100) if results['total'] > 0 else 0
    print(f"Pass Rate: {pass_rate:.1f}%\n")
    
    if results['failed'] == 0:
        print(f"{Fore.GREEN}{Style.BRIGHT}✅ ALL PRODUCTION VALIDATION TESTS PASSED!{Style.RESET_ALL}\n")
        return 0
    else:
        print(f"{Fore.RED}{Style.BRIGHT}❌ SOME TESTS FAILED{Style.RESET_ALL}\n")
        return 1


if __name__ == '__main__':
    sys.exit(main())
