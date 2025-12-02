# API Client Usage Review
**Date:** 2025-12-02  
**Project:** monitora_vagas  
**API Reference:** [busca_vagas API Documentation](https://github.com/mpbarbosa/busca_vagas/blob/main/docs/API_CLIENT_DOCUMENTATION.md)

---

## 🔍 Executive Summary

This review analyzes the current API client usage in the `monitora_vagas` project against the official `busca_vagas` API documentation (v1.2.1).

### Key Findings:
- ✅ **Correct Production URL** usage in index.html
- ⚠️ **Hardcoded URLs** instead of using environment configuration
- ⚠️ **No API integration** in QuickSearch component (uses simulation)
- ⚠️ **Missing recommended best practices** (error handling, timeouts, retries)
- ⚠️ **Incorrect endpoint** being used (should use Puppeteer endpoints)

---

## 📊 Current API Usage Inventory

### 1. **index.html** (Line 81)
```javascript
fetch('https://www.mpbarbosa.com/api/vagas/hoteis/scrape')
```

**Status:** ✅ CORRECT  
**Endpoint:** `/api/vagas/hoteis/scrape` (Puppeteer-based hotel scraping)  
**Method:** GET  
**Response Format:** `{ success: boolean, data: Array<Hotel> }`

**Issues:**
- ❌ Hardcoded production URL (should use environment config)
- ❌ No timeout handling
- ❌ No retry logic
- ❌ Basic error handling only
- ❌ No loading indicators
- ❌ No caching

---

### 2. **QuickSearch Component** (components/QuickSearch/QuickSearch.js)

**Status:** ❌ NOT USING API  
**Current Implementation:** Client-side simulation only

**Issues Identified:**

#### a) No Real API Integration
The component has extensive simulation code but **no actual API calls** to the busca_vagas backend:

```javascript
// Current: Uses simulation fallback
async queryVacancies(startDate, endDate) {
    try {
        const realResults = await this.performAfpespSearch(startDate, endDate);
        // This never actually calls the backend API
    } catch (corsError) {
        // Falls back to simulation
        const mockResponse = await this.simulateVacancyQuery(startDate, endDate);
        return mockResponse;
    }
}
```

**Should be:**
```javascript
async queryVacancies(startDate, endDate) {
    const checkin = this.formatDateISO(startDate);
    const checkout = this.formatDateISO(endDate);
    
    const response = await fetch(
        `${API_BASE_URL}/vagas/search?checkin=${checkin}&checkout=${checkout}`
    );
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
}
```

#### b) Wrong Date Format
- **Current:** Uses Brazilian DD/MM/YYYY format
- **API Expects:** ISO 8601 YYYY-MM-DD format

```javascript
// Current (WRONG):
formatDateBR(date) {
    return `${day}/${month}/${year}`; // 25/12/2024
}

// Should be (CORRECT):
formatDateISO(date) {
    return date.toISOString().split('T')[0]; // 2024-12-25
}
```

#### c) Missing Recommended Endpoints

According to the API docs, the component should use:

1. **Search Vacancies (Recommended):**
   ```
   GET /api/vagas/search?checkin=2024-12-25&checkout=2024-12-26
   ```

2. **Weekend Search:**
   ```
   GET /api/vagas/search/weekends?count=8
   ```

3. **Hotel List (Static):**
   ```
   GET /api/vagas/hoteis
   ```

**None of these are currently implemented.**

---

### 3. **Environment Configuration**

#### config/environment.js (Line 16)
```javascript
API_BASE_URL: 'http://localhost:3000/api'
```

#### config/app.js (Line 98)
```javascript
baseUrl: 'http://localhost:3000/api'
```

**Status:** ⚠️ PARTIALLY CORRECT  
**Issues:**
- ✅ Correct development URL
- ❌ Not being used by components
- ❌ No environment detection (always uses dev URL)
- ❌ Production URL should be `https://www.mpbarbosa.com/api`

---

## 🚨 Critical Issues

### 1. **No Backend Integration in QuickSearch**
- The main search functionality doesn't call the backend API
- All searches return simulated data
- Users get fake results instead of real vacancy information

### 2. **Incorrect API Usage Pattern**
```javascript
// WRONG: Trying to scrape directly from AFPESP
async performAfpespSearch(startDate, endDate) {
    return await this.executeSeleniumEquivalentSearch(startDate, endDate);
}

// CORRECT: Use the backend API
async searchVacancies(checkin, checkout) {
    const response = await fetch(
        `${API_BASE_URL}/vagas/search?checkin=${checkin}&checkout=${checkout}`,
        {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        }
    );
    return await response.json();
}
```

### 3. **Missing Error Handling**
According to the API docs, responses include:
```javascript
{
    "success": true,
    "data": {...}
}
```

But the code doesn't check the `success` field:
```javascript
// Current:
const results = await this.queryVacancies(startDate, endDate);
displaySearchResults(results, resultsContent);

// Should be:
const response = await this.queryVacancies(startDate, endDate);
if (response.success) {
    displaySearchResults(response.data, resultsContent);
} else {
    displayError(response.error);
}
```

---

## ✅ Recommendations

### Priority 1: Implement Real API Integration

**File:** `src/components/QuickSearch/QuickSearch.js`

Replace the simulation code with actual API calls:

```javascript
class HotelVacancyService {
    constructor() {
        this.apiBaseUrl = 'https://www.mpbarbosa.com/api';
        this.timeout = 60000; // 60 seconds for search operations
    }

    // Format date to ISO 8601 (API requirement)
    formatDateISO(date) {
        return date.toISOString().split('T')[0];
    }

    // Search for vacancies using the backend API
    async queryVacancies(startDate, endDate) {
        const checkin = this.formatDateISO(startDate);
        const checkout = this.formatDateISO(endDate);
        
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeout);
        
        try {
            const response = await fetch(
                `${this.apiBaseUrl}/vagas/search?checkin=${checkin}&checkout=${checkout}`,
                {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );
            
            clearTimeout(timeout);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'API returned error');
            }
            
            return result.data;
            
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Search timeout - please try again');
            }
            throw error;
        }
    }

    // Search weekend vacancies
    async searchWeekendVacancies(count = 8) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 600000); // 10 minutes
        
        try {
            const response = await fetch(
                `${this.apiBaseUrl}/vagas/search/weekends?count=${count}`,
                {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );
            
            clearTimeout(timeout);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'API returned error');
            }
            
            return result.data;
            
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Weekend search timeout - please try again');
            }
            throw error;
        }
    }

    // Get hotels list
    async getHotels() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/vagas/hoteis`, {
                headers: { 'Accept': 'application/json' }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'API returned error');
            }
            
            return result.data;
            
        } catch (error) {
            console.error('Failed to fetch hotels:', error);
            throw error;
        }
    }
}
```

### Priority 2: Use Environment Configuration

**File:** `src/index.html`

```javascript
// Instead of:
fetch('https://www.mpbarbosa.com/api/vagas/hoteis/scrape')

