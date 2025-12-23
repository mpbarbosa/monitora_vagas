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

export class BuscaVagasAPIClient {
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
     * @param {string} url - Full URL to fetch
     * @param {number} timeoutMs - Timeout in milliseconds
     * @returns {Promise<object>} API response
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
     * @returns {Promise<object>} Health check response
     */
    async checkHealth() {
        const url = buildHealthUrl(this.apiBaseUrl);
        this.logger.log(`🏥 Checking API health: ${url}`);
        
        const result = await this.fetchWithTimeout(url, this.timeout.default);
        this.logger.log(`✅ API Status: ${result.status}`);
        
        return result;
    }

    /**
     * Get static hotel list with persistent cache
     * @param {boolean} forceRefresh - Force fetch from API, bypassing cache
     * @param {number} currentTime - Current timestamp for cache validation (optional)
     * @returns {Promise<Array>} List of hotels
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
     * Scrape hotel list from AFPESP website
     * As of v1.2.1, this endpoint returns all dropdown options including "Todas"
     * Each item has a 'type' field: "All" for "Todas", "Hotel" for actual hotels
     * @returns {Promise<Array>} List of scraped hotels with type field
     */
    async scrapeHotels() {
        const url = buildScrapeUrl(this.apiBaseUrl);
        this.logger.log(`🔍 Scraping hotel list: ${url}`);
        
        const result = await this.fetchWithTimeout(url, this.timeout.search);
        
        this.logger.log(`✅ Scraped ${result.data.length} options from AFPESP (includes "Todas")`);
        return result.data;
    }

    /**
     * Search for vacancies between two dates (Puppeteer-based)
     * @param {Date|string} checkinDate - Check-in date
     * @param {Date|string} checkoutDate - Check-out date
     * @param {string} hotel - Hotel filter (default: '-1' for all hotels)
     * @returns {Promise<object>} Vacancy search results
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
     * Search for weekend vacancies (Puppeteer-based)
     * @param {number} count - Number of weekends to search (1-12, default 8)
     * @returns {Promise<object>} Weekend search results
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
     * Clear all caches (in-memory and persistent)
     */
    clearCache() {
        this.fetchManager.clearCache();
        hotelCache.clear();
        this.logger.log('🗑️ All caches cleared');
    }
    
    /**
     * Get cache statistics
     * @param {number} currentTime - Current timestamp for cache validation (optional)
     * @returns {object} Cache statistics
     */
    getCacheStats(currentTime = Date.now()) {
        return {
            ...hotelCache.getStats(currentTime),
            ibiraStats: this.fetchManager.getStats()
        };
    }
    
    /**
     * Force refresh hotel list
     * @param {number} currentTime - Current timestamp for cache (optional)
     * @returns {Promise<Array>} Fresh hotel list
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
 * Create singleton instance with default configuration
 * Can be overridden for testing by importing the class directly
 */
export const apiClient = new BuscaVagasAPIClient();

// Export for backward compatibility
export default apiClient;
