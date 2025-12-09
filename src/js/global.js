/**
 * Global JavaScript utilities
 * Placeholder for global functions and configurations
 */

(function() {
    'use strict';
    
    // Global namespace
    window.App = window.App || {};
    
    // Console logging helper
    App.log = function(message, data) {
        if (typeof console !== 'undefined') {
            console.log('[App]', message, data || '');
        }
    };
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            App.log('Application initialized');
        });
    } else {
        App.log('Application initialized');
    }
    
})();
