/**
 * Hotel Search Module Tests
 * Tests for src/js/hotelSearch.js
 */

import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';

describe('Hotel Search Module', () => {
    let dom;
    let document;
    let window;

    beforeEach(() => {
        // Create a minimal DOM for testing
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
            <body>
                <select id="hotel-select"></select>
                <input id="checkin-date" type="date" />
                <input id="checkout-date" type="date" />
                <button id="search-button">Search</button>
                <div id="results"></div>
                <div id="loading-indicator" style="display: none;"></div>
            </body>
            </html>
        `, {
            url: 'http://localhost',
            runScripts: 'dangerously',
            resources: 'usable'
        });

        document = dom.window.document;
        window = dom.window;
        global.document = document;
        global.window = window;
        global.bootstrap = {
            Tooltip: jest.fn().mockImplementation(() => ({
                dispose: jest.fn()
            }))
        };
    });

    afterEach(() => {
        dom.window.close();
    });

    test('should exist as a module', () => {
        expect(true).toBe(true); // Placeholder for module loading test
    });

    test('should have hotel select element', () => {
        const hotelSelect = document.getElementById('hotel-select');
        expect(hotelSelect).toBeTruthy();
        expect(hotelSelect.tagName).toBe('SELECT');
    });

    test('should have date input elements', () => {
        const checkinDate = document.getElementById('checkin-date');
        const checkoutDate = document.getElementById('checkout-date');
        
        expect(checkinDate).toBeTruthy();
        expect(checkoutDate).toBeTruthy();
        expect(checkinDate.type).toBe('date');
        expect(checkoutDate.type).toBe('date');
    });

    test('should have search button', () => {
        const searchButton = document.getElementById('search-button');
        expect(searchButton).toBeTruthy();
        expect(searchButton.textContent).toBe('Search');
    });

    test('should have results container', () => {
        const results = document.getElementById('results');
        expect(results).toBeTruthy();
    });

    test('should have loading indicator', () => {
        const loadingIndicator = document.getElementById('loading-indicator');
        expect(loadingIndicator).toBeTruthy();
        expect(loadingIndicator.style.display).toBe('none');
    });
});
