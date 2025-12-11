# Material Design 3 (MD3) Archive Notice

**Date**: 2025-12-11  
**Status**: ⚠️ ARCHIVED EXPERIMENTS

---

## Notice

All documents in this directory with the `MD3_` prefix are **historical references** for Material Design 3 migration experiments that were explored but not adopted for production.

### Archived Documents

- `MD3_DEPLOYMENT_CHECKLIST.md`
- `MD3_IMPLEMENTATION_SUMMARY.md`
- `MD3_MIGRATION_GUIDE.md`
- `MD3_MIGRATION_PLAN.md`
- `README_MD3_MIGRATION.md`

### Current Production Application

The **current production application** uses:

- **HTML5 native date inputs** (type="date") with ISO 8601 format
- **Colorlib template** for styling (not Material Design 3)
- **Modular CSS architecture** with @import statements
- **ES6 modules** for JavaScript

### Important Notes

1. **Date Format**: As of v1.4.3, the application uses ISO 8601 (yyyy-mm-dd) format
   - Old MD3 docs may reference dd/mm/yyyy format
   - See `docs/DATE_FORMAT_CHANGE.md` for current implementation

2. **UI Framework**: Production uses Colorlib template, not Material Design 3
   - MD3 experiments are in `public/archived-versions/`
   - Main application is `public/index.html`

3. **For Current Documentation**: See:
   - Main: `README.md`
   - Quick Start: `QUICKSTART.md`
   - HTML Spec: `docs/HTML_SPECIFICATION.md`
   - Date Format: `docs/DATE_FORMAT_CHANGE.md`

---

**Reason for Archive**: While MD3 offers modern components, the decision was made to maintain the Colorlib template for consistency and simplicity. The MD3 experiments provided valuable learning but were not adopted for production.

**Reference Only**: These documents are kept for historical reference and to document the exploration process, but should not be used as current implementation guides.
