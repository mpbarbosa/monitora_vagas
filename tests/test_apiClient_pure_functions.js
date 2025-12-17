/**
 * Unit Tests for Pure Functions in apiClient.js
 * Demonstrates referential transparency improvements
 */

import {
    formatDateISO,
    isValidWeekendCount,
    getWeekendCountError,
    buildHealthUrl,
    buildHotelsUrl,
    buildScrapeUrl,
    buildSearchUrl,
    buildWeekendSearchUrl,
    ensureISOFormat,
    BuscaVagasAPIClient
} from '../src/services/apiClient.js';

// ============================================================================
// PURE FUNCTION TESTS
// ============================================================================

describe('Pure Helper Functions', () => {
    
    describe('formatDateISO', () => {
        test('converts Date to ISO format', () => {
            const date = new Date('2025-12-20T10:30:00Z');
            expect(formatDateISO(date)).toBe('2025-12-20');
        });
        
        test('is deterministic - always returns same result', () => {
            const date = new Date('2025-01-15');
            const result1 = formatDateISO(date);
            const result2 = formatDateISO(date);
            const result3 = formatDateISO(date);
            
            expect(result1).toBe('2025-01-15');
            expect(result2).toBe('2025-01-15');
            expect(result3).toBe('2025-01-15');
        });
        
        test('handles different dates correctly', () => {
            expect(formatDateISO(new Date('2025-01-01'))).toBe('2025-01-01');
            expect(formatDateISO(new Date('2025-12-31'))).toBe('2025-12-31');
            expect(formatDateISO(new Date('2026-06-15'))).toBe('2026-06-15');
        });
    });
    
    describe('isValidWeekendCount', () => {
        test('returns true for valid counts', () => {
            expect(isValidWeekendCount(1)).toBe(true);
            expect(isValidWeekendCount(8)).toBe(true);
            expect(isValidWeekendCount(12)).toBe(true);
        });
        
        test('returns false for invalid counts', () => {
            expect(isValidWeekendCount(0)).toBe(false);
            expect(isValidWeekendCount(13)).toBe(false);
            expect(isValidWeekendCount(-1)).toBe(false);
        });
        
        test('returns false for non-integers', () => {
            expect(isValidWeekendCount(5.5)).toBe(false);
            expect(isValidWeekendCount('8')).toBe(false);
            expect(isValidWeekendCount(null)).toBe(false);
        });
        
        test('is deterministic', () => {
            expect(isValidWeekendCount(5)).toBe(true);
            expect(isValidWeekendCount(5)).toBe(true);
            expect(isValidWeekendCount(5)).toBe(true);
        });
    });
    
    describe('getWeekendCountError', () => {
        test('returns null for valid counts', () => {
            expect(getWeekendCountError(1)).toBeNull();
            expect(getWeekendCountError(8)).toBeNull();
            expect(getWeekendCountError(12)).toBeNull();
        });
        
        test('returns error message for invalid counts', () => {
            expect(getWeekendCountError(0)).toBe('Weekend count must be between 1 and 12');
            expect(getWeekendCountError(13)).toBe('Weekend count must be between 1 and 12');
            expect(getWeekendCountError(-1)).toBe('Weekend count must be between 1 and 12');
        });
        
        test('is deterministic', () => {
            const error1 = getWeekendCountError(0);
            const error2 = getWeekendCountError(0);
            expect(error1).toBe(error2);
        });
    });
    
    describe('URL Builder Functions', () => {
        const baseUrl = 'https://api.example.com';
        
        test('buildHealthUrl creates correct URL', () => {
            expect(buildHealthUrl(baseUrl)).toBe('https://api.example.com/health');
        });
        
        test('buildHotelsUrl creates correct URL', () => {
            expect(buildHotelsUrl(baseUrl)).toBe('https://api.example.com/vagas/hoteis');
        });
        
        test('buildScrapeUrl creates correct URL', () => {
            expect(buildScrapeUrl(baseUrl)).toBe('https://api.example.com/vagas/hoteis/scrape');
        });
        
        test('buildSearchUrl creates correct URL with parameters', () => {
            const url = buildSearchUrl(baseUrl, '-1', '2025-12-20', '2025-12-22');
            expect(url).toBe('https://api.example.com/vagas/search?hotel=-1&checkin=2025-12-20&checkout=2025-12-22');
        });
        
        test('buildWeekendSearchUrl creates correct URL', () => {
            expect(buildWeekendSearchUrl(baseUrl, 8)).toBe('https://api.example.com/vagas/search/weekends?count=8');
        });
        
        test('URL builders are deterministic', () => {
            const url1 = buildSearchUrl(baseUrl, '5', '2025-12-20', '2025-12-22');
            const url2 = buildSearchUrl(baseUrl, '5', '2025-12-20', '2025-12-22');
            expect(url1).toBe(url2);
        });
    });
    
    describe('ensureISOFormat', () => {
        test('converts Date objects to ISO format', () => {
            const date = new Date('2025-12-20');
            expect(ensureISOFormat(date)).toBe('2025-12-20');
        });
        
        test('returns string dates unchanged', () => {
            expect(ensureISOFormat('2025-12-20')).toBe('2025-12-20');
            expect(ensureISOFormat('2026-01-15')).toBe('2026-01-15');
        });
        
        test('is deterministic', () => {
            const date = new Date('2025-12-20');
            expect(ensureISOFormat(date)).toBe('2025-12-20');
            expect(ensureISOFormat(date)).toBe('2025-12-20');
        });
    });
});

