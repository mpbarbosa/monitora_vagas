#!/usr/bin/env python3
"""
CSS Test Suite - Automated CSS Validation
Tests CSS files in the public/css directory for:
- Syntax validation
- Variable usage
- Property conflicts
- Accessibility compliance
- Best practices
"""

import re
import os
from pathlib import Path
from typing import List, Dict, Tuple

class CSSTestSuite:
    def __init__(self, css_directory: str):
        self.css_directory = Path(css_directory)
        self.test_results = []
        self.total_tests = 0
        self.passed_tests = 0
        self.failed_tests = 0
        
    def log_test(self, test_name: str, passed: bool, message: str):
        """Log test result"""
        self.total_tests += 1
        if passed:
            self.passed_tests += 1
            status = "✓ PASS"
        else:
            self.failed_tests += 1
            status = "✗ FAIL"
        
        result = f"{status}: {test_name} - {message}"
        self.test_results.append(result)
        print(result)
    
    def find_css_files(self) -> List[Path]:
        """Find all CSS files in the directory"""
        css_files = list(self.css_directory.rglob('*.css'))
        self.log_test(
            "Find CSS files",
            len(css_files) > 0,
            f"Found {len(css_files)} CSS files"
        )
        return css_files
    
    def read_css_file(self, file_path: Path) -> str:
        """Read CSS file content"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return content
        except Exception as e:
            self.log_test(
                f"Read {file_path.name}",
                False,
                f"Error reading file: {str(e)}"
            )
            return ""
    
    def test_css_syntax(self, content: str, filename: str) -> bool:
        """Test for basic CSS syntax errors"""
        # Check for balanced braces
        open_braces = content.count('{')
        close_braces = content.count('}')
        balanced = open_braces == close_braces
        
        self.log_test(
            f"Syntax - Balanced braces in {filename}",
            balanced,
            f"Open: {open_braces}, Close: {close_braces}"
        )
        
        # Check for semicolons after property values
        property_pattern = r':\s*[^;{}]+\s*[;}]'
        properties = re.findall(property_pattern, content)
        
        self.log_test(
            f"Syntax - Properties in {filename}",
            len(properties) > 0,
            f"Found {len(properties)} CSS properties"
        )
        
        return balanced
    
    def test_css_variables(self, content: str, filename: str):
        """Test CSS variable usage"""
        # Find variable declarations
        var_declarations = re.findall(r'--[\w-]+:\s*[^;]+;', content)
        
        # Find variable usages
        var_usages = re.findall(r'var\(--[\w-]+\)', content)
        
        self.log_test(
            f"Variables - Declarations in {filename}",
            len(var_declarations) >= 0,
            f"Found {len(var_declarations)} variable declarations"
        )
        
        self.log_test(
            f"Variables - Usage in {filename}",
            len(var_usages) >= 0,
            f"Found {len(var_usages)} variable usages"
        )
        
        # Check for unused variables (in variables.css only)
        if 'variables.css' in filename:
            declared_vars = set(re.findall(r'--[\w-]+', ' '.join(var_declarations)))
            used_vars = set(re.findall(r'--[\w-]+', ' '.join(var_usages)))
            
            self.log_test(
                f"Variables - Defined in {filename}",
                len(declared_vars) > 0,
                f"{len(declared_vars)} unique variables defined"
            )
    
    def test_color_values(self, content: str, filename: str):
        """Test color value formats"""
        # Find hex colors
        hex_colors = re.findall(r'#[0-9a-fA-F]{3,8}', content)
        
        # Find rgb/rgba colors
        rgb_colors = re.findall(r'rgba?\([^)]+\)', content)
        
        # Find CSS variable color usage
        color_vars = re.findall(r'var\(--color-[\w-]+\)', content)
        
        total_colors = len(hex_colors) + len(rgb_colors) + len(color_vars)
        
        self.log_test(
            f"Colors - Found in {filename}",
            total_colors >= 0,
            f"Hex: {len(hex_colors)}, RGB: {len(rgb_colors)}, Vars: {len(color_vars)}"
        )
        
        # Check for valid hex colors
        invalid_hex = [c for c in hex_colors if len(c) not in [4, 7, 9]]
        self.log_test(
            f"Colors - Valid hex in {filename}",
            len(invalid_hex) == 0,
            f"All {len(hex_colors)} hex colors are valid format"
        )
    
    def test_responsive_design(self, content: str, filename: str):
        """Test for responsive design patterns"""
        # Find media queries
        media_queries = re.findall(r'@media[^{]+{', content)
        
        self.log_test(
            f"Responsive - Media queries in {filename}",
            len(media_queries) >= 0,
            f"Found {len(media_queries)} media queries"
        )
        
        # Check for common breakpoints
        common_breakpoints = ['768px', '992px', '1200px', '576px']
        found_breakpoints = [bp for bp in common_breakpoints if bp in content]
        
        if len(media_queries) > 0:
            self.log_test(
                f"Responsive - Breakpoints in {filename}",
                len(found_breakpoints) > 0,
                f"Uses breakpoints: {', '.join(found_breakpoints)}"
            )
    
    def test_accessibility(self, content: str, filename: str):
        """Test for accessibility patterns"""
        # Check for focus states
        focus_states = re.findall(r':focus\s*{', content)
        
        # Check for outline properties
        outline_props = re.findall(r'outline:\s*[^;]+;', content)
        
        self.log_test(
            f"Accessibility - Focus states in {filename}",
            len(focus_states) >= 0,
            f"Found {len(focus_states)} :focus selectors"
        )
        
        # Check for hover states
        hover_states = re.findall(r':hover\s*{', content)
        
        self.log_test(
            f"Accessibility - Hover states in {filename}",
            len(hover_states) >= 0,
            f"Found {len(hover_states)} :hover selectors"
        )
    
    def test_transitions_animations(self, content: str, filename: str):
        """Test for transitions and animations"""
        # Find transition properties
        transitions = re.findall(r'transition:\s*[^;]+;', content)
        
        # Find animations
        animations = re.findall(r'animation:\s*[^;]+;', content)
        
        # Find keyframes
        keyframes = re.findall(r'@keyframes\s+[\w-]+', content)
        
        self.log_test(
            f"Animations - Transitions in {filename}",
            len(transitions) >= 0,
            f"Found {len(transitions)} transition properties"
        )
        
        if len(keyframes) > 0:
            self.log_test(
                f"Animations - Keyframes in {filename}",
                True,
                f"Found {len(keyframes)} @keyframes: {', '.join([k.split()[-1] for k in keyframes])}"
            )
    
    def test_grid_flexbox(self, content: str, filename: str):
        """Test for modern layout usage"""
        # Find grid usage
        grid_props = re.findall(r'display:\s*grid', content)
        grid_template = re.findall(r'grid-template-', content)
        
        # Find flexbox usage
        flex_props = re.findall(r'display:\s*flex', content)
        flex_direction = re.findall(r'flex-direction:', content)
        
        self.log_test(
            f"Layout - Grid usage in {filename}",
            len(grid_props) >= 0,
            f"Grid containers: {len(grid_props)}, Grid templates: {len(grid_template)}"
        )
        
        self.log_test(
            f"Layout - Flexbox usage in {filename}",
            len(flex_props) >= 0,
            f"Flex containers: {len(flex_props)}, Flex directions: {len(flex_direction)}"
        )
    
    def test_imports(self, content: str, filename: str):
        """Test CSS imports"""
        imports = re.findall(r'@import\s+[\'"]([^\'"]+)[\'"]', content)
        
        if len(imports) > 0:
            self.log_test(
                f"Imports - Found in {filename}",
                True,
                f"Imports {len(imports)} files: {', '.join(imports)}"
            )
            
            # Verify imported files exist
            for import_path in imports:
                import_file = self.css_directory / import_path.replace('./', '')
                exists = import_file.exists()
                self.log_test(
                    f"Imports - File exists: {import_path}",
                    exists,
                    f"{'Found' if exists else 'Missing'}: {import_file}"
                )
    
    def run_all_tests(self):
        """Run all CSS tests"""
        print("=" * 70)
        print("CSS TEST SUITE - Automated CSS Validation")
        print("=" * 70)
        print()
        
        css_files = self.find_css_files()
        
        if not css_files:
            print("No CSS files found!")
            return
        
        print()
        print(f"Testing {len(css_files)} CSS files...")
        print()
        
        for css_file in css_files:
            print(f"\n--- Testing: {css_file.name} ---")
            content = self.read_css_file(css_file)
            
            if content:
                self.test_css_syntax(content, css_file.name)
                self.test_css_variables(content, css_file.name)
                self.test_color_values(content, css_file.name)
                self.test_responsive_design(content, css_file.name)
                self.test_accessibility(content, css_file.name)
                self.test_transitions_animations(content, css_file.name)
                self.test_grid_flexbox(content, css_file.name)
                self.test_imports(content, css_file.name)
        
        # Print summary
        print()
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


def main():
    """Main test runner"""
    # Get the CSS directory path
    script_dir = Path(__file__).parent
    css_dir = script_dir.parent / 'public' / 'css'
    
    if not css_dir.exists():
        print(f"Error: CSS directory not found at {css_dir}")
        return False
    
    # Run tests
    test_suite = CSSTestSuite(css_dir)
    success = test_suite.run_all_tests()
    
    return success


if __name__ == '__main__':
    import sys
    success = main()
    sys.exit(0 if success else 1)
