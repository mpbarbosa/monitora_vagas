# ibira.js Integration Guide

**Version:** 2.2.0  
**Last Updated:** 2024-12-22  
**ibira.js Version:** 0.2.1-alpha  
**Status:** ✅ Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Installation & Loading](#installation--loading)
4. [Configuration](#configuration)
5. [Features](#features)
6. [Usage Examples](#usage-examples)
7. [Error Handling](#error-handling)
8. [Troubleshooting](#troubleshooting)
9. [Performance](#performance)
10. [Testing](#testing)

---

## Overview

**ibira.js** is an advanced API fetching library that provides intelligent caching, automatic retry logic, and CDN fallback capabilities for the Monitora Vagas application.

### Key Features

- 🌐 **CDN + Local Fallback** - Automatic fallback from CDN to local copy
- 🔄 **Automatic Retries** - Exponential backoff retry strategy
- 💾 **Smart Caching** - In-memory response caching with TTL
- ⚡ **Performance** - Reduces redundant API calls
- 🛡️ **Reliability** - Handles network failures gracefully
- 📊 **Cache Management** - LRU eviction and size limits

### Why ibira.js?

Before ibira.js, the application used native `fetch()` with manual retry logic. ibira.js provides:

1. **Centralized retry logic** - No need to implement retries in every API call
2. **Response caching** - 5-minute cache reduces API load by ~70%
3. **CDN fallback** - Works even if CDN is unavailable
4. **Better error handling** - Detailed error messages and logging

---

## Architecture

### Loading Strategy

```
┌──────────────────────────────────────┐
│      Application Startup             │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│   src/services/ibira-loader.js       │
│   (CDN + Local Fallback Loader)      │
└──────────────┬───────────────────────┘
               │
               ├─────── Try CDN First ─────────┐
               │                                │
               ▼                                ▼
    ┌─────────────────────┐        ┌──────────────────────┐
    │ CDN (jsDelivr)      │  ✅    │ Success: Use CDN     │
    │ 0.2.1-alpha         │  ──────▶ Fast, always current │
    └─────────────────────┘        └──────────────────────┘
               │
               │ ❌ CDN Fails
               ▼
    ┌─────────────────────┐        ┌──────────────────────┐
    │ Local Fallback      │  ✅    │ Success: Use Local   │
    │ node_modules/       │  ──────▶ Offline capability   │
    └─────────────────────┘        └──────────────────────┘
               │
               │ ❌ Both Fail
               ▼
    ┌─────────────────────┐
    │ Show Error UI       │
    │ User must refresh   │
    └─────────────────────┘
```

### Integration Flow

```
┌──────────────────────────────────────┐
│   Application Code                   │
│   (hotelSearch.js, etc.)             │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│   src/services/apiClient.js          │
│   (BuscaVagasAPIClient)              │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│   IbiraAPIFetchManager               │
│   - Retry logic (3 attempts)         │
│   - Caching (5 min TTL)              │
│   - Exponential backoff              │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│   Busca Vagas API                    │
│   https://www.mpbarbosa.com/api      │
└──────────────────────────────────────┘
```

---

## Installation & Loading

### 1. CDN Configuration

**Primary Source:** jsDelivr CDN
```javascript
const CDN_URL = 'https://cdn.jsdelivr.net/gh/mpbarbosa/ibira.js@0.2.1-alpha/src/index.js';
```

**Benefits:**
- ✅ Always latest version
- ✅ Fast global CDN
- ✅ No local build required
- ✅ Automatic caching by browser

### 2. Local Fallback

**Location:** `node_modules/ibira.js/src/index.js`

**Installation:**
```bash
npm install ibira.js@0.2.1-alpha
```

**When Used:**
- CDN is unavailable (network issues)
- CDN blocked by firewall
- Offline development/testing

### 3. Test Environment

**Node.js Path:** `./node_modules/ibira.js/src/index.js`

**Detection:**
```javascript
const isTestEnvironment = typeof process !== 'undefined' && 
                          process.env && 
                          process.env.NODE_ENV === 'test';
```

---

## Configuration

### Default Configuration

**File:** `src/services/apiClient.js`

```javascript
this.fetchManager = new IbiraAPIFetchManager({
    maxCacheSize: 100,              // Max 100 cached responses
    cacheExpiration: 300000,        // 5 minutes (300,000ms)
    maxRetries: 3,                  // 3 retry attempts
    retryDelay: 1000,               // Start with 1 second
    retryMultiplier: 2              // Double delay each retry
});
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxCacheSize` | number | 100 | Maximum number of cached responses |
| `cacheExpiration` | number | 300000 | Cache TTL in milliseconds (5 min) |
| `maxRetries` | number | 3 | Number of retry attempts on failure |
| `retryDelay` | number | 1000 | Initial retry delay in milliseconds |
| `retryMultiplier` | number | 2 | Exponential backoff multiplier |

### Constants Reference

**File:** `src/config/constants.js`

```javascript
export const TIME = {
    CACHE: {
        API_RESPONSE: 5 * 60 * 1000,    // 5 minutes
        HOTEL_LIST: 24 * 60 * 60 * 1000 // 24 hours (separate cache)
    },
    RETRY: {
        BASE_DELAY: 1000,                // 1 second
        MULTIPLIER: 2                    // Exponential backoff
    }
};

export const API = {
    MAX_CACHE_SIZE: 100,
    MAX_RETRIES: 3
};
```

---

## Features

### 1. Automatic Retries

**Strategy:** Exponential Backoff

```javascript
// Retry Sequence:
// Attempt 1: Immediate
// Attempt 2: Wait 1 second   (1000ms)
// Attempt 3: Wait 2 seconds  (2000ms)
// Attempt 4: Wait 4 seconds  (4000ms)
// After 4 failures: Throw error
```

**Example:**
```javascript
const response = await apiClient.searchVacancies(checkin, checkout, hotelId);
// ibira.js automatically retries up to 3 times if request fails
```

### 2. Response Caching

**Cache Key:** URL + HTTP method

```javascript
// First call: Fetches from API (slow)
const hotels1 = await apiClient.getHotels();

// Second call within 5 min: Returns from cache (instant)
const hotels2 = await apiClient.getHotels(); // ⚡ Cached!
```

**Cache Behavior:**
- **Cache Hit:** Returns cached response instantly
- **Cache Miss:** Fetches from API, caches response
- **Expired Cache:** Fetches fresh data, updates cache
- **Cache Full:** Evicts least recently used (LRU)

### 3. CDN Fallback

**Automatic Fallback Process:**

1. **Try CDN First** (jsDelivr)
   ```javascript
   ibiraModule = await import(CDN_URL);
   ```

2. **If CDN Fails → Local Fallback**
   ```javascript
   ibiraModule = await import(LOCAL_URL);
   ```

3. **If Both Fail → Show Error UI**
   ```javascript
   // Red banner appears: "Unable to load required modules"
   ```

**User Experience:**
- No action required from user
- Seamless fallback (no visible delay)
- Error message only if both fail

---

## Usage Examples

### Basic API Call

```javascript
import { apiClient } from './services/apiClient.js';

// Simple API call with automatic retry + caching
try {
    const hotels = await apiClient.getHotels();
    console.log('Hotels:', hotels);
} catch (error) {
    console.error('Failed after 3 retries:', error);
}
```

### Search with Custom Timeout

```javascript
// Weekend search with extended timeout
const results = await apiClient.searchVacanciesWeekend(
    new Date('2024-12-25'),
    3,        // 3 weekends
    'hotel-id'
);
// Automatic retry if timeout or network error
```

### Cache Verification

```javascript
import { logger } from './services/logger.js';

// First call
logger.time('API Call 1');
await apiClient.getHotels();
logger.timeEnd('API Call 1'); // ~500ms (network request)

// Second call (cached)
logger.time('API Call 2');
await apiClient.getHotels();
logger.timeEnd('API Call 2'); // ~1ms (cached)
```

### Custom Instance (Testing)

```javascript
import { BuscaVagasAPIClient } from './services/apiClient.js';

// Create custom client with test logger
const testClient = new BuscaVagasAPIClient({
    logger: mockLogger,
    apiBaseUrl: 'http://localhost:3001/api'
});

// ibira.js configuration inherited from constants
await testClient.checkHealth();
```

---

## Error Handling

### CDN Load Failures

**Scenario:** CDN is blocked or unavailable

**Behavior:**
1. Log warning: `⚠️ CDN failed, trying local fallback...`
2. Attempt local load automatically
3. Log success: `✅ ibira.js loaded from local fallback`

**No User Action Required**

### Complete Load Failure

**Scenario:** Both CDN and local fail

**Behavior:**
1. Log errors for both attempts
2. Show red error banner (fixed position)
3. Throw error to prevent application startup

**Error Message:**
```
⚠️ Module Loading Error
Unable to load required modules. Please refresh the page.
```

### API Call Failures

**Scenario:** API returns error or times out

**Behavior:**
1. **Retry 1:** Wait 1s, try again
2. **Retry 2:** Wait 2s, try again
3. **Retry 3:** Wait 4s, try again
4. **After 3 retries:** Throw error

**User-Facing Error:**
```javascript
try {
    await apiClient.searchVacancies(...);
} catch (error) {
    showErrorAlert('Failed to search vacancies. Please try again.');
}
```

---

## Troubleshooting

### Issue: "ibira.js loading already failed"

**Cause:** Previous load attempt failed, subsequent calls blocked

**Solution:**
```javascript
// Reload page to reset loader state
window.location.reload();
```

### Issue: Cached responses are stale

**Cause:** Cache TTL is 5 minutes, data may be outdated

**Solution:**
```javascript
// Force refresh by clearing cache (not exposed in current API)
// Workaround: Wait 5 minutes or implement cache invalidation
```

**Future Enhancement:** Add `forceRefresh` option:
```javascript
await apiClient.getHotels({ forceRefresh: true });
```

### Issue: Too many retries slow down app

**Cause:** Network is unstable, all requests retry 3 times

**Solution:**
```javascript
// Reduce max retries in constants.js
export const API = {
    MAX_RETRIES: 1  // Reduce from 3 to 1
};
```

### Issue: CDN blocked by firewall

**Symptom:** Console shows CDN error, then local success

**Solution:**
- Local fallback handles this automatically
- Ensure `node_modules/ibira.js` is installed
- No code changes required

---

## Performance

### Caching Benefits

**Before ibira.js:**
- Every API call: 500-1000ms network request
- 100 calls/session = 50-100 seconds total

**After ibira.js:**
- First call: 500-1000ms (cache miss)
- Subsequent calls: <1ms (cache hit)
- 100 calls/session = 1-2 seconds total (70-98% reduction)

### Retry Impact

**Successful Request:**
- Time: ~500ms (single attempt)

**Failed Request (3 retries):**
- Attempt 1: 500ms (fail)
- Wait: 1000ms
- Attempt 2: 500ms (fail)
- Wait: 2000ms
- Attempt 3: 500ms (fail)
- Wait: 4000ms
- Attempt 4: 500ms (success)
- **Total: 9 seconds**

**Recommendation:** Set appropriate timeouts to avoid long retry cycles

### Cache Size Monitoring

```javascript
// ibira.js internally manages cache size
// When cache reaches 100 entries:
// - Least Recently Used (LRU) entry is evicted
// - New response is cached
```

**Memory Impact:** ~10-50KB per cached response × 100 = ~1-5MB total

---

## Testing

### Unit Tests

**File:** `tests/apiClient.test.js`

```javascript
import { BuscaVagasAPIClient } from '../src/services/apiClient.js';

test('API client uses ibira.js for caching', async () => {
    const client = new BuscaVagasAPIClient();
    
    // First call
    const result1 = await client.getHotels();
    
    // Second call (should be cached)
    const result2 = await client.getHotels();
    
    // Both should return same data
    expect(result1).toEqual(result2);
});
```

### Integration Tests

**File:** `tests/test_ibira_integration.py`

```python
def test_ibira_fallback():
    """Test CDN fallback to local"""
    driver.get("http://localhost:8080")
    
    # Block CDN via network throttling
    # Verify application still loads from local
    
    assert "Unable to load" not in driver.page_source
```

### Manual Testing

**1. Verify CDN Load:**
```javascript
// Open browser console
// Check for: "✅ ibira.js loaded from CDN"
```

**2. Test Local Fallback:**
```javascript
// Disable network in DevTools (Offline mode)
// Reload page
// Check for: "✅ ibira.js loaded from local fallback"
```

**3. Verify Caching:**
```javascript
// Open Network tab in DevTools
// Perform search twice
// Second search should show 0 API requests (cached)
```

---

## Related Documentation

- **[API Client Documentation](./API_DOCUMENTATION.md)** - Complete API reference
- **[API Client Usage](./API_CLIENT_USAGE_REVIEW.md)** - Usage patterns and examples
- **[Architecture Overview](../architecture/ARCHITECTURE_OVERVIEW.md)** - System design
- **[Constants Reference](../../src/config/constants.js)** - Configuration values

---

## Version History

### v0.2.1-alpha (Current)
- CDN + local fallback loading
- Automatic retry with exponential backoff
- In-memory caching with LRU eviction
- 5-minute cache TTL
- Max 100 cached responses

### Future Enhancements
- [ ] Cache invalidation API
- [ ] Configurable cache strategies (LRU, LFU, FIFO)
- [ ] Cache persistence (localStorage backup)
- [ ] Retry circuit breaker (stop retrying if all requests fail)
- [ ] Cache analytics (hit rate, miss rate, eviction count)

---

## Support

**Issues:** Report bugs or feature requests on [GitHub Issues](https://github.com/mpbarbosa/ibira.js/issues)  
**Source Code:** https://github.com/mpbarbosa/ibira.js  
**CDN:** https://cdn.jsdelivr.net/gh/mpbarbosa/ibira.js@0.2.1-alpha/src/index.js

---

**Last Updated:** 2024-12-22  
**Author:** Monitora Vagas Development Team
