# Test Coverage Dashboard - Quick Reference

## 🚀 Quick Commands

```bash
# Generate full dashboard
npm run coverage:full

# Individual steps
npm run coverage:collect      # Collect use case results
npm run coverage:dashboard    # Generate HTML dashboard

# View dashboard
open coverage/dashboard.html
```

## 📊 Coverage Targets

| Metric | Target | Status |
|--------|--------|--------|
| Overall | ≥60% | 🎯 |
| Unit Tests | ≥60% | 🎯 |
| Use Cases | ≥80% | 🎯 |

## 🎨 Color Codes

- 🟢 **Green** (≥80%): Excellent
- 🟠 **Orange** (60-79%): Good
- 🔴 **Red** (<60%): Needs work

## 📁 Key Files

```
coverage/
├── dashboard.html          # Main dashboard (open this!)
├── history.json            # Historical data
└── lcov-report/index.html  # Detailed coverage

tests/use_cases/results.json  # Use case results
```

## 🔧 Troubleshooting

### Dashboard not generating?
```bash
# Check Node version (need ≥20)
node --version

# Run tests first
npm run test:ci:unit
```

### No use case data?
```bash
# Run collector
python3 scripts/collect-use-case-results.py
```

### Chart not showing?
- Need ≥2 history entries
- Check internet (loads Chart.js from CDN)

## 💡 Tips

1. **Pre-commit**: Run `npm run coverage:full` before commits
2. **Weekly Review**: Check trends every week
3. **CI Integration**: Auto-generate in GitHub Actions
4. **Set Goals**: Aim for steady increase in coverage

## 📈 Interpreting Trends

- **Rising line** 📈: Coverage improving ✅
- **Flat line** ➡️: Stable (maintain) ⚠️
- **Falling line** 📉: Coverage declining ❌

## 🎯 Focus Areas

1. **Red bars**: Add tests immediately
2. **Failed use cases**: High priority bugs
3. **Declining trends**: Review recent changes

## 🔗 Related Docs

- [Full Documentation](./COVERAGE_DASHBOARD.md)
- [Testing Guide](./TEST_EXECUTION_SUMMARY.md)
- [Use Case Specs](../features/USE_CASE_SPECIFICATIONS.md)

---

**Need help?** See full docs at `docs/testing/COVERAGE_DASHBOARD.md`
