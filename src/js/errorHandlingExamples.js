/**
 * Error Handling Usage Examples
 * Demonstrates how to use the global error handling utilities
 * @version 1.0.0
 */

import { withErrorHandling, withSyncErrorHandling, safeAsync } from './global.js';
import { apiClient } from '../services/apiClient.js';
import { logger } from '../services/logger.js';

/**
 * Example 1: Using withErrorHandling for async API calls
 * Logs errors but re-throws them for caller to handle
 */
async function loadHotelsExample() {
    try {
        const hotels = await withErrorHandling(
            async () => await apiClient.getHotels(),
            'HotelLoading'
        );
        return hotels;
    } catch (error) {
        // Error already logged by withErrorHandling
        // Handle UI updates here
        console.error('Failed to load hotels:', error);
        throw error;
    }
}

/**
 * Example 2: Using withSyncErrorHandling for JSON parsing
 * Logs errors but re-throws them for caller to handle
 */
function parseConfigExample(jsonString) {
    try {
        const config = withSyncErrorHandling(
            () => JSON.parse(jsonString),
            'ConfigParsing'
        );
        return config;
    } catch (error) {
        // Error already logged by withSyncErrorHandling
        // Provide fallback config
        return { defaults: true };
    }
}

/**
 * Example 3: Using safeAsync for UI event handlers
 * Catches errors, logs them, and shows user notification
 * Perfect for button click handlers
 */
function setupSearchButtonExample() {
    const searchButton = document.getElementById('search-button');
    
    searchButton.addEventListener('click', () => safeAsync(
        async () => {
            const hotels = await apiClient.getHotels();
            const results = await apiClient.searchVacancies('2024-12-25', '2024-12-27');
            displayResults(results);
        },
        'SearchButton',
        'Failed to search vacancies. Please try again.'
    ));
}

/**
 * Example 4: Using safeAsync for form submission
 */
function setupFormExample() {
    const form = document.getElementById('search-form');
    
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        safeAsync(
            async () => {
                const formData = new FormData(form);
                const checkin = formData.get('checkin');
                const checkout = formData.get('checkout');
                
                const results = await apiClient.searchVacancies(checkin, checkout);
                displayResults(results);
            },
            'FormSubmit',
            'Failed to submit form. Please check your input and try again.'
        );
    });
}

/**
 * Example 5: Nested error handling with context
 */
async function complexOperationExample() {
    return await withErrorHandling(async () => {
        logger.info('Starting complex operation', 'ComplexOp');
        
        // Step 1: Load hotels
        const hotels = await withErrorHandling(
            async () => await apiClient.getHotels(),
            'ComplexOp:LoadHotels'
        );
        
        // Step 2: Parse data
        const config = withSyncErrorHandling(
            () => JSON.parse(localStorage.getItem('config') || '{}'),
            'ComplexOp:ParseConfig'
        );
        
        // Step 3: Search vacancies
        const results = await withErrorHandling(
            async () => await apiClient.searchVacancies(config.checkin, config.checkout),
            'ComplexOp:SearchVacancies'
        );
        
        return { hotels, config, results };
    }, 'ComplexOperation');
}

/**
 * Example 6: Error handling with cleanup
 */
async function operationWithCleanupExample() {
    const progressBar = showProgressBar();
    
    try {
        const result = await withErrorHandling(
            async () => await apiClient.getHotels(),
            'OperationWithCleanup'
        );
        progressBar.success();
        return result;
    } catch (error) {
        progressBar.error();
        throw error;
    } finally {
        // Cleanup always runs
        setTimeout(() => progressBar.remove(), 2000);
    }
}

/**
 * Example 7: Combining with Promise.all
 */
async function parallelOperationsExample() {
    return await withErrorHandling(async () => {
        const [hotels, config, stats] = await Promise.all([
            withErrorHandling(
                async () => await apiClient.getHotels(),
                'Parallel:Hotels'
            ),
            withErrorHandling(
                async () => fetchConfig(),
                'Parallel:Config'
            ),
            withErrorHandling(
                async () => fetchStats(),
                'Parallel:Stats'
            )
        ]);
        
        return { hotels, config, stats };
    }, 'ParallelOperations');
}

/**
 * Example 8: Error handling with retry logic
 */
async function operationWithRetryExample(maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await withErrorHandling(
                async () => await apiClient.getHotels(),
                `RetryOperation:Attempt${attempt}`
            );
        } catch (error) {
            lastError = error;
            logger.warn(`Attempt ${attempt} failed, ${maxRetries - attempt} retries remaining`, 'RetryOperation');
            
            if (attempt < maxRetries) {
                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
            }
        }
    }
    
    // All retries failed
    throw lastError;
}

/**
 * Example 9: Using safeAsync with loading state
 */
function setupButtonWithLoadingExample() {
    const button = document.getElementById('load-button');
    
    button.addEventListener('click', async () => {
        button.disabled = true;
        button.textContent = 'Loading...';
        
        await safeAsync(
            async () => {
                const data = await apiClient.getHotels();
                displayData(data);
            },
            'LoadButton',
            'Failed to load data'
        );
        
        button.disabled = false;
        button.textContent = 'Load Data';
    });
}

/**
 * Example 10: Global error handlers (already registered in global.js)
 * These catch any unhandled errors or promise rejections
 */
// window.addEventListener('error', handleUncaughtError);
// window.addEventListener('unhandledrejection', handleUnhandledRejection);

// These are automatically registered when global.js initializes

// Export examples for documentation
export {
    loadHotelsExample,
    parseConfigExample,
    setupSearchButtonExample,
    setupFormExample,
    complexOperationExample,
    operationWithCleanupExample,
    parallelOperationsExample,
    operationWithRetryExample,
    setupButtonWithLoadingExample
};

// Dummy helper functions for examples
function displayResults(results) { console.log('Results:', results); }
function displayData(data) { console.log('Data:', data); }
function showProgressBar() { 
    return { 
        success: () => {}, 
        error: () => {}, 
        remove: () => {} 
    }; 
}
async function fetchConfig() { return {}; }
async function fetchStats() { return {}; }
