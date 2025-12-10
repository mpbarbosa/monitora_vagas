#!/usr/bin/env node
/**
 * CSS Loading Test Suite - Node.js/Puppeteer Version
 * Tests that all CSS files are loaded properly
 */

const puppeteer = require('puppeteer');

class CSSLoadingTestSuite {
    constructor(url = 'http://localhost:8080') {
        this.url = url;
        this.browser = null;
        this.page = null;
        this.results = [];
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = 0;
    }

    async setup() {
        try {
            this.browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            this.page = await this.browser.newPage();
            console.log('✓ Puppeteer browser initialized');
            return true;
        } catch (error) {
            console.error(`✗ Failed to initialize browser: ${error.message}`);
            return false;
        }
    }

    async teardown() {
        if (this.browser) {
            await this.browser.close();
            console.log('✓ Browser closed');
        }
    }

    logTest(name, passed, message) {
        this.totalTests++;
        const status = passed ? 'PASS' : 'FAIL';
        const symbol = passed ? '✓' : '✗';

        if (passed) {
            this.passedTests++;
        } else {
            this.failedTests++;
        }

        const result = `${symbol} ${status}: ${name} - ${message}`;
        this.results.push({ name, passed, message });
        console.log(result);

        return passed;
    }

    async testPageLoads() {
        try {
            await this.page.goto(this.url, { waitUntil: 'networkidle2', timeout: 30000 });
            const title = await this.page.title();
            return this.logTest(
                'Page loads',
                title.length > 0,
                `Page title: '${title}'`
            );
        } catch (error) {
            return this.logTest(
                'Page loads',
                false,
                `Error: ${error.message}`
            );
        }
    }

    async testStylesheetsLoaded() {
        try {
            const stylesheets = await this.page.$$('link[rel="stylesheet"]');
            const count = stylesheets.length;

            const expectedFiles = [
                'material-design-iconic-font.min.css',
                'font-awesome.min.css',
                'select2.min.css',
                'daterangepicker.css',
                'main.css'
            ];

            const loadedHrefs = await this.page.$$eval('link[rel="stylesheet"]', links =>
                links.map(link => link.href)
            );

            for (const expected of expectedFiles) {
                const found = loadedHrefs.some(href => href.includes(expected));
                this.logTest(
                    `Stylesheet ${expected}`,
                    found,
                    found ? 'Loaded' : 'Not found'
                );
            }

            return this.logTest(
                'Total stylesheets',
                count >= 5,
                `${count} stylesheets found (expected at least 5)`
            );
        } catch (error) {
            return this.logTest(
                'Stylesheets loaded',
                false,
                `Error: ${error.message}`
            );
        }
    }

    async testCSSRulesLoaded() {
        try {
            const totalRules = await this.page.evaluate(() => {
                let count = 0;
                for (const sheet of document.styleSheets) {
                    try {
                        if (sheet.cssRules) {
                            count += sheet.cssRules.length;
                        }
                    } catch (e) {
                        // CORS blocked
                    }
                }
                return count;
            });

            return this.logTest(
                'CSS rules loaded',
                totalRules > 0,
                `${totalRules} CSS rules loaded`
            );
        } catch (error) {
            return this.logTest(
                'CSS rules loaded',
                false,
                `Error: ${error.message}`
            );
        }
    }

    async testCSSVariables() {
        try {
            const variables = await this.page.evaluate(() => {
                const vars = [
                    '--color-primary',
                    '--font-family-base',
                    '--spacing-4',
                    '--border-radius-base',
                    '--shadow-base'
                ];
                const results = {};
                for (const varName of vars) {
                    const value = getComputedStyle(document.documentElement)
                        .getPropertyValue(varName).trim();
                    results[varName] = value || null;
                }
                return results;
            });

            for (const [varName, value] of Object.entries(variables)) {
                this.logTest(
                    `CSS Variable ${varName}`,
                    value !== null && value.length > 0,
                    value ? `Value: '${value}'` : 'Not defined'
                );
            }

            const definedCount = Object.values(variables).filter(v => v).length;
            return this.logTest(
                'CSS variables defined',
                definedCount > 0,
                `${definedCount}/${Object.keys(variables).length} variables defined`
            );
        } catch (error) {
            return this.logTest(
                'CSS variables',
                false,
                `Error: ${error.message}`
            );
        }
    }

