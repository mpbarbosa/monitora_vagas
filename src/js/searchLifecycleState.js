/**
 * Search Lifecycle UI State Management (FR-008A)
 * Manages enabled/disabled state of UI elements throughout the search lifecycle
 */

(function() {
    'use strict';

    const SearchLifecycleState = {
        // DOM element references
        elements: {
            hotelSelect: null,
            checkinInput: null,
            checkoutInput: null,
            guestPlusBtn: null,
            guestMinusBtn: null,
            guestInput: null,
            searchBtn: null,
            startNewSearchBtn: null,
            copyResultsBtn: null,
            clearResultsBtn: null,
            resultsContainer: null,
            hotelsCardsContainer: null
        },

        // Current state
        currentState: 'initial', // 'initial', 'searching', 'results'

        /**
         * Initialize the state manager
         */
        init: function() {
            console.log('🔧 Initializing Search Lifecycle State Manager (FR-008A)');
            
            // Get all DOM element references
            this.elements.hotelSelect = document.getElementById('hotel-select');
            this.elements.checkinInput = document.getElementById('input-checkin');
            this.elements.checkoutInput = document.getElementById('input-checkout');
            this.elements.guestPlusBtn = document.querySelector('.plus');
            this.elements.guestMinusBtn = document.querySelector('.minus');
            this.elements.guestInput = document.querySelector('.quantity');
            this.elements.searchBtn = document.getElementById('search-button');
            this.elements.startNewSearchBtn = document.getElementById('start-new-search-btn');
            this.elements.copyResultsBtn = document.getElementById('copy-results-btn');
            this.elements.clearResultsBtn = document.getElementById('clear-results-btn');
            this.elements.resultsContainer = document.getElementById('results-container');
            this.elements.hotelsCardsContainer = document.getElementById('hotels-cards-container');

            // Set initial state
            this.setInitialState();
            
            // Setup Start New Search button handler
            if (this.elements.startNewSearchBtn) {
                this.elements.startNewSearchBtn.addEventListener('click', () => {
                    this.handleStartNewSearch();
                });
            }

            console.log('✅ Search Lifecycle State Manager initialized');
        },

        /**
         * Set Initial State (Page Load)
         * AC-008A.1 to AC-008A.4
         */
        setInitialState: function() {
            console.log('🔄 Setting Initial State');
            this.currentState = 'initial';

            // AC-008A.1: Enable all input elements
            this.enableElement(this.elements.hotelSelect);
            this.enableElement(this.elements.checkinInput);
            this.enableElement(this.elements.checkoutInput);
            
            // AC-008A.2: Enable search button
            this.enableElement(this.elements.searchBtn);
            if (this.elements.searchBtn) {
                this.elements.searchBtn.textContent = 'busca vagas';
            }

            // Guest counter handled by GuestFilterStateManager (FR-004A)
            // Initially disabled until first search

            // AC-008A.3: Hide Start New Search button
            this.hideElement(this.elements.startNewSearchBtn);

            // AC-008A.4: Hide action buttons
            this.hideElement(this.elements.copyResultsBtn);
            this.hideElement(this.elements.clearResultsBtn);

            console.log('✅ Initial State set');
        },

        /**
         * Set Searching State (During Search)
         * AC-008A.5 to AC-008A.12
         */
        setSearchingState: function() {
            console.log('🔄 Setting Searching State');
            this.currentState = 'searching';

            // AC-008A.5 to AC-008A.8: Disable all inputs and guest controls
            this.disableElement(this.elements.hotelSelect);
            this.disableElement(this.elements.checkinInput);
            this.disableElement(this.elements.checkoutInput);
            this.disableElement(this.elements.guestPlusBtn);
            this.disableElement(this.elements.guestMinusBtn);

            // AC-008A.9 & AC-008A.10: Disable search button and change text
            this.disableElement(this.elements.searchBtn);
            if (this.elements.searchBtn) {
                this.elements.searchBtn.textContent = '🔍 Buscando...';
            }

            // AC-008A.12: Visual indication applied via disableElement()
            
            console.log('✅ Searching State set');
        },

        /**
         * Set Results State (After Search Completion)
         * AC-008A.13 to AC-008A.21
         */
        setResultsState: function() {
            console.log('🔄 Setting Results State');
            this.currentState = 'results';

            // AC-008A.13 to AC-008A.15: Keep hotel and date inputs disabled
            this.disableElement(this.elements.hotelSelect);
            this.disableElement(this.elements.checkinInput);
            this.disableElement(this.elements.checkoutInput);

            // AC-008A.16: Enable guest counter (handled by GuestFilterStateManager)
            // Will be enabled by search completion in hotelSearch.js

            // AC-008A.17: Search button remains disabled
            this.disableElement(this.elements.searchBtn);

            // AC-008A.18: Show and enable Start New Search button
            this.showElement(this.elements.startNewSearchBtn);
            this.enableElement(this.elements.startNewSearchBtn);

            // AC-008A.19 & AC-008A.20: Show action buttons
            this.showElement(this.elements.copyResultsBtn);
            this.showElement(this.elements.clearResultsBtn);
            this.enableElement(this.elements.copyResultsBtn);
            this.enableElement(this.elements.clearResultsBtn);

            console.log('✅ Results State set');
        },

        /**
         * Handle Start New Search button click
         * AC-008A.26 to AC-008A.37
         */
        handleStartNewSearch: function() {
            console.log('🔄 Starting New Search');

            // AC-008A.27 & AC-008A.28: Clear and hide results
            if (this.elements.hotelsCardsContainer) {
                this.elements.hotelsCardsContainer.innerHTML = '';
            }
            if (this.elements.resultsContainer) {
                this.elements.resultsContainer.classList.remove('visible');
            }

            // AC-008A.29 to AC-008A.31: Enable inputs
            this.enableElement(this.elements.hotelSelect);
            this.enableElement(this.elements.checkinInput);
            this.enableElement(this.elements.checkoutInput);

            // AC-008A.32: Enable search button
            this.enableElement(this.elements.searchBtn);
            if (this.elements.searchBtn) {
                this.elements.searchBtn.textContent = 'busca vagas';
            }

            // AC-008A.33: Hide Start New Search button
            this.hideElement(this.elements.startNewSearchBtn);

            // AC-008A.34: Hide action buttons
            this.hideElement(this.elements.copyResultsBtn);
            this.hideElement(this.elements.clearResultsBtn);

            // AC-008A.35 & AC-008A.36: Reset and disable guest counter
            if (this.elements.guestInput) {
                this.elements.guestInput.value = '2 Hóspedes';
            }
            if (window.GuestFilterStateManager) {
                window.GuestFilterStateManager.disable();
            }

            // AC-008A.36: Date values are preserved (no action needed)

            // AC-008A.37: Return to initial state
            this.currentState = 'initial';

            console.log('✅ New Search ready');
        },

        /**
         * Helper: Enable an element
         */
        enableElement: function(element) {
            if (!element) return;
            
            element.disabled = false;
            element.style.opacity = '1';
            element.style.cursor = '';
            element.style.pointerEvents = '';
            element.removeAttribute('aria-disabled');
        },

        /**
         * Helper: Disable an element with visual indication
         */
        disableElement: function(element) {
            if (!element) return;
            
            element.disabled = true;
            element.style.opacity = '0.5';
            element.style.cursor = 'not-allowed';
            element.setAttribute('aria-disabled', 'true');
        },

        /**
         * Helper: Show an element
         */
        showElement: function(element) {
            if (!element) return;
            element.style.display = '';
            element.removeAttribute('aria-hidden');
        },

        /**
         * Helper: Hide an element
         */
        hideElement: function(element) {
            if (!element) return;
            element.style.display = 'none';
            element.setAttribute('aria-hidden', 'true');
        },

        /**
         * Get current state
         */
        getCurrentState: function() {
            return this.currentState;
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            SearchLifecycleState.init();
        });
    } else {
        SearchLifecycleState.init();
    }

    // Expose to global scope for integration with search flow
    window.SearchLifecycleState = SearchLifecycleState;

})();
