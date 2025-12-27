/**
 * Hotel Search Module
 * Handles hotel search form submission and results display
 * Separated from index.html per HTML/CSS/JS separation principles
 * @version 2.1.0
 */

import { apiClient } from '../services/apiClient.js';
import { SearchLifecycleState } from './searchLifecycleState.js';
import { GuestFilterStateManager } from './guestCounter.js';
import { GuestNumberFilter } from './guestNumberFilter.js';
import { logger } from '../services/logger.js';
import { TIME, CSS_CLASSES } from '../config/constants.js';
import { validateHolidayPackage } from './holidayPackageService.js';
import { updateCacheStatus } from './ui/cacheStatusDisplay.js';
import { toast } from '../services/toastNotification.js';
import { formValidator, validators } from '../services/formValidator.js';
import { progressIndicator } from '../services/progressIndicator.js';
import { showResultsSkeleton, hideResultsSkeleton } from './skeletonLoader.js';
import { inlineEditor } from './inlineParameterEditor.js';
import { filterChips } from './filterChips.js';

import { progressiveDisclosure } from '../services/progressiveDisclosure.js';
import { pagination } from '../services/pagination.js';
import { searchResultsSummary } from './searchResultsSummary.js';

// Function to load hotels (with optional force refresh)
async function loadHotels(forceRefresh = false) {
    const select = document.getElementById('hotel-select');
    const refreshBtn = document.getElementById('refresh-hotels-btn');

    try {
        // Disable refresh button during load
        if (refreshBtn) {
            refreshBtn.disabled = true;
            refreshBtn.textContent = '⏳';
        }

        select.setAttribute('aria-busy', 'true');
        select.innerHTML = '<option value="">Loading...</option>';

        const hotels = await apiClient.getHotels(forceRefresh);

        select.setAttribute('aria-busy', 'false');
        select.innerHTML = '<option value="">Select a hotel</option>';
        hotels.forEach(hotel => {
            const option = document.createElement('option');
            option.value = hotel.hotelId;
            option.textContent = hotel.name;
            select.appendChild(option);
        });

        // Update cache status display
        const cacheStats = apiClient.getCacheStats();
        updateCacheStatus(cacheStats);

    } catch (error) {
        logger.error('Error loading hotels:', error);
        select.setAttribute('aria-busy', 'false');
        select.innerHTML = '<option value="">Error loading hotels - Click 🔄 to retry</option>';

        // Show error in tooltip
        const tooltipText = `❌ Error: ${error.message}`;
        select.setAttribute('data-bs-title', tooltipText);
        
        let tooltip = bootstrap.Tooltip.getInstance(select);
        if (tooltip) {
            tooltip.dispose();
        }
        new bootstrap.Tooltip(select, {
            trigger: 'hover focus',
            placement: 'bottom'
        });
    } finally {
        // Re-enable refresh button
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.textContent = '🔄';
        }
    }
}

// Function to create holiday package banner HTML
function createHolidayPackageBanner(holidayPackage) {
    const icon = holidayPackage.type === 'CHRISTMAS' ? '🎄' : '🎆';
    
    const banner = document.createElement('div');
    banner.className = CSS_CLASSES.HOLIDAY_PACKAGE_BANNER;
    
    banner.innerHTML = `
        <div class="package-banner-content">
            <span class="package-icon">${icon}</span>
            <div class="package-info">
                <h3 class="package-title">${holidayPackage.name}</h3>
                <p class="package-description">${holidayPackage.duration} • Pacote completo de feriado</p>
            </div>
        </div>
    `;
    
    return banner;
}

