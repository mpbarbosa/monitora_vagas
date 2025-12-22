# 📋 Dependency Update Quick Reference

> Quick guide for updating project dependencies safely

## 🚀 Quick Start

### Run All Safe Updates (Recommended)

```bash
./scripts/update-dependencies.sh all
```

This will:
- ✅ Fix selenium-webdriver classification
- ✅ Update Bootstrap to 5.3.8
- ✅ Update markdownlint-cli to 0.47.0

**Time**: ~2 minutes  
**Risk**: Low

---

## 📦 Phase-by-Phase Updates

### Phase 0: Critical Fix (2 minutes)

Fix selenium-webdriver dependency classification:

```bash
./scripts/update-dependencies.sh 0
# or
./scripts/update-dependencies.sh critical
```

### Phase 1: Safe Updates (30 minutes)

Update Bootstrap and markdownlint:

```bash
./scripts/update-dependencies.sh 1
# or
./scripts/update-dependencies.sh safe
```

### Phase 2: Jest Upgrade (2-4 hours)

Upgrade Jest to v30 (requires testing):

```bash
./scripts/update-dependencies.sh 2
# or
./scripts/update-dependencies.sh jest
```

⚠️ **Warning**: This is a major version upgrade. Test thoroughly!

---

## 🧪 Testing After Updates

### Quick Test Suite

```bash
./scripts/update-dependencies.sh test
```

### Manual Testing

```bash
# Run all JavaScript tests
npm run test:all:js

# Run API tests with coverage
npm run test:api:coverage

# Run E2E tests
npm run test:e2e

# Linting
npm run lint
npm run lint:md

# Security audit
npm audit
```

---

## 📊 Check Dependency Status

### Check for outdated packages

```bash
npm outdated
```

### Check for security vulnerabilities

```bash
npm audit
npm audit --production  # Production only
```

### Check package info

```bash
npm list --depth=0     # Direct dependencies
npm list selenium-webdriver  # Specific package
```

---

## 🔧 Manual Updates

### Update specific package

```bash
# Update to latest patch/minor (respects semver range)
npm update bootstrap

# Install specific version
npm install bootstrap@5.3.8

# Update and save new range
npm install bootstrap@^5.3.8
```

### Update all packages to wanted versions

```bash
npm update
```

### Interactive update (requires npm-check-updates)

```bash
npx npm-check-updates --interactive
```

---

## 🎯 Critical Actions Summary

| Priority | Action | Command | Time |
|----------|--------|---------|------|
| P0 | Fix selenium classification | `./scripts/update-dependencies.sh 0` | 2 min |
| P1 | Safe updates | `./scripts/update-dependencies.sh 1` | 30 min |
| P2 | Jest upgrade | `./scripts/update-dependencies.sh 2` | 2-4 hrs |

---

## 🚨 Troubleshooting

### Update fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Version conflicts

```bash
# Check for conflicts
npm ls

# Force update package-lock.json
npm install --package-lock-only
```

### Rollback changes

```bash
# Revert package.json and package-lock.json
git checkout package.json package-lock.json
npm install
```

---

## 📚 Related Documents

- **[Complete Analysis](./DEPENDENCY_ANALYSIS_REPORT.md)** - Full dependency analysis
- **[Package.json](./package.json)** - Current dependencies
- **[Update Script](./scripts/update-dependencies.sh)** - Automated update script

---

## 🤖 Automated Updates

Dependabot is configured to automatically create PRs for:
- Security updates (immediate)
- Minor/patch updates (weekly on Mondays)

Configuration: `.github/dependabot.yml`

---

## 📝 Notes

### Current Status

```
✅ Security: No vulnerabilities
⚠️ Outdated: 5 packages
⚠️ Jest: Version mismatch (29 vs 30)
⚠️ Selenium: Wrong dependency type
```

### After All Updates

```
✅ Security: No vulnerabilities
✅ Outdated: 0 packages
✅ Jest: Version aligned (all v30)
✅ Selenium: Correctly in devDependencies
```

---

**Last Updated**: 2025-12-22  
**Next Review**: 2026-01-22
