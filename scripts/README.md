# Scripts Directory

**Purpose:** Utility scripts for maintenance and development tasks

## Contents

### `update-dependencies.sh`

Phased npm dependency update script that safely upgrades project dependencies following the documented update plan.

**Usage:**
```bash
# Run all safe phases
./scripts/update-dependencies.sh all

# Run specific phase
./scripts/update-dependencies.sh {0|1|2|test}
```

**Phases:**
- **Phase 0:** Critical fixes (selenium classification)
- **Phase 1:** Safe updates (Bootstrap, markdownlint)
- **Phase 2:** Jest upgrade (requires confirmation)

## Documentation

- **[Scripts Index](../docs/scripts/SCRIPTS_INDEX.md)** - Complete documentation for all scripts
- **[Troubleshooting Guide](../docs/scripts/TROUBLESHOOTING_GUIDE.md)** - Common issues and solutions
- **[Main README](../README.md)** - Project overview with utility scripts section

## Adding New Scripts

When adding new scripts to this directory:

1. Use standardized header format (see existing scripts)
2. Add version number (semantic versioning)
3. Document prerequisites and environment variables
4. Update Scripts Index documentation
5. Make executable: `chmod +x script.sh`

## Standards

All scripts in this directory follow:
- Consistent header format with version info
- Color-coded output (red/green/yellow/blue)
- Error handling with `set -e`
- Prerequisites documentation
- Environment variables documentation
- Help message support (`--help`)

---

**Maintained by:** Development Team  
**Last Updated:** 2024-12-23
