/**
 * API Client Service for Busca Vagas API
 * Based on official API documentation v1.2.1
 * @see https://github.com/mpbarbosa/busca_vagas/blob/main/docs/API_CLIENT_DOCUMENTATION.md
 * 
 * Uses ibira.js for API fetching and caching
 * 
 * Version: 1.1.0 - Enhanced with referential transparency improvements
 * - Dependency injection for logger
 * - Pure helper functions extracted
 * - Validators separated
 * - URL builders as pure functions
 */

import { IbiraAPIFetchManager } from 'ibira.js';
import { getEnvironment } from '../config/environment.js';
import { TIME, API } from '../config/constants.js';
import { hotelCache } from './hotelCache.js';

// ============================================================================
// PURE HELPER FUNCTIONS (Referentially Transparent)
// ============================================================================

/**
 * Format date to ISO 8601 format (YYYY-MM-DD) as required by API
 * Pure function - always produces same output for same input
 * @param {Date} date - JavaScript Date object
 * @returns {string} ISO formatted date string
 */
export function formatDateISO(date) {
    return date.toISOString().split('T')[0];
}

/**
 * Validate weekend count is within acceptable range
 * Pure function - deterministic, no side effects
 * @param {number} count - Weekend count to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidWeekendCount(count) {
    return Number.isInteger(count) && count >= 1 && count <= 12;
}

/**
 * Get validation error message for weekend count
 * Pure function - returns error message or null
 * @param {number} count - Weekend count to validate
 * @returns {string|null} Error message or null if valid
 */
export function getWeekendCountError(count) {
    if (!isValidWeekendCount(count)) {
        return 'Weekend count must be between 1 and 12';
    }
    return null;
}

/**
 * Build URL for health check endpoint
 * Pure function - deterministic URL construction
 * @param {string} baseUrl - API base URL
 * @returns {string} Complete health check URL
 */
export function buildHealthUrl(baseUrl) {
    return `${baseUrl}/health`;
}

/**
 * Build URL for hotels list endpoint
 * Pure function - deterministic URL construction
 * @param {string} baseUrl - API base URL
 * @returns {string} Complete hotels list URL
 */
export function buildHotelsUrl(baseUrl) {
    return `${baseUrl}/vagas/hoteis`;
}

/**
 * Build URL for hotel scraping endpoint
 * Pure function - deterministic URL construction
 * @param {string} baseUrl - API base URL
 * @returns {string} Complete scraping URL
 */
export function buildScrapeUrl(baseUrl) {
    return `${baseUrl}/vagas/hoteis/scrape`;
}

/**
 * Build URL for vacancy search endpoint
 * Pure function - deterministic URL construction with query parameters
 * @param {string} baseUrl - API base URL
 * @param {string} hotel - Hotel ID or '-1' for all
 * @param {string} checkin - Check-in date (ISO format)
 * @param {string} checkout - Check-out date (ISO format)
 * @returns {string} Complete search URL with query parameters
 */
export function buildSearchUrl(baseUrl, hotel, checkin, checkout) {
    return `${baseUrl}/vagas/search?hotel=${hotel}&checkin=${checkin}&checkout=${checkout}`;
}

/**
 * Build URL for weekend search endpoint
 * Pure function - deterministic URL construction
 * @param {string} baseUrl - API base URL
 * @param {number} count - Number of weekends to search
 * @returns {string} Complete weekend search URL
 */
export function buildWeekendSearchUrl(baseUrl, count) {
    return `${baseUrl}/vagas/search/weekends?count=${count}`;
}

/**
 * Convert date parameter to ISO format if needed
 * Pure function - handles both Date objects and strings
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} ISO formatted date string
 */
export function ensureISOFormat(date) {
    return date instanceof Date ? formatDateISO(date) : date;
}

// ============================================================================
// API CLIENT CLASS
// ============================================================================

