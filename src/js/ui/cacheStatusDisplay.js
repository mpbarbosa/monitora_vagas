/**
 * Cache Status Display Module
 * Handles cache status visualization via Bootstrap tooltips
 * Extracted from hotelSearch.js for better modularity and reusability
 * @version 1.0.0
 */

import { logger } from '../../services/logger.js';

/**
 * Update cache status display as Bootstrap tooltip
 * Shows cache age, expiration time, and status
 * @param {Object} cacheStats - Cache statistics object
 * @param {boolean} cacheStats.exists - Whether cache exists
 * @param {boolean} cacheStats.expired - Whether cache is expired
 * @param {number} cacheStats.count - Number of cached items
 * @param {number} cacheStats.age - Cache age in minutes
 * @param {number} cacheStats.remaining - Minutes until expiration
 * @param {string} elementId - ID of DOM element to attach tooltip to
 */
export function updateCacheStatus(cacheStats, elementId = 'hotel-select') {
    const element = document.getElementById(elementId);
    
    if (!element) {
        logger.warn(`Cache status element '${elementId}' not found`, 'CacheStatusDisplay');
        return;
    }

    // Get or create tooltip instance
    let tooltip = bootstrap.Tooltip.getInstance(element);
    
    if (cacheStats.exists && !cacheStats.expired) {
        // Cache is valid - show status
        const tooltipText = `📦 Cached ${cacheStats.count} hotels (${cacheStats.age} min ago, expires in ${cacheStats.remaining} min)`;
        element.setAttribute('data-bs-title', tooltipText);
        
        // Reinitialize tooltip if exists, otherwise create new one
        if (tooltip) {
            tooltip.dispose();
        }
        tooltip = new bootstrap.Tooltip(element, {
            trigger: 'hover focus',
            placement: 'bottom'
        });
        
        logger.debug(`Cache status updated: ${cacheStats.count} items, ${cacheStats.remaining} min remaining`, 'CacheStatusDisplay');
        
    } else if (cacheStats.exists && cacheStats.expired) {
        // Cache expired - show warning
        const tooltipText = `⏰ Cache expired, fetching fresh data...`;
        element.setAttribute('data-bs-title', tooltipText);
        
        if (tooltip) {
            tooltip.dispose();
        }
        tooltip = new bootstrap.Tooltip(element, {
            trigger: 'hover focus',
            placement: 'bottom'
        });
        
        logger.debug('Cache expired, tooltip updated', 'CacheStatusDisplay');
        
    } else {
        // No cache - remove tooltip
        if (tooltip) {
            tooltip.dispose();
        }
        element.removeAttribute('data-bs-title');
        
        logger.debug('No cache, tooltip removed', 'CacheStatusDisplay');
    }
}

/**
 * Create cache status tooltip with custom configuration
 * @param {string} elementId - ID of DOM element
 * @param {string} message - Tooltip message
 * @param {Object} options - Bootstrap tooltip options
 * @returns {bootstrap.Tooltip|null} Tooltip instance or null if element not found
 */
export function createCacheTooltip(elementId, message, options = {}) {
    const element = document.getElementById(elementId);
    
    if (!element) {
        logger.warn(`Cannot create tooltip: element '${elementId}' not found`, 'CacheStatusDisplay');
        return null;
    }
    
    // Dispose existing tooltip
    const existingTooltip = bootstrap.Tooltip.getInstance(element);
    if (existingTooltip) {
        existingTooltip.dispose();
    }
    
    // Set tooltip text
    element.setAttribute('data-bs-title', message);
    
    // Create new tooltip with merged options
    const defaultOptions = {
        trigger: 'hover focus',
        placement: 'bottom'
    };
    
    const tooltip = new bootstrap.Tooltip(element, { ...defaultOptions, ...options });
    
    logger.debug(`Tooltip created for '${elementId}'`, 'CacheStatusDisplay');
    
    return tooltip;
}

/**
 * Remove cache status tooltip from element
 * @param {string} elementId - ID of DOM element
 */
export function removeCacheTooltip(elementId) {
    const element = document.getElementById(elementId);
    
    if (!element) {
        return;
    }
    
    const tooltip = bootstrap.Tooltip.getInstance(element);
    if (tooltip) {
        tooltip.dispose();
        logger.debug(`Tooltip removed from '${elementId}'`, 'CacheStatusDisplay');
    }
    
    element.removeAttribute('data-bs-title');
}

/**
 * Format cache statistics for display
 * Pure function - formats cache stats into human-readable text
 * @param {Object} stats - Cache statistics
 * @returns {string} Formatted cache status text
 */
export function formatCacheStatus(stats) {
    if (!stats.exists) {
        return 'No cache available';
    }
    
    if (stats.expired) {
        return `Cache expired (${stats.age} min old)`;
    }
    
    return `📦 ${stats.count} items cached • ${stats.age} min old • ${stats.remaining} min remaining`;
}

/**
 * Get cache status icon based on state
 * Pure function - returns appropriate emoji icon
 * @param {Object} stats - Cache statistics
 * @returns {string} Icon emoji
 */
export function getCacheStatusIcon(stats) {
    if (!stats.exists) {
        return '❌';
    }
    
    if (stats.expired) {
        return '⏰';
    }
    
    return '📦';
}

// Export default object with all functions
export default {
    updateCacheStatus,
    createCacheTooltip,
    removeCacheTooltip,
    formatCacheStatus,
    getCacheStatusIcon
};

logger.info('Cache Status Display module loaded', 'CacheStatusDisplay');
