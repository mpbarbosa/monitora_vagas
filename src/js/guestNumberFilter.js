// Guest Number Filter Module (FR-004B)
// Client-side filtering of hotel vacancy results based on guest count
(function() {
    'use strict';

    // Guest Filter Manager
    const GuestNumberFilter = {
        currentGuestCount: 2,
        totalHotels: 0,
        visibleHotels: 0,
        
        /**
         * Parse capacity from vacancy text
         * Pattern: "até N pessoas" or "até N pessoa"
         * @param {string} text - Vacancy text to parse
         * @returns {number|null} - Extracted capacity or null if not found
         */
        parseCapacity: function(text) {
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
        },
        
        /**
         * Apply guest number filter to all vacancy cards
         * @param {number} selectedGuestCount - Number of guests selected
         */
        applyFilter: function(selectedGuestCount) {
            console.log(`🔍 Applying guest filter: ${selectedGuestCount} guest(s)`);
            
            this.currentGuestCount = selectedGuestCount;
            
            const hotelCards = document.querySelectorAll('.hotel-card');
            
            if (hotelCards.length === 0) {
                console.log('⚠️ No hotel cards found to filter');
                return;
            }
            
            this.totalHotels = hotelCards.length;
            this.visibleHotels = 0;
            let totalVisibleVacancies = 0;
            let totalHiddenVacancies = 0;
            
            hotelCards.forEach(card => {
                const vacancyItems = card.querySelectorAll('.vacancy-item');
                let hasVisibleVacancy = false;
                let cardVisibleCount = 0;
                let cardHiddenCount = 0;
                
                vacancyItems.forEach(vacancyItem => {
                    // Get vacancy text from data attribute or textContent
                    const text = vacancyItem.getAttribute('data-vacancy-text') || 
                                vacancyItem.textContent;
                    
                    // Parse capacity
                    const capacity = this.parseCapacity(text);
                    
                    if (capacity !== null) {
                        // Capacity found - apply filter rule
                        if (capacity >= selectedGuestCount) {
                            // Show: capacity >= guest count
                            vacancyItem.style.display = 'block';
                            hasVisibleVacancy = true;
                            cardVisibleCount++;
                        } else {
                            // Hide: capacity < guest count
                            vacancyItem.style.display = 'none';
                            cardHiddenCount++;
                        }
                    } else {
                        // No capacity info - keep visible (fail-safe)
                        vacancyItem.style.display = 'block';
                        hasVisibleVacancy = true;
                        cardVisibleCount++;
                    }
                });
                
                // Hide entire hotel card if no vacancies are visible
                if (hasVisibleVacancy) {
                    card.style.display = 'block';
                    this.visibleHotels++;
                    totalVisibleVacancies += cardVisibleCount;
                    
                    // Update vacancy count badge if it exists
                    const badge = card.querySelector('h4 + span');
                    if (badge && cardVisibleCount > 0) {
                        badge.textContent = `${cardVisibleCount} ${cardVisibleCount === 1 ? 'vaga' : 'vagas'}`;
                    }
                } else {
                    card.style.display = 'none';
                    totalHiddenVacancies += cardHiddenCount;
                }
            });
            
            // Update results counter
            this.updateCounter();
            
            // Show "no results" message if all cards are hidden
            if (this.visibleHotels === 0) {
                this.showNoResultsMessage();
            } else {
                this.hideNoResultsMessage();
            }
            
            console.log(`✅ Filter applied: ${this.visibleHotels}/${this.totalHotels} hotels visible, ${totalVisibleVacancies} vacancies shown, ${totalHiddenVacancies} hidden`);
        },
        
        /**
         * Update results counter display
         */
        updateCounter: function() {
            const counter = document.getElementById('results-counter');
            if (counter) {
                if (this.visibleHotels < this.totalHotels) {
                    counter.style.display = 'block';
                    counter.innerHTML = `
                        Mostrando <strong>${this.visibleHotels}</strong> de <strong>${this.totalHotels}</strong> hotéis 
                        para <strong>${this.currentGuestCount}</strong> ${this.currentGuestCount === 1 ? 'hóspede' : 'hóspedes'}
                    `;
                } else {
                    counter.style.display = 'none';
                }
            }
        },
        
        /**
         * Show "no results" message when all cards are filtered out
         */
        showNoResultsMessage: function() {
            const container = document.getElementById('hotels-cards-container');
            
            // Check if message already exists
            let noResultsMsg = document.getElementById('no-results-filter-message');
            
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.id = 'no-results-filter-message';
                noResultsMsg.style.cssText = `
                    background: white;
                    border: 2px solid #ff9800;
                    border-radius: 12px;
                    padding: 40px;
                    text-align: center;
                    color: #666;
                `;
                noResultsMsg.innerHTML = `
                    <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
                    <h4 style="margin: 0 0 10px 0; color: #ff9800; font-size: 20px;">
                        Sem vagas disponíveis para ${this.currentGuestCount} ${this.currentGuestCount === 1 ? 'hóspede' : 'hóspedes'}
                    </h4>
                    <p style="margin: 0; color: #666;">
                        Tente reduzir o número de hóspedes ou ajustar as datas da busca.
                    </p>
                `;
                container.appendChild(noResultsMsg);
            } else {
                // Update existing message
                const title = noResultsMsg.querySelector('h4');
                if (title) {
                    title.innerHTML = `
                        Sem vagas disponíveis para ${this.currentGuestCount} ${this.currentGuestCount === 1 ? 'hóspede' : 'hóspedes'}
                    `;
                }
                noResultsMsg.style.display = 'block';
            }
        },
        
        /**
         * Hide "no results" message
         */
        hideNoResultsMessage: function() {
            const noResultsMsg = document.getElementById('no-results-filter-message');
            if (noResultsMsg) {
                noResultsMsg.style.display = 'none';
            }
        },
        
        /**
         * Reset filter (show all cards)
         */
        reset: function() {
            console.log('🔄 Resetting guest filter');
            
            const hotelCards = document.querySelectorAll('.hotel-card');
            const vacancyItems = document.querySelectorAll('.vacancy-item');
            
            hotelCards.forEach(card => {
                card.style.display = 'block';
            });
            
            vacancyItems.forEach(item => {
                item.style.display = 'block';
            });
            
            this.hideNoResultsMessage();
            this.updateCounter();
        },
        
        /**
         * Get current filter statistics
         * @returns {object} - Filter statistics
         */
        getStats: function() {
            return {
                currentGuestCount: this.currentGuestCount,
                totalHotels: this.totalHotels,
                visibleHotels: this.visibleHotels,
                hiddenHotels: this.totalHotels - this.visibleHotels
            };
        }
    };
    
    // Expose to global scope
    window.GuestNumberFilter = GuestNumberFilter;
    
    console.log('✅ Guest Number Filter module loaded (FR-004B)');
})();
