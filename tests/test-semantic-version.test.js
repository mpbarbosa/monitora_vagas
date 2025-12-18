/**
 * Semantic Versioning Test Suite (Jest/JSDOM)
 * Tests the version number display in public/index.html
 */

import { describe, test, expect, beforeAll } from '@jest/globals';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

let htmlContent;
let cssContent;
let packageJson;

/**
 * Validate semantic versioning format
 * @param {string} version - Version string to validate
 * @returns {boolean} True if valid semver format
 */
function isValidSemver(version) {
    // Remove 'v' prefix if present
    const cleanVersion = version.replace(/^v/, '');
    
    // Semantic versioning pattern: MAJOR.MINOR.PATCH[-prerelease][+build]
    const semverPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
    
    return semverPattern.test(cleanVersion);
}

/**
 * Extract version from HTML content
 * @param {string} html - HTML content
 * @returns {string|null} Version string or null
 */
function extractVersionFromHTML(html) {
    const versionPattern = /<small>(v?\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+)?(?:\+[0-9A-Za-z-]+)?)<\/small>/;
    const match = html.match(versionPattern);
    return match ? match[1] : null;
}

beforeAll(() => {
    // Load HTML file
    const htmlPath = join(projectRoot, 'public', 'index.html');
    htmlContent = readFileSync(htmlPath, 'utf-8');
    
    // Load CSS file
    const cssPath = join(projectRoot, 'public', 'src', 'styles', 'index-page.css');
    cssContent = readFileSync(cssPath, 'utf-8');
    
    // Load package.json
    const packagePath = join(projectRoot, 'package.json');
    packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
});

