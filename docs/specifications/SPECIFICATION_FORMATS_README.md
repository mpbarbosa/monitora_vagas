# HTML Formal Specification Documents

## Overview

This directory contains formal specifications for HTML files in the Trade Union Hotel Search Platform. Multiple specification formats are provided to serve different audiences and use cases.

## Available Specification Formats

### 1. Technical Specification (Markdown)
**File**: `HTML_SPECIFICATION.md`  
**Format**: W3C-style Technical Specification  
**Size**: 21KB

**Best for:**
- Developers implementing HTML pages
- QA engineers writing tests
- Technical architects
- Documentation writers

**Features:**
- RFC 2119 compliance (MUST, SHOULD, MAY keywords)
- Complete component specifications
- Interface Definition Language (IDL)
- Behavioral specifications
- Validation requirements
- Conformance criteria
- Comprehensive appendices

**Sections:**
1. Introduction and scope
2. Normative references
3. Terminology and definitions
4. HTML document structure
5. Component specifications
6. Interface definitions (TypeScript-style)
7. Behavioral specifications
8. Validation requirements
9. Conformance criteria
10. Appendices (CSS classes, JavaScript API, validation rules, errors)

---

### 2. JSON Schema Definition
**File**: `HTML_SCHEMA_DEFINITION.json`  
**Format**: JSON Schema Draft-07  
**Size**: 16KB

**Best for:**
- Automated validation tools
- IDE integration and autocomplete
- API documentation generators
- Code generators
- Schema validators

**Features:**
- Machine-readable specification
- Formal data type definitions
- Validation constraints
- Required/optional field definitions
- Pattern matching for strings
- Enumerated values
- Example documents

**Use cases:**
- Validate HTML structure programmatically
- Generate HTML builders/factories
- IDE autocomplete suggestions
- API contract validation
- Documentation generation

---

### 3. RFC-Style Specification
**File**: `HTML_RFC_SPECIFICATION.txt`  
**Format**: IETF RFC (Request for Comments)  
**Size**: 18KB

**Best for:**
- Standards documentation
- Formal protocol definitions
- Academic reference
- Long-term archival
- Interoperability specifications

**Features:**
- IETF RFC format compliance
- Numbered sections
- Formal language (RFC 2119)
- Security considerations
- IANA considerations (if applicable)
- Normative and informative references
- Example implementations
- Validation checklists

**Structure:**
- Abstract
- Status and copyright
- Table of contents
- Introduction
- Requirements language
- Specifications
- Security considerations
- Accessibility considerations
- References
- Appendices

---

### 4. Grammar Specification (EBNF)
**File**: `HTML_GRAMMAR_SPECIFICATION.ebnf`  
**Format**: Extended Backus-Naur Form  
**Size**: 14KB

**Best for:**
- Parser implementation
- Formal language definition
- Academic study
- Compiler/tool development
- Syntax validation

**Features:**
- Formal grammar notation
- Production rules
- Terminal and non-terminal symbols
- Recursive definitions
- Pattern specifications
- Semantic constraints (in comments)

**Defines:**
- Document structure grammar
- Component grammar
- Form grammar
- Input element grammar
- Text content grammar
- Basic type definitions

---

## Quick Comparison

| Format | Audience | Best Use Case | Machine Readable |
|--------|----------|---------------|------------------|
| **Technical Spec** | Developers, QA | Implementation guide | No |
| **JSON Schema** | Tools, APIs | Validation, code gen | Yes |
| **RFC** | Standards bodies | Formal specification | No |
| **EBNF Grammar** | Parser writers | Syntax definition | Partially |

## Which Format to Use?

### For Implementation
→ **Technical Specification** (`HTML_SPECIFICATION.md`)
- Most comprehensive
- Examples and explanations
- TypeScript interfaces
- Behavioral specifications

### For Validation
→ **JSON Schema** (`HTML_SCHEMA_DEFINITION.json`)
- Machine validation
- Programmatic checks
- Schema validators
- IDE integration

### For Standards Work
→ **RFC Specification** (`HTML_RFC_SPECIFICATION.txt`)
- Formal protocol
- Standards submission
- Academic reference
- Archival documentation

### For Parser Development
→ **Grammar Specification** (`HTML_GRAMMAR_SPECIFICATION.ebnf`)
- Syntax rules
- Parser generation
- Formal language theory
- Compiler development

## Common Elements Across All Formats

All specifications define:

1. **Document Structure**
   - DOCTYPE declaration
   - HTML root element
   - Head element requirements
   - Body element requirements

2. **Component Hierarchy**
   - Page wrapper
   - Content wrapper
   - Card components
   - Form components

3. **Form Elements**
   - Input groups
   - Labels
   - Input fields
   - Select dropdowns
   - Buttons

4. **Validation Rules**
   - Required fields
   - Field formats
   - Value constraints
   - Error messages

5. **Accessibility Requirements**
   - Keyboard navigation
   - Screen reader support
   - ARIA attributes
   - Focus management

## Tools and Validators

### For Technical Specification
- W3C HTML Validator: https://validator.w3.org/
- W3C CSS Validator: https://jigsaw.w3.org/css-validator/
- WAVE Accessibility: https://wave.webaim.org/
- Lighthouse: https://developers.google.com/web/tools/lighthouse

### For JSON Schema
- JSON Schema Validator: https://www.jsonschemavalidator.net/
- AJV (Another JSON Validator): https://ajv.js.org/
- Schema Store: https://www.schemastore.org/
- VS Code JSON Schema validation

### For RFC Specification
- RFC Tools: https://tools.ietf.org/
- RFC XML Generator: https://xml2rfc.tools.ietf.org/
- RFC Errata: https://www.rfc-editor.org/errata.php

### For EBNF Grammar
- EBNF Parser Generators
- ANTLR: https://www.antlr.org/
- Bison: https://www.gnu.org/software/bison/
- Railroad Diagram Generator

## Usage Examples

### Validating HTML with JSON Schema

```javascript
const Ajv = require('ajv');
const schema = require('./HTML_SCHEMA_DEFINITION.json');

const ajv = new Ajv();
const validate = ajv.compile(schema);

const htmlData = {
  doctype: "html",
  html: {
    lang: "en",
    head: { /* ... */ },
    body: { /* ... */ }
  }
};

const valid = validate(htmlData);
if (!valid) {
  console.log(validate.errors);
}
```

### Using Technical Specification for Testing

```javascript
// Based on HTML_SPECIFICATION.md Section 6.5
describe('Input Group Component', () => {
  it('MUST have class "input-group"', () => {
    const inputGroup = document.querySelector('.input-group');
    expect(inputGroup).toBeTruthy();
  });
  
  it('MUST have a size modifier class', () => {
    const inputGroup = document.querySelector('.input-group');
    const hasSize = inputGroup.classList.contains('input--large') ||
                    inputGroup.classList.contains('input--medium') ||
                    inputGroup.classList.contains('input--small');
    expect(hasSize).toBe(true);
  });
});
```

### Parsing with EBNF Grammar

```python
# Using the EBNF grammar to validate HTML structure
from ebnf_parser import parse_ebnf, validate_document

grammar = open('HTML_GRAMMAR_SPECIFICATION.ebnf').read()
parser = parse_ebnf(grammar)

html_document = open('index.html').read()
is_valid = parser.validate(html_document, start_rule='<document>')

if not is_valid:
    print("Document does not conform to grammar")
```

## Maintenance

### Updating Specifications

When making changes to HTML structure:

1. Update all four specification formats
2. Ensure consistency across formats
3. Update version numbers
4. Document changes in version history
5. Run validation tests
6. Update examples

### Version Synchronization

All specifications should maintain the same version number:
- Current version: **2.0.0**
- Update date: **December 10, 2024**

### Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-01 | Initial specifications |
| 2.0.0 | 2024-12-10 | Updated for new design system |

## References

### Standards
- HTML Living Standard: https://html.spec.whatwg.org/
- CSS Specifications: https://www.w3.org/Style/CSS/
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- RFC 2119: https://www.rfc-editor.org/rfc/rfc2119
- JSON Schema: https://json-schema.org/
- EBNF: ISO/IEC 14977:1996

### Tools
- W3C Validators
- JSON Schema validators
- EBNF parser generators
- Accessibility testing tools

## Contributing

When contributing to these specifications:

1. Maintain format-specific conventions
2. Use RFC 2119 keywords consistently
3. Provide examples
4. Include validation rules
5. Document edge cases
6. Update all related formats

## License

Copyright © 2024. All rights reserved.

These specifications are for internal use only. Unauthorized distribution is prohibited.

---

**Last Updated**: December 10, 2024  
**Maintained By**: Development Team  
**Status**: Active
