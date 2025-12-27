/**
 * Skeleton Loader Module
 * Creates content-shaped placeholders during loading states
 * for better perceived performance
 * 
 * @module skeletonLoader
 */

import { logger } from '../services/logger.js';

const MODULE_NAME = 'SkeletonLoader';

/**
 * Creates a skeleton placeholder for hotel cards
 * @param {number} count - Number of skeleton cards to create
 * @returns {string} HTML string of skeleton cards
 */
export function createHotelCardsSkeleton(count = 3) {
    logger.debug(`Creating ${count} hotel card skeletons`, MODULE_NAME);
    
    const skeletons = [];
    for (let i = 0; i < count; i++) {
        skeletons.push(`
            <div class="skeleton-hotel-card" role="status" aria-label="Carregando informações do hotel">
                <div class="skeleton-hotel-card__header">
                    <div class="skeleton-hotel-card__title">
                        <div class="skeleton skeleton-text skeleton-text--title"></div>
                        <div class="skeleton skeleton-text skeleton-text--medium"></div>
                    </div>
                    <div class="skeleton skeleton-avatar"></div>
                </div>
                
                <div class="skeleton-hotel-card__badges">
                    <div class="skeleton skeleton-badge"></div>
                    <div class="skeleton skeleton-badge"></div>
                </div>
                
                <div class="skeleton-hotel-card__info">
                    <div class="skeleton-hotel-card__info-item">
                        <div class="skeleton skeleton-text skeleton-text--short"></div>
                        <div class="skeleton skeleton-text skeleton-text--medium"></div>
                    </div>
                    <div class="skeleton-hotel-card__info-item">
                        <div class="skeleton skeleton-text skeleton-text--short"></div>
                        <div class="skeleton skeleton-text skeleton-text--medium"></div>
                    </div>
                    <div class="skeleton-hotel-card__info-item">
                        <div class="skeleton skeleton-text skeleton-text--short"></div>
                        <div class="skeleton skeleton-text skeleton-text--medium"></div>
                    </div>
                    <div class="skeleton-hotel-card__info-item">
                        <div class="skeleton skeleton-text skeleton-text--short"></div>
                        <div class="skeleton skeleton-text skeleton-text--medium"></div>
                    </div>
                </div>
                
                <div class="skeleton-hotel-card__footer">
                    <div class="skeleton skeleton-button"></div>
                    <div class="skeleton skeleton-text skeleton-text--short"></div>
                </div>
                
                <span class="visually-hidden">Carregando dados do hotel...</span>
            </div>
        `);
    }
    
    return `<div class="skeleton-container">${skeletons.join('')}</div>`;
}

/**
 * Creates a skeleton placeholder for the results counter
 * @returns {string} HTML string of skeleton counter
 */
export function createCounterSkeleton() {
    logger.debug('Creating counter skeleton', MODULE_NAME);
    
    return `
        <div class="skeleton skeleton-counter" role="status" aria-label="Carregando contador">
            <span class="visually-hidden">Carregando contador de resultados...</span>
        </div>
    `;
}

/**
 * Shows skeleton loading state in results container
 * @param {HTMLElement} container - The container element
 * @param {number} cardCount - Number of skeleton cards to show
 */
export function showResultsSkeleton(container, cardCount = 3) {
    if (!container) {
        logger.warn('Container element not found for skeleton', MODULE_NAME);
        return;
    }
    
    logger.debug('Showing results skeleton', MODULE_NAME);
    
    // Find or create hotels-cards-container
    let cardsContainer = container.querySelector('#hotels-cards-container');
    if (!cardsContainer) {
        cardsContainer = container.querySelector('.hotels-cards-container');
    }
    
    if (cardsContainer) {
        cardsContainer.innerHTML = createHotelCardsSkeleton(cardCount);
        cardsContainer.setAttribute('aria-busy', 'true');
    }
    
    // Show skeleton in counter
    const counterElement = container.querySelector('#results-counter');
    if (counterElement) {
        counterElement.innerHTML = createCounterSkeleton();
        counterElement.setAttribute('aria-busy', 'true');
    }
}

/**
 * Hides skeleton loading state (called when real content is ready)
 * @param {HTMLElement} container - The container element
 */
export function hideResultsSkeleton(container) {
    if (!container) {
        logger.warn('Container element not found to hide skeleton', MODULE_NAME);
        return;
    }
    
    logger.debug('Hiding results skeleton', MODULE_NAME);
    
    // Remove aria-busy from containers
    const cardsContainer = container.querySelector('#hotels-cards-container') || 
                          container.querySelector('.hotels-cards-container');
    if (cardsContainer) {
        cardsContainer.setAttribute('aria-busy', 'false');
    }
    
    const counterElement = container.querySelector('#results-counter');
    if (counterElement) {
        counterElement.setAttribute('aria-busy', 'false');
    }
}

/**
 * Creates a skeleton placeholder for select options
 * @param {number} count - Number of skeleton options to create
 * @returns {string} HTML string of skeleton options
 */
export function createSelectOptionsSkeleton(count = 5) {
    logger.debug(`Creating ${count} select option skeletons`, MODULE_NAME);
    
    const skeletons = [];
    for (let i = 0; i < count; i++) {
        skeletons.push('<div class="skeleton skeleton-select-option"></div>');
    }
    
    return `
        <div class="skeleton-container" role="status" aria-label="Carregando opções">
            ${skeletons.join('')}
            <span class="visually-hidden">Carregando opções...</span>
        </div>
    `;
}

/**
 * Utility to wrap content with skeleton during async operation
 * @param {HTMLElement} container - The container element
 * @param {Function} asyncOperation - The async operation to perform
 * @param {Object} options - Options for skeleton display
 * @returns {Promise<*>} Result of the async operation
 */
export async function withSkeleton(container, asyncOperation, options = {}) {
    const {
        skeletonType = 'results', // 'results', 'counter', 'select'
        cardCount = 3,
        onError = null
    } = options;
    
    try {
        // Show skeleton
        if (skeletonType === 'results') {
            showResultsSkeleton(container, cardCount);
        }
        
        // Perform operation
        const result = await asyncOperation();
        
        // Hide skeleton
        if (skeletonType === 'results') {
            hideResultsSkeleton(container);
        }
        
        return result;
        
    } catch (error) {
        logger.error('Error during skeleton operation:', error, MODULE_NAME);
        
        // Hide skeleton on error
        if (skeletonType === 'results') {
            hideResultsSkeleton(container);
        }
        
        if (onError) {
            onError(error);
        }
        
        throw error;
    }
}

/**
 * Creates a generic skeleton text placeholder
 * @param {Object} options - Options for skeleton text
 * @returns {string} HTML string of skeleton text
 */
export function createSkeletonText(options = {}) {
    const {
        lines = 3,
        width = 'full', // 'short', 'medium', 'long', 'full'
        title = false
    } = options;
    
    const skeletons = [];
    
    if (title) {
        skeletons.push('<div class="skeleton skeleton-text skeleton-text--title"></div>');
    }
    
    for (let i = 0; i < lines; i++) {
        skeletons.push(`<div class="skeleton skeleton-text skeleton-text--${width}"></div>`);
    }
    
    return skeletons.join('');
}

// Export for testing
export const _internal = {
    MODULE_NAME
};

logger.info('Skeleton Loader module initialized', MODULE_NAME);
