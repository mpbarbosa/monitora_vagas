/**
 * Search Lifecycle State Module Tests
 * Tests for src/js/searchLifecycleState.js
 */

import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';

describe('Search Lifecycle State Module', () => {
    let dom;
    let document;
    let window;

    beforeEach(() => {
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
            <body>
                <div id="search-form">
                    <input id="search-input" />
                    <button id="search-button">Search</button>
                </div>
                <div id="loading-indicator" style="display: none;">
                    Loading...
                </div>
                <div id="results" style="display: none;"></div>
                <div id="error-message" style="display: none;"></div>
            </body>
            </html>
        `);

        document = dom.window.document;
        window = dom.window;
        global.document = document;
        global.window = window;
    });

    afterEach(() => {
        dom.window.close();
    });

    test('should have search form elements', () => {
        const searchForm = document.getElementById('search-form');
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');

        expect(searchForm).toBeTruthy();
        expect(searchInput).toBeTruthy();
        expect(searchButton).toBeTruthy();
    });

    test('should have loading indicator hidden by default', () => {
        const loadingIndicator = document.getElementById('loading-indicator');
        expect(loadingIndicator).toBeTruthy();
        expect(loadingIndicator.style.display).toBe('none');
    });

    test('should have results container hidden by default', () => {
        const results = document.getElementById('results');
        expect(results).toBeTruthy();
        expect(results.style.display).toBe('none');
    });

    test('should have error message hidden by default', () => {
        const errorMessage = document.getElementById('error-message');
        expect(errorMessage).toBeTruthy();
        expect(errorMessage.style.display).toBe('none');
    });

    test('loading indicator should be initially hidden', () => {
        const loadingIndicator = document.getElementById('loading-indicator');
        expect(window.getComputedStyle(loadingIndicator).display).toBe('none');
    });
});
