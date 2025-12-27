# Documentation Link Validator

Automated validation tool for internal documentation links to prevent broken links before they reach production.

## 🎯 Purpose

Prevents broken internal links in markdown documentation by:
- ✅ Validating file paths exist
- ✅ Checking anchor links point to valid headings
- ✅ Catching typos and outdated paths
- ✅ Running automatically in CI/CD and pre-commit

## 📦 Components

### 1. CLI Tool (`scripts/validate-docs-links.js`)

Standalone Node.js script that scans markdown files and validates all internal links.

**Features:**
- Validates `[text](path)` and `[text](path#anchor)` links
- Checks file existence for relative and absolute paths
- Validates anchor links against markdown headings
- Colored console output for readability
- Exit codes for CI/CD integration

### 2. Pre-Commit Hook (`.husky/pre-commit`)

Git hook that automatically validates links before allowing commits.

**Behavior:**
- Runs only on staged markdown files (fast)
- Blocks commits with broken links
- Shows clear error messages
- Can be bypassed with `--no-verify` if needed

### 3. GitHub Actions Workflow (`.github/workflows/docs-link-validation.yml`)

Automated CI/CD validation on pull requests and pushes.

**Triggers:**
- Pull requests modifying `.md` files
- Pushes to main/master/develop branches
- Manual workflow dispatch

**Features:**
- Comments on PRs with broken links
- Generates link health reports
- Uploads validation results as artifacts

## 🚀 Usage

### Run Locally

```bash
# Validate all documentation
npm run validate:links

# Validate specific directory
npm run validate:links:docs

# Validate multiple paths
npm run validate:links:all

# Run directly with custom paths
node scripts/validate-docs-links.js path/to/docs
```

### Output Examples

**✅ Success:**
```
🔍 Scanning documentation for links...

Found 45 markdown files

Checking: README.md
Checking: docs/api/API_DOCUMENTATION.md
...

📊 Link Validation Results
Files scanned: 45
Links checked: 287

✅ All links are valid!
```

**❌ Errors:**
```
🔍 Scanning documentation for links...

📊 Link Validation Results
Files scanned: 45
Links checked: 287

❌ Errors: 2
  ✗ docs/features/SEARCH_WORKFLOW.md
    Link: ../api/deprecated.md
    File not found: docs/api/deprecated.md
  
  ✗ README.md
    Link: docs/guides/QUICKSTART.md#installation
    Anchor "#installation" not found in docs/guides/QUICKSTART.md
```

### Pre-Commit Hook

The hook runs automatically on `git commit`:

```bash
git add docs/README.md
git commit -m "Update documentation"

# Output:
# 🔍 Validating documentation links...
# 📝 Checking markdown files:
#   - docs/README.md
# ✅ All documentation links are valid!
```

**Bypass (not recommended):**
```bash
git commit --no-verify -m "Commit with broken links"
```

### CI/CD Integration

Workflow runs automatically on pull requests:

1. **PR Created** → Link validation runs
2. **Broken Links Found** → CI fails + PR comment added
3. **All Links Valid** → CI passes

**Manual trigger:**
```bash
gh workflow run docs-link-validation.yml
```

## 🔧 Configuration

### Edit Search Patterns

Edit `scripts/validate-docs-links.js`:

```javascript
const config = {
    rootDir: process.cwd(),
    searchPaths: [
        'docs/**/*.md',
        'README.md',
        '.github/**/*.md'
    ],
    ignorePatterns: [
        '**/node_modules/**',
        '**/coverage/**',
        '**/venv/**'
    ]
};
```

### Enable External Link Validation

Currently disabled (requires network calls). To enable:

```javascript
const config = {
    validateExternalLinks: true  // Change to true
};
```

## 📝 Link Validation Rules

### ✅ Valid Links

```markdown
<!-- Relative paths -->
[API Docs](./api/README.md)
[Features](../features/SEARCH.md)

<!-- Absolute paths from root -->
[Main README](/README.md)

<!-- Anchor links -->
[Installation](#installation)
[API Guide](./api/README.md#endpoints)

<!-- External links (skipped by default) -->
[GitHub](https://github.com)
```

