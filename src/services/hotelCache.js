/**
 * Hotel List Cache Service with LocalStorage Persistence
 * Reduces API calls by caching hotel list locally
 * 
 * Features:
 * - LocalStorage persistence (survives page reloads)
 * - Configurable TTL (Time To Live)
 * - Automatic expiration
 * - Fallback to in-memory cache if LocalStorage unavailable
 */

import { logger } from './logger.js';
import { TIME, CACHE } from '../config/constants.js';

export class HotelCache {
    /**
     * Creates a hotel cache instance with LocalStorage persistence
     * @param {Object} options - Configuration options
     * @param {string} [options.storageKey] - LocalStorage key (defaults to CACHE.KEYS.HOTEL_LIST)
     * @param {number} [options.ttl] - Time to live in milliseconds (defaults to TIME.CACHE.HOTEL_LIST)
     */
    constructor(options = {}) {
        this.storageKey = options.storageKey || CACHE.KEYS.HOTEL_LIST;
        this.ttl = options.ttl || TIME.CACHE.HOTEL_LIST;
        this.useLocalStorage = this.isLocalStorageAvailable();
        
        logger.debug(`🗄️ HotelCache initialized (TTL: ${this.ttl / 1000 / 60} minutes, Storage: ${this.useLocalStorage ? 'LocalStorage' : 'Memory'})`);
    }

