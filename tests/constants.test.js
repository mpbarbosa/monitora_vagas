/**
 * Unit Tests for Constants Module
 * Validates configuration values and structure
 * @version 1.0.0
 */

import { describe, it, expect } from '@jest/globals';
import { TIME, API, VALIDATION, CACHE, UI } from '../src/config/constants.js';

// ============================================================================
// TIME CONSTANTS TESTS
// ============================================================================

describe('Constants - TIME', () => {
    describe('Base time units', () => {
        it('should define SECOND as 1000ms', () => {
            expect(TIME.SECOND).toBe(1000);
        });

        it('should define MINUTE as 60 seconds', () => {
            expect(TIME.MINUTE).toBe(60 * 1000);
            expect(TIME.MINUTE).toBe(60000);
        });

        it('should define HOUR as 60 minutes', () => {
            expect(TIME.HOUR).toBe(60 * 60 * 1000);
            expect(TIME.HOUR).toBe(3600000);
        });

        it('should define DAY as 24 hours', () => {
            expect(TIME.DAY).toBe(24 * 60 * 60 * 1000);
            expect(TIME.DAY).toBe(86400000);
        });

        it('should have correct unit relationships', () => {
            expect(TIME.MINUTE / TIME.SECOND).toBe(60);
            expect(TIME.HOUR / TIME.MINUTE).toBe(60);
            expect(TIME.DAY / TIME.HOUR).toBe(24);
        });
    });

    describe('API timeouts', () => {
        it('should define DEFAULT timeout', () => {
            expect(TIME.TIMEOUT.DEFAULT).toBe(30000); // 30 seconds
        });

        it('should define SEARCH timeout', () => {
            expect(TIME.TIMEOUT.SEARCH).toBe(60000); // 1 minute
        });

        it('should define WEEKEND_SEARCH timeout', () => {
            expect(TIME.TIMEOUT.WEEKEND_SEARCH).toBe(600000); // 10 minutes
        });

        it('should have increasing timeout hierarchy', () => {
            expect(TIME.TIMEOUT.DEFAULT).toBeLessThan(TIME.TIMEOUT.SEARCH);
            expect(TIME.TIMEOUT.SEARCH).toBeLessThan(TIME.TIMEOUT.WEEKEND_SEARCH);
        });

        it('should have all timeouts as positive numbers', () => {
            expect(TIME.TIMEOUT.DEFAULT).toBeGreaterThan(0);
            expect(TIME.TIMEOUT.SEARCH).toBeGreaterThan(0);
            expect(TIME.TIMEOUT.WEEKEND_SEARCH).toBeGreaterThan(0);
        });
    });

    describe('Cache TTLs', () => {
        it('should define API_RESPONSE cache TTL', () => {
            expect(TIME.CACHE.API_RESPONSE).toBe(300000); // 5 minutes
        });

        it('should define HOTEL_LIST cache TTL', () => {
            expect(TIME.CACHE.HOTEL_LIST).toBe(86400000); // 24 hours
        });

        it('should have HOTEL_LIST TTL longer than API_RESPONSE', () => {
            expect(TIME.CACHE.HOTEL_LIST).toBeGreaterThan(TIME.CACHE.API_RESPONSE);
        });
    });

    describe('Retry configuration', () => {
        it('should define BASE_DELAY', () => {
            expect(TIME.RETRY.BASE_DELAY).toBe(1000); // 1 second
        });

        it('should define MULTIPLIER for exponential backoff', () => {
            expect(TIME.RETRY.MULTIPLIER).toBe(2);
        });

        it('should support exponential backoff calculation', () => {
            const attempt1 = TIME.RETRY.BASE_DELAY * Math.pow(TIME.RETRY.MULTIPLIER, 0);
            const attempt2 = TIME.RETRY.BASE_DELAY * Math.pow(TIME.RETRY.MULTIPLIER, 1);
            const attempt3 = TIME.RETRY.BASE_DELAY * Math.pow(TIME.RETRY.MULTIPLIER, 2);
            
            expect(attempt1).toBe(1000);
            expect(attempt2).toBe(2000);
            expect(attempt3).toBe(4000);
        });
    });

    describe('UI delays', () => {
        it('should define NOTIFICATION_DURATION', () => {
            expect(TIME.UI.NOTIFICATION_DURATION).toBe(2000); // 2 seconds
        });

        it('should define DEBOUNCE delay', () => {
            expect(TIME.UI.DEBOUNCE).toBe(300); // 300ms
        });

        it('should define THROTTLE delay', () => {
            expect(TIME.UI.THROTTLE).toBe(1000); // 1 second
        });

        it('should have reasonable UI timing values', () => {
            expect(TIME.UI.DEBOUNCE).toBeGreaterThan(0);
            expect(TIME.UI.DEBOUNCE).toBeLessThan(TIME.UI.THROTTLE);
            expect(TIME.UI.THROTTLE).toBeLessThan(TIME.UI.NOTIFICATION_DURATION);
        });
    });
});

