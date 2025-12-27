# Monitora Vagas Documentation

**Last Updated:** 2024-12-22  
**Version:** 2.2.0

Welcome to the Monitora Vagas documentation. This directory contains comprehensive documentation organized by category for easy navigation.

📖 **New to the project?** Start with the [Terminology Glossary](./TERMINOLOGY_GLOSSARY.md) to understand key concepts and naming conventions.

---

## 🆕 v2.0 Updates

**New Documentation:**
- [PROJECT_STRUCTURE.md](./architecture/PROJECT_STRUCTURE.md) - Comprehensive folder structure guide
- [RESTRUCTURE_SUMMARY.md](./guides/RESTRUCTURE_SUMMARY.md) - v2.0 restructure summary

**Major Changes:**
- Removed all symlinks from project
- Reorganized folder structure following best practices
- Applied HTML/CSS/JS separation principles
- See [RESTRUCTURE_SUMMARY.md](./guides/RESTRUCTURE_SUMMARY.md) for details

---

## 📚 Documentation Structure

### 📡 [API Documentation](./api/)
Integration with busca_vagas API and client implementation.

**Files:** 9 documents
- [API_DOCUMENTATION.md](./api/API_DOCUMENTATION.md) - Complete API reference
- [IBIRA_INTEGRATION.md](./api/IBIRA_INTEGRATION.md) - ibira.js integration guide
- [README.md](./api/README.md) - API documentation index
- [API_CLIENT_USAGE_REVIEW.md](./api/API_CLIENT_USAGE_REVIEW.md) - Client usage patterns
- [API_INTEGRATION_UPDATE.md](./api/API_INTEGRATION_UPDATE.md) - Latest integration guide
- [API_INTEGRATION_CHANGES.md](./api/API_INTEGRATION_CHANGES.md) - Historical changes
- [API_INTEGRATION_SUCCESS.md](./api/API_INTEGRATION_SUCCESS.md) - Integration success stories
- [INTEGRATION_CHECKLIST.md](./api/INTEGRATION_CHECKLIST.md) - Implementation checklist
- [mock-api-server.js](./api/mock-api-server.js) - Mock server for testing

**API Version:** v1.4.1 (released 2025-12-14)

---

### 🏗️ [Architecture](./architecture/)
System architecture, design decisions, and implementation patterns.

**Files:** 12 documents
- [IMPLEMENTATION_GUIDE.md](./architecture/IMPLEMENTATION_GUIDE.md) - Architecture overview
- [COMPLETE_IMPLEMENTATION_SUMMARY.md](./architecture/COMPLETE_IMPLEMENTATION_SUMMARY.md) - Full implementation summary
- [NO_SCROLL_IMPLEMENTATION_SUMMARY.md](./architecture/NO_SCROLL_IMPLEMENTATION_SUMMARY.md) - No-scroll design pattern
- [NO_SCROLL_ANALYSIS_RECOMMENDATIONS.md](./architecture/NO_SCROLL_ANALYSIS_RECOMMENDATIONS.md) - Design analysis
- [TEST_RESULTS_ANALYSIS.md](./architecture/TEST_RESULTS_ANALYSIS.md) - Test insights
- Material Design 3 archives (5 documents)

---

### ⭐ [Features](./features/)
Feature specifications and functional requirements.

**Files:** 3 documents
- [FUNCTIONAL_REQUIREMENTS.md](./features/FUNCTIONAL_REQUIREMENTS.md) - Complete requirements specification
- [FR-004A-IMPLEMENTATION.md](./features/FR-004A-IMPLEMENTATION.md) - Guest filtering feature
- [FR-004B-QUICK-REFERENCE.md](./features/FR-004B-QUICK-REFERENCE.md) - Guest filtering quick reference

**Key Features:**
- Hotel vacancy search
- Date range selection
- Guest number filtering (FR-004)
- Results display and management

---

### 📖 [Guides](./guides/)
User guides, development guides, and how-to documentation.

