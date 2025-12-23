# Legacy Directory

**Purpose:** Archived code, prompts, and historical files from previous project versions

## ⚠️ Warning

The contents of this directory are **legacy/archived** materials. They are kept for historical reference only and should not be used in active development.

## Contents

### `__pycache__/`
Python bytecode cache from legacy Python scripts (now cleaned and gitignored).

### `prompts/`
Historical AI prompts and conversation logs from earlier development phases. Useful for understanding the project's evolution and decision-making process.

## Usage

**Do not import or use code from this directory in active development.**

This directory exists for:
- Historical reference
- Understanding previous approaches
- Learning from past decisions
- Archival purposes

## Current Code Location

For current, production code, see:

- **Frontend:** `src/` directory
  - `src/js/` - JavaScript modules
  - `src/styles/` - CSS stylesheets
  - `src/services/` - API clients and services
  - `src/config/` - Configuration files

- **Tests:** `tests/` directory
  - `tests/e2e/` - End-to-end tests
  - `tests/unit/` - Unit tests
  - `tests/integration/` - Integration tests

- **Public Assets:** `public/` directory
  - `public/index.html` - Main HTML file
  - `public/vendor/` - Third-party libraries

## Maintenance

This directory is:
- ✅ Gitignored for `__pycache__/` subdirectories
- ✅ Not included in builds or deployments
- ✅ Not maintained or updated
- ✅ Kept only for historical reference

## Migration Notes

If you need to reference or revive any legacy code:

1. Review the current codebase first to avoid duplicating existing functionality
2. Ensure the legacy code is compatible with current standards:
   - ES6+ modules for JavaScript
   - Bootstrap 5.3.3 for UI
   - Modern API client patterns
3. Update to follow current project standards (see `.github/` guides)
4. Add proper tests before integration
5. Document any revived functionality

## Related Documentation

- **[Project Structure](../docs/architecture/PROJECT_STRUCTURE.md)** - Current project organization
- **[CHANGELOG.md](../CHANGELOG.md)** - Version history and changes
- **[README.md](../README.md)** - Current project documentation

---

**Status:** Archived  
**Last Active:** Pre-v2.0  
**Current Version:** 2.1.0+
