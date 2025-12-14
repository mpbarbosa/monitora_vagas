# FR-004B: Client-Side Guest Number Filtering - Quick Reference

## 📋 Requirement Summary

**ID:** FR-004B  
**Title:** Client-Side Guest Number Filtering  
**Priority:** High  
**Status:** Planned  
**Version:** Added in v1.2 (2025-12-11)

---

## 🎯 Core Requirements

### 1. Client-Side Only
- ✅ All filtering logic in JavaScript
- ✅ No server requests
- ✅ Instant response to user actions

### 2. Parsing Rule
**Extract capacity from:** `"até N pessoas"`

**Example Input:**
```
ANDRADE (até 2 pessoas)13/12 - 15/12 (2 dias livres) - 24 Quarto(s)
```

**Extracted:**
- Capacity: **2**

### 3. Filter Logic
```javascript
if (capacity >= guestCount) {
    // Keep card VISIBLE
} else {
    // Hide card (display: none)
}
```

### 4. Trigger Event
- Execute **immediately** on guest count change
- Triggered by: **+ button** or **- button**
- Re-evaluate **all cards** each time

---

## 📊 Examples

### Scenario 1: Guest Count = 2

| Hotel | Capacity | Result |
|-------|----------|--------|
| ANDRADE | 2 pessoas | ✅ VISIBLE (2 >= 2) |
| PRAIA GRANDE | 3 pessoas | ✅ VISIBLE (3 >= 2) |
| GUARUJÁ | 4 pessoas | ✅ VISIBLE (4 >= 2) |

### Scenario 2: Guest Count = 3

| Hotel | Capacity | Result |
|-------|----------|--------|
| ANDRADE | 2 pessoas | ❌ HIDDEN (2 < 3) |
| PRAIA GRANDE | 3 pessoas | ✅ VISIBLE (3 >= 3) |
| GUARUJÁ | 4 pessoas | ✅ VISIBLE (4 >= 3) |

### Scenario 3: Guest Count = 5

| Hotel | Capacity | Result |
|-------|----------|--------|
| ANDRADE | 2 pessoas | ❌ HIDDEN (2 < 5) |
| PRAIA GRANDE | 3 pessoas | ❌ HIDDEN (3 < 5) |
| GUARUJÁ | 4 pessoas | ❌ HIDDEN (4 < 5) |

---

## 💻 Implementation

### Parsing Function

```javascript
function parseCapacity(resultString) {
    const regex = /até\s+(\d+)\s+pessoas?/i;
    const match = resultString.match(regex);
    return match ? parseInt(match[1]) : null;
}
```

### Filter Function

```javascript
function applyGuestFilter(selectedGuestCount) {
    const vacancyCards = document.querySelectorAll('.hotel-card');
    
    vacancyCards.forEach(card => {
        const vacancies = card.querySelectorAll('.vacancy-item');
        let hasVisibleVacancy = false;
        
        vacancies.forEach(vacancy => {
            const text = vacancy.textContent;
            const capacity = parseCapacity(text);
            
            if (capacity !== null && capacity >= selectedGuestCount) {
                vacancy.style.display = 'block';
                hasVisibleVacancy = true;
            } else if (capacity === null) {
                // No capacity info - keep visible (fail-safe)
                vacancy.style.display = 'block';
                hasVisibleVacancy = true;
            } else {
                vacancy.style.display = 'none';
            }
        });
        
        // Hide entire hotel card if no vacancies match
        card.style.display = hasVisibleVacancy ? 'block' : 'none';
    });
}
```

### Event Integration

```javascript
// In guestCounter.js

plusBtn.addEventListener('click', function() {
    if (!GuestFilterStateManager.isFilterEnabled()) return;
    
    guestCount++;
    updateDisplay();
    applyGuestFilter(guestCount);  // ← Apply filter here
});

minusBtn.addEventListener('click', function() {
    if (!GuestFilterStateManager.isFilterEnabled()) return;
    
    if (guestCount > 1) {
        guestCount--;
        updateDisplay();
        applyGuestFilter(guestCount);  // ← Apply filter here
    }
});
```

---

## 🔍 Parsing Pattern Details

### Supported Formats

| Pattern | Extracts | Notes |
|---------|----------|-------|
| `até 1 pessoa` | 1 | Singular |
| `até 2 pessoas` | 2 | Plural |
| `Até 3 Pessoas` | 3 | Case-insensitive |
| `ATE 4 pessoas` | 4 | Uppercase |
| `ate 5 pessoas` | 5 | Without accent |

### Regex Breakdown