**Files:** 24 documents
- [QUICK_START.md](./guides/QUICK_START.md) - Quick start guide
- [E2E_TESTING_GUIDE.md](./guides/E2E_TESTING_GUIDE.md) - End-to-end testing
- [LOCAL_TESTING_GUIDE.md](./guides/LOCAL_TESTING_GUIDE.md) - Local development setup
- [DEVELOPMENT_TOOLS_GUIDE.md](./guides/DEVELOPMENT_TOOLS_GUIDE.md) - Development tools
- [GIT_BEST_PRACTICES_GUIDE.md](./guides/GIT_BEST_PRACTICES_GUIDE.md) - Git workflow
- [NO_SCROLL_PRINCIPLE_GUIDE.md](./guides/NO_SCROLL_PRINCIPLE_GUIDE.md) - Design philosophy
- [COPILOT_PROMPT_SCOPING_GUIDE.md](./guides/COPILOT_PROMPT_SCOPING_GUIDE.md) - AI assistance guide
- And more...

---

### 🔧 [Implementation](./implementation/)
Technical implementation details and code-level documentation.

**Files:** 3 documents
- [HOTEL_CACHE_IMPLEMENTATION.md](./implementation/HOTEL_CACHE_IMPLEMENTATION.md) - LocalStorage cache system
- [HOTEL_CACHE_QUICK_REFERENCE.md](./implementation/HOTEL_CACHE_QUICK_REFERENCE.md) - Cache usage guide
- [DATE_FORMAT_CHANGE.md](./implementation/DATE_FORMAT_CHANGE.md) - Date format standardization

**Topics:**
- Caching strategies (localStorage)
- Date handling (ISO 8601)
- Performance optimizations

---

### 📁 Project Structure & Organization

**Root-level Documentation:**
- [PROJECT_STRUCTURE.md](./architecture/PROJECT_STRUCTURE.md) - Comprehensive folder structure guide ⭐
- [RESTRUCTURE_SUMMARY.md](./guides/RESTRUCTURE_SUMMARY.md) - v2.0 restructure summary 🆕

**Related Guides:**
- [../.github/FOLDER_STRUCTURE_GUIDE.md](../.github/FOLDER_STRUCTURE_GUIDE.md) - Best practices guide
- [../.github/HTML_CSS_JS_SEPARATION.md](../.github/HTML_CSS_JS_SEPARATION.md) - Separation principles

**Topics:**
- Folder organization and naming conventions
- Static vs. source file separation
- Build configuration and tooling
- Migration from v1.x to v2.0

---

### 📋 [Specifications](./specifications/)
Technical specifications and standards.

**Files:** 5 documents
- [HTML_SPECIFICATION.md](./specifications/HTML_SPECIFICATION.md) - HTML standards and structure
- [SPECIFICATION_FORMATS_README.md](./specifications/SPECIFICATION_FORMATS_README.md) - Format documentation
- [HTML_GRAMMAR_SPECIFICATION.ebnf](./specifications/HTML_GRAMMAR_SPECIFICATION.ebnf) - EBNF grammar
- [HTML_RFC_SPECIFICATION.txt](./specifications/HTML_RFC_SPECIFICATION.txt) - RFC-style spec
- [HTML_SCHEMA_DEFINITION.json](./specifications/HTML_SCHEMA_DEFINITION.json) - JSON schema

**Coverage:**
- HTML structure and semantics
- Form validation rules
- Data formats and schemas

---

### 🎨 [Styling](./styling/)
CSS, templates, and visual design documentation.

