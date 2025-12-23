# Documentation Standards

## Automated Maintenance

This project uses automated workflows to maintain documentation quality and organization.

### Workflow: `docs-organize.yml`

**Triggers:**
- Push to `docs/**` or root `*.md` files
- Pull requests affecting documentation

**Actions:**
1. **Lint Documentation** - Uses remark to enforce markdown standards
2. **Validate Links** - Checks internal documentation links
3. **Structure Verification** - Ensures required directories exist
4. **Health Report** - Generates statistics and structure overview

### Required Directory Structure

```
docs/
├── api/              # API documentation
├── architecture/     # System architecture
├── features/         # Feature documentation
├── guides/          # User and developer guides
├── implementation/  # Implementation details
├── specifications/  # Technical specifications
├── standards/       # Coding and documentation standards
├── testing/         # Testing documentation
└── workflows/       # Workflow documentation
```

### Markdown Linting

Configuration: `.remarkrc`

**Rules:**
- Use recommended preset
- Space-indented lists
- No line length limit (flexibility for tables/code)
- Allow duplicate headings (for templates)
- Validate internal links

### Manual Checks

Run locally before committing:

```bash
# Install tools
npm install -g remark-cli remark-lint remark-preset-lint-recommended

# Lint documentation
remark docs/ --use remark-preset-lint-recommended

# Check structure
tree -L 2 docs/
```

### Benefits

1. **Consistency** - Automated enforcement of markdown standards
2. **Structure** - Prevents directory disorganization
3. **Quality** - Catches broken links and formatting issues
4. **Visibility** - Health reports show documentation status
5. **Prevention** - Issues caught before merge

### CI/CD Integration

- ✅ Runs on every documentation change
- ✅ Fails build on critical issues (broken links, missing structure)
- ✅ Generates reports for review
- ✅ No manual intervention required
