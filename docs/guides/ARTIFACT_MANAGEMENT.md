# Artifact Management Guide

## Overview

This guide explains how to manage workflow artifacts and temporary documentation files in the Monitora Vagas project.

## What Are Workflow Artifacts?

Workflow artifacts are temporary files generated during development, testing, or documentation workflows. These include:

- **Summary files**: `*_SUMMARY.md`, `*_COMPLETE.md`, `*_STATUS.md`
- **Analysis files**: `*_ANALYSIS.md`, `*_REPORT.md`, `ai_*.txt`
- **Test artifacts**: `TEST_RESULTS.txt`, `BROWSER_TESTING_*.txt`, `test_screenshots/`
- **Temporary scripts**: `check-*.sh`, `fix-*.sh`
- **Draft documentation**: Various workflow-generated markdown files

## Why Ignore Them?

1. **Repository Cleanliness**: Keep git history focused on actual code and documentation
2. **Reduce Noise**: Avoid cluttering diffs with temporary files
3. **Security**: Prevent accidental commits of sensitive test data
4. **Performance**: Smaller repository size and faster operations

## Artifact Patterns in `.gitignore`

The `.gitignore` file contains comprehensive patterns that automatically exclude workflow artifacts:

```gitignore
# Workflow summary files
*_SUMMARY.md
*_COMPLETE.md
*_STATUS.md
*_CHECKLIST.md
*_INDEX.md
*_REPORT.md
*_ANALYSIS.md

# Specific workflow artifacts
ALL_ISSUES_FIXED_*.md
AUDIT_*.md
DOCUMENTATION_FIXES_*.md
EXECUTIVE_SUMMARY_*.md
FIXES_*.md
TEST_GAP_*.md

# AI-generated analysis
ai_*.txt
*_analysis.txt

# Test artifacts
TEST_RESULTS.txt
test_screenshots/

# Temporary scripts
check-*.sh
fix-*.sh
```

### Protected Files

These files are **NOT** ignored even if they match patterns:

- `README.md` - Main project documentation
- `CHANGELOG.md` - Version history
- `KNOWN_ISSUES.md` - Issue tracking
- Files in `docs/**/*.md` - Official documentation
- Files in `.github/**/*.md` - GitHub configuration docs

## Cleanup Script

### Location

```bash
scripts/cleanup-artifacts.sh
```

### Usage

#### 1. **Dry Run** (Preview what would be deleted)

```bash
./scripts/cleanup-artifacts.sh --dry-run
```

This shows all artifacts that would be deleted without actually removing them.

#### 2. **Interactive Mode** (Confirm before deletion)

```bash
./scripts/cleanup-artifacts.sh --interactive
```

This asks for confirmation before deleting files.

#### 3. **Automatic Cleanup** (No prompts)

```bash
./scripts/cleanup-artifacts.sh
```

This immediately deletes all matching artifacts.

### Example Output

```
======================================
Workflow Artifact Cleanup Script
======================================

Scanning for workflow artifacts...

Found 42 workflow artifact(s):

  ✗ ALL_ISSUES_FIXED_SUMMARY.md (16K)
  ✗ TEST_GAP_RESOLUTION_SUMMARY.md (16K)
  ✗ check-documentation-status.sh (8.0K)
  ...

Total size: 440K

Delete these files? (y/N): y

Deleting files...
  ✓ Deleted: ALL_ISSUES_FIXED_SUMMARY.md
  ✓ Deleted: TEST_GAP_RESOLUTION_SUMMARY.md
  ...

✓ Cleanup complete!
  Deleted: 42 file(s)
  Freed: 440K
```

## When to Clean Up

### Before Commits

```bash
# Run cleanup before staging files
./scripts/cleanup-artifacts.sh --dry-run  # Preview
./scripts/cleanup-artifacts.sh            # Execute

# Then commit
git add .
git commit -m "Your commit message"
```

### Before Pull Requests

Always clean up artifacts before creating a PR to ensure a clean diff.

### During Development

Run cleanup periodically to keep your working directory organized:

```bash
# Weekly cleanup
./scripts/cleanup-artifacts.sh --interactive
```

## Git Status Interpretation

After running cleanup, `git status` will show a cleaner output:

### Before Cleanup

```bash
$ git status
On branch main
Untracked files:
  ALL_ISSUES_FIXED_SUMMARY.md
  TEST_GAP_RESOLUTION_SUMMARY.md
  DOCUMENTATION_FIXES_COMPLETE.md
  (40+ more files...)
```

### After Cleanup

```bash
$ git status
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

## CI/CD Integration

The cleanup script can be integrated into CI/CD workflows:

### Pre-commit Hook

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Run artifact cleanup before commit
./scripts/cleanup-artifacts.sh --dry-run
```

### GitHub Actions

Add to `.github/workflows/ci.yml`:

```yaml
- name: Check for workflow artifacts
  run: |
    if [ -n "$(./scripts/cleanup-artifacts.sh --dry-run | grep 'Found')" ]; then
      echo "Warning: Workflow artifacts detected"
      ./scripts/cleanup-artifacts.sh --dry-run
    fi
```

## Manual Management

### List All Untracked Files

```bash
git ls-files --others --exclude-standard
```

### Check Specific Pattern

```bash
git ls-files --others --exclude-standard | grep "_SUMMARY.md"
```

### Force Track a File (Override .gitignore)

If you need to track a file that matches an ignore pattern:

```bash
git add -f FILE_NAME_SUMMARY.md
```

## Best Practices

1. **Run Cleanup Before Commits**: Always check for artifacts before staging changes
2. **Use Dry Run First**: Preview deletions to avoid mistakes
3. **Review .gitignore**: If legitimate files are being ignored, update the exclusion list
4. **Document Exceptions**: If a file matching the pattern should be tracked, add it to the exclusion list in `.gitignore`
5. **Periodic Maintenance**: Run cleanup weekly to keep workspace organized

## Troubleshooting

### Issue: Important File Was Ignored

**Solution**: Add to `.gitignore` exclusions:

```gitignore
# Keep specific important files
!IMPORTANT_SUMMARY.md
```

### Issue: Script Doesn't Find Files

**Check**:
1. Ensure you're in the repository root
2. Verify file patterns match `.gitignore`
3. Check if files are already tracked: `git ls-files FILE_NAME`

### Issue: Script Permission Denied

**Fix**:
```bash
chmod +x scripts/cleanup-artifacts.sh
```

## Related Documentation

- [Documentation Standards](../standards/DOCUMENTATION_AUTOMATION.md)
- [Git Workflow](../guides/GIT_WORKFLOW.md)
- [Scripts Index](../scripts/SCRIPTS_INDEX.md)

## Summary

- **What**: Workflow artifacts are temporary development files
- **Why**: Keep repository clean and focused
- **How**: Use `.gitignore` patterns + `cleanup-artifacts.sh` script
- **When**: Before commits, PRs, and periodically during development

---

**Last Updated**: 2024-12-26  
**Version**: 1.0.0