// ============================================================================
// API CONSTANTS TESTS
// ============================================================================

describe('Constants - API', () => {
    describe('HTTP Status codes', () => {
        it('should define success codes', () => {
            expect(API.STATUS.OK).toBe(200);
        });

        it('should define client error codes', () => {
            expect(API.STATUS.BAD_REQUEST).toBe(400);
            expect(API.STATUS.NOT_FOUND).toBe(404);
        });

        it('should define server error codes', () => {
            expect(API.STATUS.SERVER_ERROR).toBe(500);
        });

        it('should use standard HTTP status codes', () => {
            expect(API.STATUS.OK).toBeGreaterThanOrEqual(200);
            expect(API.STATUS.OK).toBeLessThan(300);
            expect(API.STATUS.BAD_REQUEST).toBeGreaterThanOrEqual(400);
            expect(API.STATUS.BAD_REQUEST).toBeLessThan(500);
        });
    });

    describe('Retry configuration', () => {
        it('should define MAX_RETRIES', () => {
            expect(API.MAX_RETRIES).toBeDefined();
            expect(typeof API.MAX_RETRIES).toBe('number');
        });

        it('should have reasonable retry limits', () => {
            expect(API.MAX_RETRIES).toBeGreaterThanOrEqual(0);
            expect(API.MAX_RETRIES).toBeLessThanOrEqual(10);
        });
    });

    describe('Content types', () => {
        it('should define JSON content type', () => {
            expect(API.CONTENT_TYPE.JSON).toBe('application/json');
        });

        it('should define FORM content type', () => {
            expect(API.CONTENT_TYPE.FORM).toBe('application/x-www-form-urlencoded');
        });
    });
});

// ============================================================================
// VALIDATION CONSTANTS TESTS
// ============================================================================

describe('Constants - VALIDATION', () => {
    describe('Guest limits', () => {
        it('should define MIN guests', () => {
            expect(VALIDATION.GUESTS.MIN).toBe(1);
        });

        it('should define MAX guests', () => {
            expect(VALIDATION.GUESTS.MAX).toBe(10);
        });

        it('should have MIN less than MAX', () => {
            expect(VALIDATION.GUESTS.MIN).toBeLessThan(VALIDATION.GUESTS.MAX);
        });

        it('should use positive integers', () => {
            expect(Number.isInteger(VALIDATION.GUESTS.MIN)).toBe(true);
            expect(Number.isInteger(VALIDATION.GUESTS.MAX)).toBe(true);
            expect(VALIDATION.GUESTS.MIN).toBeGreaterThan(0);
        });
    });
});

// ============================================================================
// CACHE CONSTANTS TESTS
// ============================================================================

describe('Constants - CACHE', () => {
    describe('Cache keys', () => {
        it('should define HOTEL_LIST key', () => {
            expect(CACHE.KEYS.HOTEL_LIST).toBe('afpesp_hotels_cache');
        });

        it('should define LOG_LEVEL key', () => {
            expect(CACHE.KEYS.LOG_LEVEL).toBe('logLevel');
        });

        it('should define USER_PREFERENCES key', () => {
            expect(CACHE.KEYS.USER_PREFERENCES).toBe('afpesp_user_prefs');
        });
    });

    describe('Cache limits', () => {
        it('should define MAX_ENTRIES', () => {
            expect(CACHE.LIMITS.MAX_ENTRIES).toBeDefined();
            expect(typeof CACHE.LIMITS.MAX_ENTRIES).toBe('number');
        });

        it('should define MAX_SIZE_MB', () => {
            expect(CACHE.LIMITS.MAX_SIZE_MB).toBeDefined();
            expect(typeof CACHE.LIMITS.MAX_SIZE_MB).toBe('number');
        });
    });
});

// ============================================================================
// UI CONSTANTS TESTS
// ============================================================================

