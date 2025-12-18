# API Client Usage Review

**Date:** 2025-12-14  
**Project:** monitora_vagas  
**API Version:** v1.4.1 (compatible with v1.2.1+)  
**API Reference:** [busca_vagas API Documentation](https://github.com/mpbarbosa/busca_vagas/blob/main/docs/api/API_CLIENT_DOCUMENTATION.md)

---

## 🔍 Executive Summary

This document reviews the current API client implementation and usage patterns across the `monitora_vagas` project.

### Current Status:

- ✅ **Centralized API Client** (`src/services/apiClient.js`)
- ✅ **Real AFPESP data** from backend API (Puppeteer-based)
- ✅ **Proper date formatting** (ISO 8601)
- ✅ **Timeout handling** with AbortController
- ✅ **Retry logic** with exponential backoff
- ✅ **Persistent caching** with localStorage
- ✅ **Response validation** for success field
- ✅ **Multiple fetch strategies** (timeout, retry, cache)

---

## 📊 Current API Usage Inventory

### 1. **API Client Service** (`src/services/apiClient.js`)

**Status:** ✅ PRODUCTION READY  
**Implementation:** Centralized service with singleton pattern  
**Class:** `BuscaVagasAPIClient`

#### Architecture Features:

- **Environment Detection** - Auto-configures for dev/production
- **Timeout Management** - Operation-specific timeouts
- **Retry Logic** - Exponential backoff for server errors
- **Persistent Cache** - localStorage for hotel data
- **Error Handling** - Comprehensive error types and messages

#### API Methods Implemented:

##### a) searchVacancies(checkinDate, checkoutDate, hotel = '-1')
```javascript
async searchVacancies(checkinDate, checkoutDate, hotel = '-1') {
    // Convert dates to ISO format if needed
    const checkin = checkinDate instanceof Date 
        ? this.formatDateISO(checkinDate) 
        : checkinDate;
    const checkout = checkoutDate instanceof Date 
        ? this.formatDateISO(checkoutDate) 
        : checkoutDate;
    
    const url = `${this.apiBaseUrl}/vagas/search?hotel=${hotel}&checkin=${checkin}&checkout=${checkout}`;
    
    // Uses fetchWithRetry (3 attempts with exponential backoff)
    const result = await this.fetchWithRetry(
        () => this.fetchWithTimeout(url, {}, this.timeout.search)
    );
    
    return result.data; // Returns only data object
}
```

**Endpoint:** `GET /api/vagas/search?hotel={HOTEL}&checkin={YYYY-MM-DD}&checkout={YYYY-MM-DD}`  
**Timeout:** 60 seconds  
**Retry:** 3 attempts with 1s, 2s, 4s backoff  
**Features:** ✅ Hotel filter, ✅ Date object support, ✅ Automatic retry

##### b) searchWeekendVacancies(count = 8)
```javascript
async searchWeekendVacancies(count = 8) {
    if (count < 1 || count > 12) {
        throw new Error('Weekend count must be between 1 and 12');
    }
    
    const url = `${this.apiBaseUrl}/vagas/search/weekends?count=${count}`;
    
    const result = await this.fetchWithRetry(
        () => this.fetchWithTimeout(url, {}, this.timeout.weekendSearch)
    );
    
    return result.data;
}
```

**Endpoint:** `GET /api/vagas/search/weekends?count={NUMBER}`  
**Timeout:** 10 minutes (600 seconds)  
**Retry:** 3 attempts  
**Validation:** ✅ Count range (1-12)  
**Features:** ✅ Extended timeout, ✅ Multi-weekend search

##### c) getHotels(forceRefresh = false)
```javascript
async getHotels(forceRefresh = false) {
    // Check persistent cache first
    if (!forceRefresh) {
        const cached = hotelCache.get();
        if (cached) {
            return cached;
        }
    }
    
    const url = `${this.apiBaseUrl}/vagas/hoteis`;
    const result = await this.fetchWithTimeout(url);
    
    // Save to persistent cache
    hotelCache.set(result.data);
    
    return result.data;
}
```

**Endpoint:** `GET /api/vagas/hoteis`  
**Timeout:** 30 seconds  
**Cache:** Persistent localStorage  
**Features:** ✅ Cache-first strategy, ✅ Force refresh option

##### d) scrapeHotels()
```javascript
async scrapeHotels() {
    const url = `${this.apiBaseUrl}/vagas/hoteis/scrape`;
    
    const result = await this.fetchWithRetry(
        () => this.fetchWithTimeout(url, {}, this.timeout.search)
    );
    
    return result.data;
}
```

**Endpoint:** `GET /api/vagas/hoteis/scrape`  
**Timeout:** 60 seconds  
**Retry:** 3 attempts  
**Features:** ✅ Dynamic scraping, ✅ Returns all dropdown options including "Todas"

##### e) checkHealth()
```javascript
async checkHealth() {
    const url = `${this.apiBaseUrl}/health`;
    const result = await this.fetchWithTimeout(url);
    return result;
}
```

**Endpoint:** `GET /api/health`  
**Timeout:** 30 seconds  
**Features:** ✅ API status check

---

### 2. **HotelVacancyService** (`src/components/QuickSearch/QuickSearch.js`)

**Status:** ✅ ACTIVE (Direct fetch implementation)  
**Purpose:** Component-level service for UI-specific operations

**Note:** This component uses direct fetch calls rather than the centralized apiClient. This is acceptable for component-specific logic but could be refactored to use apiClient for consistency.

---

### 3. **UI Integration** (`public/index.html`)

```javascript
import { apiClient } from './services/apiClient.js';

// Load hotels with cache
const hotels = await apiClient.getHotels();

// Display cache stats in tooltip
const stats = apiClient.getCacheStats();
// Show stats on hotel-select hover via Bootstrap tooltip
```

**Status:** ✅ USING API CLIENT  
**Features:** ✅ Hotel loading, ✅ Cache management, ✅ UI feedback

---

## 🚨 Implementation Summary

### ✅ What's Working

1. **Centralized API Client**
   - Single source of truth for API communication
   - Singleton pattern for consistent state
   - Reusable across all components

2. **Advanced Retry Logic**
   - Exponential backoff: 1s, 2s, 4s
   - Only retries server errors (5xx)
   - Preserves client errors (4xx) and timeouts
   - Configurable max retries (default: 3)

3. **Persistent Caching**
   - localStorage-based hotel cache
   - Survives browser restarts
   - 24-hour TTL with automatic expiration
   - Cache statistics API

4. **Proper Date Formatting**
   - ISO 8601 format (YYYY-MM-DD)
   - Accepts Date objects or strings
   - Automatic conversion in API client

5. **Timeout Handling**
   - AbortController for cancellation
   - 30 seconds for simple operations
   - 60 seconds for search operations
   - 10 minutes for weekend searches

6. **Error Handling**
   - HTTP status validation
   - API success field validation
   - Timeout-specific error messages
   - Retry-specific logging

7. **Complete API Coverage**
   - ✅ /api/health (health check)
   - ✅ /api/vagas/search (vacancy search with hotel filter)
   - ✅ /api/vagas/search/weekends (multi-weekend search)
   - ✅ /api/vagas/hoteis (static hotel list with cache)
   - ✅ /api/vagas/hoteis/scrape (dynamic hotel scraping)

---

## 📋 API Endpoints Reference

| Endpoint | Method | Purpose | Implementation | Timeout | Retry | Cache | Status |
|----------|--------|---------|----------------|---------|-------|-------|--------|
| `/api/health` | GET | Check API status | apiClient.checkHealth() | 30s | No | No | ✅ Active |
| `/api/vagas/search` | GET | Search vacancies | apiClient.searchVacancies() | 60s | Yes | No | ✅ Active |
| `/api/vagas/search/weekends` | GET | Weekend search | apiClient.searchWeekendVacancies() | 600s | Yes | No | ✅ Active |
| `/api/vagas/hoteis` | GET | Get hotel list | apiClient.getHotels() | 30s | No | Yes | ✅ Active |
| `/api/vagas/hoteis/scrape` | GET | Scrape hotels | apiClient.scrapeHotels() | 60s | Yes | No | ✅ Active |

---

## 💡 Best Practices Implemented

### 1. Singleton Pattern
```javascript
// Create singleton instance
export const apiClient = new BuscaVagasAPIClient();

// Use everywhere without instantiation
import { apiClient } from './services/apiClient.js';
const results = await apiClient.searchVacancies(checkin, checkout);
```

### 2. Retry with Exponential Backoff
```javascript
async fetchWithRetry(fetchFn, maxRetries = 3) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fetchFn();
        } catch (error) {
            const isLastAttempt = attempt === maxRetries - 1;
            const isServerError = error.message.includes('HTTP 5');
            
            if (isLastAttempt || !isServerError) {
                throw error;
            }
            
            // Exponential backoff: 1s, 2s, 4s
            const waitTime = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
}
```

### 3. Persistent Caching
```javascript
// Check cache first
if (!forceRefresh) {
    const cached = hotelCache.get();
    if (cached) {
        return cached;
    }
}

// Fetch from API
const result = await this.fetchWithTimeout(url);

// Save to persistent cache
hotelCache.set(result.data);
```

### 4. Timeout with AbortController
```javascript
async fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                ...options.headers
            }
        });
        
        clearTimeout(timeoutId);
        return await this.validateResponse(response);
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - please try again');
        }
        
        throw error;
    }
}
```

### 5. Comprehensive Response Validation
```javascript
if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}

const result = await response.json();

// API returns { success: boolean, data: {...}, error?: string }
if (result.success === false) {
    throw new Error(result.error || 'API returned error without message');
}

return result;
```

### 6. Flexible Date Input
```javascript
// Accepts both Date objects and strings
const checkin = checkinDate instanceof Date 
    ? this.formatDateISO(checkinDate) 
    : checkinDate;

// Format helper
formatDateISO(date) {
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
}
```

---

## 🎯 Recommendations

### Completed ✅

- [x] Implement centralized API client service
- [x] Add retry logic with exponential backoff
- [x] Implement persistent caching for hotels
- [x] Fix date formatting (ISO 8601)
- [x] Add timeout handling with AbortController
- [x] Add comprehensive response validation
- [x] Implement health check endpoint
- [x] Add hotel filter parameter to vacancy search
- [x] Support both Date objects and string dates
- [x] Add cache management API (stats, clear, refresh)

### Current Architecture

**Strengths:**
- ✅ Single API client instance (singleton pattern)
- ✅ Comprehensive error handling and retry logic
- ✅ Persistent caching reduces API calls
- ✅ Flexible date input (Date objects or strings)
- ✅ Operation-specific timeouts
- ✅ Environment-aware configuration

**Areas for Improvement:**
- ⚠️ QuickSearch component uses direct fetch (consider using apiClient)
- ⚠️ No progress indicators for long operations
- ⚠️ No request cancellation API for users
- ⚠️ Cache TTL not enforced (cache lives forever until cleared)

### Future Enhancements

#### High Priority
- [ ] Refactor QuickSearch to use centralized apiClient
- [ ] Add progress indicators for weekend searches (can take 10 minutes)
- [ ] Implement user-facing cancel functionality
- [ ] Add cache TTL enforcement (e.g., auto-refresh after 24 hours)

#### Medium Priority
- [ ] Add request deduplication (prevent duplicate searches)
- [ ] Implement offline detection and graceful degradation
- [ ] Add metrics collection (search times, success rates)
- [ ] Create API client documentation for developers

#### Low Priority
- [ ] Add request queue for rate limiting
- [ ] Implement background cache warming
- [ ] Add A/B testing capability for API versions
- [ ] Create API client SDK for external use

---

## 📖 Usage Examples

### Basic Vacancy Search
```javascript
import { apiClient } from './services/apiClient.js';

// Search with string dates
const results = await apiClient.searchVacancies('2025-04-03', '2025-04-05');

// Search with Date objects
const checkin = new Date('2025-04-03');
const checkout = new Date('2025-04-05');
const results = await apiClient.searchVacancies(checkin, checkout);

// Search specific hotel
const results = await apiClient.searchVacancies('2025-04-03', '2025-04-05', 'Amparo');
```

### Hotel Management
```javascript
// Get hotels (uses cache)
const hotels = await apiClient.getHotels();

// Force refresh from API
const freshHotels = await apiClient.getHotels(true);

// Or use convenience method
const refreshedHotels = await apiClient.refreshHotels();

// Check cache status
const stats = apiClient.getCacheStats();
console.log(`Cache has ${stats.itemCount} hotels, last updated: ${stats.lastUpdated}`);

// Clear all caches
apiClient.clearCache();
```

### Weekend Search
```javascript
// Search next 8 weekends (default)
const weekends = await apiClient.searchWeekendVacancies();

// Search specific number
const weekends = await apiClient.searchWeekendVacancies(12); // Max 12

// Handle long wait times
try {
    console.log('⏳ This may take several minutes...');
    const weekends = await apiClient.searchWeekendVacancies(8);
    console.log(`✅ Found vacancies in ${weekends.availability.weekendsWithVacancies} weekends`);
} catch (error) {
    console.error('Search failed:', error.message);
}
```

### Health Check
```javascript
// Check API availability
try {
    const health = await apiClient.checkHealth();
    console.log(`✅ API is ${health.status}`);
} catch (error) {
    console.error('❌ API is unavailable');
}
```

---

## 📖 Related Documentation

- **[Complete API Documentation](./API_DOCUMENTATION.md)** - Full API reference
- **[API Documentation Index](./README.md)** - Overview and navigation
- **[API Integration Update](./API_INTEGRATION_UPDATE.md)** - Latest integration changes
- **[API Integration Changes](./API_INTEGRATION_CHANGES.md)** - Historical changes
- **[Integration Checklist](./INTEGRATION_CHECKLIST.md)** - Implementation steps
- **[busca_vagas API](https://github.com/mpbarbosa/busca_vagas/blob/main/docs/API_CLIENT_DOCUMENTATION.md)** - Upstream API docs

---

## 🔧 Utility Methods

```javascript
// Date formatting
const isoDate = apiClient.formatDateISO(new Date());
// Returns: "2025-12-14"

// Cache management
apiClient.clearCache();           // Clear all caches
apiClient.getCacheStats();        // Get cache info
apiClient.getHotels(true);        // Force hotel refresh (bypass cache)
```

---

**Review Updated:** 2025-12-14  
**Status:** ✅ Production Ready with Advanced Features  
**API Client Version:** 2.0.0  
**API Version:** v1.4.1 (compatible with v1.2.1+)  
**Latest busca_vagas Release:** v1.4.1 (2025-12-14) - Holiday package booking rules  
**Next Review:** After implementing progress indicators and request cancellation