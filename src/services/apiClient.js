/**
 * API Client Service for Busca Vagas API
 * Based on official API documentation v1.2.1
 * @see https://github.com/mpbarbosa/busca_vagas/blob/main/docs/API_CLIENT_DOCUMENTATION.md
 */

import { getEnvironment } from '../config/environment.js';

export class BuscaVagasAPIClient {
    constructor() {
        const env = getEnvironment();
        this.apiBaseUrl = env.isProduction 
            ? 'https://www.mpbarbosa.com/api'
            : 'http://localhost:3000/api';
        
        this.timeout = {
            default: 30000,      // 30 seconds
            search: 60000,       // 60 seconds for vacancy search
            weekendSearch: 600000 // 10 minutes for weekend search
        };
        
        this.cache = new Map();
        this.cacheDuration = 5 * 60 * 1000; // 5 minutes
        
        console.log(`✅ BuscaVagasAPIClient initialized with base URL: ${this.apiBaseUrl}`);
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
     * Generic fetch wrapper with timeout and error handling
     * @param {string} url - Full URL to fetch
     * @param {object} options - Fetch options
     * @param {number} timeoutMs - Timeout in milliseconds
     * @returns {Promise<object>} API response
     */
    async fetchWithTimeout(url, options = {}, timeoutMs = this.timeout.default) {
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
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            // API returns { success: boolean, data: {...}, error?: string }
            if (result.success === false) {
                throw new Error(result.error || 'API returned error without message');
            }
            
            return result;
            
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - please try again');
            }
            
            throw error;
        }
    }

    /**
     * Retry fetch with exponential backoff
     * @param {Function} fetchFn - Function that returns a fetch promise
     * @param {number} maxRetries - Maximum number of retry attempts
     * @returns {Promise<object>} API response
     */
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
                console.log(`⚠️ Retry attempt ${attempt + 1}/${maxRetries} after ${waitTime}ms...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
    }

    /**
     * Check API health status
     * @returns {Promise<object>} Health check response
     */
    async checkHealth() {
        const url = `${this.apiBaseUrl}/health`;
        console.log(`🏥 Checking API health: ${url}`);
        
        const result = await this.fetchWithTimeout(url);
        console.log(`✅ API Status: ${result.status}`);
        
        return result;
    }

    /**
     * Get static hotel list
     * @returns {Promise<Array>} List of hotels
     */
    async getHotels() {
        const cacheKey = 'hotels';
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
            console.log('📦 Returning cached hotel list');
            return cached.data;
        }
        
        const url = `${this.apiBaseUrl}/vagas/hoteis`;
        console.log(`🏨 Fetching hotel list: ${url}`);
        
        const result = await this.fetchWithTimeout(url);
        
        this.cache.set(cacheKey, {
            data: result.data,
            timestamp: Date.now()
        });
        
        console.log(`✅ Retrieved ${result.data.length} hotels`);
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
        
        const result = await this.fetchWithRetry(
            () => this.fetchWithTimeout(url, {}, this.timeout.search)
        );
        
        console.log(`✅ Scraped ${result.data.length} options from AFPESP (includes "Todas")`);
        return result.data;
    }

    /**
     * Search for vacancies between two dates (Puppeteer-based)
     * @param {Date|string} checkinDate - Check-in date
     * @param {Date|string} checkoutDate - Check-out date
     * @returns {Promise<object>} Vacancy search results
     */
    async searchVacancies(checkinDate, checkoutDate) {
        // Convert dates to ISO format if needed
        const checkin = checkinDate instanceof Date 
            ? this.formatDateISO(checkinDate) 
            : checkinDate;
        const checkout = checkoutDate instanceof Date 
            ? this.formatDateISO(checkoutDate) 
            : checkoutDate;
        
        const url = `${this.apiBaseUrl}/vagas/search?checkin=${checkin}&checkout=${checkout}`;
        console.log(`🔍 Searching vacancies: ${url}`);
        console.log(`📅 Check-in: ${checkin}, Check-out: ${checkout}`);
        
        const result = await this.fetchWithRetry(
            () => this.fetchWithTimeout(url, {}, this.timeout.search)
        );
        
        const { data } = result;
        console.log(`✅ Search completed:`);
        console.log(`   - Hotels searched: ${data.searchDetails?.totalHotelsSearched || 'N/A'}`);
        console.log(`   - Vacancies found: ${data.searchDetails?.totalVacanciesFound || 0}`);
        console.log(`   - Has availability: ${data.availability?.hasVacancies ? 'YES' : 'NO'}`);
        
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
        
        const result = await this.fetchWithRetry(
            () => this.fetchWithTimeout(url, {}, this.timeout.weekendSearch)
        );
        
        const { data } = result;
        console.log(`✅ Weekend search completed:`);
        console.log(`   - Weekends searched: ${data.searchDetails?.totalWeekendsSearched || count}`);
        console.log(`   - Weekends with vacancies: ${data.availability?.weekendsWithVacancies || 0}`);
        
        return data;
    }

    /**
     * Clear the cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache cleared');
    }
}

// Create singleton instance
export const apiClient = new BuscaVagasAPIClient();

// Export for backward compatibility
export default apiClient;
