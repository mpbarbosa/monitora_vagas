#!/usr/bin/env python3
"""
Master Use Case Test Runner
Executes all use case tests (UC-001 through UC-010)

This script runs all use case test suites for both local and production environments.
"""

import os
import sys
import subprocess
import argparse
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
    """Print formatted header"""
    print(f"\n{Fore.CYAN}{Style.BRIGHT}{'='*80}")
    print(f"{Fore.CYAN}{Style.BRIGHT}{message:^80}")
    print(f"{Fore.CYAN}{Style.BRIGHT}{'='*80}{Style.RESET_ALL}\n")


def print_section(message):
    """Print formatted section"""
    print(f"\n{Fore.MAGENTA}{Style.BRIGHT}{'-'*80}")
    print(f"{Fore.MAGENTA}{Style.BRIGHT}{message}")
    print(f"{Fore.MAGENTA}{Style.BRIGHT}{'-'*80}{Style.RESET_ALL}\n")


def run_test_suite(test_file, env_vars=None):
    """Run a single test suite"""
    env = os.environ.copy()
    if env_vars:
        env.update(env_vars)
    
    print(f"{Fore.YELLOW}Running: {test_file}{Style.RESET_ALL}")
    
    try:
        result = subprocess.run(
            ['python3', test_file],
            env=env,
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout per test suite
        )
        
        print(result.stdout)
        if result.stderr:
            print(result.stderr)
        
        if result.returncode == 0:
            print(f"{Fore.GREEN}✅ {test_file} PASSED{Style.RESET_ALL}\n")
            return True
        else:
            print(f"{Fore.RED}❌ {test_file} FAILED{Style.RESET_ALL}\n")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"{Fore.RED}❌ {test_file} TIMED OUT{Style.RESET_ALL}\n")
        return False
    except Exception as e:
        print(f"{Fore.RED}❌ {test_file} ERROR: {str(e)}{Style.RESET_ALL}\n")
        return False


def main():
    parser = argparse.ArgumentParser(description='Run use case test suites')
    parser.add_argument(
        '--env',
        choices=['local', 'production', 'both'],
        default='local',
        help='Test environment (default: local)'
    )
    parser.add_argument(
        '--uc',
        type=str,
        help='Run specific use case (e.g., UC-001, UC-002)'
    )
    
    args = parser.parse_args()
    
    # Test suite definitions
    test_suites = [
        {
            'id': 'UC-001',
            'name': 'First-Time User Hotel Search',
            'file': 'test_uc001_first_time_user_search.py',
            'priority': 'Critical'
        },
        {
            'id': 'UC-002',
            'name': 'Advanced Search with Filters',
            'file': 'test_uc002_advanced_search_filters.py',
            'priority': 'High'
        },
        {
            'id': 'UC-003',
            'name': 'Date Range Validation',
            'file': 'test_uc003_date_range_validation.py',
            'priority': 'High'
        },
        {
            'id': 'UC-004',
            'name': 'Search Lifecycle Management',
            'file': 'test_uc004_search_lifecycle.py',
            'priority': 'Critical'
        }
    ]
    
    # Environment configurations
    environments = []
    if args.env in ['local', 'both']:
        environments.append({
            'name': 'Local',
            'vars': {'TEST_BASE_URL': 'http://localhost:8080/public/index.html'}
        })
    if args.env in ['production', 'both']:
        environments.append({
            'name': 'Production',
            'vars': {'TEST_BASE_URL': 'https://www.mpbarbosa.com/public/index.html'}
        })
    
    # Get script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Filter test suites if specific UC requested
    if args.uc:
        test_suites = [ts for ts in test_suites if ts['id'] == args.uc.upper()]
        if not test_suites:
            print(f"{Fore.RED}❌ Use case {args.uc} not found{Style.RESET_ALL}")
            return 1
    
    # Start testing
    start_time = datetime.now()
    print_header("USE CASE TEST EXECUTION")
    print(f"Start Time: {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Environment(s): {', '.join([e['name'] for e in environments])}")
    print(f"Test Suites: {len(test_suites)}")
    
    # Results tracking
    results = {
        'total': 0,
        'passed': 0,
        'failed': 0,
        'by_suite': {}
    }
    
    # Run tests for each environment
    for env_config in environments:
        print_section(f"Testing Environment: {env_config['name']}")
        
        for suite in test_suites:
            test_file = os.path.join(script_dir, suite['file'])
            
            if not os.path.exists(test_file):
                print(f"{Fore.YELLOW}⚠️  Skipping {suite['id']}: File not found{Style.RESET_ALL}\n")
                continue
            
            print(f"\n{Fore.CYAN}{Style.BRIGHT}{suite['id']}: {suite['name']}{Style.RESET_ALL}")
            print(f"Priority: {suite['priority']}")
            print(f"File: {suite['file']}\n")
            
            results['total'] += 1
            passed = run_test_suite(test_file, env_config['vars'])
            
            suite_key = f"{env_config['name']}-{suite['id']}"
            results['by_suite'][suite_key] = 'PASSED' if passed else 'FAILED'
            
            if passed:
                results['passed'] += 1
            else:
                results['failed'] += 1
    
    # Print summary
    end_time = datetime.now()
    duration = end_time - start_time
    
    print_header("TEST EXECUTION SUMMARY")
    print(f"End Time: {end_time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Duration: {duration}")
    print(f"\n{Fore.CYAN}Results:{Style.RESET_ALL}")
    print(f"  Total Tests: {results['total']}")
    print(f"  {Fore.GREEN}Passed: {results['passed']}{Style.RESET_ALL}")
    print(f"  {Fore.RED}Failed: {results['failed']}{Style.RESET_ALL}")
    print(f"  Pass Rate: {(results['passed'] / results['total'] * 100):.1f}%\n")
    
    # Detailed results
    print(f"{Fore.CYAN}Detailed Results:{Style.RESET_ALL}")
    for suite_key, result in results['by_suite'].items():
        env_name, uc_id = suite_key.split('-', 1)
        color = Fore.GREEN if result == 'PASSED' else Fore.RED
        print(f"  {color}{env_name:12} {uc_id}: {result}{Style.RESET_ALL}")
    
    # Exit code
    exit_code = 0 if results['failed'] == 0 else 1
    
    if exit_code == 0:
        print(f"\n{Fore.GREEN}{Style.BRIGHT}✅ ALL TESTS PASSED{Style.RESET_ALL}")
    else:
        print(f"\n{Fore.RED}{Style.BRIGHT}❌ SOME TESTS FAILED{Style.RESET_ALL}")
    
    return exit_code


if __name__ == '__main__':
    sys.exit(main())
