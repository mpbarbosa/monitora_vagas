// No-Scroll Interface Interactions and Analytics
export class NoScrollInterface {
    constructor() {
        this.initializeComponents();
        this.setupEventListeners();
        this.setupAnalytics();
    }

    initializeComponents() {
        // Progressive disclosure modal
        this.advancedModal = document.getElementById('advanced-search-modal');
        this.showAdvancedBtn = document.getElementById('show-advanced-search');
        this.closeAdvancedBtn = document.getElementById('close-advanced-search');
        this.cancelAdvancedBtn = document.getElementById('cancel-advanced-search');
        
        // Forms
        this.quickForm = document.getElementById('quick-hotel-search-form');
        this.advancedForm = document.getElementById('advanced-hotel-search-form');
        
        // Date method toggle in advanced form
        this.setupAdvancedDateToggle();
    }

    setupEventListeners() {
        // Progressive disclosure - show advanced search
        if (this.showAdvancedBtn) {
            this.showAdvancedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAdvancedSearch();
            });
        }

        // Close advanced search modal
        if (this.closeAdvancedBtn) {
            this.closeAdvancedBtn.addEventListener('click', () => {
                this.hideAdvancedSearch();
            });
        }

        if (this.cancelAdvancedBtn) {
            this.cancelAdvancedBtn.addEventListener('click', () => {
                this.hideAdvancedSearch();
            });
        }

        // Close modal on overlay click
        if (this.advancedModal) {
            this.advancedModal.addEventListener('click', (e) => {
                if (e.target === this.advancedModal) {
                    this.hideAdvancedSearch();
                }
            });
        }

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.advancedModal?.classList.contains('active')) {
                this.hideAdvancedSearch();
            }
        });

        // Form submissions
        if (this.quickForm) {
            this.quickForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleQuickSearch(e);
            });
        }

        if (this.advancedForm) {
            this.advancedForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAdvancedSearch(e);
            });
        }

        // Sync form data between quick and advanced forms
        this.setupFormDataSync();
    }

    setupAdvancedDateToggle() {
        const monthRadio = document.getElementById('advanced-date-method-months');
        const rangeRadio = document.getElementById('advanced-date-method-range');
        const monthContainer = document.getElementById('advanced-month-selection-container');
        const rangeContainer = document.getElementById('advanced-date-range-container');

        if (monthRadio && rangeRadio && monthContainer && rangeContainer) {
            monthRadio.addEventListener('change', () => {
                if (monthRadio.checked) {
                    monthContainer.style.display = 'block';
                    rangeContainer.style.display = 'none';
                }
            });

            rangeRadio.addEventListener('change', () => {
                if (rangeRadio.checked) {
                    monthContainer.style.display = 'none';
                    rangeContainer.style.display = 'block';
                }
            });
        }
    }

    setupFormDataSync() {
        // Sync region selection
        const quickRegion = document.getElementById('quick-region');
        const advancedRegion = document.getElementById('advanced-hotel-selection');
        
        if (quickRegion && advancedRegion) {
            quickRegion.addEventListener('change', () => {
                advancedRegion.value = quickRegion.value;
            });
        }

        // Sync period selection
        const quickPeriod = document.getElementById('quick-period');
        const advancedMonth = document.getElementById('advanced-month-selection');
        
        if (quickPeriod && advancedMonth) {
            quickPeriod.addEventListener('change', () => {
                advancedMonth.value = quickPeriod.value;
            });
        }
    }

    showAdvancedSearch() {
        if (this.advancedModal) {
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            this.advancedModal.style.display = 'flex';
            // Trigger reflow for animation
            this.advancedModal.offsetHeight;
            this.advancedModal.classList.add('active');
            
            // Focus management for accessibility
            const firstInput = this.advancedModal.querySelector('select, input');
            if (firstInput) {
                firstInput.focus();
            }
            
            // Analytics tracking
            this.trackAnalytics('advanced_search_opened', {
                interaction_type: 'progressive_disclosure',
                source: 'quick_search_toggle'
            });
        }
    }

    hideAdvancedSearch() {
        if (this.advancedModal) {
            this.advancedModal.classList.remove('active');
            
            setTimeout(() => {
                this.advancedModal.style.display = 'none';
                document.body.style.overflow = '';
                
                // Return focus to trigger button for accessibility
                if (this.showAdvancedBtn) {
                    this.showAdvancedBtn.focus();
                }
            }, 300); // Match CSS transition duration
            
            // Analytics tracking
            this.trackAnalytics('advanced_search_closed', {
                interaction_type: 'modal_dismissal'
            });
        }
    }

    handleQuickSearch(event) {
        const formData = new FormData(event.target);
        const searchData = {
            region: formData.get('region'),
            period: formData.get('period'),
            searchType: 'quick'
        };

        // Show progress bar
        this.showProgressBar();

        // Analytics tracking
        this.trackAnalytics('search_initiated', {
            search_type: 'quick',
            region: searchData.region,
            period: searchData.period,
            above_fold_interaction: true
        });

        // Process search (placeholder - connect to existing search handler)
        this.processSearch(searchData);
    }

    handleAdvancedSearch(event) {
        const formData = new FormData(event.target);
        const searchData = {
            union: formData.get('unionSelection'),
            region: formData.get('hotelSelection'),
            dateMethod: formData.get('advancedDateMethod'),
            period: formData.get('monthSelection'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            searchType: formData.get('advancedSearchType'),
            advancedSearch: true
        };

        // Hide modal first
        this.hideAdvancedSearch();
        
        // Show progress bar
        this.showProgressBar();

        // Analytics tracking
        this.trackAnalytics('search_initiated', {
            search_type: 'advanced',
            union: searchData.union,
            region: searchData.region,
            date_method: searchData.dateMethod,
            search_type_pref: searchData.searchType,
            progressive_disclosure_used: true
        });

        // Process search (placeholder - connect to existing search handler)
        this.processSearch(searchData);
    }

    showProgressBar() {
        const progressContainer = document.getElementById('progress-bar-container');
        if (progressContainer) {
            progressContainer.style.display = 'block';
            
            // Smooth scroll to progress bar for feedback
            progressContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }

    processSearch(searchData) {
        // This would connect to the existing search functionality
        // For now, we'll dispatch a custom event that the existing code can listen to
        const searchEvent = new CustomEvent('hotelSearchInitiated', {
            detail: searchData
        });
        document.dispatchEvent(searchEvent);
    }

    setupAnalytics() {
        // Track above-the-fold interaction metrics
        this.trackAboveFoldInteractions();
        this.trackScrollBehavior();
        this.trackMobileInteractions();
    }

    trackAboveFoldInteractions() {
        // Track any clicks above the fold
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.addEventListener('click', (e) => {
                const target = e.target.closest('button, select, input, a');
                if (target) {
                    const targetType = target.tagName.toLowerCase();
                    const targetId = target.id || target.className;
                    
                    this.trackAnalytics('above_fold_interaction', {
                        element_type: targetType,
                        element_id: targetId,
                        interaction_time: Date.now() - this.pageLoadTime
                    });
                }
            });
        }
    }

    trackScrollBehavior() {
        let hasScrolled = false;
        let scrollDepth = 0;
        
        this.pageLoadTime = Date.now();

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((currentScroll / documentHeight) * 100);

            if (!hasScrolled && currentScroll > 50) {
                hasScrolled = true;
                this.trackAnalytics('first_scroll', {
                    time_to_scroll: Date.now() - this.pageLoadTime,
                    initial_scroll_depth: scrollPercent
                });
            }

            // Track scroll depth milestones
            if (scrollPercent > scrollDepth + 25) {
                scrollDepth = Math.floor(scrollPercent / 25) * 25;
                this.trackAnalytics('scroll_depth', {
                    depth_percentage: scrollDepth,
                    time_since_load: Date.now() - this.pageLoadTime
                });
            }
        });
    }

    trackMobileInteractions() {
        // Enhanced mobile interaction tracking
        if (window.innerWidth <= 768) {
            const touchStartTime = {};

            document.addEventListener('touchstart', (e) => {
                const target = e.target.closest('button, select, input, a');
                if (target) {
                    touchStartTime[target] = Date.now();
                }
            });

            document.addEventListener('touchend', (e) => {
                const target = e.target.closest('button, select, input, a');
                if (target && touchStartTime[target]) {
                    const touchDuration = Date.now() - touchStartTime[target];
                    
                    this.trackAnalytics('mobile_interaction', {
                        element_type: target.tagName.toLowerCase(),
                        element_id: target.id || target.className,
                        touch_duration: touchDuration,
                        viewport_width: window.innerWidth
                    });
                    
                    delete touchStartTime[target];
                }
            });
        }
    }

    trackAnalytics(eventName, properties = {}) {
        // Enhanced analytics tracking with no-scroll metrics
        const analyticsData = {
            event: eventName,
            timestamp: new Date().toISOString(),
            page_url: window.location.href,
            user_agent: navigator.userAgent,
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight,
            is_mobile: window.innerWidth <= 768,
            ...properties
        };

        // Console log for development (replace with actual analytics service)
        console.log('No-Scroll Analytics:', analyticsData);

        // Here you would send to your analytics service:
        // gtag('event', eventName, properties);
        // or
        // analytics.track(eventName, analyticsData);
    }
}

// Initialize the no-scroll interface when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NoScrollInterface();
});