/**
 * Confirmation Dialog Service
 * Provides accessible confirmation modals using Bootstrap 5
 * Prevents accidental destructive actions
 * 
 * @module confirmationDialog
 * @version 1.0.0
 */

import { logger } from './logger.js';

/**
 * ConfirmationDialog class
 * Manages confirmation modals for destructive actions
 */
class ConfirmationDialog {
    constructor() {
        this.activeDialogs = new Map();
    }

    /**
     * Show confirmation dialog
     * @param {Object} options - Dialog options
     * @param {string} options.title - Dialog title
     * @param {string} options.message - Dialog message
     * @param {string} [options.details] - Additional details (optional)
     * @param {string} [options.type='warning'] - Dialog type (warning, danger, info)
     * @param {string} [options.confirmText='Confirmar'] - Confirm button text
     * @param {string} [options.cancelText='Cancelar'] - Cancel button text
     * @param {string} [options.confirmClass='btn-danger'] - Confirm button class
     * @param {Function} options.onConfirm - Callback when confirmed
     * @param {Function} [options.onCancel] - Callback when cancelled (optional)
     * @returns {Promise<boolean>} Resolves with true if confirmed, false if cancelled
     */
    show({
        title,
        message,
        details = '',
        type = 'warning',
        confirmText = 'Confirmar',
        cancelText = 'Cancelar',
        confirmClass = 'btn-danger',
        onConfirm = null,
        onCancel = null
    }) {
        return new Promise((resolve) => {
            const dialogId = `confirm-${Date.now()}`;
            
            // Create modal element
            const modal = this.createModalElement({
                id: dialogId,
                title,
                message,
                details,
                type,
                confirmText,
                cancelText,
                confirmClass
            });

            // Add to DOM
            document.body.appendChild(modal);

            // Initialize Bootstrap modal
            const bsModal = new bootstrap.Modal(modal, {
                backdrop: 'static',
                keyboard: true
            });

            // Handle confirm
            const confirmBtn = modal.querySelector('.btn-confirm');
            const cancelBtn = modal.querySelector('.btn-cancel');
            const closeBtn = modal.querySelector('.btn-close');

            const handleConfirm = () => {
                logger.debug(`Confirmation dialog confirmed: ${dialogId}`, 'ConfirmDialog');
                if (onConfirm) onConfirm();
                resolve(true);
                bsModal.hide();
            };

            const handleCancel = () => {
                logger.debug(`Confirmation dialog cancelled: ${dialogId}`, 'ConfirmDialog');
                if (onCancel) onCancel();
                resolve(false);
                bsModal.hide();
            };

            confirmBtn.addEventListener('click', handleConfirm);
            cancelBtn.addEventListener('click', handleCancel);
            if (closeBtn) closeBtn.addEventListener('click', handleCancel);

            // Clean up on hide
            modal.addEventListener('hidden.bs.modal', () => {
                modal.remove();
                this.activeDialogs.delete(dialogId);
            });

            // Store reference
            this.activeDialogs.set(dialogId, bsModal);

            // Show modal
            bsModal.show();

            // Focus confirm button for keyboard users
            modal.addEventListener('shown.bs.modal', () => {
                cancelBtn.focus(); // Focus cancel by default (safer)
            });

            logger.debug(`Confirmation dialog shown: ${dialogId}`, 'ConfirmDialog');
        });
    }

    /**
     * Create modal DOM element
     * @private
     */
    createModalElement({
        id,
        title,
        message,
        details,
        type,
        confirmText,
        cancelText,
        confirmClass
    }) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = id;
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-labelledby', `${id}-label`);
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('role', 'dialog');

        // Type-specific styling
        const typeConfig = {
            warning: {
                headerClass: 'bg-warning text-dark',
                icon: 'fa-exclamation-triangle'
            },
            danger: {
                headerClass: 'bg-danger text-white',
                icon: 'fa-exclamation-circle'
            },
            info: {
                headerClass: 'bg-info text-white',
                icon: 'fa-info-circle'
            }
        };

