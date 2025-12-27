/**
 * Filter Chips Module
 * Displays active filters as removable chips above search results
 * Allows quick modification of search parameters
 * @version 2.2.0
 */

import { logger } from '../services/logger.js';
import { optimisticUI } from '../services/optimisticUI.js';

/**
 * Create Filter Chips Manager
 * @returns {Object} Public API for filter chips
 */
function createFilterChips() {
    let activeFilters = new Map();
    let containerElement = null;

    /**
     * Initialize the filter chips container
     */
    const initialize = () => {
        // Find or create chips container
        containerElement = document.getElementById('filter-chips-container');
        
        if (!containerElement) {
            logger.warn('Filter chips container not found in DOM');
            return false;
        }

        logger.debug('Filter chips initialized', 'FILTER_CHIPS');
        return true;
    };

    /**
     * Add a filter chip
     * @param {string} key - Unique filter identifier
     * @param {string} label - Display label
     * @param {string} value - Filter value
     * @param {Function} onRemove - Callback when chip is removed
     */
    const addChip = (key, label, value, onRemove) => {
        if (!containerElement) {
            logger.warn('Filter chips not initialized');
            return;
        }

        // Store filter
        activeFilters.set(key, { label, value, onRemove });
        
        // Render all chips
        renderChips();
        
        logger.debug(`Filter chip added: ${key}`, 'FILTER_CHIPS');
    };

    /**
     * Remove a filter chip
     * @param {string} key - Filter identifier to remove
     */
    const removeChip = (key) => {
        const filter = activeFilters.get(key);
        
        if (!filter) {
            return;
        }

        // Show optimistic feedback
        optimisticUI.showFeedback(`Removendo filtro: ${filter.label}`);

        // Remove from map
        activeFilters.delete(key);
        
        // Re-render chips
        renderChips();
        
        // Execute callback
        if (filter.onRemove && typeof filter.onRemove === 'function') {
            filter.onRemove();
        }
        
        logger.debug(`Filter chip removed: ${key}`, 'FILTER_CHIPS');
    };

    /**
     * Clear all filter chips
     */
    const clearAll = () => {
        if (activeFilters.size === 0) {
            return;
        }

        optimisticUI.showFeedback('Removendo todos os filtros');

        // Execute all remove callbacks
        activeFilters.forEach((filter) => {
            if (filter.onRemove && typeof filter.onRemove === 'function') {
                filter.onRemove();
            }
        });

        // Clear the map
        activeFilters.clear();
        
        // Re-render (should show empty state)
        renderChips();
        
        logger.debug('All filter chips cleared', 'FILTER_CHIPS');
    };

    /**
     * Update a filter chip's value
     * @param {string} key - Filter identifier
     * @param {string} newValue - New value
     */
    const updateChip = (key, newValue) => {
        const filter = activeFilters.get(key);
        
        if (!filter) {
            return;
        }

        filter.value = newValue;
        renderChips();
        
        logger.debug(`Filter chip updated: ${key}`, 'FILTER_CHIPS');
    };

    /**
     * Render all filter chips
     */
    const renderChips = () => {
        if (!containerElement) {
            return;
        }

        // Clear container
        containerElement.innerHTML = '';

        // If no filters, hide container
        if (activeFilters.size === 0) {
            containerElement.style.display = 'none';
            return;
        }

        // Show container
        containerElement.style.display = 'flex';

        // Create chips wrapper
        const chipsWrapper = document.createElement('div');
        chipsWrapper.className = 'filter-chips-wrapper';

        // Add label
        const label = document.createElement('span');
        label.className = 'filter-chips-label';
        label.textContent = 'Filtros ativos:';
        chipsWrapper.appendChild(label);

        // Add each chip
        activeFilters.forEach((filter, key) => {
            const chip = createChipElement(key, filter.label, filter.value);
            chipsWrapper.appendChild(chip);
        });

        containerElement.appendChild(chipsWrapper);

        // Add "Clear All" button if multiple filters
        if (activeFilters.size > 1) {
            const clearAllBtn = document.createElement('button');
            clearAllBtn.type = 'button';
            clearAllBtn.className = 'filter-chips-clear-all';
            clearAllBtn.innerHTML = '<i class="bi bi-x-circle"></i> Limpar Todos';
            clearAllBtn.setAttribute('aria-label', 'Remover todos os filtros');
            clearAllBtn.addEventListener('click', clearAll);
            containerElement.appendChild(clearAllBtn);
        }
    };

    /**
     * Create a single chip element
     * @param {string} key - Filter identifier
     * @param {string} label - Display label
     * @param {string} value - Filter value
     * @returns {HTMLElement} Chip element
     */
    const createChipElement = (key, label, value) => {
        const chip = document.createElement('div');
        chip.className = 'filter-chip';
        chip.setAttribute('role', 'group');
        chip.setAttribute('aria-label', `Filtro: ${label} ${value}`);

        // Chip content
        const content = document.createElement('span');
        content.className = 'filter-chip-content';
        content.innerHTML = `
            <strong>${label}:</strong> ${value}
        `;

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'filter-chip-remove';
        removeBtn.innerHTML = '<i class="bi bi-x"></i>';
        removeBtn.setAttribute('aria-label', `Remover filtro: ${label}`);
        removeBtn.addEventListener('click', () => removeChip(key));

        chip.appendChild(content);
        chip.appendChild(removeBtn);

        return chip;
    };

    /**
     * Get current active filters
     * @returns {Map} Active filters map
     */
    const getActiveFilters = () => {
        return new Map(activeFilters);
    };

    /**
     * Check if a filter is active
     * @param {string} key - Filter identifier
     * @returns {boolean} True if filter is active
     */
    const hasFilter = (key) => {
        return activeFilters.has(key);
    };

    // Public API
    return {
        initialize,
        addChip,
        removeChip,
        updateChip,
        clearAll,
        getActiveFilters,
        hasFilter
    };
}

// Create singleton instance
export const filterChips = createFilterChips();