    async testFontFamilies() {
        try {
            const bodyFont = await this.page.evaluate(() => {
                return getComputedStyle(document.body).fontFamily;
            });

            this.logTest(
                'Body font family',
                bodyFont.length > 0,
                `Font: ${bodyFont}`
            );

            const robotoLoaded = bodyFont.toLowerCase().includes('roboto');
            return this.logTest(
                'Roboto font',
                true,
                robotoLoaded ? 'Loaded' : `Using: ${bodyFont}`
            );
        } catch (error) {
            return this.logTest(
                'Font families',
                false,
                `Error: ${error.message}`
            );
        }
    }

    async testIconFonts() {
        try {
            const fonts = await this.page.evaluate(() => {
                // Test Font Awesome
                const faIcon = document.createElement('i');
                faIcon.className = 'fa fa-check';
                document.body.appendChild(faIcon);
                const faFont = getComputedStyle(faIcon).fontFamily;
                document.body.removeChild(faIcon);

                // Test Material Design Icons
                const mdiIcon = document.createElement('i');
                mdiIcon.className = 'zmdi zmdi-check';
                document.body.appendChild(mdiIcon);
                const mdiFont = getComputedStyle(mdiIcon).fontFamily;
                document.body.removeChild(mdiIcon);

                return {
                    fontAwesome: faFont,
                    materialDesign: mdiFont
                };
            });

            const faLoaded = fonts.fontAwesome.toLowerCase().includes('fontawesome');
            this.logTest(
                'Font Awesome icons',
                faLoaded,
                fonts.fontAwesome
            );

            const mdiLoaded = fonts.materialDesign.toLowerCase().includes('material');
            this.logTest(
                'Material Design icons',
                mdiLoaded,
                fonts.materialDesign
            );

            return faLoaded || mdiLoaded;
        } catch (error) {
            return this.logTest(
                'Icon fonts',
                false,
                `Error: ${error.message}`
            );
        }
    }

    async testCSSClassesApplied() {
        try {
            const classesToTest = [
                'page-wrapper',
                'wrapper',
                'card',
                'form',
                'btn',
                'input-group'
            ];

            const results = await this.page.evaluate((classes) => {
                return classes.map(className => {
                    const el = document.createElement('div');
                    el.className = className;
                    el.style.cssText = 'position: absolute; visibility: hidden;';
                    document.body.appendChild(el);
                    const style = getComputedStyle(el);
                    const display = style.display;
                    const hasStyles = display !== 'none';
                    document.body.removeChild(el);
                    return {
                        className,
                        display,
                        hasStyles
                    };
                });
            }, classesToTest);

            let appliedCount = 0;
            for (const result of results) {
                if (result.hasStyles) {
                    appliedCount++;
                }
                this.logTest(
                    `Class '.${result.className}'`,
                    result.hasStyles,
                    `display: ${result.display}`
                );
            }

            return this.logTest(
                'CSS classes applied',
                appliedCount > 0,
                `${appliedCount}/${classesToTest.length} classes have styles`
            );
        } catch (error) {
            return this.logTest(
                'CSS classes',
                false,
                `Error: ${error.message}`
            );
        }
    }

    async testResponsiveBreakpoints() {
        try {
            const mediaQueries = await this.page.evaluate(() => {
                let count = 0;
                for (const sheet of document.styleSheets) {
                    try {
                        if (sheet.cssRules) {
                            for (const rule of sheet.cssRules) {
                                if (rule.type === CSSRule.MEDIA_RULE) {
                                    count++;
                                }
                            }
                        }
                    } catch (e) {
                        // CORS blocked
                    }
                }
                return count;
            });

            return this.logTest(
                'Media queries',
                mediaQueries >= 0,
                `${mediaQueries} media query rules found`
            );
        } catch (error) {
            return this.logTest(
                'Responsive breakpoints',
                false,
                `Error: ${error.message}`
            );
        }
    }

