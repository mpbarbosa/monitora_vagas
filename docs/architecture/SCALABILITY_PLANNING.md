# Scalability Planning Document

**Version:** 2.2.0  
**Last Updated:** 2024-12-22  
**Review Frequency:** Quarterly or at 75% threshold  
**Next Review:** 2025-03-22

---

## 📋 Overview

This document tracks file and directory thresholds that trigger reorganization to maintain codebase scalability and developer productivity.

**Purpose:**
- ✅ Define clear thresholds for reorganization
- ✅ Track current state vs. thresholds
- ✅ Plan proactive refactoring
- ✅ Prevent technical debt accumulation

---

## 📊 Current State (2024-12-22)

### JavaScript Modules (`src/js/`)

**Current:** 5 files  
**Threshold:** 10 files  
**Status:** ✅ **HEALTHY** (50% of threshold)  
**Action Required:** None

**Files:**
1. `global.js` - Bootstrap initialization
2. `guestCounter.js` - Guest counter UI component
3. `guestNumberFilter.js` - Client-side filtering logic
4. `hotelSearch.js` - Search workflow orchestration
5. `searchLifecycleState.js` - UI state management

**Reorganization Trigger:** 10+ files

### Test Files (`tests/` root)

**Current:** 70 files (34 .py + 9 .js + 27 other)  
**Threshold:** 50 files  
**Status:** ⚠️ **APPROACHING THRESHOLD** (140% of threshold)  
**Action Required:** Review and plan reorganization

**Breakdown:**
- Python tests: 25 files
- JavaScript tests: 9 files
- Documentation: 27 files (README, summaries, specs)
- Other: 9 files (shell scripts, etc.)

**Reorganization Trigger:** Already exceeded threshold

---

## 🎯 Reorganization Thresholds

### src/js/ Directory

| Status | File Count | Action |
|--------|-----------|--------|
| ✅ Healthy | 1-10 | No action needed |
| ⚠️ Monitor | 11-15 | Plan reorganization |
| 🔴 Reorganize | 16+ | Immediate refactoring required |

**Proposed Structure (when threshold reached):**

```
src/js/
├── components/      # UI components
│   ├── GuestCounter.js
│   ├── GuestFilter.js
│   └── SearchButton.js
├── workflows/       # Business logic orchestration
│   ├── hotelSearch.js
│   └── searchLifecycle.js
├── state/          # State management
│   └── searchLifecycleState.js
└── init/           # Initialization
    └── global.js
```

### tests/ Directory

| Status | File Count | Action |
|--------|-----------|--------|
| ✅ Healthy | 1-50 | No action needed |
| ⚠️ Monitor | 51-75 | Plan reorganization |
| 🔴 Reorganize | 76+ | Immediate refactoring required |

**Current State:** 70 files (⚠️ already in "Monitor" zone)

**Proposed Structure (recommended now):**

```
tests/
├── unit/              # Unit tests (Jest)
│   ├── services/
│   ├── config/
│   └── utils/
├── integration/       # Integration tests
│   ├── api/
│   └── ui/
├── e2e/              # End-to-end tests (existing)
├── use_cases/        # Use case tests (existing)
├── python/           # Python tests (consolidated)
│   ├── ui_tests/
│   └── selenium_tests/
├── __mocks__/        # Jest mocks (existing)
└── test_screenshots/ # Screenshots (existing)
```

---

## 📈 Growth Projections

### src/js/ Growth Trajectory

**Historical Growth:**
- v1.0.0 (2024-12-08): 3 files
- v2.0.0 (2024-12-16): 5 files
- v2.2.0 (2024-12-22): 5 files

**Projected Growth:**
```
Current:   ████████░░ 50% (5/10 files)
v2.3.0:    ██████████ 60% (6/10 files) - Guest filter enhancements
v2.4.0:    ████████████ 70% (7/10 files) - Weekend search UI
v2.5.0:    ██████████████ 80% (8/10 files) - Booking calendar
v3.0.0:    ████████████████ 90% (9/10 files) - User preferences
v3.1.0:    🔴 THRESHOLD EXCEEDED (11/10 files) - REORGANIZE
```