**Files:** 11 documents
- [GUEST_BUTTONS_COMPLETE_GUIDE.md](./styling/GUEST_BUTTONS_COMPLETE_GUIDE.md) - Complete guest buttons implementation ⭐ 🆕
- [BOOTSTRAP_INTEGRATION.md](./styling/BOOTSTRAP_INTEGRATION.md) - Bootstrap 5.3.3 integration
- [BOOTSTRAP_UPGRADE_SUMMARY.md](./styling/BOOTSTRAP_UPGRADE_SUMMARY.md) - Bootstrap upgrade summary
- [COLORLIB_TEMPLATE_APPLICATION.md](./styling/COLORLIB_TEMPLATE_APPLICATION.md) - Template integration
- [CSS_FOLDERS_COMPARISON.md](./styling/CSS_FOLDERS_COMPARISON.md) - CSS structure analysis
- [CSS_LOADING_ISSUE.md](./styling/CSS_LOADING_ISSUE.md) - CSS troubleshooting
- [CACHE_STATUS_TOOLTIP.md](./styling/CACHE_STATUS_TOOLTIP.md) - Cache status tooltip implementation
- [FIXED_HEADER.md](./styling/FIXED_HEADER.md) - Fixed header implementation
- [FORM_IN_HEADER_IMPLEMENTATION.md](./styling/FORM_IN_HEADER_IMPLEMENTATION.md) - Form integration in header
- [GUEST_INPUT_WIDTH_FIX.md](./styling/GUEST_INPUT_WIDTH_FIX.md) - Guest input width fix
- [TOP_ALIGNMENT_FIX.md](./styling/TOP_ALIGNMENT_FIX.md) - Top alignment improvements

**Topics:**
- Guest button states, layouts, and interactions (consolidated guide)
- Bootstrap framework integration
- Colorlib template customization
- CSS organization and troubleshooting
- UI component styling

---

### 📜 [Scripts](./scripts/)
Script documentation and troubleshooting guides.

**Files:** 2 documents
- [SCRIPTS_INDEX.md](./scripts/SCRIPTS_INDEX.md) - Comprehensive index of all project scripts 🆕
- [TROUBLESHOOTING_GUIDE.md](./scripts/TROUBLESHOOTING_GUIDE.md) - Script troubleshooting guide 🆕

**Topics:**
- Utility scripts (fix-css-symlink.sh, update-dependencies.sh, run-tests.sh)
- Test scripts (10 automated test scripts)
- Script standards and conventions
- Error handling and debugging
- Performance optimization

---

### 📏 [Standards](./standards/)
Coding standards, best practices, and development conventions.

**Files:** 5 documents
- [CENTRALIZED_LOGGER.md](./standards/CENTRALIZED_LOGGER.md) - Logger service standards and usage 🆕
- [CONSTANTS_EXTRACTION.md](./standards/CONSTANTS_EXTRACTION.md) - Constants management patterns 🆕
- [ES6_MODULE_CONVERSION.md](./standards/ES6_MODULE_CONVERSION.md) - ES6 module conversion guide 🆕
- [DOCUMENTATION_AUTOMATION.md](./standards/DOCUMENTATION_AUTOMATION.md) - Automated documentation standards 🆕
- [ESLINT_CONFIGURATION.md](./standards/ESLINT_CONFIGURATION.md) - ESLint setup and rules

**Topics:**
- Centralized logging best practices
- Constants and magic number elimination
- ES6 module patterns and migration
- Documentation automation and linting
- Code quality standards and enforcement

---

### 🧪 [Testing](./testing/)
Test data, test results, and testing documentation.

**Files:** 4 documents
- [COVERAGE_DASHBOARD.md](./testing/COVERAGE_DASHBOARD.md) - Test coverage dashboard guide 🆕 ⭐
- [COVERAGE_DASHBOARD_QUICK_REF.md](./testing/COVERAGE_DASHBOARD_QUICK_REF.md) - Quick reference guide 🆕
- [FR-014-TEST-DOCUMENTATION.md](./testing/FR-014-TEST-DOCUMENTATION.md) - Comprehensive FR-014 test documentation
- [api_test_response.json](./testing/api_test_response.json) - Sample API response for testing

**Test Coverage:**
- Interactive coverage dashboard with historical trends 🆕
- Jest unit tests and use case E2E tests tracking
- FR-014 booking rules toggle functionality
- Unit tests, E2E tests, and integration tests
- Test execution scripts and automation

**Note:** Main test scripts are in the `/tests` folder at project root.

---

### 📜 [Scripts](./scripts/)
Script documentation and troubleshooting guides.

