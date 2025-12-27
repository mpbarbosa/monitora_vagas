/**
 * Inline Parameter Editor Module
 * Allows users to modify search parameters directly in results view
 * @version 2.2.0
 */

import { logger } from '../services/logger.js';
import { CSS_CLASSES } from '../config/constants.js';

class InlineParameterEditor {
    constructor() {
        this.currentParams = null;
        this.onParamChangeCallback = null;
        this.editorContainer = null;
    }

    /**
     * Initialize inline editor with current search parameters
     * @param {Object} params - Current search parameters
     * @param {Function} onParamChange - Callback when parameters change
     */
    init(params, onParamChange) {
        this.currentParams = params;
        this.onParamChangeCallback = onParamChange;
        
        logger.debug('Inline editor initialized', 'InlineEditor');
    }

    /**
     * Create and display inline editor UI
     * @param {HTMLElement} container - Container to insert editor into
     */
    render(container) {
        if (!this.currentParams) {
            logger.warn('Cannot render: No parameters set', 'InlineEditor');
            return;
        }

        // Create editor container
        this.editorContainer = document.createElement('div');
        this.editorContainer.className = 'inline-editor-container';
        this.editorContainer.setAttribute('role', 'region');
        this.editorContainer.setAttribute('aria-label', 'Editor de parâmetros de busca');

        this.editorContainer.innerHTML = `
            <div class="inline-editor-header">
                <h4>⚙️ Refinar Busca</h4>
                <button class="btn btn-sm btn-link toggle-editor" 
                        aria-label="Minimizar editor"
                        aria-expanded="true"
                        aria-controls="inline-editor-content">
                    <i class="fa fa-chevron-up"></i>
                </button>
            </div>
            <div class="inline-editor-content" id="inline-editor-content">
                <div class="row g-3">
                    <div class="col-md-4">
                        <label for="inline-hotel" class="form-label small">Hotel</label>
                        <select class="form-select form-select-sm" id="inline-hotel">
                            <!-- Options populated dynamically -->
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="inline-checkin" class="form-label small">Check-In</label>
                        <input type="date" class="form-control form-control-sm" 
                               id="inline-checkin" value="${this.currentParams.checkin}">
                    </div>
                    <div class="col-md-3">
                        <label for="inline-checkout" class="form-label small">Check-Out</label>
                        <input type="date" class="form-control form-control-sm" 
                               id="inline-checkout" value="${this.currentParams.checkout}">
                    </div>
                    <div class="col-md-2 d-flex align-items-end">
                        <button class="btn btn-primary btn-sm w-100" id="inline-apply-btn">
                            <i class="fa fa-refresh"></i> Aplicar
                        </button>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-12">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" 
                                   id="inline-booking-rules" 
                                   ${this.currentParams.applyBookingRules ? 'checked' : ''}>
                            <label class="form-check-label small" for="inline-booking-rules">
                                Aplicar regras de reserva
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert before results
        const resultsHeader = container.querySelector('.results-header');
        if (resultsHeader) {
            resultsHeader.after(this.editorContainer);
        } else {
            container.prepend(this.editorContainer);
        }

        // Populate hotel dropdown
        this._populateHotelSelect();

        // Attach event listeners
        this._attachEventListeners();

        logger.debug('Inline editor rendered', 'InlineEditor');
    }

    /**
     * Populate hotel select dropdown from main form
     */
    _populateHotelSelect() {
        const mainHotelSelect = document.getElementById('hotel-select');
        const inlineHotelSelect = document.getElementById('inline-hotel');

        if (!mainHotelSelect || !inlineHotelSelect) return;

        // Clone options from main form
        inlineHotelSelect.innerHTML = mainHotelSelect.innerHTML;
        inlineHotelSelect.value = this.currentParams.hotel || '';
    }

    /**
     * Attach event listeners to editor controls
     */
    _attachEventListeners() {
        // Toggle editor visibility
        const toggleBtn = this.editorContainer.querySelector('.toggle-editor');
        const content = this.editorContainer.querySelector('.inline-editor-content');
        
        toggleBtn.addEventListener('click', () => {
            const isExpanded = content.classList.toggle('collapsed');
            toggleBtn.setAttribute('aria-expanded', !isExpanded);
            toggleBtn.innerHTML = isExpanded 
                ? '<i class="fa fa-chevron-down"></i>' 
                : '<i class="fa fa-chevron-up"></i>';
            
            logger.debug(`Inline editor ${isExpanded ? 'collapsed' : 'expanded'}`, 'InlineEditor');
        });

        // Apply button
        const applyBtn = document.getElementById('inline-apply-btn');
        applyBtn.addEventListener('click', () => this._handleApply());

        // Auto-apply on Enter key in date inputs
        const dateInputs = this.editorContainer.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this._handleApply();
                }
            });
        });
    }

    /**
     * Handle apply button click
     */
    _handleApply() {
        const newParams = {
            hotel: document.getElementById('inline-hotel').value,
            checkin: document.getElementById('inline-checkin').value,
            checkout: document.getElementById('inline-checkout').value,
            applyBookingRules: document.getElementById('inline-booking-rules').checked
        };

        // Check if parameters changed
        if (this._paramsChanged(newParams)) {
            logger.info('Parameters changed, triggering new search', 'InlineEditor');
            
            // Update current params
            this.currentParams = newParams;

            // Visual feedback
            const applyBtn = document.getElementById('inline-apply-btn');
            const originalHtml = applyBtn.innerHTML;
            applyBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Aplicando...';
            applyBtn.disabled = true;

            // Trigger callback
            if (this.onParamChangeCallback) {
                this.onParamChangeCallback(newParams)
                    .then(() => {
                        // Success feedback
                        applyBtn.innerHTML = '<i class="fa fa-check"></i> Aplicado!';
                        setTimeout(() => {
                            applyBtn.innerHTML = originalHtml;
                            applyBtn.disabled = false;
                        }, 1500);
                    })
                    .catch((error) => {
                        logger.error('Error applying parameters', error, 'InlineEditor');
                        applyBtn.innerHTML = '<i class="fa fa-exclamation-triangle"></i> Erro';
                        setTimeout(() => {
                            applyBtn.innerHTML = originalHtml;
                            applyBtn.disabled = false;
                        }, 2000);
                    });
            }
        } else {
            logger.debug('No parameter changes detected', 'InlineEditor');
        }
    }

    /**
     * Check if parameters changed
     */
    _paramsChanged(newParams) {
        return newParams.hotel !== this.currentParams.hotel ||
               newParams.checkin !== this.currentParams.checkin ||
               newParams.checkout !== this.currentParams.checkout ||
               newParams.applyBookingRules !== this.currentParams.applyBookingRules;
    }

    /**
     * Update current parameters (e.g., when main form changes)
     */
    updateParams(params) {
        this.currentParams = params;
        
        if (this.editorContainer) {
            // Update UI if editor is visible
            const inlineHotel = document.getElementById('inline-hotel');
            const inlineCheckin = document.getElementById('inline-checkin');
            const inlineCheckout = document.getElementById('inline-checkout');
            const inlineRules = document.getElementById('inline-booking-rules');

            if (inlineHotel) inlineHotel.value = params.hotel || '';
            if (inlineCheckin) inlineCheckin.value = params.checkin;
            if (inlineCheckout) inlineCheckout.value = params.checkout;
            if (inlineRules) inlineRules.checked = params.applyBookingRules;
        }
    }

    /**
     * Remove inline editor from DOM
     */
    remove() {
        if (this.editorContainer) {
            this.editorContainer.remove();
            this.editorContainer = null;
        }
    }
}

// Export singleton instance
export const inlineEditor = new InlineParameterEditor();
