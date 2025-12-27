# GitHub Configuration

**Version:** 2.2.0  
**Last Updated:** 2024-12-22  
**Maintainer:** Monitora Vagas Development Team

---

## 📋 Overview

This directory contains GitHub-specific configuration files for:
- ✅ Automated workflows (CI/CD)
- ✅ Dependency management
- ✅ Issue templates (if configured)
- ✅ Pull request templates (if configured)

---

## 🤖 Workflows

### 1. docs-organize.yml

**Purpose:** Validates documentation structure and quality on every push/PR

**Triggers:**
- Push to `docs/**` or `*.md` files
- Pull requests affecting `docs/**` or `*.md` files

**What it checks:**
1. ✅ **Markdown Linting** - Uses remark with recommended presets
2. ✅ **Internal Link Validation** - Ensures all relative links work
3. ✅ **Directory Structure** - Verifies required folders exist
4. ✅ **Documentation Health Report** - Generates statistics and structure report

**Required Directories:**
```
docs/
├── api/              # API documentation
├── architecture/     # System design docs
├── features/         # Feature specifications
├── guides/           # User/developer guides
├── implementation/   # Implementation details
├── specifications/   # Technical specifications
├── standards/        # Coding standards
├── testing/          # Test documentation
└── workflows/        # Workflow documentation
```

**Jobs:**
1. **lint-and-organize** (ubuntu-latest)
   - Checkout repository
   - Setup Node.js 20
   - Install remark tools
   - Lint documentation
   - Validate internal links (continues on error)
   - Check directory structure
   - Generate documentation report
   - Upload report as artifact

**Artifacts:**
- `documentation-report` - Contains `docs-report.md` with:
  - Directory structure (tree view)
  - Statistics (file count, directory count)
  - Timestamp

**Exit Codes:**
- `0` - All checks passed
- `1` - Linting errors or missing directories

**Fixing Failures:**

*Linting Errors:*
```bash
# Install remark locally
npm install -g remark-cli remark-lint remark-preset-lint-recommended

# Lint documentation
remark docs/ --use remark-preset-lint-recommended

# Auto-fix common issues
remark docs/ --use remark-preset-lint-recommended --output
```

*Link Validation Errors:*
```bash
# Install link validator
npm install -g remark-validate-links

# Check links
remark docs/ --use remark-validate-links

# Common fixes:
# - Update relative paths: [Link](../correct/path.md)
# - Fix anchor links: [Section](#correct-section-name)
# - Remove or update dead links
```

*Directory Structure Errors:*
```bash
# Create missing directories
mkdir -p docs/api docs/architecture docs/features docs/guides \
         docs/implementation docs/specifications docs/standards \
         docs/testing docs/workflows
```

**Related Documentation:**
- [Scripts Index](../docs/scripts/SCRIPTS_INDEX.md)
- [Documentation Standards](../docs/standards/DOCUMENTATION_AUTOMATION.md)
- [Markdown Linting Report](../docs/standards/MARKDOWN_LINTING_REPORT.md)

---

## 📦 Dependabot

### dependabot.yml

**Purpose:** Automated dependency updates for npm packages

**Configuration:**
- **Ecosystem:** npm
- **Directory:** `/` (root)
- **Schedule:** Weekly (Mondays at 9:00 AM)
- **Open PR Limit:** 10 (5 regular + security updates)

**Update Groups:**

1. **Production Dependencies**
   - `bootstrap` - UI framework
   - `ibira.js` - API client library
   - **Update types:** minor, patch

2. **Test Dependencies**
   - `jest*` - Testing framework
   - `@jest/*` - Jest plugins
   - `selenium-webdriver` - Browser automation
   - **Update types:** minor, patch

3. **Dev Dependencies**
   - `eslint*` - Code linting
   - `markdownlint*` - Markdown linting
   - `node-fetch` - HTTP client
   - **Update types:** minor, patch

**Versioning Strategy:**
- **increase** - Always increment version

**Ignored Updates:**
- ❌ **Major versions** - Require manual testing due to breaking changes
- 🔒 **Security updates** - Always allowed regardless of version

**PR Labels:**
- `dependencies` - All dependency updates
- `automated` - Automated PRs

**Commit Message Format:**
```
chore(deps): update <group-name>

- Updates <package1> from x.y.z to x.y.z+1
- Updates <package2> from x.y.z to x.y.z+1
```

**Handling Dependabot PRs:**

1. **Review Changes:**
   ```bash
   # Checkout PR branch
   gh pr checkout <PR-number>
   
   # Review changes
   git log --oneline
   npm list | grep <updated-package>
   ```

2. **Test Updates:**
   ```bash
   # Install dependencies
   npm install
   
   # Run tests
   npm run test:all
   
   # Run linting
   npm run lint
   
   # Check for breaking changes
   npm outdated
   ```

3. **Merge or Close:**
   - ✅ **Merge** if tests pass and no breaking changes
   - ⏸️ **Postpone** major updates for dedicated update cycles
   - ❌ **Close** if update causes issues

**Manual Updates (Major Versions):**
```bash
# Check for major updates
npm outdated

# Update specific package (major version)
npm install <package>@latest

# Test thoroughly
npm run test:all
npm run test:production

# Update package.json version constraints if needed
# Review CHANGELOG of updated package
# Document breaking changes in CHANGELOG.md
```

**Related Documentation:**
- [Dependency Update Script](../docs/scripts/SCRIPTS_INDEX.md#2-scriptupdate-dependenciessh)
- [Package.json Scripts](../README.md#npm-scripts-reference)

---

## 🔐 Security

**Dependabot Security Alerts:**
- Automatically enabled for this repository
- Creates PRs for vulnerable dependencies
- Higher priority than regular updates
- Open PR limit: 10 (allows for security PRs even when at regular limit)

**Security Best Practices:**
1. ✅ Review Dependabot security alerts promptly
2. ✅ Test security updates before merging
3. ✅ Keep dependencies up-to-date (reduces attack surface)
4. ✅ Monitor GitHub Security Advisories tab
5. ✅ Use `npm audit` locally before committing

---

## 📝 Future Enhancements

**Potential Additions:**
- [ ] CI/CD workflow for running tests on PR
- [ ] Automated deployment workflow
- [ ] Issue templates for bugs/features
- [ ] Pull request template with checklist
- [ ] Code scanning with CodeQL
- [ ] Performance benchmarking workflow
- [ ] Semantic release automation
- [ ] Changelog generation workflow

---

## 📚 Related Documentation

- **[Main README](../README.md)** - Project overview
- **[CI/CD Section](../README.md#-cicd--automation)** - CI/CD usage guide
- **[Scripts Index](../docs/scripts/SCRIPTS_INDEX.md)** - All project scripts
- **[Contributing Guide](../README.md#-contributing)** - How to contribute
- **[Documentation Standards](../docs/standards/DOCUMENTATION_AUTOMATION.md)** - Doc standards

---

**Last Updated:** 2024-12-22  
**Maintained By:** Monitora Vagas Development Team  
**Questions?** Open an issue or check related documentation above.