**Files:** 2 documents
- [SCRIPTS_INDEX.md](./scripts/SCRIPTS_INDEX.md) - Comprehensive index of all project scripts 🆕
- [TROUBLESHOOTING_GUIDE.md](./scripts/TROUBLESHOOTING_GUIDE.md) - Script troubleshooting guide 🆕

**Topics:**
- Utility scripts (fix-css-symlink.sh, update-dependencies.sh, run-tests.sh)
- Test scripts (10 automated test scripts)
- Script standards and conventions
- Error handling and debugging
- Performance optimization

---

### 📁 [Archive](./archive/)
Archived documentation and historical records.

**Files:** 2 documents
- [DOCUMENTATION_UPDATE_PLAN.md](./archive/DOCUMENTATION_UPDATE_PLAN.md) - Historical documentation update plan 🆕
- [documentation_updates.md](./archive/documentation_updates.md) - Legacy documentation updates 🆕

**Purpose:**
- Preserve historical documentation for reference
- Track evolution of documentation practices
- Maintain audit trail of major changes

---

### 📊 [Reports](./reports/)
Analysis reports, verification documents, and audit results.

**Files:** 7 documents
- [CODE_DOCUMENTATION_ALIGNMENT.md](./reports/CODE_DOCUMENTATION_ALIGNMENT.md) - Code-docs alignment verification
- [FEATURE_STATUS_VERIFICATION.md](./reports/FEATURE_STATUS_VERIFICATION.md) - Feature implementation status
- [DELIVERABLES.md](./reports/DELIVERABLES.md) - Project deliverables
- [DOCUMENTATION_UPDATE_RECOMMENDATIONS.md](./reports/DOCUMENTATION_UPDATE_RECOMMENDATIONS.md) - Doc improvement suggestions
- Subdirectories: analysis/, bugfixes/, implementation/

---

### 🔍 [Troubleshooting](./troubleshooting/)
Known issues, debugging guides, and problem solutions.

**Files:** 3 documents
- [UNICODE_EMOJI_CORRUPTION_GUIDE.md](./troubleshooting/UNICODE_EMOJI_CORRUPTION_GUIDE.md) - Emoji encoding issues
- [UNICODE_EMOJI_CORRUPTION_QUICK_REF.md](./troubleshooting/UNICODE_EMOJI_CORRUPTION_QUICK_REF.md) - Quick reference
- [UNICODE_EMOJI_GLOSSARY.md](./troubleshooting/UNICODE_EMOJI_GLOSSARY.md) - Emoji glossary

**Common Issues:**
- Unicode and emoji handling
- Encoding problems
- Display issues

---

### 🤖 [Workflow Automation](./workflow-automation/)
CI/CD workflows and automation documentation.

**Files:** 2 documents
- [PRODUCTION_TEST_EXECUTION_COMPLETE.md](./workflow-automation/PRODUCTION_TEST_EXECUTION_COMPLETE.md) - Production test results
- [PRODUCTION_TEST_EXECUTION_SUMMARY.md](./workflow-automation/PRODUCTION_TEST_EXECUTION_SUMMARY.md) - Test execution summary

---

### 🔄 [Workflows](./workflows/)
Development workflows and execution contexts.

**Files:** 1 document
- [WORKFLOW_EXECUTION_CONTEXT_v1.4.3.md](./workflows/WORKFLOW_EXECUTION_CONTEXT_v1.4.3.md) - Development workflow context

**Topics:**
- Development process
- Deployment workflows
- Version management

---

## 🚀 Quick Start

### New to the Project?
1. Start with [QUICKSTART.md](./guides/QUICKSTART.md) in the guides folder
2. Read [API Documentation](./api/README.md) for API integration
3. Review [Features Documentation](./features/FUNCTIONAL_REQUIREMENTS.md) for requirements

### Developers
1. [Development Tools Guide](./guides/DEVELOPMENT_TOOLS_GUIDE.md)
2. [Local Testing Guide](./guides/LOCAL_TESTING_GUIDE.md)
3. [E2E Testing Guide](./guides/E2E_TESTING_GUIDE.md)

