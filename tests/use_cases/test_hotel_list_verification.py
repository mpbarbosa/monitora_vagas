#!/usr/bin/env python3
"""
Hotel List Verification Test
Verifies that all 25 hotels are correctly loaded from the API

This test checks:
1. API endpoint returns correct data
2. All 25 hotels are present
3. Hotel data structure is correct
4. No duplicate hotels
5. All required fields are present
"""

import sys
import urllib.request
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


def verify_hotel_api():
    """Verify hotel API returns all expected hotels"""
    
    print_header("HOTEL LIST VERIFICATION TEST")
    print(f"Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    # Expected hotel data
    expected_hotels = [
        "Todas", "Amparo", "Appenzell", "Areado", "Avaré", "Boraceia",
        "Campos do Jordão", "Caraguatatuba", "Fazenda Ibirá", "Guarujá",
        "Itanhaém", "Lindoia", "Maresias", "Monte Verde", "Peruíbe I",
        "Peruíbe II", "Poços de Caldas", "Saha", "São Lourenço", "São Pedro",
        "Serra Negra", "Socorro", "Termas de Ibirá", "Ubatuba", "Unidade Capital"
    ]
    
    results = {
        'total_tests': 0,
        'passed': 0,
        'failed': 0,
        'details': []
    }
    
    try:
        # Test 1: API Accessibility
        print(f"{Fore.YELLOW}Test 1: Checking API accessibility...{Style.RESET_ALL}")
        results['total_tests'] += 1
        
        api_url = "https://www.mpbarbosa.com/api/vagas/hoteis/scrape"
        req = urllib.request.Request(api_url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req, timeout=10)
        
        print(f"{Fore.GREEN}✅ API accessible (HTTP {response.getcode()}){Style.RESET_ALL}")
        results['passed'] += 1
        results['details'].append(('API Accessibility', 'PASS', f"HTTP {response.getcode()}"))
        
        # Test 2: Valid JSON Response
        print(f"\n{Fore.YELLOW}Test 2: Checking JSON response...{Style.RESET_ALL}")
        results['total_tests'] += 1
        
        content = response.read().decode('utf-8')
        data = json.loads(content)
        
        print(f"{Fore.GREEN}✅ Valid JSON response{Style.RESET_ALL}")
        results['passed'] += 1
        results['details'].append(('JSON Response', 'PASS', 'Valid JSON'))
        
        # Test 3: Success Flag
        print(f"\n{Fore.YELLOW}Test 3: Checking success flag...{Style.RESET_ALL}")
        results['total_tests'] += 1
        
        if data.get('success'):
            print(f"{Fore.GREEN}✅ Success flag is True{Style.RESET_ALL}")
            results['passed'] += 1
            results['details'].append(('Success Flag', 'PASS', 'True'))
        else:
            print(f"{Fore.RED}❌ Success flag is False{Style.RESET_ALL}")
            results['failed'] += 1
            results['details'].append(('Success Flag', 'FAIL', 'False'))
        
        # Test 4: Hotel Count
        print(f"\n{Fore.YELLOW}Test 4: Checking hotel count...{Style.RESET_ALL}")
        results['total_tests'] += 1
        
        reported_count = data.get('count', 0)
        hotels = data.get('data', [])
        actual_count = len(hotels)
        
        print(f"   Reported count: {reported_count}")
        print(f"   Actual count: {actual_count}")
        print(f"   Expected count: {len(expected_hotels)}")
        
        if actual_count == reported_count == len(expected_hotels):
            print(f"{Fore.GREEN}✅ Hotel count correct: {actual_count} hotels{Style.RESET_ALL}")
            results['passed'] += 1
            results['details'].append(('Hotel Count', 'PASS', f'{actual_count} hotels'))
        else:
            print(f"{Fore.RED}❌ Hotel count mismatch{Style.RESET_ALL}")
            results['failed'] += 1
            results['details'].append(('Hotel Count', 'FAIL', f'Mismatch: {actual_count}'))
        
        # Test 5: All Expected Hotels Present
        print(f"\n{Fore.YELLOW}Test 5: Checking all expected hotels...{Style.RESET_ALL}")
        results['total_tests'] += 1
        
        hotel_names = [h.get('name') for h in hotels]
        missing_hotels = []
        
        for expected in expected_hotels:
            if expected not in hotel_names:
                missing_hotels.append(expected)
        
        if not missing_hotels:
            print(f"{Fore.GREEN}✅ All {len(expected_hotels)} expected hotels present{Style.RESET_ALL}")
            results['passed'] += 1
            results['details'].append(('Expected Hotels', 'PASS', f'All {len(expected_hotels)} present'))
        else:
            print(f"{Fore.RED}❌ Missing hotels: {', '.join(missing_hotels)}{Style.RESET_ALL}")
            results['failed'] += 1
            results['details'].append(('Expected Hotels', 'FAIL', f'Missing: {len(missing_hotels)}'))
        
        # Test 6: No Duplicate Hotels
        print(f"\n{Fore.YELLOW}Test 6: Checking for duplicates...{Style.RESET_ALL}")
        results['total_tests'] += 1
        
        unique_names = set(hotel_names)
        duplicates = len(hotel_names) - len(unique_names)
        
        if duplicates == 0:
            print(f"{Fore.GREEN}✅ No duplicate hotels{Style.RESET_ALL}")
            results['passed'] += 1
            results['details'].append(('Duplicates', 'PASS', 'None'))
        else:
            print(f"{Fore.RED}❌ Found {duplicates} duplicate(s){Style.RESET_ALL}")
            results['failed'] += 1
            results['details'].append(('Duplicates', 'FAIL', f'{duplicates} found'))
        
        # Test 7: Hotel Data Structure
        print(f"\n{Fore.YELLOW}Test 7: Checking hotel data structure...{Style.RESET_ALL}")
        results['total_tests'] += 1
        
        required_fields = ['id', 'hotelId', 'name', 'type']
        invalid_hotels = []
        
        for hotel in hotels:
            for field in required_fields:
                if field not in hotel:
                    invalid_hotels.append(hotel.get('name', 'Unknown'))
                    break
        
        if not invalid_hotels:
            print(f"{Fore.GREEN}✅ All hotels have required fields{Style.RESET_ALL}")
            print(f"   Required fields: {', '.join(required_fields)}")
            results['passed'] += 1
            results['details'].append(('Data Structure', 'PASS', 'All fields present'))
        else:
            print(f"{Fore.RED}❌ Hotels with missing fields: {', '.join(invalid_hotels)}{Style.RESET_ALL}")
            results['failed'] += 1
            results['details'].append(('Data Structure', 'FAIL', f'{len(invalid_hotels)} invalid'))
        
        # Test 8: Hotel IDs
        print(f"\n{Fore.YELLOW}Test 8: Checking hotel IDs...{Style.RESET_ALL}")
        results['total_tests'] += 1
        
        hotel_ids = [h.get('hotelId') for h in hotels]
        unique_ids = set(hotel_ids)
        
        if len(hotel_ids) == len(unique_ids):
            print(f"{Fore.GREEN}✅ All hotel IDs are unique{Style.RESET_ALL}")
            results['passed'] += 1
            results['details'].append(('Hotel IDs', 'PASS', 'All unique'))
        else:
            print(f"{Fore.RED}❌ Duplicate hotel IDs found{Style.RESET_ALL}")
            results['failed'] += 1
            results['details'].append(('Hotel IDs', 'FAIL', 'Duplicates found'))
        
        # Display hotel list
        print(f"\n{Fore.CYAN}{'='*80}")
        print(f"{Fore.CYAN}COMPLETE HOTEL LIST ({len(hotels)} hotels)")
        print(f"{Fore.CYAN}{'='*80}{Style.RESET_ALL}\n")
        
        for i, hotel in enumerate(hotels, 1):
            hotel_type = hotel.get('type', 'Unknown')
            icon = "🏨" if hotel_type == "Hotel" else "📋"
            print(f"{i:2d}. {icon} {hotel.get('name'):20s} (ID: {hotel.get('hotelId'):5s}) - {hotel_type}")
        
    except Exception as e:
        print(f"\n{Fore.RED}❌ Error: {str(e)}{Style.RESET_ALL}")
        results['failed'] += 1
        results['details'].append(('Exception', 'FAIL', str(e)))
    
    # Summary
    print(f"\n{Fore.CYAN}{'='*80}")
    print(f"{Fore.CYAN}TEST SUMMARY")
    print(f"{Fore.CYAN}{'='*80}{Style.RESET_ALL}\n")
    
    print(f"End Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    print(f"Total Tests: {results['total_tests']}")
    print(f"{Fore.GREEN}Passed: {results['passed']}{Style.RESET_ALL}")
    print(f"{Fore.RED}Failed: {results['failed']}{Style.RESET_ALL}")
    pass_rate = (results['passed'] / results['total_tests'] * 100) if results['total_tests'] > 0 else 0
    print(f"Pass Rate: {pass_rate:.1f}%\n")
    
    # Detailed results
    print(f"{Fore.CYAN}Detailed Results:{Style.RESET_ALL}\n")
    for test_name, status, details in results['details']:
        color = Fore.GREEN if status == 'PASS' else Fore.RED
        symbol = '✅' if status == 'PASS' else '❌'
        print(f"  {color}{symbol} {test_name:25s} {status:6s} - {details}{Style.RESET_ALL}")
    
    if results['failed'] == 0:
        print(f"\n{Fore.GREEN}{Style.BRIGHT}✅ ALL HOTEL VERIFICATION TESTS PASSED!{Style.RESET_ALL}\n")
        return 0
    else:
        print(f"\n{Fore.RED}{Style.BRIGHT}❌ SOME TESTS FAILED{Style.RESET_ALL}\n")
        return 1


if __name__ == '__main__':
    sys.exit(verify_hotel_api())
