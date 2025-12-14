# HTML Formal Specification Document
## Trade Union Hotel Search Platform

**Document Type**: Technical Specification  
**Version**: 2.0.0  
**Status**: Draft  
**Last Updated**: December 10, 2024  
**Author**: Development Team  
**Classification**: Internal Documentation

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Document Scope](#2-document-scope)
3. [Normative References](#3-normative-references)
4. [Terminology and Definitions](#4-terminology-and-definitions)
5. [HTML Document Structure](#5-html-document-structure)
6. [Component Specifications](#6-component-specifications)
7. [Interface Definition Language](#7-interface-definition-language)
8. [Behavioral Specifications](#8-behavioral-specifications)
9. [Validation Requirements](#9-validation-requirements)
10. [Conformance Criteria](#10-conformance-criteria)

---

## 1. Introduction

### 1.1 Purpose

This document formally specifies the HTML structure, components, and behavior of the Trade Union Hotel Search Platform web application (`index.html`).

### 1.2 Intended Audience

- Web Developers
- Quality Assurance Engineers
- Technical Architects
- Documentation Writers
- Maintenance Engineers

### 1.3 Document Conventions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

---

## 2. Document Scope

### 2.1 In Scope

- HTML5 document structure
- DOM element specifications
- CSS class definitions
- JavaScript interface contracts
- Accessibility requirements
- Component behavior specifications

### 2.2 Out of Scope

- Server-side implementation details
- Database schema definitions
- Network protocol specifications
- Deployment procedures

---

## 3. Normative References

This specification normatively references the following documents:

- **HTML Living Standard** - WHATWG HTML Specification
- **CSS Specifications** - W3C CSS Level 3
- **ECMAScript 2015** - ECMA-262, 6th Edition
- **WAI-ARIA 1.2** - Web Accessibility Initiative
- **RFC 2119** - Key words for use in RFCs to Indicate Requirement Levels

---

## 4. Terminology and Definitions

### 4.1 Terms

- **Component**: A reusable, self-contained HTML element or group of elements
- **Widget**: An interactive UI element
- **Container**: A parent element that contains child elements
- **Form Control**: An input element within a form
- **State**: The current condition or mode of a component

### 4.2 Abbreviations

- **API**: Application Programming Interface
- **DOM**: Document Object Model
- **UI**: User Interface
- **UX**: User Experience
- **ARIA**: Accessible Rich Internet Applications
- **SEO**: Search Engine Optimization

---

## 5. HTML Document Structure

### 5.1 Document Type Declaration

```html
<!DOCTYPE html>
```

**Conformance**: The document MUST use the HTML5 DOCTYPE declaration.

### 5.2 Root Element

```html
<html lang="en">
```

**Specification**:
- **Element**: `html`
- **Attributes**:
  - `lang` (REQUIRED): ISO 639-1 language code
  - Value MUST be "en" for English content

### 5.3 Document Head

#### 5.3.1 Head Element Structure

```html
<head>
    <!-- Required meta tags -->
    <!-- Title -->
    <!-- External resources -->
    <!-- Styles -->
</head>
```

#### 5.3.2 Required Meta Tags

**Charset Meta Tag**:
```html
<meta charset="UTF-8">
```
- **Requirement**: MUST be the first child of `<head>`
- **Purpose**: Declares character encoding

**Viewport Meta Tag**:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
```
- **Requirement**: REQUIRED for responsive design
- **Attributes**:
  - `width=device-width` (REQUIRED)
  - `initial-scale=1` (REQUIRED)
  - `shrink-to-fit=no` (RECOMMENDED)

**Description Meta Tag**:
```html
<meta name="description" content="[Application Description]">
```
- **Requirement**: REQUIRED for SEO
- **Content**: MUST be between 50-160 characters

**Author Meta Tag**:
```html
<meta name="author" content="[Author Name]">
```
- **Requirement**: OPTIONAL
- **Purpose**: Identifies content author

**Keywords Meta Tag**:
```html
<meta name="keywords" content="[Comma-separated keywords]">
```
- **Requirement**: OPTIONAL
- **Purpose**: SEO keywords

#### 5.3.3 Title Element

```html
<title>[Page Title]</title>
```
- **Requirement**: REQUIRED (HTML5 spec)
- **Content**: MUST be unique and descriptive
- **Length**: SHOULD be 50-60 characters
- **Format**: "[Page Name] - [Site Name]" (RECOMMENDED)

#### 5.3.4 External Resources

**Icon Fonts**:
```html
<link href="vendor/mdi-font/css/material-design-iconic-font.min.css" 
      rel="stylesheet" 
      media="all">
<link href="vendor/font-awesome-4.7/css/font-awesome.min.css" 
      rel="stylesheet" 
      media="all">
```
- **Requirement**: OPTIONAL
- **Purpose**: Icon libraries

**Web Fonts**:
```html
<link href="https://fonts.googleapis.com/css?family=Roboto:..." 
      rel="stylesheet">
```
- **Requirement**: OPTIONAL
- **Loading**: SHOULD use `font-display: swap` in CSS

**Vendor CSS**:
```html
<link href="vendor/select2/select2.min.css" rel="stylesheet" media="all">
<link href="vendor/datepicker/daterangepicker.css" rel="stylesheet" media="all">
```
- **Requirement**: REQUIRED if using respective components
- **Loading Order**: MUST load before main CSS

**Main CSS**:
```html
<link href="css/main.css" rel="stylesheet" media="all">
```
- **Requirement**: REQUIRED
- **Loading Order**: MUST be last stylesheet loaded

### 5.4 Document Body

#### 5.4.1 Body Element Structure

```html
<body>
    <div class="page-wrapper">
        <div class="wrapper">
            <div class="card">
                <div class="card-body">
                    <!-- Content -->
                </div>
            </div>
        </div>
    </div>
</body>
```

**Specification**:
- **Element**: `body`
- **Children**: MUST contain exactly one `.page-wrapper` element
- **Scripts**: SHOULD be placed before closing `</body>` tag

---

## 6. Component Specifications

### 6.1 Page Wrapper Component

**Type**: Container Component

**HTML Structure**:
```html
<div class="page-wrapper bg-color-1 p-t-395 p-b-120">
```

**Specification**:
- **Class Name**: `page-wrapper` (REQUIRED)
- **Additional Classes**:
  - Background class (REQUIRED): One of `bg-color-1`, `bg-color-2`, etc.
  - Padding top class (OPTIONAL): Format `p-t-{pixels}`
  - Padding bottom class (OPTIONAL): Format `p-b-{pixels}`
- **Purpose**: Main page container
- **Children**: MUST contain exactly one `.wrapper` element

### 6.2 Wrapper Component

**Type**: Container Component

**HTML Structure**:
```html
<div class="wrapper wrapper--w1070">
```

**Specification**:
- **Class Name**: `wrapper` (REQUIRED)
- **Width Modifier**: REQUIRED, one of:
  - `wrapper--w1070`: 1070px max-width
  - `wrapper--w900`: 900px max-width
  - `wrapper--w780`: 780px max-width
- **Purpose**: Content width constraint
- **Children**: MUST contain exactly one `.card` element

### 6.3 Card Component

**Type**: Container Component

**HTML Structure**:
```html
<div class="card card-7">
    <div class="card-body">
        <!-- Content -->
    </div>
</div>
```

**Specification**:
- **Class Name**: `card` (REQUIRED)
- **Style Variant**: REQUIRED, format `card-{number}`
  - Available variants: `card-1` through `card-7`
- **Children**: MUST contain exactly one `.card-body` element
- **Purpose**: Content card container

**Card Body**:
- **Class Name**: `card-body` (REQUIRED)
- **Parent**: MUST be child of `.card`
- **Children**: MAY contain form, text, or other content elements

### 6.4 Form Component

**Type**: Interactive Component

**HTML Structure**:
```html
<form class="form" method="POST" action="#">
    <!-- Form controls -->
</form>
```

**Specification**:
- **Element**: `form`
- **Class Name**: `form` (REQUIRED)
- **Attributes**:
  - `method` (REQUIRED): "GET" or "POST"
  - `action` (REQUIRED): URL or "#"
  - `novalidate` (OPTIONAL): For custom validation
- **Children**: SHOULD contain `.input-group` elements

### 6.5 Input Group Component

**Type**: Form Control Container

**HTML Structure**:
```html
<div class="input-group input--[size]">
    <label class="label">[Label Text]</label>
    <input class="input--style-1" type="[type]" name="[name]" id="[id]">
</div>
```

**Specification**:
- **Class Name**: `input-group` (REQUIRED)
- **Size Modifier**: REQUIRED, one of:
  - `input--large`: Full width
  - `input--medium`: Half width
  - `input--small`: Quarter width
- **Children**:
  - Label (REQUIRED): One `.label` element
  - Input/Select (REQUIRED): One form control

**Label Element**:
- **Class Name**: `label` (REQUIRED)
- **Content**: MUST be descriptive text
- **Association**: SHOULD use `for` attribute matching input `id`

**Input Element**:
- **Class Name**: `input--style-1` (REQUIRED)
- **Attributes**:
  - `type` (REQUIRED): Valid HTML5 input type
  - `name` (REQUIRED): Unique form field name
  - `id` (RECOMMENDED): Unique identifier
  - `required` (OPTIONAL): For required fields
  - `placeholder` (OPTIONAL): Hint text

### 6.6 Select Component

**Type**: Form Control

**HTML Structure**:
```html
<select class="input--style-1" name="[name]" id="[id]">
    <option value="">[Placeholder]</option>
    <option value="[value]">[Text]</option>
</select>
```

**Specification**:
- **Element**: `select`
- **Class Name**: `input--style-1` (REQUIRED)
- **Attributes**:
  - `name` (REQUIRED): Form field name
  - `id` (RECOMMENDED): Unique identifier
  - `required` (OPTIONAL): For required fields
- **Children**: MUST contain at least one `option` element

**Option Element**:
- **Attributes**:
  - `value` (REQUIRED): Option value
- **Content**: MUST be user-visible text
- **First Option**: SHOULD be a placeholder with empty value

### 6.7 Button Component

**Type**: Interactive Component

**HTML Structure**:
```html
<button class="btn btn--radius-2 btn--blue-2" type="[type]">
    [Button Text]
</button>
```

**Specification**:
- **Element**: `button` or `a` (with button classes)
- **Required Classes**:
  - `btn` (REQUIRED): Base button class
- **Optional Classes**:
  - Border radius: `btn--radius-{number}`
  - Color: `btn--blue-2`, `btn--red`, etc.
- **Attributes**:
  - `type` (REQUIRED for forms): "submit", "reset", or "button"
  - `disabled` (OPTIONAL): For disabled state
- **Content**: MUST contain descriptive text

---

## 7. Interface Definition Language (IDL)

### 7.1 Form Interface

```typescript
interface HotelSearchForm {
  // Properties
  readonly hotelSelect: HTMLSelectElement;
  readonly checkinInput: HTMLInputElement;
  readonly checkoutInput: HTMLInputElement;
  
  // Methods
  validate(): boolean;
  submit(): Promise<void>;
  reset(): void;
  
  // Events
  onsubmit: (event: SubmitEvent) => void;
  onchange: (event: Event) => void;
}
```

### 7.2 Hotel Select Interface

```typescript
interface HotelSelect {
  // Properties
  element: HTMLSelectElement;
  options: Hotel[];
  selectedValue: string | null;
  
  // Methods
  loadOptions(hotels: Hotel[]): void;
  getValue(): string | null;
  setValue(value: string): void;
  disable(): void;
  enable(): void;
  
  // Events
  onchange: (hotel: Hotel | null) => void;
}

interface Hotel {
  id: string;
  name: string;
  location?: string;
  available: boolean;
}
```

### 7.3 Date Input Interface

```typescript
interface DateInput {
  // Properties
  element: HTMLInputElement;
  value: string; // ISO 8601 format (yyyy-mm-dd)
  minDate: string | null;
  maxDate: string | null;
  
  // Methods
  getValue(): string | null; // Returns ISO format string
  setValue(date: string): void; // Accepts ISO format string
  setMin(date: string): void; // Accepts ISO format string
  setMax(date: string): void; // Accepts ISO format string
  validate(): boolean;
  
  // Events
  onchange: (date: string) => void; // Passes ISO format string
}
```

**Note**: HTML5 date inputs use ISO 8601 format (yyyy-mm-dd) as specified by the HTML standard.

---

## 8. Behavioral Specifications

### 8.1 Page Load Behavior

**Requirement**: The page MUST complete the following sequence on load:

1. **DOM Ready** (REQUIRED)
   - Parse HTML
   - Load and apply CSS
   - Initialize DOM tree

2. **Resource Loading** (REQUIRED)
   - Load external scripts
   - Load web fonts
   - Load vendor libraries

3. **Initialization** (REQUIRED)
   - Initialize form components
   - Load hotel data
   - Set default form values
   - Attach event listeners

4. **Ready State** (REQUIRED)
   - Display form to user
   - Enable form interactions
   - Log ready state (OPTIONAL)

### 8.2 Form Validation Behavior

**Pre-Submit Validation**:

1. **Hotel Selection** (REQUIRED)
   - MUST NOT be empty
   - MUST be a valid hotel ID
   - Error message: "Please select a hotel"

2. **Check-in Date** (REQUIRED)
   - MUST NOT be empty
   - MUST be today or future date
   - MUST be before check-out date
   - Error message: "Please select a valid check-in date"

3. **Check-out Date** (REQUIRED)
   - MUST NOT be empty
   - MUST be after check-in date
   - MUST be at least 1 day after check-in
   - Error message: "Check-out must be after check-in"

**Validation Timing**:
- **On Blur**: Validate individual field (RECOMMENDED)
- **On Submit**: Validate entire form (REQUIRED)
- **On Change**: Clear previous errors (RECOMMENDED)

### 8.3 Form Submission Behavior

**Requirement**: Form submission MUST follow this sequence:

1. **Prevent Default** (REQUIRED)
   - Prevent browser form submission
   - Handle submission via JavaScript

2. **Validation** (REQUIRED)
   - Run validation rules
   - If invalid, stop and show errors
   - If valid, proceed

3. **Data Collection** (REQUIRED)
   - Collect form values
   - Format data for API
   - Validate data types

4. **Submission** (REQUIRED)
   - Show loading state
   - Send data to server/API
   - Handle response

5. **Result Handling** (REQUIRED)
   - On success: Show results or redirect
   - On error: Show error message
   - Hide loading state

### 8.4 Accessibility Behavior

**Keyboard Navigation** (REQUIRED):
- TAB: Move to next form field
- SHIFT+TAB: Move to previous field
- ENTER: Submit form (on submit button)
- SPACE: Toggle select dropdown
- Arrow keys: Navigate select options

**Screen Reader Support** (REQUIRED):
- All form fields MUST have associated labels
- Error messages MUST be announced
- Loading states MUST be announced
- Focus MUST be managed on errors

**ARIA Attributes** (RECOMMENDED):
- `aria-label`: For fields without visible labels
- `aria-describedby`: For help text
- `aria-invalid`: For invalid fields
- `aria-required`: For required fields
- `aria-live`: For dynamic content

---

## 9. Validation Requirements

### 9.1 HTML Validation

The document MUST pass W3C HTML5 validation with:
- Zero errors (REQUIRED)
- Zero warnings (RECOMMENDED)

**Validator**: https://validator.w3.org/

### 9.2 CSS Validation

Stylesheets MUST pass W3C CSS validation with:
- Zero errors (REQUIRED)
- Vendor-specific warnings allowed (ACCEPTABLE)

**Validator**: https://jigsaw.w3.org/css-validator/

### 9.3 Accessibility Validation

The document MUST conform to:
- WCAG 2.1 Level AA (REQUIRED)
- Section 508 (RECOMMENDED)

**Validators**:
- WAVE: https://wave.webaim.org/
- axe DevTools
- Lighthouse Accessibility Score ≥ 90

### 9.4 Performance Validation

**Requirements**:
- Lighthouse Performance Score ≥ 80 (REQUIRED)
- First Contentful Paint ≤ 1.8s (RECOMMENDED)
- Time to Interactive ≤ 3.8s (RECOMMENDED)
- Cumulative Layout Shift ≤ 0.1 (REQUIRED)

### 9.5 Cross-Browser Compatibility

The document MUST function correctly in:
- Chrome (latest 2 versions) - REQUIRED
- Firefox (latest 2 versions) - REQUIRED
- Safari (latest 2 versions) - REQUIRED
- Edge (latest 2 versions) - REQUIRED
- Mobile Chrome (latest) - REQUIRED
- Mobile Safari (latest) - REQUIRED

---

## 10. Conformance Criteria

### 10.1 Structural Conformance

A conforming HTML document MUST:

1. ✓ Use HTML5 DOCTYPE
2. ✓ Have valid HTML5 markup
3. ✓ Include required meta tags
4. ✓ Use semantic HTML elements
5. ✓ Follow proper nesting rules
6. ✓ Have unique IDs
7. ✓ Use valid attribute values

### 10.2 Functional Conformance

A conforming implementation MUST:

1. ✓ Load and render without errors
2. ✓ Display all form fields correctly
3. ✓ Validate form input properly
4. ✓ Submit form data successfully
5. ✓ Handle errors gracefully
6. ✓ Work without JavaScript (progressive enhancement)
7. ✓ Support keyboard navigation

### 10.3 Accessibility Conformance

A conforming implementation MUST:

1. ✓ Meet WCAG 2.1 Level AA
2. ✓ Have proper ARIA attributes
3. ✓ Support screen readers
4. ✓ Have keyboard accessibility
5. ✓ Have sufficient color contrast (4.5:1)
6. ✓ Have focus indicators
7. ✓ Have descriptive labels

### 10.4 Performance Conformance

A conforming implementation SHOULD:

1. ✓ Achieve Lighthouse score ≥ 80
2. ✓ Load in under 3 seconds (3G)
3. ✓ Have minimal layout shifts
4. ✓ Optimize images
5. ✓ Minify CSS/JS
6. ✓ Use async/defer for scripts

---

## Appendix A: CSS Class Reference

### A.1 Layout Classes

| Class | Purpose | Values |
|-------|---------|--------|
| `page-wrapper` | Page container | - |
| `wrapper` | Content wrapper | - |
| `wrapper--w{size}` | Width constraint | 780, 900, 1070 |
| `card` | Card container | - |
| `card-{n}` | Card style variant | 1-7 |
| `card-body` | Card content area | - |

### A.2 Form Classes

| Class | Purpose | Values |
|-------|---------|--------|
| `form` | Form container | - |
| `input-group` | Input wrapper | - |
| `input--{size}` | Input size | large, medium, small |
| `label` | Form label | - |
| `input--style-1` | Input style | - |

### A.3 Button Classes

| Class | Purpose | Values |
|-------|---------|--------|
| `btn` | Base button | - |
| `btn--radius-{n}` | Border radius | 1-3 |
| `btn--{color}` | Button color | blue-2, red, green |

### A.4 Utility Classes

| Class | Purpose | Format |
|-------|---------|--------|
| `bg-color-{n}` | Background color | 1-5 |
| `p-t-{n}` | Padding top | Pixels |
| `p-b-{n}` | Padding bottom | Pixels |
| `m-t-{n}` | Margin top | Pixels |
| `m-b-{n}` | Margin bottom | Pixels |

---

## Appendix B: JavaScript API Reference

### B.1 Form API

```javascript
// Get form element
const form = document.querySelector('.form');

// Form methods
form.validate(); // Returns boolean
form.submit(); // Submits form
form.reset(); // Resets form

// Form events
form.addEventListener('submit', handleSubmit);
form.addEventListener('change', handleChange);
```

### B.2 Select API

```javascript
// Get select element
const select = document.getElementById('hotel-select');

// Select methods
select.loadOptions(hotels); // Populate options
select.getValue(); // Get selected value
select.setValue('hotel-1'); // Set value

// Select events
select.addEventListener('change', handleChange);
```

---

## Appendix C: Validation Rules

### C.1 Field Validation Rules

| Field | Type | Required | Min Length | Max Length | Pattern |
|-------|------|----------|------------|------------|---------|
| Hotel | select | Yes | - | - | Non-empty |
| Check-in | date | Yes | - | - | ISO 8601 (yyyy-mm-dd) |
| Check-out | date | Yes | - | - | ISO 8601 (yyyy-mm-dd) |

**Date Format**: HTML5 `type="date"` inputs use ISO 8601 format (yyyy-mm-dd) as mandated by the HTML specification. The browser's native date picker automatically handles locale-specific display while maintaining ISO format in the input value.

### C.2 Date Validation Rules

| Rule | Description | Error Message |
|------|-------------|---------------|
| Not empty | Date must be selected | "Please select a date" |
| Valid format | Date in ISO 8601 format (yyyy-mm-dd) | Browser native validation |
| Future date | Check-in ≥ today | "Cannot book past dates" |
| Check-out after check-in | Check-out > check-in | "Check-out must be after check-in" |
| Minimum stay | Check-out ≥ check-in + 1 day | "Minimum stay is 1 night" |

---

## Appendix D: Error Messages

### D.1 Validation Error Messages

| Error Code | Message | Severity |
|------------|---------|----------|
| ERR_NO_HOTEL | "Please select a hotel" | Error |
| ERR_NO_CHECKIN | "Please select check-in date" | Error |
| ERR_NO_CHECKOUT | "Please select check-out date" | Error |
| ERR_PAST_DATE | "Cannot select past dates" | Error |
| ERR_CHECKOUT_BEFORE_CHECKIN | "Check-out must be after check-in" | Error |
| ERR_MIN_STAY | "Minimum stay is 1 night" | Warning |

### D.2 System Error Messages

| Error Code | Message | Action |
|------------|---------|--------|
| ERR_NETWORK | "Network error. Please try again." | Retry |
| ERR_SERVER | "Server error. Please contact support." | Contact support |
| ERR_TIMEOUT | "Request timed out. Please try again." | Retry |

---

## Appendix E: Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2024-01-01 | Team | Initial specification |
| 2.0.0 | 2024-12-10 | Team | Updated for new design system |

---

## Appendix F: References

### F.1 Standards

- HTML Living Standard: https://html.spec.whatwg.org/
- CSS Specifications: https://www.w3.org/Style/CSS/
- ECMAScript 2015: https://www.ecma-international.org/ecma-262/6.0/
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- RFC 2119: https://www.rfc-editor.org/rfc/rfc2119

### F.2 Tools

- W3C HTML Validator: https://validator.w3.org/
- W3C CSS Validator: https://jigsaw.w3.org/css-validator/
- WAVE Accessibility: https://wave.webaim.org/
- Google Lighthouse: https://developers.google.com/web/tools/lighthouse

---

**Document End**

**Approval Signatures**:

- Technical Lead: __________________ Date: __________
- QA Lead: __________________ Date: __________
- Project Manager: __________________ Date: __________

---

**Copyright © 2024. All rights reserved.**