### ❌ Invalid Links

```markdown
<!-- File doesn't exist -->
[Missing](./does-not-exist.md)

<!-- Anchor doesn't exist -->
[Bad Anchor](#nonexistent-heading)

<!-- Typo in path -->
[Typo](./api/READM.md)
```

## 🐛 Troubleshooting

### Pre-Commit Hook Not Running

**Check installation:**
```bash
ls -la .git/hooks/pre-commit
# Should be symlink to .husky/pre-commit
```

**Reinstall hook:**
```bash
chmod +x .husky/pre-commit
git config core.hooksPath .husky
```

### False Positives for Anchors

Markdown heading conversion rules:
- Lowercase all text
- Replace spaces with hyphens
- Remove special characters

**Example:**
```markdown
## API Reference Guide
<!-- Valid anchors: #api-reference-guide -->

## FAQ's & Tips
<!-- Valid anchors: #faqs--tips -->
```

### Performance Issues

For large repositories:

```bash
# Validate specific directory only
npm run validate:links:docs

# Validate only staged files (fastest)
git diff --cached --name-only | grep "\.md$" | xargs node scripts/validate-docs-links.js
```

## 📊 Metrics & Reporting

### Link Health Report

Generated on main branch pushes:

- Total markdown files scanned
- Total links validated
- Error/warning counts
- Historical trends (if enabled)

**View reports:**
```bash
gh run list --workflow=docs-link-validation.yml
gh run view <run-id> --log
```

### Integration with Coverage Dashboard

Link validation results can be integrated with the test coverage dashboard:

```javascript
// In generate-coverage-report.js
import { validateDocumentationLinks } from './validate-docs-links.js';

const linkResults = await validateDocumentationLinks();
dashboard.metrics.documentationHealth = {
    totalFiles: linkResults.totalFiles,
    totalLinks: linkResults.totalLinks,
    brokenLinks: linkResults.errors.length
};
```

## 🎯 Best Practices

### 1. Fix Links Before Committing
- Run `npm run validate:links` before staging changes
- Let pre-commit hook catch issues early

### 2. Use Relative Paths
```markdown
<!-- ✅ Good - relative to current file -->
[Guide](../guides/SETUP.md)

<!-- ❌ Bad - hard-coded absolute path -->
[Guide](/home/user/project/docs/guides/SETUP.md)
```

### 3. Consistent Anchor Formats
```markdown
<!-- ✅ Good - matches generated anchor -->
[See Installation](#installation)
## Installation

<!-- ❌ Bad - case mismatch -->
[See Installation](#Installation)
## Installation
```

### 4. Update Links When Moving Files
```bash
# Moving a file? Update all references!
git grep "old-path.md" docs/
# Update found references
git add .
git commit -m "Refactor: Move and update references to old-path.md"
```

## 🔮 Future Enhancements

Potential improvements:

1. **External Link Validation**
   - HTTP status checks for external URLs
   - Configurable timeout and retry logic
   - Cache valid URLs to reduce checks

2. **Link Suggestions**
   - Fuzzy matching for typos
   - Suggest similar paths when file not found

3. **Performance Optimization**
   - Parallel file processing
   - Incremental validation (only changed files)
   - Caching of validation results

4. **IDE Integration**
   - VS Code extension for real-time validation
   - Hover tooltips showing link status

## 📚 Related Documentation

- [Documentation Standards](../standards/DOCUMENTATION_AUTOMATION.md)
- [CI/CD Workflows](../workflows/README.md)
- [Pre-commit Hooks Setup](../guides/DEVELOPMENT_SETUP.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)

## 🤝 Contributing

To improve the link validator:

1. Test changes locally: `npm run validate:links`
2. Update this documentation
3. Add test cases if modifying validation logic
4. Submit PR with clear description

## 📄 License

Same as project license (ISC)
