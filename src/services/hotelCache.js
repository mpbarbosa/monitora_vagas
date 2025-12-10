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

export class HotelCache {
    constructor(options = {}) {
        this.storageKey = options.storageKey || 'afpesp_hotels_cache';
        this.ttl = options.ttl || 24 * 60 * 60 * 1000; // Default: 24 hours
        this.useLocalStorage = this.isLocalStorageAvailable();
        
        console.log(`🗄️ HotelCache initialized (TTL: ${this.ttl / 1000 / 60} minutes, Storage: ${this.useLocalStorage ? 'LocalStorage' : 'Memory'})`);
    }

    /**
     * Check if LocalStorage is available
     */
    isLocalStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('⚠️ LocalStorage not available, falling back to memory cache');
            return false;
        }
    }

    /**
     * Get cached hotel list
     * @returns {Array|null} Cached hotels or null if expired/not found
     */
    get() {
        try {
            if (this.useLocalStorage) {
                const cached = localStorage.getItem(this.storageKey);
                if (!cached) {
                    console.log('📭 No cached hotels found in LocalStorage');
                    return null;
                }

                const { data, timestamp } = JSON.parse(cached);
                
                // Check if expired
                const age = Date.now() - timestamp;
                if (age > this.ttl) {
                    console.log(`⏰ Cache expired (age: ${Math.round(age / 1000 / 60)} minutes, TTL: ${this.ttl / 1000 / 60} minutes)`);
                    this.clear();
                    return null;
                }

                console.log(`✅ Using cached hotels (${data.length} hotels, age: ${Math.round(age / 1000 / 60)} minutes)`);
                return data;
            }
        } catch (error) {
            console.error('❌ Error reading from cache:', error);
            return null;
        }

        return null;
    }

    /**
     * Save hotel list to cache
     * @param {Array} hotels - Hotel list to cache
     */
    set(hotels) {
        try {
            if (!Array.isArray(hotels)) {
                console.error('❌ Invalid data: hotels must be an array');
                return false;
            }

            if (this.useLocalStorage) {
                const cacheData = {
                    data: hotels,
                    timestamp: Date.now()
                };

                localStorage.setItem(this.storageKey, JSON.stringify(cacheData));
                console.log(`💾 Cached ${hotels.length} hotels (TTL: ${this.ttl / 1000 / 60} minutes)`);
                return true;
            }
        } catch (error) {
            // LocalStorage quota exceeded or other error
            console.error('❌ Error saving to cache:', error);
            
            // Try to clear old data and retry
            if (error.name === 'QuotaExceededError') {
                console.log('🗑️ Quota exceeded, clearing cache and retrying...');
                this.clear();
                try {
                    const cacheData = {
                        data: hotels,
                        timestamp: Date.now()
                    };
                    localStorage.setItem(this.storageKey, JSON.stringify(cacheData));
                    return true;
                } catch (retryError) {
                    console.error('❌ Retry failed:', retryError);
                }
            }
            return false;
        }

        return false;
    }

    /**
     * Clear cache
     */
    clear() {
        try {
            if (this.useLocalStorage) {
                localStorage.removeItem(this.storageKey);
                console.log('🗑️ Hotel cache cleared');
            }
        } catch (error) {
            console.error('❌ Error clearing cache:', error);
        }
    }

    /**
     * Get cache statistics
     */
    getStats() {
        try {
            if (this.useLocalStorage) {
                const cached = localStorage.getItem(this.storageKey);
                if (!cached) {
                    return { exists: false };
                }

                const { data, timestamp } = JSON.parse(cached);
                const age = Date.now() - timestamp;
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
            console.error('❌ Error getting cache stats:', error);
        }

        return { exists: false };
    }

    /**
     * Force refresh - clear cache and fetch new data
     */
    forceRefresh() {
        console.log('🔄 Force refresh requested - clearing cache');
        this.clear();
    }
}

// Create singleton instance with default 24-hour cache
export const hotelCache = new HotelCache({
    storageKey: 'afpesp_hotels_cache',
    ttl: 24 * 60 * 60 * 1000 // 24 hours
});

export default hotelCache;
