/**
 * Search Results Summary Module
 * Displays a sticky summary bar showing current search parameters at top of results
 * @version 1.0.0
 */

import { logger } from '../services/logger.js';

/**
 * Creates and manages the search results summary bar
 */
class SearchResultsSummary {
    constructor() {
        this.summaryBar = null;
    }

    /**
     * Initialize and render the summary bar
     * @param {Object} params - Search parameters
     * @param {string} params.hotelName - Hotel name
     * @param {string} params.checkin - Check-in date
     * @param {string} params.checkout - Check-out date
     * @param {number} params.guests - Number of guests
     * @param {number} params.nights - Number of nights
     * @param {boolean} params.applyBookingRules - Whether booking rules are applied
     */
    render(params) {
        const { hotelName, checkin, checkout, guests, nights, applyBookingRules } = params;

        // Remove existing summary if present
        this.remove();

        // Create summary bar
        this.summaryBar = document.createElement('div');
        this.summaryBar.id = 'search-results-summary';
        this.summaryBar.className = 'search-results-summary';
        this.summaryBar.setAttribute('role', 'status');
        this.summaryBar.setAttribute('aria-live', 'polite');

        // Format dates for display
        const checkinFormatted = this.formatDate(checkin);
        const checkoutFormatted = this.formatDate(checkout);

        this.summaryBar.innerHTML = `
            <div class="summary-content">
                <div class="summary-item summary-hotel">
                    <i class="fa fa-hotel" aria-hidden="true"></i>
                    <span class="summary-label">Hotel:</span>
                    <strong class="summary-value">${hotelName}</strong>
                </div>
                <div class="summary-divider" aria-hidden="true">•</div>
                <div class="summary-item summary-dates">
                    <i class="fa fa-calendar" aria-hidden="true"></i>
                    <span class="summary-label">Período:</span>
                    <strong class="summary-value">${checkinFormatted} - ${checkoutFormatted}</strong>
                    <span class="summary-meta">(${nights} ${nights === 1 ? 'noite' : 'noites'})</span>
                </div>
                <div class="summary-divider" aria-hidden="true">•</div>
                <div class="summary-item summary-guests">
                    <i class="fa fa-users" aria-hidden="true"></i>
                    <span class="summary-label">Hóspedes:</span>
                    <strong class="summary-value">${guests}</strong>
                </div>
                ${applyBookingRules ? `
                    <div class="summary-divider" aria-hidden="true">•</div>
                    <div class="summary-item summary-rules">
                        <i class="fa fa-check-circle text-success" aria-hidden="true"></i>
                        <span class="summary-value">Regras Aplicadas</span>
                    </div>
                ` : ''}
            </div>
        `;

        // Insert at the top of results container
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.insertBefore(this.summaryBar, resultsContainer.firstChild);
            logger.debug('Search results summary rendered', 'SearchResultsSummary');
        }
    }

    /**
     * Update the summary bar with new parameters
     * @param {Object} params - Updated search parameters
     */
    update(params) {
        if (!this.summaryBar) {
            this.render(params);
            return;
        }

        // Re-render with new params
        this.render(params);
    }

    /**
     * Remove the summary bar
     */
    remove() {
        if (this.summaryBar && this.summaryBar.parentNode) {
            this.summaryBar.parentNode.removeChild(this.summaryBar);
            this.summaryBar = null;
            logger.debug('Search results summary removed', 'SearchResultsSummary');
        }
    }

    /**
     * Format date for display (DD/MM/YYYY)
     * @param {string} dateStr - Date string in YYYY-MM-DD format
     * @returns {string} Formatted date
     */
    formatDate(dateStr) {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }

    /**
     * Calculate number of nights between dates
     * @param {string} checkin - Check-in date (YYYY-MM-DD)
     * @param {string} checkout - Check-out date (YYYY-MM-DD)
     * @returns {number} Number of nights
     */
    calculateNights(checkin, checkout) {
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        const diffTime = Math.abs(checkoutDate - checkinDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
}

// Export singleton instance
export const searchResultsSummary = new SearchResultsSummary();
