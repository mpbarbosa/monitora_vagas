/**
 * Pagination Service
 * Handles pagination for large result sets
 * @version 1.0.0
 */

import { logger } from './logger.js';
import { CSS_CLASSES } from '../config/constants.js';

/**
 * Pagination configuration constants
 */
const PAGINATION_CONFIG = {
    DEFAULT_ITEMS_PER_PAGE: 10,
    VISIBLE_PAGE_BUTTONS: 5, // Show 5 page numbers at a time
    MIN_ITEMS_FOR_PAGINATION: 10
};

/**
 * Pagination state manager
 */
class PaginationManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = PAGINATION_CONFIG.DEFAULT_ITEMS_PER_PAGE;
        this.totalItems = 0;
        this.items = [];
        this.renderCallback = null;
        this.containerId = null;
    }

    /**
     * Initialize pagination
     * @param {Array} items - All items to paginate
     * @param {Object} options - Configuration options
     * @param {number} options.itemsPerPage - Items per page
     * @param {Function} options.onPageChange - Callback when page changes
     * @param {string} options.containerId - Container element ID for pagination controls
     */
    init(items, options = {}) {
        this.items = items || [];
        this.totalItems = this.items.length;
        this.itemsPerPage = options.itemsPerPage || PAGINATION_CONFIG.DEFAULT_ITEMS_PER_PAGE;
        this.renderCallback = options.onPageChange || null;
        this.containerId = options.containerId || 'pagination-container';
        this.currentPage = 1;

        logger.debug(`Pagination initialized: ${this.totalItems} items, ${this.itemsPerPage} per page`, 'Pagination');
    }

    /**
     * Check if pagination is needed
     */
    isPaginationNeeded() {
        return this.totalItems > PAGINATION_CONFIG.MIN_ITEMS_FOR_PAGINATION;
    }

    /**
     * Get total number of pages
     */
    getTotalPages() {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    /**
     * Get items for current page
     */
    getCurrentPageItems() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.items.slice(startIndex, endIndex);
    }

    /**
     * Go to specific page
     */
    goToPage(pageNumber) {
        const totalPages = this.getTotalPages();
        
        if (pageNumber < 1 || pageNumber > totalPages) {
            logger.warn(`Invalid page number: ${pageNumber}`, 'Pagination');
            return;
        }

        this.currentPage = pageNumber;
        logger.debug(`Navigated to page ${pageNumber}`, 'Pagination');

        // Trigger callback if provided
        if (this.renderCallback) {
            this.renderCallback(this.getCurrentPageItems(), pageNumber, totalPages);
        }

        // Update pagination controls
        this.renderControls();
    }

    /**
     * Go to next page
     */
    nextPage() {
        if (this.currentPage < this.getTotalPages()) {
            this.goToPage(this.currentPage + 1);
        }
    }

    /**
     * Go to previous page
     */
    previousPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }

    /**
     * Get page range for display (e.g., [1, 2, 3, 4, 5])
     */
    getPageRange() {
        const totalPages = this.getTotalPages();
        const maxButtons = PAGINATION_CONFIG.VISIBLE_PAGE_BUTTONS;
        
        let startPage = Math.max(1, this.currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);
        
        // Adjust if we're near the end
        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }
        
        const range = [];
        for (let i = startPage; i <= endPage; i++) {
            range.push(i);
        }
        
        return range;
    }

    /**
     * Render pagination controls
     */
    renderControls() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            logger.warn(`Pagination container not found: ${this.containerId}`, 'Pagination');
            return;
        }

        // Don't show pagination if not needed
        if (!this.isPaginationNeeded()) {
            container.innerHTML = '';
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block';

        const totalPages = this.getTotalPages();
        const pageRange = this.getPageRange();

        const paginationHTML = `
            <nav aria-label="Pagination navigation">
                <ul class="pagination pagination-sm justify-content-center mb-0">
                    <!-- Previous button -->
                    <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                        <button class="page-link" 
                                data-page="prev" 
                                ${this.currentPage === 1 ? 'disabled' : ''}
                                aria-label="Previous page">
                            <span aria-hidden="true">&laquo;</span>
                        </button>
                    </li>

                    <!-- First page (if not in range) -->
                    ${pageRange[0] > 1 ? `
                        <li class="page-item">
                            <button class="page-link" data-page="1">1</button>
                        </li>
                        ${pageRange[0] > 2 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
                    ` : ''}

                    <!-- Page numbers -->
                    ${pageRange.map(page => `
                        <li class="page-item ${page === this.currentPage ? 'active' : ''}">
                            <button class="page-link" 
                                    data-page="${page}"
                                    ${page === this.currentPage ? 'aria-current="page"' : ''}>
                                ${page}
                            </button>
                        </li>
                    `).join('')}

                    <!-- Last page (if not in range) -->
                    ${pageRange[pageRange.length - 1] < totalPages ? `
                        ${pageRange[pageRange.length - 1] < totalPages - 1 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
                        <li class="page-item">
                            <button class="page-link" data-page="${totalPages}">${totalPages}</button>
                        </li>
                    ` : ''}

                    <!-- Next button -->
                    <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                        <button class="page-link" 
                                data-page="next" 
                                ${this.currentPage === totalPages ? 'disabled' : ''}
                                aria-label="Next page">
                            <span aria-hidden="true">&raquo;</span>
                        </button>
                    </li>
                </ul>
            </nav>

            <!-- Page info -->
            <div class="text-center mt-2 text-muted small">
                Showing ${(this.currentPage - 1) * this.itemsPerPage + 1}-${Math.min(this.currentPage * this.itemsPerPage, this.totalItems)} of ${this.totalItems} results
            </div>
        `;

        container.innerHTML = paginationHTML;

        // Attach event listeners
        this.attachEventListeners(container);
    }

    /**
     * Attach click event listeners to pagination buttons
     */
    attachEventListeners(container) {
        const buttons = container.querySelectorAll('[data-page]');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const page = button.getAttribute('data-page');
                
                if (page === 'prev') {
                    this.previousPage();
                } else if (page === 'next') {
                    this.nextPage();
                } else {
                    this.goToPage(parseInt(page, 10));
                }
            });
        });
    }

    /**
     * Reset pagination to first page
     */
    reset() {
        this.currentPage = 1;
        this.items = [];
        this.totalItems = 0;
        
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = '';
            container.style.display = 'none';
        }
    }
}

// Export singleton instance
export const pagination = new PaginationManager();