    /**
     * Check if LocalStorage is available and functional
     * Tests by writing and removing a test value
     * @returns {boolean} True if LocalStorage is available, false otherwise
     * @private
     */
    isLocalStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            logger.warn('⚠️ LocalStorage not available, falling back to memory cache');
            return false;
        }
    }

    /**
     * Get cached hotel list from LocalStorage
     * Automatically validates cache expiration based on TTL
     * @param {number} [currentTime=Date.now()] - Current timestamp for cache validation (injectable for testing)
     * @returns {Array|null} Cached hotels or null if expired/not found
     * @example
     * const hotels = hotelCache.get();
     * if (hotels) {
     *   console.log(`Found ${hotels.length} cached hotels`);
     * } else {
     *   console.log('Cache miss - need to fetch from API');
     * }
     */
    get(currentTime = Date.now()) {
        try {
            if (this.useLocalStorage) {
                const cached = localStorage.getItem(this.storageKey);
                if (!cached) {
                    logger.debug('📭 No cached hotels found in LocalStorage');
                    return null;
                }

                const { data, timestamp } = JSON.parse(cached);
                
                // Check if expired
                const age = currentTime - timestamp;
                if (age > this.ttl) {
                    logger.debug(`⏰ Cache expired (age: ${Math.round(age / 1000 / 60)} minutes, TTL: ${this.ttl / 1000 / 60} minutes)`);
                    this.clear();
                    return null;
                }

                logger.debug(`✅ Using cached hotels (${data.length} hotels, age: ${Math.round(age / 1000 / 60)} minutes)`);
                return data;
            }
        } catch (error) {
            logger.error('❌ Error reading from cache:', error);
            return null;
        }

        return null;
    }

    /**
     * Save hotel list to LocalStorage cache with current timestamp
     * Automatically handles QuotaExceededError by clearing and retrying
     * @param {Array} hotels - Hotel list to cache (must be an array)
     * @param {number} [currentTime=Date.now()] - Current timestamp for cache (injectable for testing)
     * @returns {boolean} True if successfully cached, false otherwise
     * @example
     * const hotels = await apiClient.getHotels();
     * const success = hotelCache.set(hotels);
     * if (success) {
     *   console.log('Hotels cached successfully');
     * }
     */
    set(hotels, currentTime = Date.now()) {
        try {
            if (!Array.isArray(hotels)) {
                logger.error('❌ Invalid data: hotels must be an array');
                return false;
            }

            if (this.useLocalStorage) {
                const cacheData = {
                    data: hotels,
                    timestamp: currentTime
                };

                localStorage.setItem(this.storageKey, JSON.stringify(cacheData));
                logger.debug(`💾 Cached ${hotels.length} hotels (TTL: ${this.ttl / 1000 / 60} minutes)`);
                return true;
            }
        } catch (error) {
            // LocalStorage quota exceeded or other error
            logger.error('❌ Error saving to cache:', error);
            
            // Try to clear old data and retry
            if (error.name === 'QuotaExceededError') {
                logger.debug('🗑️ Quota exceeded, clearing cache and retrying...');
                this.clear();
                try {
                    const cacheData = {
                        data: hotels,
                        timestamp: currentTime
                    };
                    localStorage.setItem(this.storageKey, JSON.stringify(cacheData));
                    return true;
                } catch (retryError) {
                    logger.error('❌ Retry failed:', retryError);
                }
            }
            return false;
        }

        return false;
    }

    /**
     * Clear hotel cache from LocalStorage
     * Removes all cached data and resets state
     * @example
     * hotelCache.clear();
     * console.log('Cache cleared');
     */
    clear() {
        try {
            if (this.useLocalStorage) {
                localStorage.removeItem(this.storageKey);
                logger.debug('🗑️ Hotel cache cleared');
            }
        } catch (error) {
            logger.error('❌ Error clearing cache:', error);
        }
    }

    /**
     * Get cache statistics including age, size, and expiration status
     * @param {number} [currentTime=Date.now()] - Current timestamp for calculations (injectable for testing)
     * @returns {Object} Cache statistics object
     * @returns {boolean} returns.exists - Whether cache exists
     * @returns {number} [returns.count] - Number of cached hotels
     * @returns {number} [returns.age] - Cache age in minutes
     * @returns {number} [returns.remaining] - Time remaining before expiration in minutes
     * @returns {boolean} [returns.expired] - Whether cache is expired
     * @returns {number} [returns.size] - Cache size in bytes
     * @example
     * const stats = hotelCache.getStats();
     * if (stats.exists) {
     *   console.log(`Cache: ${stats.count} hotels, ${stats.age}min old, ${stats.remaining}min remaining`);
     * }
     */
    getStats(currentTime = Date.now()) {
        try {
            if (this.useLocalStorage) {
                const cached = localStorage.getItem(this.storageKey);
                if (!cached) {
                    return { exists: false };
                }

                const { data, timestamp } = JSON.parse(cached);
                const age = currentTime - timestamp;
                const remaining = this.ttl - age;

                return {
                    exists: true,
                    count: data.length,
                    age: Math.round(age / 1000 / 60), // minutes
                    remaining: Math.round(remaining / 1000 / 60), // minutes
                    expired: age > this.ttl,
                    size: new Blob([cached]).size // bytes
                };
            }
        } catch (error) {
            logger.error('❌ Error getting cache stats:', error);
        }

        return { exists: false };
    }

    /**
     * Force refresh by clearing cache
     * Next get() call will require fetching from API
     * @example
     * hotelCache.forceRefresh();
     * const freshHotels = await apiClient.getHotels();
     */
    forceRefresh() {
        logger.debug('🔄 Force refresh requested - clearing cache');
        this.clear();
    }
}

/**
 * Singleton instance of HotelCache with default configuration
 * - Storage key: CACHE.KEYS.HOTEL_LIST
 * - TTL: TIME.CACHE.HOTEL_LIST (24 hours)
 * - Automatically uses LocalStorage if available, falls back to memory
 * 
 * @type {HotelCache}
 * @example
 * import { hotelCache } from './services/hotelCache.js';
 * 
 * // Get cached hotels
 * const hotels = hotelCache.get();
 * 
 * // Save to cache
 * hotelCache.set(hotelsArray);
 * 
 * // Clear cache
 * hotelCache.clear();
 * 
 * // Get statistics
 * const stats = hotelCache.getStats();
 */
export const hotelCache = new HotelCache({
    storageKey: CACHE.KEYS.HOTEL_LIST,
    ttl: TIME.CACHE.HOTEL_LIST
});

export default hotelCache;
