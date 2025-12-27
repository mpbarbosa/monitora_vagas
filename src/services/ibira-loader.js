/**
 * ibira.js Loader with CDN + Local Fallback
 * 
 * This module provides a wrapper for loading ibira.js with automatic fallback
 * from CDN to local copy if CDN is unavailable.
 * 
 * Usage in other modules:
 *   import { IbiraAPIFetchManager } from './ibira-loader.js';
 * 
 * @version 1.1.0
 */

import { logger } from './logger.js';

// Detect if running in Jest/Node test environment
const isTestEnvironment = typeof process !== 'undefined' && 
                          process.env && 
                          process.env.NODE_ENV === 'test';

const CDN_URL = 'https://cdn.jsdelivr.net/gh/mpbarbosa/ibira.js@0.2.1-alpha/src/index.js';
const LOCAL_URL = '../node_modules/ibira.js/src/index.js';
// For Jest/Node environment, use a path that works from project root
const NODE_LOCAL_URL = './node_modules/ibira.js/src/index.js';

let ibiraModule = null;
let loadAttempted = false;

/**
 * Load ibira.js with CDN fallback to local
 * @returns {Promise<Object>} The ibira.js module exports
 */
async function loadIbira() {
    if (ibiraModule) {
        return ibiraModule;
    }
    
    if (loadAttempted) {
        throw new Error('ibira.js loading already failed');
    }
    
    loadAttempted = true;
    
    // In test environment, use local path directly
    if (isTestEnvironment) {
        logger.debug('📦 Test environment: Loading ibira.js from local path...', 'IbiraLoader');
        try {
            ibiraModule = await import(NODE_LOCAL_URL);
            logger.debug('✅ ibira.js loaded in test environment', 'IbiraLoader');
            return ibiraModule;
        } catch (error) {
            logger.error('❌ Failed to load ibira.js in test environment', error, 'IbiraLoader');
            throw new Error(`Failed to load ibira.js in test: ${error.message}`);
        }
    }
    
    // Try CDN first (browser environment)
    try {
        logger.info('🌐 Loading ibira.js from CDN...', 'IbiraLoader');
        ibiraModule = await import(CDN_URL);
        logger.info('✅ ibira.js loaded from CDN', 'IbiraLoader');
        return ibiraModule;
    } catch (cdnError) {
        logger.warn('⚠️ CDN failed, trying local fallback... ' + cdnError.message, 'IbiraLoader');
        
        // Fallback to local
        try {
            ibiraModule = await import(LOCAL_URL);
            logger.info('✅ ibira.js loaded from local fallback', 'IbiraLoader');
            return ibiraModule;
        } catch (localError) {
            logger.error('❌ Both CDN and local loading failed', cdnError, 'IbiraLoader');
            logger.error('  CDN error: ' + cdnError.message, null, 'IbiraLoader');
            logger.error('  Local error: ' + localError.message, null, 'IbiraLoader');
            
            // Show user-friendly error
            if (typeof document !== 'undefined') {
                const errorDiv = document.createElement('div');
                errorDiv.id = 'ibira-load-error';
                errorDiv.style.cssText = `
                    position: fixed;
                    top: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #f44336;
                    color: white;
                    padding: 15px 30px;
                    border-radius: 5px;
                    z-index: 9999;
                    font-family: Arial, sans-serif;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                    max-width: 500px;
                    text-align: center;
                `;
                errorDiv.innerHTML = `
                    <strong>⚠️ Module Loading Error</strong><br>
                    <small>Unable to load required modules. Please refresh the page.</small>
                `;
                document.body.appendChild(errorDiv);
            }
            
            throw new Error(`Failed to load ibira.js: CDN (${cdnError.message}), Local (${localError.message})`);
        }
    }
}

// Pre-load ibira.js
const ibiraPromise = loadIbira();

// Export all ibira.js exports with lazy loading
export const IbiraAPIFetchManager = await ibiraPromise.then(m => m.IbiraAPIFetchManager);

// Export the loader for manual use if needed
export { loadIbira };

// Export default
export default await ibiraPromise;
