#!/usr/bin/env python3

"""
Use Case Test Results Collector

Runs all use case tests and generates a JSON summary for the coverage dashboard.

Usage:
    python3 scripts/collect-use-case-results.py
    python3 scripts/collect-use-case-results.py --env local
    python3 scripts/collect-use-case-results.py --env production
"""

import json
import subprocess
import sys
from pathlib import Path
from datetime import datetime

# Configuration
ROOT_DIR = Path(__file__).parent.parent
USE_CASES_DIR = ROOT_DIR / "tests" / "use_cases"
RESULTS_FILE = USE_CASES_DIR / "results.json"

# Use case test files mapping
USE_CASES = {
    "UC-001: API Hotel List": "test_uc001_api_hotel_list.py",
    "UC-002: API Search Vacancies": "test_uc002_api_search_vacancies.py",
    "UC-003: API Booking Rules": "test_uc003_api_booking_rules.py",
    "UC-004: Guest Filter Toggle": "test_uc004_guest_filter_toggle.py",
    "UC-005: Hotel List Display": "test_uc005_hotel_list_selenium.py",
    "UC-006: Search Form Validation": "test_uc006_search_form_validation.py",
    "UC-007: Search Results Display": "test_uc007_search_results_display.py",
    "UC-008: Booking Rules Handling": "test_uc008_booking_rules_handling.py",
    "UC-009: Holiday Package Detection": "test_uc009_holiday_package_detection.py",
    "UC-010: Guest Number Filtering": "test_uc010_guest_number_filtering.py",
}


def run_test(test_file: str) -> dict:
    """
    Run a single test file and return result.
    
    Args:
        test_file: Name of the test file
        
    Returns:
        Dictionary with test result information
    """
    test_path = USE_CASES_DIR / test_file
    
    if not test_path.exists():
        return {
            "passed": False,
            "skipped": True,
            "message": "Test file not found",
            "duration": 0
        }
    
    start_time = datetime.now()
    
    try:
        result = subprocess.run(
            [sys.executable, str(test_path)],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True,
            timeout=60
        )
        
        duration = (datetime.now() - start_time).total_seconds()
        
        return {
            "passed": result.returncode == 0,
            "skipped": False,
            "message": "Success" if result.returncode == 0 else "Failed",
            "duration": duration,
            "stdout": result.stdout[-500:] if result.stdout else "",
            "stderr": result.stderr[-500:] if result.stderr else ""
        }
        
    except subprocess.TimeoutExpired:
        duration = (datetime.now() - start_time).total_seconds()
        return {
            "passed": False,
            "skipped": False,
            "message": "Test timed out",
            "duration": duration
        }
        
    except Exception as e:
        duration = (datetime.now() - start_time).total_seconds()
        return {
            "passed": False,
            "skipped": False,
            "message": f"Error: {str(e)}",
            "duration": duration
        }


def main():
    """Main execution function."""
    print("🧪 Collecting Use Case Test Results\n")
    
    results = {
        "timestamp": datetime.now().isoformat(),
        "summary": {
            "total": len(USE_CASES),
            "passed": 0,
            "failed": 0,
            "skipped": 0,
            "duration": 0
        },
        "tests": {}
    }
    
    # Run each use case test
    for name, test_file in USE_CASES.items():
        print(f"Running {name}...", end=" ", flush=True)
        
        result = run_test(test_file)
        results["tests"][name] = result
        results["summary"]["duration"] += result["duration"]
        
        if result["skipped"]:
            results["summary"]["skipped"] += 1
            print("⏭️  SKIPPED")
        elif result["passed"]:
            results["summary"]["passed"] += 1
            print("✅ PASSED")
        else:
            results["summary"]["failed"] += 1
            print(f"❌ FAILED: {result['message']}")
    
    # Ensure directory exists
    USE_CASES_DIR.mkdir(parents=True, exist_ok=True)
    
    # Save results
    with open(RESULTS_FILE, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📊 Summary:")
    print(f"   Total:   {results['summary']['total']}")
    print(f"   Passed:  {results['summary']['passed']}")
    print(f"   Failed:  {results['summary']['failed']}")
    print(f"   Skipped: {results['summary']['skipped']}")
    print(f"   Duration: {results['summary']['duration']:.2f}s")
    print(f"\n✅ Results saved to: {RESULTS_FILE}")
    
    # Return exit code based on failures
    return 0 if results['summary']['failed'] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
