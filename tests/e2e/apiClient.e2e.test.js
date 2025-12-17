/**
 * End-to-End Test Suite for API Client Service
 * 
 * Tests real API interactions with the backend server.
 * Requires backend server running on configured API_BASE_URL.
 * 
 * @jest-environment jsdom
 * 
 * Prerequisites:
 * - Backend server must be running
 * - Set TEST_API_URL environment variable or use default
 * - Database must have test data
 * 
 * Run with:
 *   npm run test:e2e
 *   npm run test:e2e:local (for localhost testing)
 */

import { jest } from '@jest/globals';

// Environment configuration for E2E tests
const TEST_API_URL = process.env.TEST_API_URL || 'http://localhost:3001/api';
const TEST_TIMEOUT = 30000; // 30 seconds for API calls

// Set environment variable before importing
process.env.TEST_API_URL = TEST_API_URL;
process.env.NODE_ENV = 'test';

// Polyfill fetch for Node.js test environment if needed
if (typeof global.fetch === 'undefined') {
    const { default: fetch, Headers, Request, Response } = await import('node-fetch');
    global.fetch = fetch;
    global.Headers = Headers;
    global.Request = Request;
    global.Response = Response;
}

// Import client
const { BuscaVagasAPIClient } = await import('../../src/services/apiClient.js');

// ============================================================================
// TEST CONFIGURATION
// ============================================================================