**Estimated Time to Threshold:** 3-4 minor releases (~6-8 months)

### tests/ Growth Trajectory

**Historical Growth:**
- v1.0.0 (2024-12-08): 20 files
- v2.0.0 (2024-12-16): 50 files
- v2.2.0 (2024-12-22): 70 files

**Current Status:** Already exceeded 50-file threshold

**Action Required:** Reorganize within next 2 releases (by v2.4.0)

---

## 🔧 Reorganization Plans

### Plan A: tests/ Reorganization (PRIORITY)

**Timeline:** Before v2.4.0 (Q1 2025)  
**Effort:** Medium (2-3 hours)  
**Risk:** Low (test behavior unchanged)

**Steps:**

1. **Create subdirectories**
   ```bash
   mkdir -p tests/python/ui_tests tests/python/selenium_tests
   mkdir -p tests/jest/unit tests/jest/integration
   ```

2. **Move Python tests**
   ```bash
   mv tests/test_*.py tests/python/ui_tests/
   mv tests/simple_*.py tests/python/
   ```

3. **Move JavaScript tests**
   ```bash
   mv tests/*.test.js tests/jest/unit/
   mv tests/e2e/*.test.js tests/jest/integration/
   ```

4. **Update test runners**
   - Update `package.json` test paths
   - Update shell script paths
   - Update documentation

5. **Verify all tests still pass**
   ```bash
   npm run test:all
   ```

**Benefits:**
- ✅ Clear separation by test type
- ✅ Easier to find specific tests
- ✅ Better organization for new contributors
- ✅ Scales to 200+ test files

### Plan B: src/js/ Reorganization (FUTURE)

**Timeline:** When threshold reached (v3.1.0+)  
**Effort:** Medium (3-4 hours)  
**Risk:** Medium (requires import path updates)

**Steps:**

1. **Create subdirectories**
   ```bash
   mkdir -p src/js/components src/js/workflows src/js/state src/js/init
   ```

2. **Move files to appropriate subdirectories**
   ```bash
   mv src/js/guestCounter.js src/js/components/
   mv src/js/guestNumberFilter.js src/js/components/
   mv src/js/hotelSearch.js src/js/workflows/
   mv src/js/searchLifecycleState.js src/js/state/
   mv src/js/global.js src/js/init/
   ```

3. **Update all import paths**
   ```javascript
   // Before
   import { GuestCounter } from './guestCounter.js';
   
   // After
   import { GuestCounter } from './components/guestCounter.js';
   ```

4. **Update HTML script tags**
   ```html
   <!-- Before -->
   <script type="module" src="../src/js/guestCounter.js"></script>
   
   <!-- After -->
   <script type="module" src="../src/js/components/guestCounter.js"></script>
   ```

5. **Run linter and tests**
   ```bash
   npm run lint:fix
   npm run test:all
   ```

**Benefits:**
- ✅ Logical grouping by function
- ✅ Scales to 50+ JavaScript files
- ✅ Easier to locate specific modules
- ✅ Supports future React migration

---

## 📏 Other Scalability Metrics

### Services Directory (`src/services/`)

**Current:** 5 files  
**Threshold:** 8 files  
**Status:** ✅ **HEALTHY** (63% of threshold)

**Files:**
1. `apiClient.js`
2. `hotelCache.js`
3. `ibira-loader.js`
4. `logger.js`
5. (Future: authService.js, notificationService.js, etc.)

**Reorganization Plan:** None needed yet

### Configuration (`src/config/`)

**Current:** 2 files  
**Threshold:** 5 files  
**Status:** ✅ **HEALTHY** (40% of threshold)

**Files:**
1. `constants.js`
2. `environment.js`

**Reorganization Plan:** None needed

### Documentation (`docs/`)

**Current:** 123 markdown files across 16 categories  
**Threshold:** 150 files per category  
**Status:** ✅ **HEALTHY** (organized in subdirectories)

**Current Organization:** Effective (category-based)  
**Action:** No reorganization needed

---

## 🎯 Proactive Measures