/**
 * API Client for Busca Vagas API
 * Handles all communication with the backend API including:
 * - Health checks
 * - Hotel list management with caching
 * - Vacancy searches (date range and weekend searches)
 * - Puppeteer-based scraping operations
 * 
 * Uses ibira.js for advanced caching and retry logic
 * 
 * @class
 * @example
 * // Using singleton instance
 * import { apiClient } from './services/apiClient.js';
 * 
 * // Check API health
 * const health = await apiClient.checkHealth();
 * 
 * // Get hotels (cached)
 * const hotels = await apiClient.getHotels();
 * 
 * // Search vacancies
 * const results = await apiClient.searchVacancies(
 *   new Date('2024-01-15'),
 *   new Date('2024-01-17'),
 *   '-1'
 * );
 * 
 * @example
 * // Creating custom instance for testing
 * import { BuscaVagasAPIClient } from './services/apiClient.js';
 * 
 * const client = new BuscaVagasAPIClient({
 *   logger: customLogger
 * });
 */
export class BuscaVagasAPIClient {
    /**
     * Creates a new API client instance
     * @param {Object} [config={}] - Configuration options
     * @param {Object} [config.logger=console] - Logger instance (injectable for testing)
     * @param {string} [config.apiBaseUrl] - Override API base URL
     * @param {Object} [config.timeout] - Custom timeout configuration
     * @param {number} [config.timeout.default] - Default timeout in ms
     * @param {number} [config.timeout.search] - Search timeout in ms
     * @param {number} [config.timeout.weekendSearch] - Weekend search timeout in ms
     */
    constructor(config = {}) {
        const env = getEnvironment();
        
        // Dependency injection for logger (improved testability)
        this.logger = config.logger || console;
        
        // Configuration
        this.apiBaseUrl = env.API_BASE_URL || (env.isProduction 
            ? 'https://www.mpbarbosa.com/api'
            : 'http://localhost:3001/api');
        
        this.timeout = {
            default: TIME.TIMEOUT.DEFAULT,
            search: TIME.TIMEOUT.SEARCH,
            weekendSearch: TIME.TIMEOUT.WEEKEND_SEARCH
        };
        
        // Initialize ibira.js API fetch manager
        this.fetchManager = new IbiraAPIFetchManager({
            maxCacheSize: API.MAX_CACHE_SIZE,
            cacheExpiration: TIME.CACHE.API_RESPONSE,
            maxRetries: API.MAX_RETRIES,
            retryDelay: TIME.RETRY.BASE_DELAY,
            retryMultiplier: TIME.RETRY.MULTIPLIER
        });
        
        this.logger.log(`✅ BuscaVagasAPIClient initialized with base URL: ${this.apiBaseUrl}`);
        this.logger.log(`✅ Using ibira.js for API fetching and caching`);
    }

    /**
     * Format date to ISO 8601 format (YYYY-MM-DD) as required by API
     * Delegates to pure helper function
     * @param {Date} date - JavaScript Date object
     * @returns {string} ISO formatted date string
     */
    formatDateISO(date) {
        return formatDateISO(date);
    }