### Troubleshooting
1. Check [Troubleshooting](./troubleshooting/) folder
2. Review [CSS Loading Issue](./styling/CSS_LOADING_ISSUE.md) for common CSS problems
3. See [Test Results Analysis](./architecture/TEST_RESULTS_ANALYSIS.md) for test insights

---

## 📊 Documentation Statistics

| Category | Files | Description |
|----------|-------|-------------|
| API | 8 | API integration and client usage |
| Architecture | 12 | System design and patterns |
| Features | 3 | Requirements and specifications |
| Guides | 24 | User and developer guides |
| Implementation | 4 | Technical implementation details |
| Scripts | 2 | Script documentation and troubleshooting 🆕 |
| Specifications | 5 | Standards and schemas |
| Styling | 11 | CSS and visual design |
| Testing | 2 | Test data and documentation 🆕 |
| Archive | 2 | Historical documentation 🆕 |
| Troubleshooting | 3 | Problem solving guides |
| Workflows | 1 | Development processes |
| **Total** | **77** | **Complete documentation** |

---

## 🔗 External Resources

### API Documentation
- [busca_vagas Repository](https://github.com/mpbarbosa/busca_vagas)
- [busca_vagas API Documentation](https://github.com/mpbarbosa/busca_vagas/blob/main/docs/api/API_CLIENT_DOCUMENTATION.md)
- [DATA_FLOW_DOCUMENTATION](https://github.com/mpbarbosa/busca_vagas/blob/main/docs/DATA_FLOW_DOCUMENTATION.md)

### Templates & Resources
- [Colorlib Template](https://colorlib.com/) - Base template used

---

## 📝 Documentation Conventions

### File Naming
- **UPPERCASE.md** - Major documentation files
- **lowercase.md** - Supporting documentation
- **FEATURE-XXX-NAME.md** - Feature-specific docs
- **README.md** - Index files for each category

### Document Headers
All major documents include:
- Version number
- Last updated date
- Status indicator
- Author/maintainer information

### Cross-References
Use relative links for internal documentation:
```markdown
[API Documentation](./api/README.md)
[Features](./features/FUNCTIONAL_REQUIREMENTS.md)
```

---

## 🆕 Recent Updates

### December 22, 2024
- **Documentation Consolidation**: Merged 5 guest button documents into comprehensive guide
  - Created [GUEST_BUTTONS_COMPLETE_GUIDE.md](./styling/GUEST_BUTTONS_COMPLETE_GUIDE.md)
  - Consolidated layout, visibility, cursor, and states documentation
  - Single source of truth for guest button implementation

### December 14, 2025
- Organized documentation into categories
- Created category folders (api, features, styling, etc.)
- Updated API version to v1.4.1
- Added comprehensive documentation index

### December 11, 2025
- Added guest filtering feature (FR-004)
- Updated functional requirements

### December 9, 2025
- Material Design 3 migration archived
- No-scroll principle implementation

---

## 🤝 Contributing to Documentation

When adding new documentation:

1. **Choose the right category:**
   - API integration → `api/`
   - System design → `architecture/`
   - Feature specs → `features/`
   - How-to guides → `guides/`
   - Code details → `implementation/`
   - Standards → `specifications/`
   - CSS/design → `styling/`
   - Test data → `testing/`
   - Problems → `troubleshooting/`
   - Processes → `workflows/`

2. **Follow naming conventions:**
   - Use descriptive names
   - Include version numbers if applicable
   - Use UPPERCASE for major docs

3. **Update this README:**
   - Add your document to the appropriate section
   - Update statistics
   - Note the change in Recent Updates

4. **Include standard headers:**
   - Title
   - Version/date
   - Purpose/overview
   - Table of contents (for long docs)

---

## 📞 Need Help?

- 📖 Check the appropriate category folder
- 🔍 Use grep to search documentation: `grep -r "search term" docs/`
- 📋 Review [QUICKSTART.md](./guides/QUICKSTART.md) for basics
- 🐛 Check [Troubleshooting](./troubleshooting/) for known issues

---

**Documentation Status:** ✅ Complete and Organized  
**Last Major Update:** 2025-12-14 (Documentation categorization)  
**Maintained By:** Monitora Vagas Team