// Function to create hotel card HTML
function createHotelCard(hotelName, vacancies) {
    const hotelCard = document.createElement('div');
    hotelCard.className = CSS_CLASSES.HOTEL_CARD;

    // Hotel header
    const hotelHeader = document.createElement('div');
    hotelHeader.className = CSS_CLASSES.HOTEL_HEADER;
    hotelHeader.innerHTML = `
        <span class="hotel-icon">🏨</span>
        <h4 class="hotel-name">${hotelName}</h4>
        <span class="vacancy-count">
            ${vacancies.length} ${vacancies.length === 1 ? 'vaga' : 'vagas'}
        </span>
    `;
    hotelCard.appendChild(hotelHeader);

    // Vacancies list
    const vacanciesList = document.createElement('div');
    vacanciesList.className = CSS_CLASSES.VACANCIES_LIST;

    vacancies.forEach((vacancy, vIndex) => {
        const vacancyItem = document.createElement('div');
        vacancyItem.className = CSS_CLASSES.VACANCY_ITEM;
        vacancyItem.setAttribute('data-vacancy-text', vacancy);
        vacancyItem.innerHTML = `
            <span class="vacancy-number">${vIndex + 1}.</span>${vacancy}
        `;
        vacanciesList.appendChild(vacancyItem);
    });

    hotelCard.appendChild(vacanciesList);

    // FlexReserva link
    const flexReservaLink = document.createElement('a');
    flexReservaLink.href = 'https://www.flexreserva.org.br/';
    flexReservaLink.target = '_blank';
    flexReservaLink.rel = 'noopener noreferrer';
    flexReservaLink.textContent = 'Ir para o FlexReserva';
    flexReservaLink.className = CSS_CLASSES.FLEX_RESERVA_LINK;
    hotelCard.appendChild(flexReservaLink);

    return hotelCard;
}