```javascript
/até\s+(\d+)\s+pessoas?/i
```

- `até` - Match "até" (case-insensitive)
- `\s+` - One or more whitespace
- `(\d+)` - Capture one or more digits (the capacity)
- `\s+` - One or more whitespace
- `pessoas?` - Match "pessoa" or "pessoas"
- `i` - Case-insensitive flag

---

## ⚠️ Edge Cases

### Case 1: Missing Capacity
**Input:** `"ANDRADE 13/12 - 15/12 - 24 Quarto(s)"`  
**Behavior:** Keep VISIBLE (fail-safe)  
**Reason:** No capacity information to filter on

### Case 2: Invalid Capacity
**Input:** `"até pessoas"` (no number)  
**Behavior:** Keep VISIBLE  
**Reason:** Parsing returns null → fail-safe

### Case 3: Zero or Negative
**Input:** `"até 0 pessoas"` or `"até -1 pessoas"`  
**Behavior:** Keep VISIBLE  
**Reason:** Invalid capacity → fail-safe

### Case 4: All Cards Hidden
**Scenario:** All cards have capacity < guest count  
**Behavior:** Show message "Sem vagas disponíveis para N hóspedes"

---

## ✅ Acceptance Criteria Checklist

- [ ] **AC-004B.1:** Client-side implementation only
- [ ] **AC-004B.2:** Parse guest capacity from strings
- [ ] **AC-004B.3:** Extract number from "até N pessoas"
- [ ] **AC-004B.4:** Show cards if capacity >= guest count
- [ ] **AC-004B.5:** Hide cards if capacity < guest count
- [ ] **AC-004B.6:** Apply filter immediately on count change
- [ ] **AC-004B.7:** Re-evaluate all cards on each change
- [ ] **AC-004B.8:** Use CSS display (don't remove from DOM)

---

## 🧪 Testing Checklist

- [ ] Parse capacity correctly from various formats
- [ ] Filter shows matching cards
- [ ] Filter hides non-matching cards
- [ ] Filter triggers on + button
- [ ] Filter triggers on - button
- [ ] Handle missing capacity gracefully
- [ ] Test with multiple cards
- [ ] Case-insensitive matching works
- [ ] Accent-insensitive matching works

---

## 🔗 Dependencies

**Required Features:**
- FR-004: Guest Counter (provides count value)
- FR-004A: Guest Filter State Management (enables after search)
- FR-006: Results Display (provides cards to filter)

**Integration Points:**
- Guest counter +/- button event handlers
- Hotel vacancy card structure
- Results display container

---

## 📐 User Flow

```
1. User completes search
   ↓
2. Results displayed (all visible)
   ↓
3. Guest filter enabled (FR-004A)
   ↓
4. User clicks + button (2 → 3)
   ↓
5. applyGuestFilter(3) executes
   ↓
6. Cards with capacity < 3 → HIDDEN
   ↓
7. Cards with capacity >= 3 → VISIBLE
   ↓
8. User clicks - button (3 → 2)
   ↓
9. applyGuestFilter(2) executes
   ↓
10. Previously hidden cards → VISIBLE again
```

---

## 🎨 Visual Feedback

### Before Filtering (2 guests)
```
✓ ANDRADE (até 2 pessoas)
✓ PRAIA GRANDE (até 3 pessoas)
✓ GUARUJÁ (até 4 pessoas)

Showing: 3 hotels
```

### After Filtering (3 guests)
```
  [Hidden: ANDRADE]
✓ PRAIA GRANDE (até 3 pessoas)
✓ GUARUJÁ (até 4 pessoas)

Showing: 2 of 3 hotels
```

---

## ⚡ Performance Notes

- Pre-compile regex (don't recreate on each call)
- Batch DOM updates to minimize reflows
- No debouncing needed (instant feedback desired)
- Efficient for 50+ cards

---

## ♿ Accessibility

- Screen reader announcement: "Showing X hotels for Y guests"
- ARIA live region for dynamic updates
- Focus management when cards hide/show
- Keyboard navigation support

---

## 🌍 Internationalization

- **Portuguese (pt-BR):** `até {N} pessoa(s)`
- **English (en-US):** `up to {N} guest(s)` (future)

---

## 📚 Documentation

- **Full Specification:** `docs/FUNCTIONAL_REQUIREMENTS.md` (FR-004B)
- **Version:** 1.2
- **Added:** 2025-12-11

---

**Status:** 📋 Documented - Ready for Implementation  
**Priority:** 🔴 High  
**Complexity:** 🟡 Medium  
**Estimated Effort:** 4-6 hours
