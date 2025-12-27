#!/usr/bin/env node

/**
 * Documentation Link Validator
 * 
 * Validates internal links in markdown documentation to prevent broken links.
 * Can be run as pre-commit hook or standalone.
 * 
 * Features:
 * - Validates markdown links
 * - Checks file existence
 * - Validates anchor links
 * - Colored console output
 * - Exit codes for CI/CD
 * 
 * Usage:
 *   node scripts/validate-docs-links.js [path]
 *   npm run validate:links
 */

import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join, dirname, relative, resolve } from 'path';

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

/**
 * Configuration
 */
const config = {
    rootDir: process.cwd(),
    searchPaths: ['docs/**/*.md', 'README.md', '.github/**/*.md'],
    ignorePatterns: [
        '**/node_modules/**',
        '**/coverage/**',
        '**/venv/**',
        '**/.git/**'
    ],
    // External link validation (optional - requires network)
    validateExternalLinks: false
};

/**
 * Link validation results
 */
class ValidationResults {
    constructor() {
        this.totalFiles = 0;
        this.totalLinks = 0;
        this.errors = [];
        this.warnings = [];
    }

    addError(file, link, message) {
        this.errors.push({ file, link, message });
    }

    addWarning(file, link, message) {
        this.warnings.push({ file, link, message });
    }

    hasErrors() {
        return this.errors.length > 0;
    }

    print() {
        console.log(`\n${colors.bold}📊 Link Validation Results${colors.reset}`);
        console.log(`Files scanned: ${colors.cyan}${this.totalFiles}${colors.reset}`);
        console.log(`Links checked: ${colors.cyan}${this.totalLinks}${colors.reset}`);

        if (this.errors.length > 0) {
            console.log(`\n${colors.red}${colors.bold}❌ Errors: ${this.errors.length}${colors.reset}`);
            this.errors.forEach(({ file, link, message }) => {
                console.log(`  ${colors.red}✗${colors.reset} ${relative(config.rootDir, file)}`);
                console.log(`    Link: ${colors.yellow}${link}${colors.reset}`);
                console.log(`    ${message}`);
            });
        }

        if (this.warnings.length > 0) {
            console.log(`\n${colors.yellow}${colors.bold}⚠️  Warnings: ${this.warnings.length}${colors.reset}`);
            this.warnings.forEach(({ file, link, message }) => {
                console.log(`  ${colors.yellow}⚠${colors.reset} ${relative(config.rootDir, file)}`);
                console.log(`    Link: ${colors.cyan}${link}${colors.reset}`);
                console.log(`    ${message}`);
            });
        }

        if (this.errors.length === 0 && this.warnings.length === 0) {
            console.log(`\n${colors.green}${colors.bold}✅ All links are valid!${colors.reset}`);
        }
    }

    getExitCode() {
        return this.hasErrors() ? 1 : 0;
    }
}

/**
 * Extract all markdown links from content
 * @param {string} content - Markdown file content
 * @returns {Array} Array of {text, url, line} objects
 */
function extractLinks(content) {
    const links = [];
    const lines = content.split('\n');

    // Match [text](url) and [text](url#anchor) patterns
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

    lines.forEach((line, index) => {
        let match;
        while ((match = linkRegex.exec(line)) !== null) {
            links.push({
                text: match[1],
                url: match[2],
                line: index + 1
            });
        }
    });

    return links;
}

/**
 * Check if a file path exists
 * @param {string} filePath - File path to check
 * @returns {boolean}
 */
function fileExists(filePath) {
    try {
        return existsSync(filePath) && statSync(filePath).isFile();
    } catch (error) {
        return false;
    }
}

/**
 * Check if anchor exists in markdown file
 * @param {string} filePath - Path to markdown file
 * @param {string} anchor - Anchor name (without #)
 * @returns {boolean}
 */