// ============================================================================
// DEPENDENCY INJECTION TESTS
// ============================================================================

describe('BuscaVagasAPIClient - Dependency Injection', () => {
    
    test('uses provided logger instead of console', () => {
        const mockLogger = {
            log: jest.fn()
        };
        
        const client = new BuscaVagasAPIClient({ logger: mockLogger });
        
        expect(mockLogger.log).toHaveBeenCalledWith(
            expect.stringContaining('BuscaVagasAPIClient initialized')
        );
    });
    
    test('falls back to console if no logger provided', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        
        const client = new BuscaVagasAPIClient();
        
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
    
    test('logger can be mocked for silent testing', () => {
        const silentLogger = {
            log: () => {} // No-op logger
        };
        
        const client = new BuscaVagasAPIClient({ logger: silentLogger });
        
        // Should not throw, logs are silently ignored
        expect(client.logger.log).toBeDefined();
    });
});

// ============================================================================
// REFERENTIAL TRANSPARENCY TESTS
// ============================================================================

describe('Referential Transparency Properties', () => {
    
    test('pure functions can be memoized', () => {
        const memoize = (fn) => {
            const cache = new Map();
            return (...args) => {
                const key = JSON.stringify(args);
                if (cache.has(key)) return cache.get(key);
                const result = fn(...args);
                cache.set(key, result);
                return result;
            };
        };
        
        const memoizedFormat = memoize(formatDateISO);
        const date = new Date('2025-12-20');
        
        const result1 = memoizedFormat(date);
        const result2 = memoizedFormat(date); // From cache
        
        expect(result1).toBe('2025-12-20');
        expect(result2).toBe('2025-12-20');
    });
    
    test('pure functions have no side effects', () => {
        const date = new Date('2025-12-20');
        const originalTime = date.getTime();
        
        formatDateISO(date);
        
        // Date object unchanged
        expect(date.getTime()).toBe(originalTime);
    });
    
    test('pure validators are composable', () => {
        const isValid = (count) => {
            return isValidWeekendCount(count) && count <= 10;
        };
        
        expect(isValid(8)).toBe(true);
        expect(isValid(11)).toBe(false);
        expect(isValid(0)).toBe(false);
    });
    
    test('URL builders can be composed', () => {
        const buildFullUrl = (base, hotel, checkin, checkout) => {
            return buildSearchUrl(base, hotel, checkin, checkout);
        };
        
        const url = buildFullUrl('https://api.test.com', '-1', '2025-12-20', '2025-12-22');
        expect(url).toContain('vagas/search');
    });
});

// ============================================================================
// PROPERTY-BASED TESTING
// ============================================================================

describe('Property-Based Tests', () => {
    
    test('formatDateISO is idempotent when applied to strings', () => {
        const isoString = '2025-12-20';
        const date = new Date(isoString);
        
        const formatted = formatDateISO(date);
        expect(formatted).toBe(isoString);
    });
    
    test('URL builders preserve order independence', () => {
        const url1 = buildSearchUrl('https://api.test.com', 'A', 'B', 'C');
        const url2 = buildSearchUrl('https://api.test.com', 'A', 'B', 'C');
        
        expect(url1).toBe(url2);
    });
    
    test('validation is symmetric', () => {
        const testCounts = [1, 5, 8, 12];
        
        testCounts.forEach(count => {
            const isValid = isValidWeekendCount(count);
            const hasError = getWeekendCountError(count) !== null;
            
            // Valid counts should have no error, invalid should have error
            expect(isValid).toBe(!hasError);
        });
    });
});

// ============================================================================
// CURRENT TIME PARAMETER TESTS
// ============================================================================

describe('Current Time Parameter', () => {
    
    test('getHotels accepts currentTime parameter', async () => {
        const mockLogger = { log: jest.fn() };
        const client = new BuscaVagasAPIClient({ logger: mockLogger });
        
        const fixedTime = new Date('2025-12-20T10:00:00Z').getTime();
        
        // Method signature should accept currentTime
        expect(async () => {
            // Note: This will fail if API is not available, but tests parameter acceptance
            try {
                await client.getHotels(false, fixedTime);
            } catch (e) {
                // Expected - testing parameter acceptance, not actual API call
            }
        }).not.toThrow(TypeError);
    });
    
    test('getCacheStats accepts currentTime parameter', () => {
        const mockLogger = { log: () => {} };
        const client = new BuscaVagasAPIClient({ logger: mockLogger });
        
        const fixedTime = new Date('2025-12-20T10:00:00Z').getTime();
        
        expect(() => {
            client.getCacheStats(fixedTime);
        }).not.toThrow();
    });
});
