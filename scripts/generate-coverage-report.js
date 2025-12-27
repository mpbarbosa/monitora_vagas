#!/usr/bin/env node

/**
 * Test Coverage Dashboard Generator
 * 
 * Generates HTML dashboard visualizing:
 * - Jest unit test coverage
 * - Use case test coverage
 * - Test execution trends over time
 * 
 * Usage:
 *   node scripts/generate-coverage-report.js
 *   npm run coverage:dashboard
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Configuration
const CONFIG = {
    outputDir: path.join(rootDir, 'coverage'),
    dashboardFile: path.join(rootDir, 'coverage', 'dashboard.html'),
    historyFile: path.join(rootDir, 'coverage', 'history.json'),
    jestCoverageFile: path.join(rootDir, 'coverage', 'coverage-summary.json'),
    useCaseResultsFile: path.join(rootDir, 'tests', 'use_cases', 'results.json'),
    targetCoverage: 60
};

/**
 * Run Jest tests with coverage and return results
 */
function runJestCoverage() {
    console.log('📊 Running Jest tests with coverage...');
    
    try {
        execSync('npm run test:ci:unit', {
            cwd: rootDir,
            stdio: 'inherit'
        });
        
        return true;
    } catch (error) {
        console.warn('⚠️  Jest coverage failed, but continuing with existing data');
        return false;
    }
}

/**
 * Read Jest coverage summary
 */
function readJestCoverage() {
    if (!fs.existsSync(CONFIG.jestCoverageFile)) {
        console.warn('⚠️  No Jest coverage file found');
        return null;
    }
    
    const data = JSON.parse(fs.readFileSync(CONFIG.jestCoverageFile, 'utf8'));
    return data.total;
}

/**
 * Read use case test results
 */
function readUseCaseResults() {
    if (!fs.existsSync(CONFIG.useCaseResultsFile)) {
        console.warn('⚠️  No use case results found');
        return null;
    }
    
    const data = JSON.parse(fs.readFileSync(CONFIG.useCaseResultsFile, 'utf8'));
    return data;
}

/**
 * Calculate use case coverage percentage
 */
function calculateUseCaseCoverage(results) {
    if (!results || !results.summary) {
        return 0;
    }
    
    const { passed, total } = results.summary;
    return total > 0 ? Math.round((passed / total) * 100) : 0;
}

/**
 * Read coverage history
 */
function readHistory() {
    if (!fs.existsSync(CONFIG.historyFile)) {
        return [];
    }
    
    return JSON.parse(fs.readFileSync(CONFIG.historyFile, 'utf8'));
}

/**
 * Save current coverage to history
 */
function saveToHistory(jestCoverage, useCaseResults) {
    const history = readHistory();
    
    const entry = {
        timestamp: new Date().toISOString(),
        jest: jestCoverage ? {
            statements: jestCoverage.statements.pct,
            branches: jestCoverage.branches.pct,
            functions: jestCoverage.functions.pct,
            lines: jestCoverage.lines.pct
        } : null,
        useCases: useCaseResults ? {
            total: useCaseResults.summary.total,
            passed: useCaseResults.summary.passed,
            failed: useCaseResults.summary.failed,
            coverage: calculateUseCaseCoverage(useCaseResults)
        } : null
    };
    
    // Keep last 30 entries
    history.push(entry);
    if (history.length > 30) {
        history.shift();
    }
    
    fs.writeFileSync(CONFIG.historyFile, JSON.stringify(history, null, 2));
    
    return history;
}

/**
 * Generate coverage badge color
 */
function getCoverageColor(percentage) {
    if (percentage >= 80) return '#4caf50'; // Green
    if (percentage >= 60) return '#ff9800'; // Orange
    if (percentage >= 40) return '#ff5722'; // Deep orange
    return '#f44336'; // Red
}

/**
 * Generate HTML dashboard
 */
