/**
 * About Modal Handler
 * Manages the "Sobre" (About) modal display
 * @module aboutModal
 */

import { logger } from '../services/logger.js';

/**
 * Initialize About modal functionality
 */
function initAboutModal() {
    const aboutLink = document.getElementById('about-link');
    const aboutModal = document.getElementById('aboutModal');
    
    if (!aboutLink || !aboutModal) {
        logger.warn('About link or modal not found in DOM', 'AboutModal');
        return;
    }
    
    // Initialize Bootstrap modal
    const modalInstance = new bootstrap.Modal(aboutModal);
    
    // Add click handler to About link
    aboutLink.addEventListener('click', (event) => {
        event.preventDefault();
        logger.debug('Opening About modal', 'AboutModal');
        modalInstance.show();
    });
    
    logger.info('About modal initialized', 'AboutModal');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutModal);
} else {
    initAboutModal();
}

export { initAboutModal };
