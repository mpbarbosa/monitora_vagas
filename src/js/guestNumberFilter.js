// Guest Number Filter Module (FR-004B)
// Client-side filtering of hotel vacancy results based on guest count
// Refactored to functional programming pattern with closures

import { logger } from '../services/logger.js';
import { optimisticUI } from '../services/optimisticUI.js';
import { filterChips } from './filterChips.js';

/**
 * Create Guest Number Filter using closure pattern (no 'this')
 * @returns {Object} Public API for guest number filtering
 */
function createGuestNumberFilter() {
    // Private state (closure variables)
    let currentGuestCount = 2;
    let totalHotels = 0;
    let visibleHotels = 0;
    
    /**
     * Parse capacity from vacancy text
     * Pattern: "até N pessoas" or "até N pessoa"
     * @param {string} text - Vacancy text to parse
     * @returns {number|null} - Extracted capacity or null if not found
     */
    const parseCapacity = (text) => {
        // Regex: matches "até N pessoas" (case-insensitive, accent-optional)
        // Supports: até, Até, ATE, ate
        const regex = /at[eé]\s+(\d+)\s+pessoas?/i;
        const match = text.match(regex);
        
        if (match && match[1]) {
            const capacity = parseInt(match[1], 10);
            // Validate capacity is a positive number
            return (capacity > 0) ? capacity : null;
        }
        
        return null;
    };
    
    /**
     * Update results counter display
     */
    const updateCounter = () => {
        const counter = document.getElementById('results-counter');
        if (counter) {
            if (visibleHotels < totalHotels) {
                counter.style.display = 'block';
                counter.innerHTML = `
                    Mostrando <strong>${visibleHotels}</strong> de <strong>${totalHotels}</strong> hotéis 
                    para <strong>${currentGuestCount}</strong> ${currentGuestCount === 1 ? 'hóspede' : 'hóspedes'}
                `;
            } else {
                counter.style.display = 'none';
            }
        }
    };
    
    /**
     * Hide "no results" message
     */
    const hideNoResultsMessage = () => {
        const noResultsMsg = document.getElementById('no-results-filter-message');
        if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    };
    
    /**
     * Show "no results" message when all cards are filtered out
     */
    const showNoResultsMessage = () => {
        const container = document.getElementById('hotels-cards-container');
        
        // Check if message already exists
        let noResultsMsg = document.getElementById('no-results-filter-message');
        
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'no-results-filter-message';
            noResultsMsg.className = 'no-results-filter-message';
            noResultsMsg.innerHTML = `
                <div class="no-results-filter-icon">🔍</div>
                <h4 class="no-results-filter-title">
                    Sem vagas disponíveis para ${currentGuestCount} ${currentGuestCount === 1 ? 'hóspede' : 'hóspedes'}
                </h4>
                <p class="no-results-filter-description">
                    Tente reduzir o número de hóspedes ou ajustar as datas da busca.
                </p>
            `;
            container.appendChild(noResultsMsg);
        } else {
            // Update existing message
            const title = noResultsMsg.querySelector('h4');
            if (title) {
                title.innerHTML = `
                    Sem vagas disponíveis para ${currentGuestCount} ${currentGuestCount === 1 ? 'hóspede' : 'hóspedes'}
                `;
            }
            noResultsMsg.style.display = 'block';
        }
    };
    
    /**
     * Apply guest number filter to all vacancy cards
     * @param {number} selectedGuestCount - Number of guests selected
     */
    const applyFilter = (selectedGuestCount) => {
        logger.debug(`Applying guest filter: ${selectedGuestCount} guest(s)`, 'GuestFilter');
        
        currentGuestCount = selectedGuestCount;
        
        // Update or add filter chip
        const guestLabel = selectedGuestCount === 1 ? 'hóspede' : 'hóspedes';
        filterChips.addChip(
            'guests',
            'Hóspedes',
            `${selectedGuestCount} ${guestLabel}`,
            () => {
                // When chip is removed, reset guest count to default (2)
                const guestInput = document.querySelector('[name="guests"]');
                if (guestInput) {
                    guestInput.value = '2';
                    // Trigger filter update
                    applyFilter(2);
                }
            }
        );
        
        // Import pagination dynamically (circular dependency workaround)
        import('./hotelSearch.js').then(module => {
            const allCards = module.getAllHotelCards?.() || [];
            
            if (allCards.length === 0) {
                logger.warn('No hotel cards found to filter', 'GuestFilter');
                return;
            }
            
            const container = document.getElementById('hotels-cards-container');
            
            // Show optimistic filtering indicator
            if (container) {
                container.classList.add('optimistic-filtering');
            }
            
            // Filter cards based on guest count
            const filteredCards = allCards.filter(card => {
                const vacancyItems = card.querySelectorAll('.vacancy-item');
                let hasVisibleVacancy = false;
                let cardVisibleCount = 0;
                
                vacancyItems.forEach(vacancyItem => {
                    const text = vacancyItem.getAttribute('data-vacancy-text') || 
                                vacancyItem.textContent;
                    
                    const capacity = parseCapacity(text);
                    
                    if (capacity !== null) {
                        if (capacity >= selectedGuestCount) {
                            vacancyItem.style.display = 'block';
                            hasVisibleVacancy = true;
                            cardVisibleCount++;
                        } else {
                            vacancyItem.style.display = 'none';
                        }
                    } else {
                        vacancyItem.style.display = 'block';
                        hasVisibleVacancy = true;
                        cardVisibleCount++;
                    }
                });
                
                // Update vacancy count badge
                if (hasVisibleVacancy) {
                    const badge = card.querySelector('.vacancy-count');
                    if (badge && cardVisibleCount > 0) {
                        badge.textContent = `${cardVisibleCount} ${cardVisibleCount === 1 ? 'vaga' : 'vagas'}`;
                    }
                }
                
                return hasVisibleVacancy;
            });
            
            totalHotels = allCards.length;
            visibleHotels = filteredCards.length;
            
            // Re-initialize pagination with filtered results
            import('../services/pagination.js').then(paginationModule => {
                const pagination = paginationModule.pagination;
                
                if (filteredCards.length > 0) {
                    hideNoResultsMessage();
                    
                    // Re-render pagination with filtered cards
                    pagination.init(filteredCards, {
                        itemsPerPage: 10,
                        containerId: 'pagination-container',
                        onPageChange: (pageCards) => {
                            const container = document.getElementById('hotels-cards-container');
                            if (!container) return;
                            
                            // Preserve banner
                            const banner = container.querySelector('.holiday-package-banner');
                            container.innerHTML = '';
                            if (banner) container.appendChild(banner);
                            
                            // Add page cards
                            pageCards.forEach(card => container.appendChild(card));
                        }
                    });
                    
                    // Render first page
                    const firstPage = pagination.getCurrentPageItems();
                    const container = document.getElementById('hotels-cards-container');
                    const banner = container?.querySelector('.holiday-package-banner');
                    
                    if (container) {
                        container.innerHTML = '';
                        if (banner) container.appendChild(banner);
                        firstPage.forEach(card => container.appendChild(card));
                    }
                    
                    pagination.renderControls();
                } else {
                    showNoResultsMessage();
                    pagination.reset();
                }
                
                updateCounter();
                
                // Remove optimistic indicator
                setTimeout(() => {
                    if (container) {
                        container.classList.remove('optimistic-filtering');
                    }
                }, 300);
            });
        });
    };
    
    /**
     * Reset filter (show all cards)
     */
    const reset = () => {
        logger.debug('Resetting guest filter', 'GuestFilter');
        
        const hotelCards = document.querySelectorAll('.hotel-card');
        const vacancyItems = document.querySelectorAll('.vacancy-item');
        
        hotelCards.forEach(card => {
            card.style.display = 'block';
        });
        
        vacancyItems.forEach(item => {
            item.style.display = 'block';
        });
        
        hideNoResultsMessage();
        updateCounter();
    };
    
    /**
     * Get current filter statistics
     * @returns {object} - Filter statistics
     */
    const getStats = () => ({
        currentGuestCount,
        totalHotels,
        visibleHotels,
        hiddenHotels: totalHotels - visibleHotels
    });
    
    // Return public API
    return {
        parseCapacity,
        applyFilter,
        updateCounter,
        showNoResultsMessage,
        hideNoResultsMessage,
        reset,
        getStats
    };
}

// Create singleton instance
const GuestNumberFilter = createGuestNumberFilter();

export { GuestNumberFilter };

logger.info('Guest Number Filter module loaded', 'FR-004B');