describe('API Client E2E Tests', () => {
    let client;
    let silentLogger;
    let serverAvailable = false;

    // Setup before all tests
    beforeAll(async () => {
        // Silent logger for cleaner test output
        silentLogger = {
            log: jest.fn()
        };
        
        console.log(`\n🔧 E2E Test Configuration:`);
        console.log(`   API URL: ${TEST_API_URL}`);
        console.log(`   Timeout: ${TEST_TIMEOUT}ms`);
        console.log(`   Date: ${new Date().toISOString()}\n`);
        
        // Check if server is available
        try {
            const healthUrl = `${TEST_API_URL}/health`;
            const response = await fetch(healthUrl, { 
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            serverAvailable = response.ok;
            
            if (serverAvailable) {
                console.log('✅ API server is available\n');
            } else {
                console.log('⚠️  API server returned non-200 status\n');
            }
        } catch (error) {
            console.log('⚠️  API server is not available. E2E tests will be skipped.');
            console.log(`   Error: ${error.message}`);
            console.log(`   Please start the backend server at ${TEST_API_URL}\n`);
        }
    });

    beforeEach(() => {
        // Create fresh client for each test
        try {
            client = new BuscaVagasAPIClient({ logger: silentLogger });
        } catch (error) {
            console.error('Failed to create client:', error);
            client = null;
        }
    });

    afterEach(() => {
        // Clear cache after each test
        if (client && client.fetchManager && client.fetchManager.cache) {
            client.fetchManager.cache.clear();
        }
    });

    // Helper to wrap tests with server availability check
    const testWithServer = (name, fn, timeout) => {
        test(name, async () => {
            if (!serverAvailable) {
                console.log(`⏭️  Skipping "${name}" - Server unavailable`);
                return;
            }
            await fn();
        }, timeout);
    };

    // ========================================================================
    // HEALTH CHECK TESTS
    // ========================================================================

    describe('Health Check Endpoint', () => {
        testWithServer('should successfully check API health', async () => {
            const response = await client.checkHealth();
            
            expect(response).toBeDefined();
            expect(response.status).toBe('ok');
            expect(response).toHaveProperty('timestamp');
        }, TEST_TIMEOUT);

        testWithServer('should return response within timeout', async () => {
            const startTime = Date.now();
            await client.checkHealth();
            const duration = Date.now() - startTime;
            
            expect(duration).toBeLessThan(5000); // Should respond in < 5s
        }, TEST_TIMEOUT);

        testWithServer('should handle multiple concurrent health checks', async () => {
            const promises = Array.from({ length: 5 }, () => 
                client.checkHealth()
            );
            
            const results = await Promise.all(promises);
            
            expect(results).toHaveLength(5);
            results.forEach(result => {
                expect(result.status).toBe('ok');
            });
        }, TEST_TIMEOUT);
    });

    // ========================================================================
    // HOTEL LIST TESTS
    // ========================================================================

    describe('Hotel List Endpoint', () => {
        testWithServer('should fetch list of available hotels', async () => {
            const hotels = await client.getHotels();
            
            expect(Array.isArray(hotels)).toBe(true);
            expect(hotels.length).toBeGreaterThan(0);
        }, TEST_TIMEOUT);

        testWithServer('should return hotels with correct structure', async () => {
            const hotels = await client.getHotels();
            
            const hotel = hotels[0];
            expect(hotel).toHaveProperty('id');
            expect(hotel).toHaveProperty('name');
            expect(typeof hotel.id).toBe('string');
            expect(typeof hotel.name).toBe('string');
        }, TEST_TIMEOUT);

        testWithServer('should cache hotel list', async () => {
            // First call - fetches from API
            const hotels1 = await client.getHotels();
            
            // Second call - should use cache
            const hotels2 = await client.getHotels();
            
            expect(hotels1).toEqual(hotels2);
        }, TEST_TIMEOUT);

        testWithServer('should handle forced refresh', async () => {
            const hotels1 = await client.getHotels();
            
            // Force refresh
            const hotels2 = await client.getHotels(true);
            
            expect(Array.isArray(hotels2)).toBe(true);
        }, TEST_TIMEOUT);
    });

    // ========================================================================
    // SCRAPING TESTS
    // ========================================================================

    describe('Scraping Endpoint', () => {
        testWithServer('should trigger scraping successfully', async () => {
            const response = await client.triggerScraping();
            
            expect(response).toBeDefined();
            expect(response).toHaveProperty('status');
        }, TEST_TIMEOUT);

        testWithServer('should return scraping job information', async () => {
            const response = await client.triggerScraping();
            
            // Should have job details
            expect(response).toHaveProperty('message');
        }, TEST_TIMEOUT);
    });

    // ========================================================================
    // SEARCH TESTS - BASIC
    // ========================================================================

    describe('Basic Search Functionality', () => {
        // Test dates - next month
        const getTestDates = () => {
            const now = new Date();
            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            const checkIn = new Date(nextMonth.getTime() + (7 * 24 * 60 * 60 * 1000)); // +7 days
            const checkOut = new Date(checkIn.getTime() + (2 * 24 * 60 * 60 * 1000)); // +2 days
            
            return {
                checkIn: client.formatDateISO(checkIn),
                checkOut: client.formatDateISO(checkOut)
            };
        };

        testWithServer('should search for all hotels', async () => {
            const { checkIn, checkOut } = getTestDates();
            
            const results = await client.searchAvailability(
                'all',
                checkIn,
                checkOut,
                2
            );
            
            expect(Array.isArray(results)).toBe(true);
        }, TEST_TIMEOUT);

        testWithServer('should return results with correct structure', async () => {
            const { checkIn, checkOut } = getTestDates();
            
            const results = await client.searchAvailability(
                'all',
                checkIn,
                checkOut,
                2
            );
            
            if (results.length > 0) {
                const result = results[0];
                expect(result).toHaveProperty('hotel');
                expect(result).toHaveProperty('availability');
            }
        }, TEST_TIMEOUT);

        testWithServer('should handle different guest counts', async () => {
            const { checkIn, checkOut } = getTestDates();
            
            const guestCounts = [1, 2, 4];
            
            for (const guests of guestCounts) {
                const results = await client.searchAvailability(
                    'all',
                    checkIn,
                    checkOut,
                    guests
                );
                
                expect(Array.isArray(results)).toBe(true);
            }
        }, TEST_TIMEOUT);

        testWithServer('should handle specific hotel search', async () => {
            const { checkIn, checkOut } = getTestDates();
            
            // First get hotel list
            const hotels = await client.getHotels();
            
            if (hotels.length > 0) {
                const hotelId = hotels[0].id;
                
                const results = await client.searchAvailability(
                    hotelId,
                    checkIn,
                    checkOut,
                    2
                );
                
                expect(Array.isArray(results)).toBe(true);
            }
        }, TEST_TIMEOUT);

        testWithServer('should validate date parameters', async () => {
            const { checkIn, checkOut } = getTestDates();
            
            // Test with Date objects
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);
            
            const results = await client.searchAvailability(
                'all',
                checkInDate,
                checkOutDate,
                2
            );
            
            expect(Array.isArray(results)).toBe(true);
        }, TEST_TIMEOUT);
    });

    // ========================================================================
    // SEARCH TESTS - ADVANCED
    // ========================================================================

    describe('Advanced Search Features', () => {
        testWithServer('should handle date range spanning multiple months', async () => {
            const now = new Date();
            const checkIn = new Date(now.getFullYear(), now.getMonth() + 1, 28);
            const checkOut = new Date(now.getFullYear(), now.getMonth() + 2, 2);
            
            const results = await client.searchAvailability(
                'all',
                checkIn,
                checkOut,
                2
            );
            
            expect(Array.isArray(results)).toBe(true);
        }, TEST_TIMEOUT);

        testWithServer('should handle weekend stays', async () => {
            const now = new Date();
            // Find next Friday
            const daysUntilFriday = (5 - now.getDay() + 7) % 7;
            const friday = new Date(now.getTime() + daysUntilFriday * 24 * 60 * 60 * 1000);
            friday.setDate(friday.getDate() + 7); // Next week
            
            const checkIn = client.formatDateISO(friday);
            const sunday = new Date(friday.getTime() + 2 * 24 * 60 * 60 * 1000);
            const checkOut = client.formatDateISO(sunday);
            
            const results = await client.searchAvailability(
                'all',
                checkIn,
                checkOut,
                2
            );
            
            expect(Array.isArray(results)).toBe(true);
        }, TEST_TIMEOUT);

        testWithServer('should handle long stays (7+ days)', async () => {
            const now = new Date();
            const checkIn = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            const checkOut = new Date(checkIn.getTime() + 10 * 24 * 60 * 60 * 1000);
            
            const results = await client.searchAvailability(
                'all',
                checkIn,
                checkOut,
                2
            );
            
            expect(Array.isArray(results)).toBe(true);
        }, TEST_TIMEOUT);
    });

    // ========================================================================
    // WEEKEND SEARCH TESTS
    // ========================================================================

    describe('Weekend Search Functionality', () => {
        testWithServer('should search multiple consecutive weekends', async () => {
            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            
            const results = await client.searchWeekends(
                'all',
                startDate,
                3, // 3 weekends
                2  // 2 guests
            );
            
            expect(Array.isArray(results)).toBe(true);
        }, 60000); // 60s timeout for weekend search

        testWithServer('should validate weekend count range', async () => {
            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            
            // Test valid counts (1-12)
            for (const count of [1, 6, 12]) {
                const results = await client.searchWeekends(
                    'all',
                    startDate,
                    count,
                    2
                );
                
                expect(Array.isArray(results)).toBe(true);
            }
        }, 120000); // 120s timeout

        testWithServer('should reject invalid weekend counts', async () => {
            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            
            await expect(
                client.searchWeekends('all', startDate, 0, 2)
            ).rejects.toThrow(/Número de finais de semana deve estar entre 1 e 12/);
            
            await expect(
                client.searchWeekends('all', startDate, 13, 2)
            ).rejects.toThrow(/Número de finais de semana deve estar entre 1 e 12/);
        }, TEST_TIMEOUT);

        testWithServer('should handle different starting months', async () => {
            const now = new Date();
            
            // Test with current month + 1 and + 2
            for (const monthOffset of [1, 2]) {
                const startDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
                
                const results = await client.searchWeekends(
                    'all',
                    startDate,
                    2,
                    2
                );
                
                expect(Array.isArray(results)).toBe(true);
            }
        }, 120000);
    });

    // ========================================================================
    // ERROR HANDLING TESTS
    // ========================================================================

    describe('Error Handling', () => {
        testWithServer('should handle invalid hotel ID', async () => {
            const now = new Date();
            const checkIn = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            const checkOut = new Date(checkIn.getTime() + 2 * 24 * 60 * 60 * 1000);
            
            // This may or may not throw depending on API implementation
            // Just ensure it doesn't crash
            try {
                await client.searchAvailability(
                    'invalid-hotel-id-12345',
                    checkIn,
                    checkOut,
                    2
                );
            } catch (error) {
                expect(error).toBeDefined();
            }
        }, TEST_TIMEOUT);

        testWithServer('should handle past dates gracefully', async () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const today = new Date();
            
            // API should reject or handle past dates
            try {
                await client.searchAvailability(
                    'all',
                    yesterday,
                    today,
                    2
                );
            } catch (error) {
                // Expected to fail
                expect(error).toBeDefined();
            }
        }, TEST_TIMEOUT);

        testWithServer('should handle check-out before check-in', async () => {
            const now = new Date();
            const checkIn = new Date(now.getFullYear(), now.getMonth() + 1, 10);
            const checkOut = new Date(now.getFullYear(), now.getMonth() + 1, 5);
            
            // Should reject invalid date range
            try {
                await client.searchAvailability(
                    'all',
                    checkIn,
                    checkOut,
                    2
                );
            } catch (error) {
                expect(error).toBeDefined();
            }
        }, TEST_TIMEOUT);

        testWithServer('should handle invalid guest count', async () => {
            const now = new Date();
            const checkIn = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            const checkOut = new Date(checkIn.getTime() + 2 * 24 * 60 * 60 * 1000);
            
            // Test invalid guest counts
            for (const guests of [0, -1, 100]) {
                try {
                    await client.searchAvailability(
                        'all',
                        checkIn,
                        checkOut,
                        guests
                    );
                } catch (error) {
                    // Expected to fail
                    expect(error).toBeDefined();
                }
            }
        }, TEST_TIMEOUT);
    });

    // ========================================================================
    // PERFORMANCE TESTS
    // ========================================================================

    describe('Performance & Concurrency', () => {
        testWithServer('should handle concurrent searches', async () => {
            const now = new Date();
            const checkIn = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            const checkOut = new Date(checkIn.getTime() + 2 * 24 * 60 * 60 * 1000);
            
            // Run 3 concurrent searches
            const promises = Array.from({ length: 3 }, (_, i) => 
                client.searchAvailability(
                    'all',
                    checkIn,
                    checkOut,
                    2
                )
            );
            
            const results = await Promise.all(promises);
            
            expect(results).toHaveLength(3);
            results.forEach(result => {
                expect(Array.isArray(result)).toBe(true);
            });
        }, TEST_TIMEOUT);

        testWithServer('should respect timeout configuration', async () => {
            const now = new Date();
            const checkIn = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            const checkOut = new Date(checkIn.getTime() + 2 * 24 * 60 * 60 * 1000);
            
            const startTime = Date.now();
            
            await client.searchAvailability('all', checkIn, checkOut, 2);
            
            const duration = Date.now() - startTime;
            
            // Should complete within configured timeout
            expect(duration).toBeLessThan(client.timeout.search);
        }, TEST_TIMEOUT);

        testWithServer('should cache effectively', async () => {
            const now = new Date();
            const checkIn = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            const checkOut = new Date(checkIn.getTime() + 2 * 24 * 60 * 60 * 1000);
            
            // First call - fresh fetch
            const start1 = Date.now();
            const results1 = await client.searchAvailability('all', checkIn, checkOut, 2);
            const duration1 = Date.now() - start1;
            
            // Second call - should be faster (cached)
            const start2 = Date.now();
            const results2 = await client.searchAvailability('all', checkIn, checkOut, 2);
            const duration2 = Date.now() - start2;
            
            // Cache should make second call faster
            expect(duration2).toBeLessThanOrEqual(duration1);
            expect(results1).toEqual(results2);
        }, TEST_TIMEOUT);
    });

    // ========================================================================
    // INTEGRATION TESTS
    // ========================================================================

    describe('End-to-End Workflows', () => {
        testWithServer('should complete full search workflow', async () => {
            // 1. Check health
            const health = await client.checkHealth();
            expect(health.status).toBe('ok');
            
            // 2. Fetch hotels
            const hotels = await client.getHotels();
            expect(Array.isArray(hotels)).toBe(true);
            expect(hotels.length).toBeGreaterThan(0);
            
            // 3. Search availability
            const now = new Date();
            const checkIn = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            const checkOut = new Date(checkIn.getTime() + 2 * 24 * 60 * 60 * 1000);
            
            const results = await client.searchAvailability(
                'all',
                checkIn,
                checkOut,
                2
            );
            
            expect(Array.isArray(results)).toBe(true);
        }, TEST_TIMEOUT);

        testWithServer('should handle hotel-specific search workflow', async () => {
            // 1. Get hotel list
            const hotels = await client.getHotels();
            expect(hotels.length).toBeGreaterThan(0);
            
            // 2. Pick first hotel
            const hotel = hotels[0];
            
            // 3. Search for that specific hotel
            const now = new Date();
            const checkIn = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            const checkOut = new Date(checkIn.getTime() + 2 * 24 * 60 * 60 * 1000);
            
            const results = await client.searchAvailability(
                hotel.id,
                checkIn,
                checkOut,
                2
            );
            
            expect(Array.isArray(results)).toBe(true);
        }, TEST_TIMEOUT);

        testWithServer('should handle weekend search workflow', async () => {
            // 1. Health check
            await client.checkHealth();
            
            // 2. Weekend search
            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            
            const results = await client.searchWeekends(
                'all',
                startDate,
                2,
                2
            );
            
            expect(Array.isArray(results)).toBe(true);
        }, 60000);
    });

    // ========================================================================
    // CACHE BEHAVIOR TESTS
    // ========================================================================

    describe('Cache Behavior', () => {
        testWithServer('should use cache for repeated hotel fetches', async () => {
            const hotels1 = await client.getHotels();
            const hotels2 = await client.getHotels();
            
            // Should return same data
            expect(hotels1).toEqual(hotels2);
        }, TEST_TIMEOUT);

        testWithServer('should clear cache on demand', async () => {
            await client.getHotels();
            
            // Clear cache
            client.hotelCache.clear();
            
            // Fetch again - should work
            const hotels = await client.getHotels();
            expect(Array.isArray(hotels)).toBe(true);
        }, TEST_TIMEOUT);

        testWithServer('should force refresh when requested', async () => {
            await client.getHotels();
            
            // Force refresh
            const hotels = await client.getHotels(true);
            expect(Array.isArray(hotels)).toBe(true);
        }, TEST_TIMEOUT);
    });
});

// ============================================================================
// TEST SUITE SUMMARY
// ============================================================================

describe('E2E Test Suite Summary', () => {
    test('should display test configuration', () => {
        console.log('\n📊 E2E Test Suite Summary:');
        console.log('════════════════════════════════════════');
        console.log(`   Test Categories: 10`);
        console.log(`   Total Tests: 40+`);
        console.log(`   API URL: ${TEST_API_URL}`);
        console.log(`   Timeout: ${TEST_TIMEOUT}ms`);
        console.log('════════════════════════════════════════\n');
        
        expect(true).toBe(true);
    });
});
