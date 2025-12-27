/**
 * Dark Mode Service
 * Manages dark/light theme switching with system preference detection
 * Persists user preference in localStorage
 * 
 * @module darkMode
 * @version 1.0.0
 */

import { logger } from './logger.js';

const STORAGE_KEY = 'theme-preference';
const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto'
};

/**
 * DarkMode class
 * Manages theme switching and persistence
 */
class DarkMode {
    constructor() {
        this.currentTheme = THEMES.AUTO;
        this.systemPreference = null;
        this.mediaQuery = null;
    }

    /**
     * Initialize dark mode
     */
    init() {
        logger.debug('Initializing dark mode', 'DarkMode');
        
        // Detect system preference
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.systemPreference = this.mediaQuery.matches ? THEMES.DARK : THEMES.LIGHT;
        
        // Listen for system preference changes
        this.mediaQuery.addEventListener('change', (e) => {
            this.systemPreference = e.matches ? THEMES.DARK : THEMES.LIGHT;
            if (this.currentTheme === THEMES.AUTO) {
                this.applyTheme();
            }
        });
        
        // Load saved preference
        const saved = this.loadPreference();
        this.setTheme(saved);
        
        logger.info(`Dark mode initialized: ${this.currentTheme}`, 'DarkMode');
    }

    /**
     * Set theme
     * @param {string} theme - 'light', 'dark', or 'auto'
     */
    setTheme(theme) {
        if (!Object.values(THEMES).includes(theme)) {
            logger.warn(`Invalid theme: ${theme}`, 'DarkMode');
            theme = THEMES.AUTO;
        }
        
        this.currentTheme = theme;
        this.savePreference(theme);
        this.applyTheme();
        this.updateToggleButton();
        
        logger.debug(`Theme set to: ${theme}`, 'DarkMode');
    }

    /**
     * Apply current theme to document
     */
    applyTheme() {
        const effectiveTheme = this.getEffectiveTheme();
        
        // Remove both classes first
        document.documentElement.classList.remove('light-theme', 'dark-theme');
        
        // Add appropriate class
        document.documentElement.classList.add(`${effectiveTheme}-theme`);
        
        // Set data attribute for CSS
        document.documentElement.setAttribute('data-theme', effectiveTheme);
        
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: effectiveTheme, preference: this.currentTheme }
        }));
        
        logger.debug(`Applied theme: ${effectiveTheme}`, 'DarkMode');
    }

    /**
     * Get effective theme (resolving 'auto')
     * @returns {string} 'light' or 'dark'
     */
    getEffectiveTheme() {
        if (this.currentTheme === THEMES.AUTO) {
            return this.systemPreference;
        }
        return this.currentTheme;
    }

    /**
     * Toggle between themes
     */
    toggle() {
        const themes = [THEMES.LIGHT, THEMES.DARK, THEMES.AUTO];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.setTheme(themes[nextIndex]);
    }

    /**
     * Get current theme preference
     * @returns {string} Current theme preference
     */
    getTheme() {
        return this.currentTheme;
    }

    /**
     * Get effective theme
     * @returns {string} Effective theme ('light' or 'dark')
     */
    getEffective() {
        return this.getEffectiveTheme();
    }

    /**
     * Save preference to localStorage
     */
    savePreference(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (error) {
            logger.warn('Failed to save theme preference', error, 'DarkMode');
        }
    }

    /**
     * Load preference from localStorage
     * @returns {string} Saved theme or 'auto'
     */
    loadPreference() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved || THEMES.AUTO;
        } catch (error) {
            logger.warn('Failed to load theme preference', error, 'DarkMode');
            return THEMES.AUTO;
        }
    }

    /**
     * Update toggle button appearance
     */
    updateToggleButton() {
        const button = document.getElementById('dark-mode-toggle');
        if (!button) return;
        
        const effectiveTheme = this.getEffectiveTheme();
        const icons = {
            light: '☀️',
            dark: '🌙',
            auto: '🌗'
        };
        
        const labels = {
            light: 'Modo Claro',
            dark: 'Modo Escuro',
            auto: 'Automático'
        };
        
        // Update icon
        const icon = button.querySelector('.theme-icon');
        if (icon) {
            if (this.currentTheme === THEMES.AUTO) {
                icon.textContent = icons.auto;
            } else {
                icon.textContent = icons[effectiveTheme];
            }
        }
        
        // Update aria-label
        button.setAttribute('aria-label', `Tema: ${labels[this.currentTheme]}`);
        button.setAttribute('title', labels[this.currentTheme]);
        
        // Update data attribute
        button.setAttribute('data-theme', this.currentTheme);
    }

    /**
     * Setup toggle button event listener
     */
    setupToggleButton() {
        const button = document.getElementById('dark-mode-toggle');
        if (button) {
            button.addEventListener('click', () => this.toggle());
            this.updateToggleButton();
            logger.debug('Toggle button configured', 'DarkMode');
        }
    }
}

// Export singleton instance
export const darkMode = new DarkMode();

// Export constants
export { THEMES };