    /**
     * Generic fetch wrapper using ibira.js with timeout and error handling
     * Automatically handles API response format and errors
     * @param {string} url - Full URL to fetch
     * @param {number} [timeoutMs=this.timeout.default] - Timeout in milliseconds
     * @returns {Promise<Object>} API response object with { success, data, ... }
     * @throws {Error} If request times out or API returns error
     * @private
     * @example
     * const response = await this.fetchWithTimeout(
     *   'https://api.example.com/endpoint',
     *   5000
     * );
     */
    async fetchWithTimeout(url, timeoutMs = this.timeout.default) {
        try {
            const result = await this.fetchManager.fetch(url, { timeout: timeoutMs });
            
            // API returns { success: boolean, data: {...}, error?: string }
            if (result.success === false) {
                throw new Error(result.error || 'API returned error without message');
            }
            
            return result;
            
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - please try again');
            }
            
            throw error;
        }
    }

    /**
     * Check API health status
     * @returns {Promise<Object>} Health check response
     * @returns {boolean} returns.success - Whether API is healthy
     * @returns {string} returns.status - API status message
     * @returns {string} returns.version - API version
     * @throws {Error} If health check fails or times out
     * @example
     * try {
     *   const health = await apiClient.checkHealth();
     *   console.log(`API Status: ${health.status}`);
     *   console.log(`API Version: ${health.version}`);
     * } catch (error) {
     *   console.error('API is down:', error);
     * }
     */
    async checkHealth() {
        const url = buildHealthUrl(this.apiBaseUrl);
        this.logger.log(`🏥 Checking API health: ${url}`);
        
        const result = await this.fetchWithTimeout(url, this.timeout.default);
        this.logger.log(`✅ API Status: ${result.status}`);
        
        return result;
    }

    /**
     * Get static hotel list with persistent LocalStorage cache
     * First checks cache, then falls back to API if expired or not found
     * @param {boolean} [forceRefresh=false] - Force fetch from API, bypassing cache
     * @param {number} [currentTime=Date.now()] - Current timestamp for cache validation (injectable for testing)
     * @returns {Promise<Array<Object>>} List of hotels
     * @returns {string} returns[].id - Hotel ID (used in API queries)
     * @returns {string} returns[].name - Hotel display name
     * @returns {string} returns[].type - Hotel type ("Hotel" or "All")
     * @throws {Error} If API request fails
     * @example
     * // Get hotels (uses cache if valid)
     * const hotels = await apiClient.getHotels();
     * console.log(`Found ${hotels.length} hotels`);
     * 
     * // Force refresh from API
     * const freshHotels = await apiClient.getHotels(true);
     */
    async getHotels(forceRefresh = false, currentTime = Date.now()) {
        // Check persistent cache first (unless force refresh)
        if (!forceRefresh) {
            const cached = hotelCache.get(currentTime);
            if (cached) {
                return cached;
            }
        }
        
        // If cache miss or force refresh, fetch from API
        const url = buildHotelsUrl(this.apiBaseUrl);
        this.logger.log(`🏨 Fetching hotel list from API: ${url}`);
        
        const result = await this.fetchWithTimeout(url);
        
        // Save to persistent cache
        hotelCache.set(result.data, currentTime);
        
        this.logger.log(`✅ Retrieved ${result.data.length} hotels from API`);
        return result.data;
    }

    /**
     * Scrape hotel list from AFPESP website using Puppeteer
     * Returns all dropdown options including "Todas" (All hotels)
     * As of API v1.2.1, each item has a 'type' field
     * @returns {Promise<Array<Object>>} List of scraped hotels with type field
     * @returns {string} returns[].id - Hotel ID
     * @returns {string} returns[].name - Hotel name
     * @returns {string} returns[].type - "All" for "Todas", "Hotel" for actual hotels
     * @throws {Error} If scraping fails or times out
     * @example
     * const scrapedHotels = await apiClient.scrapeHotels();
     * const allOption = scrapedHotels.find(h => h.type === 'All');
     * const actualHotels = scrapedHotels.filter(h => h.type === 'Hotel');
     * console.log(`Scraped ${actualHotels.length} hotels plus "All" option`);
     */
    async scrapeHotels() {
        const url = buildScrapeUrl(this.apiBaseUrl);
        this.logger.log(`🔍 Scraping hotel list: ${url}`);
        
        const result = await this.fetchWithTimeout(url, this.timeout.search);
        
        this.logger.log(`✅ Scraped ${result.data.length} options from AFPESP (includes "Todas")`);
        return result.data;
    }

    /**
     * Search for vacancies between two dates using Puppeteer
     * Performs automated browser search on AFPESP website
     * @param {Date|string} checkinDate - Check-in date (Date object or ISO string YYYY-MM-DD)
     * @param {Date|string} checkoutDate - Check-out date (Date object or ISO string YYYY-MM-DD)
     * @param {string} [hotel='-1'] - Hotel filter: '-1' for all hotels, or specific hotel ID
     * @returns {Promise<Object>} Vacancy search results
     * @returns {boolean} returns.success - Whether search completed successfully
     * @returns {boolean} returns.hasAvailability - Whether vacancies were found
     * @returns {string} returns.date - Search date timestamp
     * @returns {Object} returns.result - Detailed search results
     * @returns {string} returns.result.status - Search status message
     * @throws {Error} If search fails, times out, or dates are invalid
     * @example
     * // Search all hotels for specific dates
     * const results = await apiClient.searchVacancies(
     *   new Date('2024-12-25'),
     *   new Date('2024-12-27'),
     *   '-1'
     * );
     * 
     * if (results.hasAvailability) {
     *   console.log('Vacancies found!');
     *   console.log(results.result);
     * }
     * 
     * @example
     * // Search specific hotel using ISO string dates
     * const results = await apiClient.searchVacancies(
     *   '2024-12-25',
     *   '2024-12-27',
     *   'hotel123'
     * );
     */
    async searchVacancies(checkinDate, checkoutDate, hotel = '-1') {
        // Convert dates to ISO format if needed (using pure helper)
        const checkin = ensureISOFormat(checkinDate);
        const checkout = ensureISOFormat(checkoutDate);
        
        // Build URL using pure helper
        const url = buildSearchUrl(this.apiBaseUrl, hotel, checkin, checkout);
        this.logger.log(`🔍 Searching vacancies: ${url}`);
        this.logger.log(`📅 Check-in: ${checkin}, Check-out: ${checkout}, Hotel: ${hotel}`);
        
        const result = await this.fetchWithTimeout(url, this.timeout.search);
        
        // According to DATA_FLOW_DOCUMENTATION.md:
        // Response: { success, method, headlessMode, resourceSavings, hotelFilter, data: { success, date, hasAvailability, result } }
        const { data } = result;
        this.logger.log(`✅ Search completed:`);
        this.logger.log(`   - Method: ${result.method || 'N/A'}`);
        this.logger.log(`   - Has availability: ${data.hasAvailability ? 'YES' : 'NO'}`);
        this.logger.log(`   - Status: ${data.result?.status || 'N/A'}`);
        
        return data;
    }

    /**
     * Search for weekend vacancies using Puppeteer
     * Searches multiple consecutive weekends for availability
     * NOTE: This is a long-running operation (up to 10 minutes for 12 weekends)
     * @param {number} [count=8] - Number of weekends to search (1-12, default 8)
     * @returns {Promise<Object>} Weekend search results
     * @returns {boolean} returns.success - Whether search completed successfully
     * @returns {Object} returns.searchDetails - Search metadata
     * @returns {number} returns.searchDetails.totalWeekendsSearched - Number of weekends searched
     * @returns {Object} returns.availability - Availability summary
     * @returns {number} returns.availability.weekendsWithVacancies - Count of weekends with available rooms
     * @returns {Array<Object>} returns.weekends - Detailed results per weekend
     * @throws {Error} If count is invalid (not 1-12) or search fails
     * @example
     * // Search next 8 weekends (default)
     * const results = await apiClient.searchWeekendVacancies();
     * console.log(`Found vacancies in ${results.availability.weekendsWithVacancies} weekends`);
     * 
     * @example
     * // Search next 12 weekends (maximum)
     * console.log('Starting weekend search (this may take up to 10 minutes)...');
     * const results = await apiClient.searchWeekendVacancies(12);
     * results.weekends.forEach(weekend => {
     *   if (weekend.hasAvailability) {
     *     console.log(`Vacancy: ${weekend.checkin} to ${weekend.checkout}`);
     *   }
     * });
     */
    async searchWeekendVacancies(count = 8) {
        // Validate using pure helper function
        const error = getWeekendCountError(count);
        if (error) {
            throw new Error(error);
        }
        
        // Build URL using pure helper
        const url = buildWeekendSearchUrl(this.apiBaseUrl, count);
        this.logger.log(`🔍 Searching ${count} weekend(s): ${url}`);
        this.logger.log(`⏳ This may take several minutes (up to 10 minutes)...`);
        
        const result = await this.fetchWithTimeout(url, this.timeout.weekendSearch);
        
        const { data } = result;
        this.logger.log(`✅ Weekend search completed:`);
        this.logger.log(`   - Weekends searched: ${data.searchDetails?.totalWeekendsSearched || count}`);
        this.logger.log(`   - Weekends with vacancies: ${data.availability?.weekendsWithVacancies || 0}`);
        
        return data;
    }

    /**
     * Clear all caches (in-memory API cache and persistent hotel cache)
     * Useful for testing or when data needs to be refreshed
     * @example
     * // Clear all caches
     * apiClient.clearCache();
     * console.log('All caches cleared');
     */
    clearCache() {
        this.fetchManager.clearCache();
        hotelCache.clear();
        this.logger.log('🗑️ All caches cleared');
    }
    
    /**
     * Get cache statistics for debugging and monitoring
     * Combines hotel cache stats with ibira.js API cache stats
     * @param {number} [currentTime=Date.now()] - Current timestamp for cache validation (injectable for testing)
     * @returns {Object} Combined cache statistics
     * @returns {boolean} returns.exists - Whether hotel cache exists
     * @returns {number} [returns.count] - Number of cached hotels
     * @returns {number} [returns.age] - Hotel cache age in minutes
     * @returns {number} [returns.remaining] - Time remaining before expiration
     * @returns {boolean} [returns.expired] - Whether hotel cache is expired
     * @returns {number} [returns.size] - Hotel cache size in bytes
     * @returns {Object} returns.ibiraStats - ibira.js API cache statistics
     * @example
     * const stats = apiClient.getCacheStats();
     * console.log(`Hotel cache: ${stats.exists ? stats.count + ' hotels' : 'empty'}`);
     * console.log(`API cache: ${stats.ibiraStats.size} entries`);
     */
    getCacheStats(currentTime = Date.now()) {
        return {
            ...hotelCache.getStats(currentTime),
            ibiraStats: this.fetchManager.getStats()
        };
    }
    
    /**
     * Force refresh hotel list by bypassing cache
     * Convenience method for getHotels(true)
     * @param {number} [currentTime=Date.now()] - Current timestamp for cache (injectable for testing)
     * @returns {Promise<Array<Object>>} Fresh hotel list from API
     * @example
     * const freshHotels = await apiClient.refreshHotels();
     * console.log(`Refreshed ${freshHotels.length} hotels`);
     */
    async refreshHotels(currentTime = Date.now()) {
        this.logger.log('🔄 Forcing hotel list refresh...');
        return this.getHotels(true, currentTime);
    }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

/**
 * Singleton instance of BuscaVagasAPIClient with default configuration
 * Ready to use for all API operations throughout the application
 * 
 * For testing or custom configuration, import BuscaVagasAPIClient class instead
 * 
 * @type {BuscaVagasAPIClient}
 * @example
 * // Import and use singleton
 * import { apiClient } from './services/apiClient.js';
 * 
 * const hotels = await apiClient.getHotels();
 * const health = await apiClient.checkHealth();
 * 
 * @example
 * // For testing with custom config
 * import { BuscaVagasAPIClient } from './services/apiClient.js';
 * 
 * const testClient = new BuscaVagasAPIClient({
 *   logger: mockLogger,
 *   apiBaseUrl: 'http://test-api.local'
 * });
 */
export const apiClient = new BuscaVagasAPIClient();

// Export for backward compatibility
export default apiClient;