describe('Semantic Versioning in index.html', () => {
    
    describe('HTML Structure', () => {
        
        test('should contain version-footer class', () => {
            expect(htmlContent).toContain('version-footer');
        });
        
        test('should use semantic footer tag', () => {
            expect(htmlContent).toMatch(/<footer[^>]*class="version-footer"/);
        });
        
        test('should use small tag for version text', () => {
            const footerMatch = htmlContent.match(/<footer[^>]*class="version-footer"[^>]*>[\s\S]*?<\/footer>/);
            expect(footerMatch).toBeTruthy();
            expect(footerMatch[0]).toContain('<small>');
        });
        
        test('should contain version number', () => {
            const version = extractVersionFromHTML(htmlContent);
            expect(version).toBeTruthy();
            expect(version).toMatch(/\d+\.\d+\.\d+/);
        });
    });
    
    describe('Version Format', () => {
        
        test('should follow semantic versioning format', () => {
            const version = extractVersionFromHTML(htmlContent);
            expect(version).toBeTruthy();
            expect(isValidSemver(version)).toBe(true);
        });
        
        test('should be in MAJOR.MINOR.PATCH format', () => {
            const version = extractVersionFromHTML(htmlContent);
            const cleanVersion = version.replace(/^v/, '');
            const parts = cleanVersion.split(/[-+]/)[0].split('.');
            
            expect(parts).toHaveLength(3);
            expect(parseInt(parts[0])).toBeGreaterThanOrEqual(0); // MAJOR
            expect(parseInt(parts[1])).toBeGreaterThanOrEqual(0); // MINOR
            expect(parseInt(parts[2])).toBeGreaterThanOrEqual(0); // PATCH
        });
        
        test('version parts should be valid numbers', () => {
            const version = extractVersionFromHTML(htmlContent);
            const cleanVersion = version.replace(/^v/, '');
            const [major, minor, patch] = cleanVersion.split(/[-+]/)[0].split('.');
            
            expect(isNaN(parseInt(major))).toBe(false);
            expect(isNaN(parseInt(minor))).toBe(false);
            expect(isNaN(parseInt(patch))).toBe(false);
        });
    });
    
    describe('Version Consistency', () => {
        
        test('should match version in package.json', () => {
            const htmlVersion = extractVersionFromHTML(htmlContent).replace(/^v/, '');
            const packageVersion = packageJson.version;
            
            expect(htmlVersion).toBe(packageVersion);
        });
        
        test('package.json version should be valid semver', () => {
            expect(isValidSemver(packageJson.version)).toBe(true);
        });
    });
    
    describe('CSS Styling', () => {
        
        test('should have .version-footer CSS class defined', () => {
            expect(cssContent).toMatch(/\.version-footer\s*\{/);
        });
        
        test('should have text-align property', () => {
            const footerCssBlock = cssContent.match(/\.version-footer\s*\{[^}]*\}/);
            expect(footerCssBlock).toBeTruthy();
            expect(footerCssBlock[0]).toMatch(/text-align\s*:/);
        });
        
        test('should have padding property', () => {
            const footerCssBlock = cssContent.match(/\.version-footer\s*\{[^}]*\}/);
            expect(footerCssBlock).toBeTruthy();
            expect(footerCssBlock[0]).toMatch(/padding\s*:/);
        });
        
        test('should have color property', () => {
            const footerCssBlock = cssContent.match(/\.version-footer\s*\{[^}]*\}/);
            expect(footerCssBlock).toBeTruthy();
            expect(footerCssBlock[0]).toMatch(/color\s*:/);
        });
        
        test('should have font-size property', () => {
            const footerCssBlock = cssContent.match(/\.version-footer\s*\{[^}]*\}/);
            expect(footerCssBlock).toBeTruthy();
            expect(footerCssBlock[0]).toMatch(/font-size\s*:/);
        });
    });
    
    describe('Accessibility', () => {
        
        test('should use semantic HTML5 footer element', () => {
            expect(htmlContent).toMatch(/<footer/);
        });
        
        test('should use semantic small element for version text', () => {
            const footerMatch = htmlContent.match(/<footer[^>]*class="version-footer"[^>]*>[\s\S]*?<\/footer>/);
            expect(footerMatch[0]).toContain('<small>');
        });
        
        test('version text should be readable', () => {
            const version = extractVersionFromHTML(htmlContent);
            // Version should not be empty or just whitespace
            expect(version.trim().length).toBeGreaterThan(0);
        });
    });
    
    describe('Version Location', () => {
        
        test('should be within body tag', () => {
            const bodyMatch = htmlContent.match(/<body>[\s\S]*<\/body>/);
            expect(bodyMatch).toBeTruthy();
            expect(bodyMatch[0]).toContain('version-footer');
        });
        
        test('should be positioned after main content', () => {
            const resultsContainerIndex = htmlContent.indexOf('results-container');
            const versionFooterIndex = htmlContent.indexOf('version-footer');
            
            expect(versionFooterIndex).toBeGreaterThan(resultsContainerIndex);
        });
    });
    
    describe('Edge Cases', () => {
        
        test('should handle version with v prefix correctly', () => {
            const version = extractVersionFromHTML(htmlContent);
            // Whether it has 'v' or not, it should still be valid semver
            expect(isValidSemver(version)).toBe(true);
        });
        
        test('should not have multiple version declarations', () => {
            const versionMatches = htmlContent.match(/<footer[^>]*class="version-footer"/g);
            expect(versionMatches).toHaveLength(1);
        });
        
        test('version footer should not be empty', () => {
            const footerMatch = htmlContent.match(/<footer[^>]*class="version-footer"[^>]*>([\s\S]*?)<\/footer>/);
            expect(footerMatch).toBeTruthy();
            expect(footerMatch[1].trim()).not.toBe('');
        });
    });
});

describe('Version Utility Functions', () => {
    
    test('isValidSemver should validate correct versions', () => {
        expect(isValidSemver('1.0.0')).toBe(true);
        expect(isValidSemver('v1.0.0')).toBe(true);
        expect(isValidSemver('2.0.0')).toBe(true);
        expect(isValidSemver('1.2.3-alpha')).toBe(true);
        expect(isValidSemver('1.2.3+build.123')).toBe(true);
        expect(isValidSemver('1.2.3-alpha.1+build.123')).toBe(true);
    });
    
    test('isValidSemver should reject invalid versions', () => {
        expect(isValidSemver('1.0')).toBe(false);
        expect(isValidSemver('1')).toBe(false);
        expect(isValidSemver('abc')).toBe(false);
        expect(isValidSemver('')).toBe(false);
        expect(isValidSemver('1.0.0.')).toBe(false);
    });
    
    test('extractVersionFromHTML should extract version correctly', () => {
        const testHtml = '<footer class="version-footer"><small>v2.0.0</small></footer>';
        expect(extractVersionFromHTML(testHtml)).toBe('v2.0.0');
    });
    
    test('extractVersionFromHTML should handle version without v prefix', () => {
        const testHtml = '<footer class="version-footer"><small>2.0.0</small></footer>';
        expect(extractVersionFromHTML(testHtml)).toBe('2.0.0');
    });
});
