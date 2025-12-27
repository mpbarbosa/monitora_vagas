# Test Coverage Dashboard

## 📊 Overview

The Test Coverage Dashboard provides a comprehensive visualization of test coverage across the entire project, tracking both Jest unit tests and use case end-to-end tests with historical trend analysis.

## Features

### 1. **Unified Coverage View**

- **Jest Unit Tests**: Statements, branches, functions, and lines coverage
- **Use Case Tests**: End-to-end test coverage with pass/fail status
- **Overall Coverage**: Combined metric showing project health

### 2. **Visual Indicators**

- **Color-coded Progress Bars**:
  - 🟢 Green (≥80%): Excellent coverage
  - 🟠 Orange (60-79%): Acceptable coverage
  - 🔴 Red (<60%): Needs improvement

### 3. **Historical Tracking**

- **Trend Chart**: Line graph showing coverage evolution over last 30 runs
- **Timestamp**: Each run is timestamped for audit trail
- **Comparison**: Easy comparison between current and historical performance

### 4. **Detailed Use Case Status**

- **Individual Test Results**: See which specific use cases pass/fail
- **Success Rate**: Percentage of passing use cases
- **Quick Identification**: Instantly spot problematic test areas

## Quick Start

### Generate Dashboard

```bash
# Full workflow - collect use case results + generate dashboard
npm run coverage:full

# Or run individually
npm run coverage:collect      # Collect use case test results
npm run coverage:dashboard    # Generate HTML dashboard
```

### View Dashboard

```bash
# Open in browser
open coverage/dashboard.html

# Or navigate to
file:///path/to/monitora_vagas/coverage/dashboard.html
```

## Dashboard Components

### 1. Overall Coverage Card
Shows combined coverage percentage from Jest and use case tests:
- **Big Number Display**: Immediate visual of overall health
- **Status Badge**: PASSING (≥60%) or NEEDS WORK (<60%)

### 2. Jest Unit Tests Card
Detailed breakdown of unit test coverage:
- **Statements**: Percentage of code statements executed
- **Branches**: Percentage of conditional branches tested
- **Functions**: Percentage of functions called
- **Lines**: Percentage of code lines executed

### 3. Use Case Tests Card
End-to-end test results:
- **Coverage Percentage**: Based on passed/total ratio
- **Status Table**: Each use case with pass/fail indicator
- **Quick Scan**: Green checkmarks for passes, red X for failures

### 4. Coverage Trend Chart
Historical visualization:
- **Jest Statements**: Blue line tracking unit test coverage
- **Use Cases**: Green line tracking E2E test coverage
- **Last 30 Runs**: Historical context for improvements/regressions

## Files & Structure

```
coverage/
├── dashboard.html          # Main interactive HTML dashboard
├── history.json            # Historical coverage data (last 30 runs)
├── coverage-summary.json   # Jest coverage data
└── lcov-report/            # Detailed Jest HTML coverage report
    └── index.html

tests/
└── use_cases/
    └── results.json        # Use case test results

scripts/
├── generate-coverage-report.js  # Dashboard generator (Node.js)
└── collect-use-case-results.py  # Use case results collector (Python)
```

## Scripts

### generate-coverage-report.js

**Purpose**: Generates the HTML coverage dashboard

**Features**:
- Runs Jest tests with coverage
- Reads use case results
- Updates historical data
- Generates interactive HTML with Chart.js

**Usage**:
```bash
node scripts/generate-coverage-report.js
```

### collect-use-case-results.py

**Purpose**: Runs all use case tests and collects results

**Features**:
- Executes each use case test file
- Captures pass/fail status
- Records execution duration
- Generates JSON summary

**Usage**:
```bash
python3 scripts/collect-use-case-results.py
```

## Configuration

Dashboard settings in `scripts/generate-coverage-report.js`:

```javascript
const CONFIG = {
    outputDir: 'coverage',
    dashboardFile: 'coverage/dashboard.html',
    historyFile: 'coverage/history.json',
    targetCoverage: 60  // Target percentage
};
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Coverage Dashboard

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          npm ci
          pip install -r requirements.txt
      
      - name: Generate coverage dashboard
        run: npm run coverage:full
      
      - name: Upload dashboard
        uses: actions/upload-artifact@v4
        with:
          name: coverage-dashboard
          path: coverage/dashboard.html
      
      - name: Comment PR with coverage
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const summary = JSON.parse(
              fs.readFileSync('coverage/coverage-summary.json', 'utf8')
            );
            const stmtCov = summary.total.statements.pct;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `📊 Coverage Report: ${stmtCov}% statements`
            });
```

## Interpreting Results

### Coverage Thresholds