describe('Constants - UI', () => {
    describe('Animation timings', () => {
        it('should define animation durations', () => {
            expect(UI.ANIMATION.FAST).toBeDefined();
            expect(UI.ANIMATION.NORMAL).toBeDefined();
            expect(UI.ANIMATION.SLOW).toBeDefined();
        });

        it('should have increasing animation durations', () => {
            expect(UI.ANIMATION.FAST).toBeLessThan(UI.ANIMATION.NORMAL);
            expect(UI.ANIMATION.NORMAL).toBeLessThan(UI.ANIMATION.SLOW);
        });
    });

    describe('Breakpoints', () => {
        it('should define responsive breakpoints', () => {
            expect(UI.BREAKPOINTS.MOBILE).toBeDefined();
            expect(UI.BREAKPOINTS.TABLET).toBeDefined();
            expect(UI.BREAKPOINTS.DESKTOP).toBeDefined();
            expect(UI.BREAKPOINTS.WIDE).toBeDefined();
        });

        it('should have increasing breakpoint values', () => {
            expect(UI.BREAKPOINTS.MOBILE).toBeLessThan(UI.BREAKPOINTS.TABLET);
            expect(UI.BREAKPOINTS.TABLET).toBeLessThan(UI.BREAKPOINTS.DESKTOP);
            expect(UI.BREAKPOINTS.DESKTOP).toBeLessThan(UI.BREAKPOINTS.WIDE);
        });
    });

    describe('Z-index layers', () => {
        it('should define z-index constants', () => {
            expect(UI.Z_INDEX.DROPDOWN).toBeDefined();
            expect(UI.Z_INDEX.MODAL).toBeDefined();
            expect(UI.Z_INDEX.TOOLTIP).toBeDefined();
            expect(UI.Z_INDEX.NOTIFICATION).toBeDefined();
        });
    });
});

// ============================================================================
// STRUCTURE AND IMMUTABILITY TESTS
// ============================================================================

describe('Constants - Structure and Immutability', () => {
    it('should export all major constant groups', () => {
        expect(TIME).toBeDefined();
        expect(API).toBeDefined();
        expect(VALIDATION).toBeDefined();
        expect(CACHE).toBeDefined();
    });

    it('should use nested objects for organization', () => {
        expect(typeof TIME.TIMEOUT).toBe('object');
        expect(typeof TIME.CACHE).toBe('object');
        expect(typeof API.STATUS).toBe('object');
        expect(typeof VALIDATION.GUESTS).toBe('object');
    });

    it('should only contain primitive values or objects', () => {
        const checkPrimitives = (obj) => {
            for (const [key, value] of Object.entries(obj)) {
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    checkPrimitives(value);
                } else {
                    expect(['string', 'number', 'boolean', 'object']).toContain(typeof value);
                }
            }
        };

        checkPrimitives(TIME);
        checkPrimitives(API);
        checkPrimitives(VALIDATION);
    });

    it('should not contain functions', () => {
        const hasFunctions = (obj) => {
            for (const value of Object.values(obj)) {
                if (typeof value === 'function') return true;
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    if (hasFunctions(value)) return true;
                }
            }
            return false;
        };

        expect(hasFunctions(TIME)).toBe(false);
        expect(hasFunctions(API)).toBe(false);
        expect(hasFunctions(VALIDATION)).toBe(false);
    });
});

// ============================================================================
// INTEGRATION AND CROSS-REFERENCE TESTS
// ============================================================================

describe('Constants - Integration Tests', () => {
    it('should use consistent time units across modules', () => {
        // Cache TTL should use TIME constants
        expect(TIME.CACHE.API_RESPONSE % TIME.SECOND).toBe(0);
        expect(TIME.CACHE.HOTEL_LIST % TIME.MINUTE).toBe(0);
    });

    it('should have timeout values appropriate for their use cases', () => {
        // Search timeout should be longer than default
        expect(TIME.TIMEOUT.SEARCH).toBeGreaterThan(TIME.TIMEOUT.DEFAULT);
        
        // Weekend search timeout should be longest
        expect(TIME.TIMEOUT.WEEKEND_SEARCH).toBeGreaterThan(TIME.TIMEOUT.SEARCH);
    });

    it('should have cache TTLs appropriate for data volatility', () => {
        // Static hotel list can be cached longer than API responses
        expect(TIME.CACHE.HOTEL_LIST).toBeGreaterThan(TIME.CACHE.API_RESPONSE);
    });
});