function anchorExists(filePath, anchor) {
    if (!fileExists(filePath)) return false;

    try {
        const content = readFileSync(filePath, 'utf8');
        const lines = content.split('\n');

        // Convert anchor to potential heading format
        const anchorLower = anchor.toLowerCase().replace(/-/g, ' ');

        for (const line of lines) {
            // Check for markdown headers
            if (line.startsWith('#')) {
                const heading = line.replace(/^#+\s+/, '').toLowerCase();
                const headingAnchor = heading.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                
                if (headingAnchor === anchor || heading === anchorLower) {
                    return true;
                }
            }

            // Check for HTML anchors
            if (line.includes(`id="${anchor}"`) || line.includes(`id='${anchor}'`)) {
                return true;
            }
        }

        return false;
    } catch (error) {
        return false;
    }
}

/**
 * Validate a single link
 * @param {string} sourceFile - File containing the link
 * @param {object} link - Link object {text, url, line}
 * @param {ValidationResults} results - Results object
 */
function validateLink(sourceFile, link, results) {
    const { url, text, line } = link;

    // Skip external links (http/https)
    if (url.startsWith('http://') || url.startsWith('https://')) {
        if (config.validateExternalLinks) {
            results.addWarning(sourceFile, url, 'External link validation not implemented');
        }
        return;
    }

    // Skip mailto and other protocols
    if (url.includes(':')) {
        return;
    }

    // Parse anchor
    const [filePath, anchor] = url.split('#');
    const sourceDir = dirname(sourceFile);

    // Resolve relative path
    let targetPath;
    if (filePath === '') {
        // Same-file anchor link
        targetPath = sourceFile;
    } else if (filePath.startsWith('/')) {
        // Absolute path from root
        targetPath = join(config.rootDir, filePath);
    } else {
        // Relative path
        targetPath = resolve(sourceDir, filePath);
    }

    // Check if file exists
    if (!fileExists(targetPath)) {
        results.addError(
            sourceFile,
            url,
            `File not found: ${relative(config.rootDir, targetPath)}`
        );
        return;
    }

    // Check anchor if present
    if (anchor) {
        if (!anchorExists(targetPath, anchor)) {
            results.addError(
                sourceFile,
                url,
                `Anchor "#${anchor}" not found in ${relative(config.rootDir, targetPath)}`
            );
        }
    }
}

/**
 * Validate links in a single file
 * @param {string} filePath - Path to markdown file
 * @param {ValidationResults} results - Results object
 */
function validateFile(filePath, results) {
    try {
        const content = readFileSync(filePath, 'utf8');
        const links = extractLinks(content);

        results.totalLinks += links.length;

        links.forEach(link => {
            validateLink(filePath, link, results);
        });
    } catch (error) {
        results.addError(filePath, '', `Failed to read file: ${error.message}`);
    }
}

/**
 * Find markdown files matching patterns
 * @param {string[]} patterns - Search patterns
 * @returns {string[]} Array of absolute file paths
 */
function findMarkdownFiles(patterns) {
    const files = new Set();

    function walkDirectory(dir, pattern = '**/*.md') {
        try {
            const entries = readdirSync(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = join(dir, entry.name);
                const relativePath = relative(config.rootDir, fullPath);

                // Skip ignored patterns
                if (config.ignorePatterns.some(ignore => 
                    relativePath.includes(ignore.replace(/\*/g, ''))
                )) {
                    continue;
                }

                if (entry.isDirectory()) {
                    walkDirectory(fullPath, pattern);
                } else if (entry.name.endsWith('.md')) {
                    files.add(fullPath);
                }
            }
        } catch (error) {
            // Skip inaccessible directories
        }
    }

    for (const pattern of patterns) {
        if (pattern.endsWith('.md') && !pattern.includes('*')) {
            // Single file
            const filePath = resolve(config.rootDir, pattern);
            if (existsSync(filePath)) {
                files.add(filePath);
            }
        } else {
            // Directory or pattern
            let searchDir = pattern
                .replace('/**/*.md', '')
                .replace('**/*.md', '')
                .replace('*.md', '');
            
            if (!searchDir) {
                searchDir = config.rootDir;
            } else {
                searchDir = resolve(config.rootDir, searchDir);
            }
            
            if (existsSync(searchDir)) {
                walkDirectory(searchDir);
            }
        }
    }

    return Array.from(files);
}

/**
 * Main validation function
 * @param {string[]} patterns - Glob patterns to search
 * @returns {Promise<ValidationResults>}
 */
async function validateDocumentationLinks(patterns = config.searchPaths) {
    const results = new ValidationResults();

    console.log(`${colors.bold}🔍 Scanning documentation for links...${colors.reset}\n`);

    // Find all markdown files
    const files = findMarkdownFiles(patterns);

    results.totalFiles = files.length;

    console.log(`Found ${colors.cyan}${files.length}${colors.reset} markdown files\n`);

    // Validate each file
    files.forEach(file => {
        console.log(`Checking: ${colors.cyan}${relative(config.rootDir, file)}${colors.reset}`);
        validateFile(file, results);
    });

    return results;
}

/**
 * CLI entry point
 */
async function main() {
    const args = process.argv.slice(2);
    let patterns = config.searchPaths;

    // Allow custom path argument
    if (args.length > 0) {
        patterns = args.map(arg => {
            if (arg.endsWith('.md')) {
                return arg;
            }
            return join(arg, '**/*.md');
        });
    }

    try {
        const results = await validateDocumentationLinks(patterns);
        results.print();
        process.exit(results.getExitCode());
    } catch (error) {
        console.error(`${colors.red}${colors.bold}Fatal error:${colors.reset} ${error.message}`);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { validateDocumentationLinks, ValidationResults };