| Metric | Target | Good | Needs Work |
|--------|--------|------|------------|
| **Overall** | ≥60% | ≥80% | <60% |
| **Statements** | ≥60% | ≥80% | <60% |
| **Branches** | ≥60% | ≥80% | <60% |
| **Functions** | ≥60% | ≥80% | <60% |
| **Lines** | ≥60% | ≥80% | <60% |
| **Use Cases** | ≥80% | 100% | <80% |

### What to Focus On

1. **Low Statement Coverage** (<60%)
   - Indicates untested code paths
   - **Action**: Add unit tests for uncovered files

2. **Low Branch Coverage** (<60%)
   - Missing conditional logic tests
   - **Action**: Test if/else branches and switch cases

3. **Failed Use Cases**
   - Broken end-to-end functionality
   - **Action**: Debug and fix immediately (high priority)

4. **Declining Trends**
   - Coverage dropping over time
   - **Action**: Enforce coverage checks in CI

## Best Practices

### 1. **Run Before Commits**
```bash
# Add to pre-commit hook
npm run coverage:full
```

### 2. **Set Coverage Gates**
Update `jest.config.js`:
```javascript
coverageThreshold: {
    global: {
        statements: 60,
        branches: 60,
        functions: 60,
        lines: 60
    }
}
```

### 3. **Review Dashboard Weekly**
- Check trend direction (improving vs. declining)
- Identify consistently failing use cases
- Plan test improvements

### 4. **Document Skipped Tests**
When skipping tests, document why in `results.json`:
```json
{
  "UC-009: Holiday Package Detection": {
    "passed": false,
    "skipped": true,
    "message": "Requires mock server - implementation pending"
  }
}
```

## Troubleshooting

### Dashboard Not Generating

**Symptom**: `npm run coverage:dashboard` fails

**Solutions**:
1. Ensure Node.js ≥20.0.0: `node --version`
2. Check Jest coverage exists: `ls coverage/coverage-summary.json`
3. Run Jest manually: `npm run test:ci:unit`

### No Use Case Results

**Symptom**: Dashboard shows "No use case results available"

**Solutions**:
1. Run use case collector: `npm run coverage:collect`
2. Verify results file exists: `ls tests/use_cases/results.json`
3. Check test paths in `scripts/collect-use-case-results.py`

### Chart Not Displaying

**Symptom**: Trend chart area is blank

**Solutions**:
1. Check browser console for JavaScript errors
2. Ensure internet connection (loads Chart.js from CDN)
3. Need at least 2 history entries for chart to render

### Old History Data

**Symptom**: Trend chart shows outdated information

**Solutions**:
```bash
# Clear history and regenerate
rm coverage/history.json
npm run coverage:full
```

## Advanced Usage

### Custom Use Case Mapping

Edit `scripts/collect-use-case-results.py`:

```python
USE_CASES = {
    "UC-001: My Custom Test": "test_custom.py",
    "UC-002: Another Test": "test_another.py",
    # Add more use cases...
}
```

### Export Coverage Data

```bash
# Export as JSON
cat coverage/history.json | jq

# Export summary as CSV
node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('coverage/coverage-summary.json'));
console.log('Metric,Coverage');
console.log('Statements,' + data.total.statements.pct);
console.log('Branches,' + data.total.branches.pct);
console.log('Functions,' + data.total.functions.pct);
console.log('Lines,' + data.total.lines.pct);
" > coverage-summary.csv
```

### Integrate with Slack

Post coverage updates to Slack channel:

```bash
#!/bin/bash
# scripts/notify-coverage.sh

COVERAGE=$(node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('coverage/coverage-summary.json'));
console.log(data.total.statements.pct);
")

curl -X POST -H 'Content-type: application/json' \
  --data "{\"text\":\"Coverage: ${COVERAGE}%\"}" \
  $SLACK_WEBHOOK_URL
```

## Maintenance

### Keep History Manageable

The dashboard automatically keeps only the last 30 entries. To adjust:

```javascript
// In scripts/generate-coverage-report.js
// Keep last 30 entries
history.push(entry);
if (history.length > 30) {  // Change this number
    history.shift();
}
```

### Update Dependencies

```bash
# Update Chart.js version in dashboard HTML if needed
# Current: 4.4.0
# Check for updates: https://www.jsdelivr.com/package/npm/chart.js
```

## Related Documentation

- [Testing Guide](../testing/TEST_EXECUTION_SUMMARY.md)
- [Use Case Specifications](../features/USE_CASE_SPECIFICATIONS.md)
- [CI/CD Pipeline](../.github/workflows/ci.yml)
- [Jest Configuration](../../jest.config.js)

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/monitora_vagas/issues)
- **Questions**: Open discussion in GitHub
- **Improvements**: Submit pull request with enhancement

---

**Generated**: 2025-12-26  
**Version**: 1.0.0  
**Maintainer**: Development Team