// Use:
import { getEnvironment } from './config/environment.js';

const env = getEnvironment();
fetch(`${env.fullApiUrl}/vagas/hoteis/scrape`)
```

### Priority 3: Add Best Practices from API Docs

#### a) Timeout Handling
```javascript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 60000);

try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    return await response.json();
} catch (error) {
    if (error.name === 'AbortError') {
        console.error('Request timeout');
    }
    throw error;
}
```

#### b) Retry Logic with Exponential Backoff
```javascript
async function fetchWithRetry(url, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;
            
            if (response.status >= 500) {
                const waitTime = Math.pow(2, i) * 1000;
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }
            
            return response;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            const waitTime = Math.pow(2, i) * 1000;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
}
```

#### c) Caching for Hotel List
```javascript
class CachedAPIClient {
    constructor() {
        this.cache = new Map();
        this.cacheDuration = 5 * 60 * 1000; // 5 minutes
    }
    
    async getHotels() {
        const cacheKey = 'hotels';
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
            return cached.data;
        }
        
        const response = await fetch(`${API_BASE_URL}/vagas/hoteis`);
        const result = await response.json();
        
        this.cache.set(cacheKey, {
            data: result.data,
            timestamp: Date.now()
        });
        
        return result.data;
    }
}
```

### Priority 4: Update Response Handling

The API returns data in this format:
```javascript
{
    "success": true,
    "data": {
        "searchDetails": {
            "searchId": "...",
            "searchedDates": {...},
            "totalHotelsSearched": 25,
            "totalVacanciesFound": 15
        },
        "availability": {
            "hasVacancies": true,
            "availableHotels": 3,
            "unavailableHotels": 22
        },
        "vacancies": [...]
    }
}
```

Update the display functions to handle this structure:
```javascript
function displaySearchResults(apiResponse, container) {
    if (!apiResponse || !apiResponse.data) return;
    
    const data = apiResponse.data;
    const { availability, vacancies, searchDetails } = data;
    
    if (availability.hasVacancies) {
        // Display available vacancies
        container.innerHTML = generateAvailabilityHTML(vacancies, searchDetails);
    } else {
        // Display no availability message
        container.innerHTML = generateNoAvailabilityHTML(searchDetails);
    }
}
```

---

## 📋 Action Items Checklist

### High Priority
- [ ] Replace simulation code with real API calls in QuickSearch
- [ ] Fix date formatting (DD/MM/YYYY → YYYY-MM-DD)
- [ ] Implement proper error handling for API responses
- [ ] Add timeout handling (60s for search, 10min for weekend search)
- [ ] Update response parsing to match API data structure

### Medium Priority
- [ ] Use environment configuration instead of hardcoded URLs
- [ ] Implement retry logic with exponential backoff
- [ ] Add caching for hotel list endpoint
- [ ] Add loading indicators during API calls
- [ ] Implement proper CORS error handling

### Low Priority
- [ ] Add analytics for API call success/failure rates
- [ ] Implement client-side rate limiting
- [ ] Add request/response logging in development
- [ ] Create API client abstraction layer
- [ ] Add unit tests for API integration

---

## 🔧 Implementation Plan

### Phase 1: Core API Integration (Week 1)
1. Create API client service (`src/services/apiClient.js`)
2. Replace QuickSearch simulation with real API calls
3. Update date formatting functions
4. Test all endpoints

### Phase 2: Error Handling & UX (Week 2)
1. Add timeout handling
2. Implement retry logic
3. Add proper error messages
4. Add loading states

### Phase 3: Optimization (Week 3)
1. Implement caching
2. Add environment configuration
3. Performance testing
4. User acceptance testing

---

## 📚 API Endpoints Reference

| Endpoint | Method | Purpose | Current Usage |
|----------|--------|---------|---------------|
| `/api/health` | GET | Check API status | ❌ Not used |
| `/api/vagas/hoteis` | GET | Get hotel list (static) | ❌ Not used |
| `/api/vagas/hoteis/scrape` | GET | Scrape hotel list | ✅ Used in index.html |
| `/api/vagas/search` | GET | Search vacancies (Puppeteer) | ❌ Not used (SHOULD USE) |
| `/api/vagas/search/weekends` | GET | Search weekend vacancies | ❌ Not used (SHOULD USE) |

---

## 💡 Code Examples

### Before (Current - Simulation):
```javascript
async queryVacancies(startDate, endDate) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const hasAvailability = Math.random() > 0.5;
    return this.simulateVacancyQuery(startDate, endDate);
}
```

### After (Correct - API Integration):
```javascript
async queryVacancies(startDate, endDate) {
    const checkin = this.formatDateISO(startDate);
    const checkout = this.formatDateISO(endDate);
    
    const response = await fetch(
        `${this.apiBaseUrl}/vagas/search?checkin=${checkin}&checkout=${checkout}`,
        { 
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(60000)
        }
    );
    
    const result = await response.json();
    
    if (!result.success) {
        throw new Error(result.error);
    }
    
    return result.data;
}
```

---

## 🎯 Expected Outcomes

After implementing these recommendations:

1. **Real Data**: Users get actual vacancy information from AFPESP
2. **Better UX**: Proper error messages, loading states, timeout handling
3. **Reliability**: Retry logic handles transient failures
4. **Performance**: Caching reduces unnecessary API calls
5. **Maintainability**: Clean API abstraction makes updates easier

---

## 📖 Related Documentation

- [API Client Documentation](https://github.com/mpbarbosa/busca_vagas/blob/main/docs/API_CLIENT_DOCUMENTATION.md)
- [API Reference](https://github.com/mpbarbosa/busca_vagas/blob/main/docs/API.md)
- [Architecture Overview](https://github.com/mpbarbosa/busca_vagas/blob/main/docs/ARCHITECTURE.md)

---

**Review Completed:** 2025-12-02  
**Reviewer:** GitHub Copilot CLI  
**Next Review:** After implementation of Priority 1 items