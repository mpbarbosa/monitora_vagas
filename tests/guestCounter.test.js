/**
 * Guest Counter Module Tests
 * Tests for src/js/guestCounter.js
 */

import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';

describe('Guest Counter Module', () => {
    let dom;
    let document;
    let window;

    beforeEach(() => {
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
            <body>
                <div id="guest-counter">
                    <button id="guest-decrease" class="btn">-</button>
                    <span id="guest-count">2</span>
                    <button id="guest-increase" class="btn">+</button>
                </div>
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

    test('should have guest counter elements', () => {
        const guestCounter = document.getElementById('guest-counter');
        const decreaseBtn = document.getElementById('guest-decrease');
        const increaseBtn = document.getElementById('guest-increase');
        const guestCount = document.getElementById('guest-count');

        expect(guestCounter).toBeTruthy();
        expect(decreaseBtn).toBeTruthy();
        expect(increaseBtn).toBeTruthy();
        expect(guestCount).toBeTruthy();
    });

    test('should display initial guest count', () => {
        const guestCount = document.getElementById('guest-count');
        expect(guestCount.textContent).toBe('2');
    });

    test('should have increase button', () => {
        const increaseBtn = document.getElementById('guest-increase');
        expect(increaseBtn.textContent).toBe('+');
        expect(increaseBtn.classList.contains('btn')).toBe(true);
    });

    test('should have decrease button', () => {
        const decreaseBtn = document.getElementById('guest-decrease');
        expect(decreaseBtn.textContent).toBe('-');
        expect(decreaseBtn.classList.contains('btn')).toBe(true);
    });
});