        const config = typeConfig[type] || typeConfig.warning;

        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header ${config.headerClass}">
                        <h5 class="modal-title" id="${id}-label">
                            <i class="fa ${config.icon}"></i> ${title}
                        </h5>
                        <button type="button" class="btn-close" aria-label="Fechar"></button>
                    </div>
                    <div class="modal-body">
                        <p class="mb-3"><strong>${message}</strong></p>
                        ${details ? `<p class="text-muted small mb-0">${details}</p>` : ''}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary btn-cancel">
                            <i class="fa fa-times"></i> ${cancelText}
                        </button>
                        <button type="button" class="btn ${confirmClass} btn-confirm">
                            <i class="fa fa-check"></i> ${confirmText}
                        </button>
                    </div>
                </div>
            </div>
        `;

        return modal;
    }

    /**
     * Confirm destructive action (warning dialog)
     * @param {string} message - Confirmation message
     * @param {Object} [options] - Additional options
     * @returns {Promise<boolean>} True if confirmed
     */
    async confirmDelete(message, options = {}) {
        return await this.show({
            title: options.title || 'Confirmar Exclusão',
            message,
            details: options.details || 'Esta ação não pode ser desfeita.',
            type: 'danger',
            confirmText: options.confirmText || 'Sim, Excluir',
            cancelText: options.cancelText || 'Cancelar',
            confirmClass: 'btn-danger',
            ...options
        });
    }

    /**
     * Confirm action (warning dialog)
     * @param {string} message - Confirmation message
     * @param {Object} [options] - Additional options
     * @returns {Promise<boolean>} True if confirmed
     */
    async confirmAction(message, options = {}) {
        return await this.show({
            title: options.title || 'Confirmar Ação',
            message,
            details: options.details || '',
            type: 'warning',
            confirmText: options.confirmText || 'Confirmar',
            cancelText: options.cancelText || 'Cancelar',
            confirmClass: 'btn-warning',
            ...options
        });
    }

    /**
     * Show information dialog (OK only)
     * @param {string} message - Information message
     * @param {Object} [options] - Additional options
     * @returns {Promise<boolean>} Always true
     */
    async alert(message, options = {}) {
        const modal = this.createAlertModal({
            title: options.title || 'Informação',
            message,
            type: options.type || 'info'
        });

        document.body.appendChild(modal);

        const bsModal = new bootstrap.Modal(modal);
        
        return new Promise((resolve) => {
            const okBtn = modal.querySelector('.btn-ok');
            okBtn.addEventListener('click', () => {
                bsModal.hide();
                resolve(true);
            });

            modal.addEventListener('hidden.bs.modal', () => {
                modal.remove();
            });

            bsModal.show();

            modal.addEventListener('shown.bs.modal', () => {
                okBtn.focus();
            });
        });
    }

    /**
     * Create alert modal (OK only)
     * @private
     */
    createAlertModal({ title, message, type }) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('role', 'alertdialog');

        const typeClass = type === 'info' ? 'bg-info text-white' : 'bg-primary text-white';
        const icon = type === 'info' ? 'fa-info-circle' : 'fa-check-circle';

        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header ${typeClass}">
                        <h5 class="modal-title">
                            <i class="fa ${icon}"></i> ${title}
                        </h5>
                    </div>
                    <div class="modal-body">
                        <p class="mb-0">${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary btn-ok" data-bs-dismiss="modal">
                            <i class="fa fa-check"></i> OK
                        </button>
                    </div>
                </div>
            </div>
        `;

        return modal;
    }

    /**
     * Close all active dialogs
     */
    closeAll() {
        this.activeDialogs.forEach((modal) => {
            modal.hide();
        });
        this.activeDialogs.clear();
    }
}

// Export singleton instance
export const confirmDialog = new ConfirmationDialog();

export { ConfirmationDialog };
