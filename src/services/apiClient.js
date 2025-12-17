/**
 * API Client Service for Busca Vagas API
 * Based on official API documentation v1.2.1
 * @see https://github.com/mpbarbosa/busca_vagas/blob/main/docs/API_CLIENT_DOCUMENTATION.md
 * 
 * Uses ibira.js for API fetching and caching
 */

import { IbiraAPIFetchManager } from 'ibira.js';
import { getEnvironment } from '../config/environment.js';
import { hotelCache } from './hotelCache.js';

export class BuscaVagasAPIClient {
    constructor() {
        const env = getEnvironment();
        this.apiBaseUrl = env.API_BASE_URL || (env.isProduction 
            ? 'https://www.mpbarbosa.com/api'
            : 'http://localhost:3001/api');
        
        this.timeout = {
            default: 30000,      // 30 seconds
            search: 60000,       // 60 seconds for vacancy search
            weekendSearch: 600000 // 10 minutes for weekend search
        };
        
        // Initialize ibira.js API fetch manager
        this.fetchManager = new IbiraAPIFetchManager({
            maxCacheSize: 100,
            cacheExpiration: 5 * 60 * 1000, // 5 minutes
            maxRetries: 3,
            retryDelay: 1000,
            retryMultiplier: 2
        });
        
        console.log(`✅ BuscaVagasAPIClient initialized with base URL: ${this.apiBaseUrl}`);
        console.log(`✅ Using ibira.js for API fetching and caching`);
    }

    /**
     * Format date to ISO 8601 format (YYYY-MM-DD) as required by API
     * @param {Date} date - JavaScript Date object
     * @returns {string} ISO formatted date string
     */
    formatDateISO(date) {
        return date.toISOString().split('T')[0];
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
        const url = `${this.apiBaseUrl}/health`;
        console.log(`🏥 Checking API health: ${url}`);
        
        const result = await this.fetchWithTimeout(url, this.timeout.default);
        console.log(`✅ API Status: ${result.status}`);
        
        return result;
    }

    /**
     * Get static hotel list with persistent cache
     * @param {boolean} forceRefresh - Force fetch from API, bypassing cache
     * @returns {Promise<Array>} List of hotels
     */
    async getHotels(forceRefresh = false) {
        // Check persistent cache first (unless force refresh)
        if (!forceRefresh) {
            const cached = hotelCache.get();
            if (cached) {
                return cached;
            }
        }
        
        // If cache miss or force refresh, fetch from API
        const url = `${this.apiBaseUrl}/vagas/hoteis`;
        console.log(`🏨 Fetching hotel list from API: ${url}`);
        
        const result = await this.fetchWithTimeout(url);
        
        // Save to persistent cache
        hotelCache.set(result.data);
        
        console.log(`✅ Retrieved ${result.data.length} hotels from API`);
        return result.data;
    }

    /**
     * Scrape hotel list from AFPESP website
     * As of v1.2.1, this endpoint returns all dropdown options including "Todas"
     * Each item has a 'type' field: "All" for "Todas", "Hotel" for actual hotels
     * @returns {Promise<Array>} List of scraped hotels with type field
     */
    async scrapeHotels() {
        const url = `${this.apiBaseUrl}/vagas/hoteis/scrape`;
        console.log(`🔍 Scraping hotel list: ${url}`);
        
        const result = await this.fetchWithTimeout(url, this.timeout.search);
        
        console.log(`✅ Scraped ${result.data.length} options from AFPESP (includes "Todas")`);
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
        // Convert dates to ISO format if needed
        const checkin = checkinDate instanceof Date 
            ? this.formatDateISO(checkinDate) 
            : checkinDate;
        const checkout = checkoutDate instanceof Date 
            ? this.formatDateISO(checkoutDate) 
            : checkoutDate;
        
        const url = `${this.apiBaseUrl}/vagas/search?hotel=${hotel}&checkin=${checkin}&checkout=${checkout}`;
        console.log(`🔍 Searching vacancies: ${url}`);
        console.log(`📅 Check-in: ${checkin}, Check-out: ${checkout}, Hotel: ${hotel}`);
        
        const result = await this.fetchWithTimeout(url, this.timeout.search);
        
        // According to DATA_FLOW_DOCUMENTATION.md:
        // Response: { success, method, headlessMode, resourceSavings, hotelFilter, data: { success, date, hasAvailability, result } }
        const { data } = result;
        console.log(`✅ Search completed:`);
        console.log(`   - Method: ${result.method || 'N/A'}`);
        console.log(`   - Has availability: ${data.hasAvailability ? 'YES' : 'NO'}`);
        console.log(`   - Status: ${data.result?.status || 'N/A'}`);
        
        return data;
    }

    /**
     * Search for weekend vacancies (Puppeteer-based)
     * @param {number} count - Number of weekends to search (1-12, default 8)
     * @returns {Promise<object>} Weekend search results
     */
    async searchWeekendVacancies(count = 8) {
        if (count < 1 || count > 12) {
            throw new Error('Weekend count must be between 1 and 12');
        }
        
        const url = `${this.apiBaseUrl}/vagas/search/weekends?count=${count}`;
        console.log(`🔍 Searching ${count} weekend(s): ${url}`);
        console.log(`⏳ This may take several minutes (up to 10 minutes)...`);
        
        const result = await this.fetchWithTimeout(url, this.timeout.weekendSearch);
        
        const { data } = result;
        console.log(`✅ Weekend search completed:`);
        console.log(`   - Weekends searched: ${data.searchDetails?.totalWeekendsSearched || count}`);
        console.log(`   - Weekends with vacancies: ${data.availability?.weekendsWithVacancies || 0}`);
        
        return data;
    }

    /**
     * Clear all caches (in-memory and persistent)
     */
    clearCache() {
        this.fetchManager.clearCache();
        hotelCache.clear();
        console.log('🗑️ All caches cleared');
    }
    
    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            ...hotelCache.getStats(),
            ibiraStats: this.fetchManager.getStats()
        };
    }
    
    /**
     * Force refresh hotel list
     */
    async refreshHotels() {
        console.log('🔄 Forcing hotel list refresh...');
        return this.getHotels(true);
    }
}

// Create singleton instance
export const apiClient = new BuscaVagasAPIClient();

// Export for backward compatibility
export default apiClient;