function generateDashboard(jestCoverage, useCaseResults, history) {
    const now = new Date().toISOString();
    
    const jestStmtPct = jestCoverage?.statements.pct || 0;
    const jestBranchPct = jestCoverage?.branches.pct || 0;
    const jestFuncPct = jestCoverage?.functions.pct || 0;
    const jestLinesPct = jestCoverage?.lines.pct || 0;
    
    const useCaseCoverage = calculateUseCaseCoverage(useCaseResults);
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Coverage Dashboard - Monitora Vagas</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: #f5f5f5;
            padding: 20px;
            color: #333;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        header {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        
        h1 {
            font-size: 32px;
            margin-bottom: 10px;
            color: #1976d2;
        }
        
        .meta {
            color: #666;
            font-size: 14px;
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .card {
            background: white;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .card h2 {
            font-size: 18px;
            margin-bottom: 20px;
            color: #555;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 10px;
        }
        
        .metric {
            margin-bottom: 15px;
        }
        
        .metric-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 5px;
        }
        
        .metric-bar {
            height: 30px;
            background: #e0e0e0;
            border-radius: 15px;
            overflow: hidden;
            position: relative;
        }
        
        .metric-fill {
            height: 100%;
            transition: width 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
        }
        
        .metric-value {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-weight: bold;
            font-size: 14px;
            color: white;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        
        .status-good { background: #4caf50; }
        .status-warning { background: #ff9800; }
        .status-danger { background: #f44336; }
        
        .summary-card {
            text-align: center;
        }
        
        .big-number {
            font-size: 48px;
            font-weight: bold;
            margin: 20px 0;
        }
        
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
            color: white;
        }
        
        .chart-container {
            width: 100%;
            height: 300px;
            margin-top: 20px;
        }
        
        canvas {
            max-width: 100%;
            height: 100%;
        }
        
        .trend-indicator {
            display: inline-block;
            margin-left: 10px;
            font-size: 18px;
        }
        
        .trend-up { color: #4caf50; }
        .trend-down { color: #f44336; }
        .trend-stable { color: #ff9800; }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        
        th, td {
            text-align: left;
            padding: 12px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        th {
            background: #f5f5f5;
            font-weight: 600;
            color: #555;
        }
        
        tr:hover {
            background: #fafafa;
        }
        
        .pass { color: #4caf50; font-weight: bold; }
        .fail { color: #f44336; font-weight: bold; }
        
        footer {
            text-align: center;
            margin-top: 40px;
            color: #999;
            font-size: 14px;
        }
        
        @media (max-width: 768px) {
            .grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📊 Test Coverage Dashboard</h1>
            <div class="meta">
                <strong>Project:</strong> Monitora Vagas v2.2.0 &nbsp;|&nbsp;
                <strong>Generated:</strong> ${new Date(now).toLocaleString()} &nbsp;|&nbsp;
                <strong>Target:</strong> ${CONFIG.targetCoverage}%
            </div>
        </header>
        
        <div class="grid">
            <!-- Overall Coverage -->
            <div class="card summary-card">
                <h2>Overall Coverage</h2>
                <div class="big-number" style="color: ${getCoverageColor((jestStmtPct + useCaseCoverage) / 2)}">
                    ${Math.round((jestStmtPct + useCaseCoverage) / 2)}%
                </div>
                <div class="status-badge" style="background: ${getCoverageColor((jestStmtPct + useCaseCoverage) / 2)}">
                    ${((jestStmtPct + useCaseCoverage) / 2) >= CONFIG.targetCoverage ? 'PASSING' : 'NEEDS WORK'}
                </div>
            </div>
            
            <!-- Jest Unit Tests -->
            <div class="card">
                <h2>Jest Unit Tests</h2>
                <div class="metric">
                    <div class="metric-label">Statements</div>
                    <div class="metric-bar">
                        <div class="metric-fill" style="width: ${jestStmtPct}%; background: ${getCoverageColor(jestStmtPct)}">
                            <span class="metric-value">${jestStmtPct.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                <div class="metric">
                    <div class="metric-label">Branches</div>
                    <div class="metric-bar">
                        <div class="metric-fill" style="width: ${jestBranchPct}%; background: ${getCoverageColor(jestBranchPct)}">
                            <span class="metric-value">${jestBranchPct.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                <div class="metric">
                    <div class="metric-label">Functions</div>
                    <div class="metric-bar">
                        <div class="metric-fill" style="width: ${jestFuncPct}%; background: ${getCoverageColor(jestFuncPct)}">
                            <span class="metric-value">${jestFuncPct.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                <div class="metric">
                    <div class="metric-label">Lines</div>
                    <div class="metric-bar">
                        <div class="metric-fill" style="width: ${jestLinesPct}%; background: ${getCoverageColor(jestLinesPct)}">
                            <span class="metric-value">${jestLinesPct.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Use Case Tests -->
            <div class="card">
                <h2>Use Case Tests</h2>
                ${useCaseResults ? `
                <div class="metric">
                    <div class="metric-label">Coverage (${useCaseResults.summary.passed}/${useCaseResults.summary.total} passed)</div>
                    <div class="metric-bar">
                        <div class="metric-fill" style="width: ${useCaseCoverage}%; background: ${getCoverageColor(useCaseCoverage)}">
                            <span class="metric-value">${useCaseCoverage}%</span>
                        </div>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Use Case</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(useCaseResults.tests || {}).map(([name, result]) => `
                            <tr>
                                <td>${name}</td>
                                <td class="${result.passed ? 'pass' : 'fail'}">${result.passed ? '✓ PASS' : '✗ FAIL'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                ` : '<p style="color: #999;">No use case results available</p>'}
            </div>
        </div>
        
        <!-- Coverage History Chart -->
        ${history.length > 1 ? `
        <div class="card">
            <h2>Coverage Trend (Last ${history.length} Runs)</h2>
            <div class="chart-container">
                <canvas id="trendChart"></canvas>
            </div>
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>
        <script>
            const ctx = document.getElementById('trendChart').getContext('2d');
            const history = ${JSON.stringify(history)};
            
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: history.map(h => new Date(h.timestamp).toLocaleDateString()),
                    datasets: [
                        {
                            label: 'Jest Statements',
                            data: history.map(h => h.jest?.statements || 0),
                            borderColor: '#1976d2',
                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                            tension: 0.4
                        },
                        {
                            label: 'Use Cases',
                            data: history.map(h => h.useCases?.coverage || 0),
                            borderColor: '#4caf50',
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                                }
                            }
                        }
                    }
                }
            });
        </script>
        ` : ''}
        
        <footer>
            <p>Generated by Test Coverage Dashboard Generator | Monitora Vagas v2.2.0</p>
            <p>For detailed coverage reports, see <code>coverage/lcov-report/index.html</code></p>
        </footer>
    </div>
</body>
</html>`;
    
    fs.writeFileSync(CONFIG.dashboardFile, html);
    console.log(`✅ Dashboard generated: ${CONFIG.dashboardFile}`);
}

/**
 * Main execution
 */
function main() {
    console.log('🚀 Starting Test Coverage Dashboard Generator\n');
    
    // Ensure coverage directory exists
    if (!fs.existsSync(CONFIG.outputDir)) {
        fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }
    
    // Run Jest coverage
    runJestCoverage();
    
    // Read coverage data
    const jestCoverage = readJestCoverage();
    const useCaseResults = readUseCaseResults();
    
    // Save to history
    const history = saveToHistory(jestCoverage, useCaseResults);
    
    // Generate dashboard
    generateDashboard(jestCoverage, useCaseResults, history);
    
    console.log('\n✨ Coverage dashboard ready!');
    console.log(`   Open: ${CONFIG.dashboardFile}`);
    
    // Print summary
    if (jestCoverage) {
        console.log(`\n📊 Jest Coverage:`);
        console.log(`   Statements: ${jestCoverage.statements.pct.toFixed(1)}%`);
        console.log(`   Branches:   ${jestCoverage.branches.pct.toFixed(1)}%`);
        console.log(`   Functions:  ${jestCoverage.functions.pct.toFixed(1)}%`);
        console.log(`   Lines:      ${jestCoverage.lines.pct.toFixed(1)}%`);
    }
    
    if (useCaseResults) {
        const coverage = calculateUseCaseCoverage(useCaseResults);
        console.log(`\n📋 Use Case Tests:`);
        console.log(`   Total:   ${useCaseResults.summary.total}`);
        console.log(`   Passed:  ${useCaseResults.summary.passed}`);
        console.log(`   Failed:  ${useCaseResults.summary.failed}`);
        console.log(`   Coverage: ${coverage}%`);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