// Function to create empty state HTML
function createEmptyState() {
    const emptyState = document.createElement('div');
    emptyState.className = CSS_CLASSES.EMPTY_STATE;
    emptyState.innerHTML = `
        <div class="empty-state-illustration">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="60" cy="60" r="50" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>
                <path d="M40 50 Q40 40, 50 40 L70 40 Q80 40, 80 50 L80 70 Q80 80, 70 80 L50 80 Q40 80, 40 70 Z" fill="#e9ecef" stroke="#adb5bd" stroke-width="2"/>
                <rect x="48" y="52" width="10" height="15" fill="#fff" stroke="#adb5bd" stroke-width="1.5"/>
                <rect x="62" y="52" width="10" height="15" fill="#fff" stroke="#adb5bd" stroke-width="1.5"/>
                <line x1="50" y1="75" x2="70" y2="75" stroke="#adb5bd" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </div>
        <h4 class="empty-state-title">Sem vagas disponíveis</h4>
        <p class="empty-state-message">Não há quartos disponíveis para o período selecionado.</p>
        
        <div class="empty-state-actions">
            <button type="button" class="btn btn-primary" id="empty-state-modify-search" aria-label="Modificar busca">
                <i class="bi bi-pencil-square" aria-hidden="true"></i>
                Modificar Busca
            </button>
            <button type="button" class="btn btn-outline-secondary" id="empty-state-new-search" aria-label="Nova busca">
                <i class="bi bi-arrow-clockwise" aria-hidden="true"></i>
                Nova Busca
            </button>
        </div>
        
        <div class="empty-state-suggestions">
            <p class="empty-state-suggestions-title"><strong>Sugestões para melhorar sua busca:</strong></p>
            <div class="empty-state-suggestions-grid">
                <div class="suggestion-item">
                    <i class="bi bi-calendar-event" aria-hidden="true"></i>
                    <span>Experimente períodos próximos (±2 dias)</span>
                </div>
                <div class="suggestion-item">
                    <i class="bi bi-building" aria-hidden="true"></i>
                    <span>Consulte outros hotéis disponíveis</span>
                </div>
                <div class="suggestion-item">
                    <i class="bi bi-people" aria-hidden="true"></i>
                    <span>Ajuste o número de hóspedes</span>
                </div>
                <div class="suggestion-item">
                    <i class="bi bi-telephone" aria-hidden="true"></i>
                    <span>Entre em contato direto com o hotel</span>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners for action buttons
    setTimeout(() => {
        const modifyBtn = document.getElementById('empty-state-modify-search');
        const newSearchBtn = document.getElementById('empty-state-new-search');
        
        if (modifyBtn) {
            modifyBtn.addEventListener('click', () => {
                logger.info('Empty state: Modify search clicked', 'EMPTY_STATE');
                // Scroll to form
                const searchForm = document.getElementById('search-form');
                if (searchForm) {
                    searchForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Focus on first input
                    const firstInput = searchForm.querySelector('input, select');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }
            });
        }
        
        if (newSearchBtn) {
            newSearchBtn.addEventListener('click', () => {
                logger.info('Empty state: New search clicked', 'EMPTY_STATE');
                // Trigger "Nova Busca" button if available
                const newSearchButton = document.getElementById('new-search-button');
                if (newSearchButton) {
                    newSearchButton.click();
                } else {
                    // Fallback: reload page
                    window.location.reload();
                }
            });
        }
    }, 0);
    
    return emptyState;
}

// Function to create error state HTML
function createErrorState(errorMessage) {
    const errorState = document.createElement('div');
    errorState.className = CSS_CLASSES.ERROR_STATE;
    errorState.innerHTML = `
        <div class="error-state-icon">❌</div>
        <h4 class="error-state-title">Erro na Busca</h4>
        <p class="error-state-message">${errorMessage}</p>
        <p class="error-state-details">Por favor, tente novamente.</p>
    `;
    return errorState;
}

// Function to create booking rule error HTML
function createBookingRuleErrorHTML(error) {
    const errorState = document.createElement('div');
    errorState.className = CSS_CLASSES.ERROR_STATE;
    errorState.innerHTML = `
        <div class="error-state-icon">⚠️</div>
        <h4 class="error-state-title">${error.title || 'Regra de Reserva Violada'}</h4>
        <p class="error-state-message">${error.message}</p>
    `;
    return errorState;
}

// Function to create booking rule error object
function createBookingRuleError(result) {
    const error = new Error(result.message || 'Booking rule violation');
    error.isBookingRuleError = true;
    error.code = result.code;
    error.title = result.title || 'Regra de Reserva';
    error.message = result.message;
    return error;
}

// Store all hotel cards for pagination
let allHotelCards = [];

// Function to render a page of hotel cards
function renderHotelCardsPage(hotelCards, pageNumber, totalPages) {
    const hotelsCardsContainer = document.getElementById('hotels-cards-container');
    
    // Find and preserve holiday package banner if it exists
    const existingBanner = hotelsCardsContainer.querySelector(`.${CSS_CLASSES.HOLIDAY_PACKAGE_BANNER}`);
    
    // Clear container
    hotelsCardsContainer.innerHTML = '';
    
    // Re-add banner if it existed
    if (existingBanner) {
        hotelsCardsContainer.appendChild(existingBanner);
    }
    
    // Add current page's hotel cards
    hotelCards.forEach(card => {
        hotelsCardsContainer.appendChild(card);
    });
    
    logger.debug(`Rendered page ${pageNumber} of ${totalPages} (${hotelCards.length} hotels)`, 'Pagination');
}

// Function to display formatted results in hotel cards
function displayResults(apiResponse, checkin, checkout, hotel) {
    const resultsContainer = document.getElementById('results-container');
    const hotelsCardsContainer = document.getElementById('hotels-cards-container');

    const { data, holidayPackage } = apiResponse;
    const { result } = data;

    // Hide skeleton loading state
    hideResultsSkeleton(resultsContainer);

    // Clear previous results
    hotelsCardsContainer.innerHTML = '';
    allHotelCards = [];

    // Get hotel name
    const hotelSelect = document.getElementById('hotel-select');
    const hotelName = hotelSelect.options[hotelSelect.selectedIndex]?.text || hotel;
    
    // Calculate nights
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
    
    // Get guests count
    const guestsInput = document.querySelector('.js-number-input .quantity');
    const guests = parseInt(guestsInput?.value || '2', 10);
    
    // Get booking rules state
    const applyBookingRules = document.getElementById('booking-rules-toggle')?.checked ?? true;

    // Render search results summary bar
    searchResultsSummary.render({
        hotelName,
        checkin,
        checkout,
        guests,
        nights,
        applyBookingRules
    });

    // Initialize and populate filter chips
    filterChips.initialize();
    
    // Add hotel filter chip (if specific hotel selected)
    if (hotel !== '-1' && hotelName && hotelName !== hotel) {
        filterChips.addChip(
            'hotel',
            'Hotel',
            hotelName,
            () => {
                // When removed, reset to all hotels
                const hotelSelect = document.getElementById('hotel-select');
                if (hotelSelect) {
                    hotelSelect.value = '';
                }
            }
        );
    }
    
    // Add date range filter chip
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };
    
    filterChips.addChip(
        'dates',
        'Período',
        `${formatDate(checkin)} - ${formatDate(checkout)} (${nights} ${nights === 1 ? 'noite' : 'noites'})`,
        () => {
            // When removed, scroll to date inputs
            const checkinInput = document.getElementById('input-checkin');
            if (checkinInput) {
                checkinInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                checkinInput.focus();
            }
        }
    );
    
    // Add booking rules filter chip (if disabled)
    if (!applyBookingRules) {
        filterChips.addChip(
            'booking-rules',
            'Regras de Reserva',
            'Desativadas',
            () => {
                // When removed, re-enable booking rules
                const bookingRulesToggle = document.getElementById('booking-rules-toggle');
                if (bookingRulesToggle) {
                    bookingRulesToggle.checked = true;
                }
            }
        );
    }

    // Show holiday package banner if present
    if (holidayPackage) {
        const packageBanner = createHolidayPackageBanner(holidayPackage);
        hotelsCardsContainer.appendChild(packageBanner);
    }

    // Detailed Vacancies
    if (data.hasAvailability && result.vacancies && result.vacancies.length > 0) {
        // Group by hotel
        const hotelGroups = result.hotelGroups || {};

        // Create all hotel cards first
        Object.keys(hotelGroups).forEach((hotelName) => {
            const vacancies = hotelGroups[hotelName];
            const hotelCard = createHotelCard(hotelName, vacancies);
            allHotelCards.push(hotelCard);
        });

        // Initialize pagination
        pagination.init(allHotelCards, {
            itemsPerPage: 10,
            containerId: 'pagination-container',
            onPageChange: renderHotelCardsPage
        });

        // Render first page
        if (pagination.isPaginationNeeded()) {
            renderHotelCardsPage(pagination.getCurrentPageItems(), 1, pagination.getTotalPages());
            pagination.renderControls();
        } else {
            // No pagination needed, show all cards
            allHotelCards.forEach(card => hotelsCardsContainer.appendChild(card));
        }

    } else {
        // Show empty state
        const emptyState = createEmptyState();
        hotelsCardsContainer.appendChild(emptyState);
        
        // Reset pagination
        pagination.reset();
    }

    // Display results
    resultsContainer.classList.add(CSS_CLASSES.VISIBLE);

    // Initialize inline parameter editor
    const currentParams = {
        hotel: hotel,
        checkin: checkin,
        checkout: checkout,
        applyBookingRules: document.getElementById('apply-booking-rules')?.checked ?? true
    };
    
    inlineEditor.init(currentParams, handleInlineParamChange);
    inlineEditor.render(resultsContainer);

    breadcrumb.showResults();
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    logger.info('Results displayed successfully', 'HotelSearch');
}

// Handle inline parameter changes
async function handleInlineParamChange(newParams) {
    logger.info('Inline parameters changed, triggering new search', 'HotelSearch');
    
    // Update main form fields to match
    const hotelSelect = document.getElementById('hotel-select');
    const checkinInput = document.getElementById('input-checkin');
    const checkoutInput = document.getElementById('input-checkout');
    const applyBookingRulesCheckbox = document.getElementById('apply-booking-rules');

    if (hotelSelect) hotelSelect.value = newParams.hotel || '';
    if (checkinInput) checkinInput.value = newParams.checkin;
    if (checkoutInput) checkoutInput.value = newParams.checkout;
    if (applyBookingRulesCheckbox) applyBookingRulesCheckbox.checked = newParams.applyBookingRules;

    // Perform new search with updated parameters
    return performSearch(
        newParams.hotel || '-1',
        newParams.checkin,
        newParams.checkout,
        newParams.applyBookingRules
    );
}

// Perform search with given parameters (reusable for inline editing)
async function performSearch(hotel, checkin, checkout, applyBookingRules) {
    logger.group('Vacancy Search Flow');

    // Set searching state (FR-008A)
    SearchLifecycleState.setSearchingState();

    // Hide previous results and show skeleton
    const resultsContainer = document.getElementById('results-container');
    const hotelsCardsContainer = document.getElementById('hotels-cards-container');
    resultsContainer.classList.add(CSS_CLASSES.VISIBLE); // Make visible to show skeleton
    
    // Show skeleton loading state (better perceived performance)
    showResultsSkeleton(resultsContainer, 3);

    // Create progress indicator (appears below skeleton)
    const progress = progressIndicator.create({
        id: 'vacancy-search',
        title: 'Searching for vacancies...',
        message: 'Contacting API server',
        container: hotelsCardsContainer,
        showProgress: true
    });

    try {
        // Use apiClient service instead of direct fetch (better abstraction)
        // FR-014: Include applyBookingRules parameter
        logger.debug(`Searching vacancies: Hotel=${hotel}, Check-in=${checkin}, Check-out=${checkout}, Booking Rules=${applyBookingRules}`, 'HotelSearch');
        logger.time('API Request');

        // Update progress
        progress.setProgress(30);
        progress.setMessage('Fetching availability data...');

        const result = await apiClient.searchVacancies(checkin, checkout, hotel, applyBookingRules);
        
        logger.timeEnd('API Request');
        logger.debug('API Response received', 'HotelSearch');

        // Update progress
        progress.setProgress(80);
        progress.setMessage('Processing results...');

        // Show the formatted data in the results area
        logger.debug('Formatting and displaying results...', 'HotelSearch');
        displayResults(result, checkin, checkout, hotel);

        // Complete progress
        progress.complete('Search completed successfully');
        progress.remove(1500);

    } catch (error) {
        logger.timeEnd('API Request');
        logger.error('❌ Search failed:', error);

        // Hide skeleton on error
        hideResultsSkeleton(resultsContainer);

        // Show error in progress indicator
        progress.error('Search failed');
        progress.remove(2000);

        // Display error in results container with special handling for booking rules
        if (error.isBookingRuleError) {
            const errorHTML = createBookingRuleErrorHTML(error);
            hotelsCardsContainer.appendChild(errorHTML);
        } else {
            const errorHTML = createErrorState(error.message);
            hotelsCardsContainer.appendChild(errorHTML);
        }
        resultsContainer.classList.add(CSS_CLASSES.VISIBLE);

        // Show toast notification for non-booking-rule errors
        if (!error.isBookingRuleError) {
            toast.error(`Erro na busca: ${error.message}`);
        }
        
        throw error; // Re-throw for inline editor to handle
    } finally {
        // Set results state (FR-008A)
        SearchLifecycleState.setResultsState();
        
        // Enable guest filter after search completion (FR-004A)
        GuestFilterStateManager.enable();
        logger.info('Guest filter enabled after search completion', 'FR-004A');
        logger.groupEnd();
    }
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();

    // Clear previous validation errors
    formValidator.clearAllErrors();

    // Validate all form fields
    if (!formValidator.validateAll()) {
        logger.warn('Form validation failed', 'HotelSearch');
        return;
    }

    // Get input parameters from web page UI
    const hotelSelect = document.getElementById('hotel-select');
    const checkinInput = document.getElementById('input-checkin');
    const checkoutInput = document.getElementById('input-checkout');
    const applyBookingRulesCheckbox = document.getElementById('apply-booking-rules');

    const hotel = hotelSelect.value || '-1'; // Default to all hotels
    const checkin = checkinInput.value; // yyyy-mm-dd (ISO format from date input)
    const checkout = checkoutInput.value; // yyyy-mm-dd (ISO format from date input)
    const applyBookingRules = applyBookingRulesCheckbox ? applyBookingRulesCheckbox.checked : true; // FR-014

    logger.debug('Input parameters', 'HotelSearch'); logger.debug(`Hotel: ${hotel}, Check-in: ${checkin}, Check-out: ${checkout}, Booking Rules: ${applyBookingRules}`);
    logger.debug(`Dates in ISO format: ${checkin} to ${checkout}`, 'HotelSearch');

    // Use refactored search function
    try {
        await performSearch(hotel, checkin, checkout, applyBookingRules);
    } catch (error) {
        // Error already handled in performSearch
    }
}

// Copy results to clipboard
function handleCopyResults() {
    const hotelsCardsContainer = document.getElementById('hotels-cards-container');
    const copyBtn = document.getElementById('copy-results-btn');
    
    // Get all text content from hotel cards
    const textContent = hotelsCardsContainer.innerText;

    // Copy to clipboard
    navigator.clipboard.writeText(textContent).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copiado!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, TIME.UI.NOTIFICATION_DURATION);
    }).catch(err => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copiado!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, TIME.UI.NOTIFICATION_DURATION);
    });
}

// Clear results with confirmation
function handleClearResults() {
    // Show confirmation modal
    const modal = new bootstrap.Modal(document.getElementById('clearResultsModal'));
    modal.show();
    
    logger.debug('Clear results confirmation requested', 'HotelSearch');
}

// Actual clear results function (called after confirmation)
function executeClearResults() {
    const hotelsCardsContainer = document.getElementById('hotels-cards-container');
    const resultsContainer = document.getElementById('results-container');
    
    // Clear results with animation
    resultsContainer.classList.add('optimistic-fade-out');
    
    setTimeout(() => {
        // Remove search results summary
        searchResultsSummary.remove();
        
        // Clear hotel cards
        hotelsCardsContainer.innerHTML = '';
        allHotelCards = [];
        
        // Reset pagination
        pagination.reset();
        
        // Remove inline editor
        inlineEditor.remove();
        
        // Hide results container
        resultsContainer.classList.remove(CSS_CLASSES.VISIBLE, 'optimistic-fade-out');
        
        // Reset search lifecycle state
        SearchLifecycleState.setReadyState();
        
        // Reset breadcrumb to home
        breadcrumb.updateBreadcrumb('home');
        
        // Show success toast
        toast.success('Resultados limpos com sucesso');
        
        logger.info('Results cleared', 'HotelSearch');
    }, 300);
}

// Check if dates match a holiday package and update notice visibility
/**
 * Update holiday package notice based on selected dates
 * Refactored to use holidayPackageService for validation
 * Complexity reduced from ~12 to ~3
 */
function updateHolidayNotice() {
    const checkinInput = document.getElementById('input-checkin');
    const checkoutInput = document.getElementById('input-checkout');
    const notice = document.getElementById('holiday-package-notice');
    const noticeText = document.getElementById('holiday-package-text');
    
    if (!checkinInput || !checkoutInput || !notice) {
        return;
    }
    
    const checkin = checkinInput.value;
    const checkout = checkoutInput.value;
    
    // Use holiday package service for validation
    const validation = validateHolidayPackage(checkin, checkout);
    
    if (validation.message) {
        notice.classList.add(CSS_CLASSES.VISIBLE);
        noticeText.textContent = validation.message;
        logger.debug(`Holiday package validation: ${validation.type}`, 'HolidayPackage');
    } else {
        notice.classList.remove(CSS_CLASSES.VISIBLE);
    }
}

// Setup all event listeners
function setupEventListeners() {
    const form = document.querySelector('.form');
    const refreshBtn = document.getElementById('refresh-hotels-btn');
    const copyBtn = document.getElementById('copy-results-btn');
    const clearBtn = document.getElementById('clear-results-btn');
    const checkinInput = document.getElementById('input-checkin');
    const checkoutInput = document.getElementById('input-checkout');

    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            logger.info('Manual refresh requested', 'HotelCache');
            loadHotels(true); // Force refresh
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', handleCopyResults);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', handleClearResults);
    }
    
    // Confirm clear button in modal
    const confirmClearBtn = document.getElementById('confirmClearBtn');
    if (confirmClearBtn) {
        confirmClearBtn.addEventListener('click', () => {
            executeClearResults();
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('clearResultsModal'));
            if (modal) modal.hide();
        });
    }
    
    // Listen for date changes to update holiday notice
    if (checkinInput) {
        checkinInput.addEventListener('change', updateHolidayNotice);
        checkinInput.addEventListener('input', updateHolidayNotice);
    }
    
    if (checkoutInput) {
        checkoutInput.addEventListener('change', updateHolidayNotice);
        checkoutInput.addEventListener('input', updateHolidayNotice);
    }
}

// Initialize the module
function init() {
    // Setup form validation
    setupFormValidation();
    
    // Load hotels on page load
    loadHotels();
    
    // Setup event listeners
    setupEventListeners();
}

// Setup form validation rules
function setupFormValidation() {
    progressiveDisclosure.init();
    // Hotel selection validator
    formValidator.registerField('hotel-select', validators.selectRequired('Por favor, selecione um hotel'));
    
    // Check-in date validator
    formValidator.registerField('input-checkin', validators.dateRequired('Por favor, selecione a data de check-in'));
    
    // Check-out date validator with date range check
    formValidator.registerField('input-checkout', (value) => {
        // First check if date is provided
        const dateCheck = validators.dateRequired('Por favor, selecione a data de check-out')(value);
        if (!dateCheck.isValid) {
            return dateCheck;
        }
        
        // Then check if checkout is after checkin
        const rangeCheck = validators.dateRange('input-checkin', 'Check-out deve ser posterior ao check-in')(value);
        return rangeCheck;
    });
    
    logger.debug('Form validation rules registered', 'HotelSearch');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export function to get all hotel cards (used by guest filter with pagination)
export function getAllHotelCards() {
    return allHotelCards;
}