### File Count Monitoring

**Monthly Check:**
```bash
# Add to monthly review script
echo "src/js/: $(ls -1 src/js/*.js | wc -l) files (threshold: 10)"
echo "tests/: $(find tests/ -maxdepth 1 -type f | wc -l) files (threshold: 50)"
```

**Automated Alerts:**
```bash
# Add to pre-push hook (optional)
JS_COUNT=$(ls -1 src/js/*.js 2>/dev/null | wc -l)
if [ $JS_COUNT -gt 10 ]; then
    echo "⚠️ WARNING: src/js/ has $JS_COUNT files (threshold: 10)"
    echo "Consider reorganization before adding more files"
fi
```

### Best Practices

1. **✅ Single Responsibility** - Keep files focused on one concern
2. **✅ Extract Early** - Split files before they get too large
3. **✅ Modular Design** - Design for future reorganization
4. **✅ Review Regularly** - Check thresholds quarterly
5. **✅ Document Plans** - Update this document when approaching thresholds

---

## 📅 Review Schedule

### Quarterly Reviews

**Q1 2025 (Jan-Mar):**
- [ ] Review file counts
- [ ] Execute tests/ reorganization (Plan A)
- [ ] Update this document

**Q2 2025 (Apr-Jun):**
- [ ] Review file counts
- [ ] Monitor src/js/ growth
- [ ] Plan React migration (if applicable)

**Q3 2025 (Jul-Sep):**
- [ ] Review file counts
- [ ] Assess need for src/js/ reorganization

**Q4 2025 (Oct-Dec):**
- [ ] Annual review
- [ ] Update thresholds if needed
- [ ] Plan major refactoring (if required)

---

## 🚦 Decision Matrix

### When to Reorganize

| Metric | Value | Decision |
|--------|-------|----------|
| **File count** | <75% of threshold | ✅ No action |
| **File count** | 75-100% of threshold | ⚠️ Plan reorganization |
| **File count** | >100% of threshold | 🔴 Reorganize now |
| **Developer complaints** | 2+ team members | 🔴 Reorganize regardless of count |
| **New contributor confusion** | >30 min to find file | 🔴 Reorganize regardless of count |

### Reorganization Checklist

Before reorganizing:
- [ ] Document current structure
- [ ] Create backup branch
- [ ] Write reorganization script
- [ ] Plan import path updates
- [ ] Schedule for low-activity period
- [ ] Notify team members

After reorganizing:
- [ ] Update all documentation
- [ ] Run full test suite
- [ ] Update CI/CD if needed
- [ ] Update this planning document
- [ ] Announce changes to team

---

## 📚 Related Documentation

- **[Project Structure](./architecture/PROJECT_STRUCTURE.md)** - Current structure
- **[Test Organization](./.gitkeep files)** - Test directory plans
- **[Contributing Guide](../README.md#contributing)** - How to contribute
- **[Architecture Decisions](./architecture/ARCHITECTURE_DECISIONS.md)** (if exists)

---

## 📊 Summary Dashboard

### Current Health Status

```
┌──────────────────────────────────────┐
│ SCALABILITY HEALTH DASHBOARD         │
├──────────────────────────────────────┤
│                                      │
│ src/js/         ████████░░  50% ✅   │
│ src/services/   ████████░░  63% ✅   │
│ src/config/     ████░░░░░░  40% ✅   │
│ tests/          ██████████████ 140% ⚠️│
│ docs/           ████████░░  82% ✅   │
│                                      │
│ PRIORITY ACTION:                     │
│ 🔴 Reorganize tests/ (70/50 files)  │
│                                      │
└──────────────────────────────────────┘
```

### Next Actions

1. **🔴 URGENT:** Plan tests/ reorganization (by v2.4.0)
2. **🟡 MONITOR:** Track src/js/ growth (quarterly)
3. **🟢 HEALTHY:** Other directories within thresholds

---

**Last Updated:** 2024-12-22  
**Next Review:** 2025-03-22  
**Status:** tests/ reorganization pending, otherwise healthy  
**Maintainer:** Monitora Vagas Development Team