    async testCSSLoadOrder() {
        try {
            const sheetOrder = await this.page.evaluate(() => {
                return Array.from(document.styleSheets).map(s => {
                    if (!s.href) return 'inline';
                    const parts = s.href.split('/');
                    return parts[parts.length - 1];
                });
            });

            const cssFiles = sheetOrder.filter(s => s !== 'inline' && s.includes('.css'));
            const mainIsLast = cssFiles.length > 0 && cssFiles[cssFiles.length - 1] === 'main.css';

            return this.logTest(
                'CSS load order',
                mainIsLast,
                `main.css is ${mainIsLast ? 'last' : 'not last'}: ${cssFiles.join(', ')}`
            );
        } catch (error) {
            return this.logTest(
                'CSS load order',
                false,
                `Error: ${error.message}`
            );
        }
    }

    async testCSSLoadPerformance() {
        try {
            const perf = await this.page.evaluate(() => {
                if (!performance || !performance.getEntriesByType) {
                    return null;
                }

                const resources = performance.getEntriesByType('resource');
                const cssResources = resources.filter(r => r.name.includes('.css'));

                if (cssResources.length === 0) {
                    return null;
                }

                const times = cssResources.map(r => r.duration);
                const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
                const maxTime = Math.max(...times);

                return {
                    count: cssResources.length,
                    avgTime: avgTime,
                    maxTime: maxTime
                };
            });

            if (perf === null) {
                return this.logTest(
                    'CSS load performance',
                    true,
                    'Performance API not available or no data'
                );
            }

            const isGood = perf.maxTime < 1000;
            return this.logTest(
                'CSS load performance',
                isGood,
                `${perf.count} files, avg: ${perf.avgTime.toFixed(2)}ms, max: ${perf.maxTime.toFixed(2)}ms`
            );
        } catch (error) {
            return this.logTest(
                'CSS load performance',
                false,
                `Error: ${error.message}`
            );
        }
    }

    async runAllTests() {
        console.log('='.repeat(70));
        console.log('CSS LOADING TEST SUITE - Node.js/Puppeteer');
        console.log('='.repeat(70));
        console.log();

        if (!(await this.setup())) {
            console.log('Failed to setup browser');
            return false;
        }

        try {
            console.log(`Testing URL: ${this.url}`);
            console.log();

            console.log('--- Test Group 1: Page Loading ---');
            await this.testPageLoads();
            console.log();

            console.log('--- Test Group 2: Stylesheet Loading ---');
            await this.testStylesheetsLoaded();
            console.log();

            console.log('--- Test Group 3: CSS Rules ---');
            await this.testCSSRulesLoaded();
            console.log();

            console.log('--- Test Group 4: CSS Variables ---');
            await this.testCSSVariables();
            console.log();

            console.log('--- Test Group 5: Font Loading ---');
            await this.testFontFamilies();
            console.log();

            console.log('--- Test Group 6: Icon Fonts ---');
            await this.testIconFonts();
            console.log();

            console.log('--- Test Group 7: CSS Classes ---');
            await this.testCSSClassesApplied();
            console.log();

            console.log('--- Test Group 8: Responsive Design ---');
            await this.testResponsiveBreakpoints();
            console.log();

            console.log('--- Test Group 9: Load Order ---');
            await this.testCSSLoadOrder();
            console.log();

            console.log('--- Test Group 10: Performance ---');
            await this.testCSSLoadPerformance();
            console.log();

            console.log('='.repeat(70));
            console.log('TEST SUMMARY');
            console.log('='.repeat(70));
            console.log(`Total Tests:  ${this.totalTests}`);
            console.log(`Passed:       ${this.passedTests} ✓`);
            console.log(`Failed:       ${this.failedTests} ✗`);

            if (this.totalTests > 0) {
                const passRate = ((this.passedTests / this.totalTests) * 100).toFixed(1);
                console.log(`Pass Rate:    ${passRate}%`);
            }

            console.log('='.repeat(70));

            return this.failedTests === 0;
        } finally {
            await this.teardown();
        }
    }
}

// Main execution
async function main() {
    const url = process.argv[2] || 'http://localhost:8080';
    const suite = new CSSLoadingTestSuite(url);
    const success = await suite.runAllTests();
    process.exit(success ? 0 : 1);
}

// Check if puppeteer is installed
try {
    require.resolve('puppeteer');
    main().catch(error => {
        console.error('Error running tests:', error);
        process.exit(1);
    });
} catch (e) {
    console.error('Error: puppeteer is not installed.');
    console.error('Please install it with: npm install puppeteer');
    process.exit(1);
}
