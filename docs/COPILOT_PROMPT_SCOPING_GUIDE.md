# GitHub Copilot Prompt Scoping Guide

> **📋 Document Distribution: Submodule Copy (Monitora Vagas)**  
> This is an **identical copy** of the canonical guide for developer convenience.  
> **Canonical Version**: See [/docs/COPILOT_PROMPT_SCOPING_GUIDE.md](../../../docs/COPILOT_PROMPT_SCOPING_GUIDE.md) in the main repository.  
> **Main Repository**: [mpbarbosa_site](https://github.com/mpbarbosa/mpbarbosa_site)  
> **Last Synchronized**: 2025-11-09

## Overview

This guide provides best practices for creating well-defined, scoped prompts when working with GitHub Copilot to ensure the AI assistant implements only what you intend, without overstepping the specified boundaries.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Prompt Structure Framework](#prompt-structure-framework)
3. [Scope Definition Techniques](#scope-definition-techniques)
4. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)
5. [Examples of Well-Scoped Prompts](#examples-of-well-scoped-prompts)
6. [Verification Strategies](#verification-strategies)
7. [Quick Reference Checklist](#quick-reference-checklist)

## Core Principles

### 1. Specificity Over Generality
- Be explicit about what should and should not change
- Define exact boundaries of modification
- Specify the precise scope of files, functions, or code blocks

### 2. Single Responsibility Principle
- One prompt should address one specific change or feature
- Avoid combining multiple unrelated modifications
- Break complex requests into smaller, focused tasks

### 3. Context Preservation
- Explicitly state what existing functionality must remain unchanged
- Specify compatibility requirements
- Define what should not be affected by the changes

## Prompt Structure Framework

### Basic Template
```
[CONTEXT] + [SPECIFIC_ACTION] + [BOUNDARIES] + [CONSTRAINTS] + [VERIFICATION]
```

### Detailed Framework

#### 1. Context Setting
- **File/Location**: Specify exact file path and location
- **Current State**: Describe the current implementation
- **Purpose**: Explain the reason for the change

#### 2. Specific Action
- **What**: Clearly define what needs to be done
- **Where**: Exact location (line numbers, method names, etc.)
- **How**: Specify the approach if you have preferences

#### 3. Boundaries
- **Include**: What should be modified
- **Exclude**: What should NOT be modified
- **Scope Limits**: Define the maximum extent of changes

#### 4. Constraints
- **Technical**: API compatibility, performance requirements
- **Behavioral**: Existing functionality preservation
- **Structural**: Code style, architecture patterns

#### 5. Verification
- **Expected Outcome**: What the result should look like
- **Test Criteria**: How to verify the change works correctly
- **Side Effects**: What should remain unaffected

## Scope Definition Techniques

### 1. File-Level Scoping
```
"In file src/components/UserProfile.js, modify only the validateEmail function..."
"Make changes exclusively to the SpeechSynthesisManager.js file..."
"Update only the CSS in styles/main.css, no HTML modifications..."
```

### 2. Function/Method-Level Scoping
```
"In the calculateTotal() method on lines 45-67..."
"Modify only the error handling within the fetchUserData function..."
"Add validation to the speak() method without changing its signature..."
```

### 3. Line-Level Scoping
```
"Between lines 120-135 in UserService.js..."
"Modify only the return statement on line 89..."
"Add error handling after line 156, before the existing return..."
```

### 4. Feature-Level Scoping
```
"Add input validation without changing the UI components..."
"Implement error logging without modifying the existing workflow..."
"Add caching functionality while preserving all current API responses..."
```

### 5. Behavioral Scoping
```
"Maintain backward compatibility with existing API calls..."
"Preserve all current function signatures and return types..."
"Keep the same user experience while improving performance..."
```

## Common Pitfalls and Solutions

### Pitfall 1: Vague Action Words
❌ **Bad**: "Fix the authentication system"
✅ **Good**: "Add null checks to the validateToken function in AuthService.js without modifying the token refresh logic"

### Pitfall 2: Unclear Boundaries
❌ **Bad**: "Improve the error handling"
✅ **Good**: "Add try-catch blocks to the database connection methods in UserRepository.js, lines 23-45, without changing the existing error message format"

### Pitfall 3: Missing Constraints
❌ **Bad**: "Add logging to the API calls"
✅ **Good**: "Add debug logging to the fetchUser API call in UserController.js using the existing logger instance, without modifying the response structure or timing"

### Pitfall 4: Scope Creep Enablers
❌ **Bad**: "Optimize the performance"
✅ **Good**: "Cache the results of the getUserPreferences function using a Map, without changing the function signature or return format"

## Examples of Well-Scoped Prompts

### Example 1: Bug Fix
```
**Context**: In SpeechSynthesisManager.js, the speak() method on line 67 doesn't handle cases where the voice parameter is null.

**Action**: Add a null check for the voice parameter at the beginning of the speak() method.

**Boundaries**: 
- Modify only the speak() method
- Do not change method signature
- Do not modify any other methods in the class

**Constraints**:
- Use existing error handling patterns from the class
- Maintain the same return behavior for valid inputs
- Do not add new dependencies

**Verification**: The method should return early with appropriate error handling when voice is null, and continue normal operation for valid voice parameters.
```

### Example 2: Feature Addition
```
**Context**: The UserProfile component needs email validation before saving.

**Action**: Add email format validation to the saveProfile() method in components/UserProfile.js.

**Boundaries**:
- Add validation only to saveProfile() method (lines 89-112)
- Do not modify the UI components or form fields
- Do not change the existing save workflow for valid emails

**Constraints**:
- Use regex pattern validation
- Return validation errors in the same format as existing field validations
- Do not add external validation libraries

**Verification**: Invalid emails should prevent saving and display appropriate error messages, while valid emails continue the normal save process.
```

### Example 3: Refactoring
```
**Context**: The calculateDiscount function in OrderService.js has nested if statements that need simplification.

**Action**: Refactor the nested if-else logic in calculateDiscount() (lines 45-78) to use early returns.

**Boundaries**:
- Modify only the calculateDiscount() function logic
- Do not change function signature or return type
- Do not modify any calling code or tests

**Constraints**:
- Maintain identical behavior for all input combinations
- Keep the same parameter validation
- Preserve all existing edge case handling

**Verification**: All existing unit tests should continue to pass, and the function should return identical results for all input scenarios.
```

## Verification Strategies

### 1. Pre-Implementation Verification
- Ask Copilot to "explain the changes you would make" before implementing
- Request a "summary of files and functions that would be modified"
- Use "show me the specific lines that would change"

### 2. Implementation Verification
- Review the diff to ensure only intended changes were made
- Check that no additional files were modified
- Verify that existing tests still pass

### 3. Post-Implementation Verification
- Test the specific functionality that was requested
- Verify that unrelated features still work
- Check for any unexpected side effects

## Quick Reference Checklist

Before submitting a prompt to GitHub Copilot, verify:

- [ ] **Specific Location**: Exact file, function, or line numbers specified
- [ ] **Clear Action**: Unambiguous description of what to do
- [ ] **Defined Boundaries**: Explicit about what should NOT change
- [ ] **Technical Constraints**: API compatibility, performance, dependencies addressed
- [ ] **Behavioral Constraints**: Existing functionality preservation specified
- [ ] **Single Responsibility**: Prompt addresses only one concern
- [ ] **Verification Criteria**: How to confirm the change is correct
- [ ] **Context Provided**: Sufficient background for understanding the change

## Advanced Techniques

### Using Inline Comments for Guidance
```javascript
// COPILOT: Add input validation here, only for email format
function saveUser(userData) {
    // COPILOT: Do not modify this existing logic below
    const existingValidation = validateRequired(userData);
    // ... rest of function
}
```

### Progressive Refinement Approach
1. Start with analysis: "What would need to change to add X?"
2. Refine scope: "Focus only on the validation logic"
3. Implement: "Add the validation as discussed, without other changes"

### Context Window Management
- Select only the relevant code section before prompting
- Use file tabs to limit Copilot's context to specific files
- Close unrelated files to reduce scope creep

## Conclusion

Well-scoped prompts lead to more predictable, maintainable, and focused code changes. By following these guidelines, you can leverage GitHub Copilot's capabilities while maintaining precise control over what gets modified in your codebase.

Remember: The goal is not to limit Copilot's intelligence, but to channel it effectively toward your specific objectives.