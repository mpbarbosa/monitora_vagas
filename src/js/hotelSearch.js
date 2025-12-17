/**
 * Hotel Search Module
 * Handles hotel search form submission and results display
 * Separated from index.html per HTML/CSS/JS separation principles
 */

import { apiClient } from '../services/apiClient.js';

// Function to update cache status display
function updateCacheStatus() {
    const stats = apiClient.getCacheStats();
    const statusEl = document.getElementById('cache-status');

    if (stats.exists && !stats.expired) {
        statusEl.textContent = `📦 Cached ${stats.count} hotels (${stats.age} min ago, expires in ${stats.remaining} min)`;
        statusEl.className = 'help-text success';
    } else if (stats.exists && stats.expired) {
        statusEl.textContent = `⏰ Cache expired, fetching fresh data...`;
        statusEl.className = 'help-text warning';
    } else {
        statusEl.textContent = '';
    }
}

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

        select.innerHTML = '<option value="">Loading...</option>';

        const hotels = await apiClient.getHotels(forceRefresh);

        select.innerHTML = '<option value="">Select a hotel</option>';
        hotels.forEach(hotel => {
            const option = document.createElement('option');
            option.value = hotel.hotelId;
            option.textContent = hotel.name;
            select.appendChild(option);
        });

        updateCacheStatus();

    } catch (error) {
        console.error('Error loading hotels:', error);
        select.innerHTML = '<option value="">Error loading hotels - Click 🔄 to retry</option>';

        const statusEl = document.getElementById('cache-status');
        statusEl.textContent = `❌ Error: ${error.message}`;
        statusEl.className = 'help-text error';
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
    banner.className = 'holiday-package-banner';
    
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
    hotelCard.className = 'hotel-card';

    // Hotel header
    const hotelHeader = document.createElement('div');
    hotelHeader.className = 'hotel-header';
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
    vacanciesList.className = 'vacancies-list';

    vacancies.forEach((vacancy, vIndex) => {
        const vacancyItem = document.createElement('div');
        vacancyItem.className = 'vacancy-item';
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
    flexReservaLink.className = 'flex-reserva-link';
    hotelCard.appendChild(flexReservaLink);

    return hotelCard;
}

// Function to create empty state HTML
function createEmptyState() {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
        <div class="empty-state-icon">😔</div>
        <h4 class="empty-state-title">Sem vagas disponíveis</h4>
        <p class="empty-state-message">Não há quartos disponíveis para o período selecionado.</p>
    `;
    return emptyState;
}

// Function to create error state HTML
function createErrorState(errorMessage) {
    const errorState = document.createElement('div');
    errorState.className = 'error-state';
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
    errorState.className = 'error-state';
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

// Function to display formatted results in hotel cards
function displayResults(apiResponse, checkin, checkout, hotel) {
    const resultsContainer = document.getElementById('results-container');
    const hotelsCardsContainer = document.getElementById('hotels-cards-container');

    const { data, holidayPackage } = apiResponse;
    const { result } = data;

    // Clear previous results
    hotelsCardsContainer.innerHTML = '';

    // Show holiday package banner if present
    if (holidayPackage) {
        const packageBanner = createHolidayPackageBanner(holidayPackage);
        hotelsCardsContainer.appendChild(packageBanner);
    }

    // Detailed Vacancies
    if (data.hasAvailability && result.vacancies && result.vacancies.length > 0) {
        // Group by hotel
        const hotelGroups = result.hotelGroups || {};

        Object.keys(hotelGroups).forEach((hotelName) => {
            const vacancies = hotelGroups[hotelName];
            const hotelCard = createHotelCard(hotelName, vacancies);
            hotelsCardsContainer.appendChild(hotelCard);
        });

    } else {
        // Show empty state
        const emptyState = createEmptyState();
        hotelsCardsContainer.appendChild(emptyState);
    }

    // Display results
    resultsContainer.classList.add('visible');

    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    console.log('✅ Results displayed successfully');
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();

    console.log('🚀 Starting vacancy search flow...');

    // Get input parameters from web page UI
    const hotelSelect = document.getElementById('hotel-select');
    const checkinInput = document.getElementById('input-checkin');
    const checkoutInput = document.getElementById('input-checkout');

    const hotel = hotelSelect.value || '-1'; // Default to all hotels
    const checkin = checkinInput.value; // yyyy-mm-dd (ISO format from date input)
    const checkout = checkoutInput.value; // yyyy-mm-dd (ISO format from date input)

    console.log('📝 Input parameters:', { hotel, checkin, checkout });

    // Validate inputs
    if (!checkin || !checkout) {
        alert('Por favor, selecione as datas de check-in e check-out');
        return;
    }

    console.log('✅ Dates in ISO format:', { checkin, checkout });

    // Set searching state (FR-008A)
    if (window.SearchLifecycleState) {
        window.SearchLifecycleState.setSearchingState();
    }

    // Hide previous results
    const resultsContainer = document.getElementById('results-container');
    const hotelsCardsContainer = document.getElementById('hotels-cards-container');
    resultsContainer.classList.remove('visible');
    hotelsCardsContainer.innerHTML = '';

    try {
        // POST the data to API (using GET as per API spec)
        const apiUrl = `https://www.mpbarbosa.com/api/vagas/search?hotel=${encodeURIComponent(hotel)}&checkin=${checkin}&checkout=${checkout}`;
        console.log('🌐 API Request URL:', apiUrl);
        console.log('📤 Posting data to API...');

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        // Fetch the API data
        console.log('📥 Fetching API response...');
        const result = await response.json();
        console.log('✅ API Response received:', result);

        // Handle HTTP errors (including booking rule violations)
        if (!response.ok) {
            // Check if it's a booking rule validation error
            if (response.status === 400 && result.code) {
                throw createBookingRuleError(result);
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        if (!result.success) {
            throw new Error(result.error || 'API returned error');
        }

        // Show the formatted data in the results area
        console.log('📊 Formatting and displaying results...');
        displayResults(result, checkin, checkout, hotel);

    } catch (error) {
        console.error('❌ Search failed:', error);

        // Display error in results container with special handling for booking rules
        if (error.isBookingRuleError) {
            const errorHTML = createBookingRuleErrorHTML(error);
            hotelsCardsContainer.appendChild(errorHTML);
        } else {
            const errorHTML = createErrorState(error.message);
            hotelsCardsContainer.appendChild(errorHTML);
        }
        resultsContainer.classList.add('visible');

        // Don't show alert for booking rule errors (already shown in results)
        if (!error.isBookingRuleError) {
            alert(`Erro na busca: ${error.message}`);
        }
    } finally {
        // Set results state (FR-008A)
        if (window.SearchLifecycleState) {
            window.SearchLifecycleState.setResultsState();
        }
        
        // Enable guest filter after search completion (FR-004A)
        if (window.GuestFilterStateManager) {
            window.GuestFilterStateManager.enable();
            console.log('✅ Guest filter enabled after search completion (FR-004A)');
        }
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
        }, 2000);
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
        }, 2000);
    });
}

// Clear results
function handleClearResults() {
    const hotelsCardsContainer = document.getElementById('hotels-cards-container');
    const resultsContainer = document.getElementById('results-container');
    
    hotelsCardsContainer.innerHTML = '';
    resultsContainer.classList.remove('visible');
}

// Check if dates match a holiday package and update notice visibility
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
    
    if (!checkin || !checkout) {
        notice.classList.remove('visible');
        return;
    }
    
    // Extract month-day from dates (format: YYYY-MM-DD)
    const checkinMD = checkin.substring(5); // MM-DD
    const checkoutMD = checkout.substring(5); // MM-DD
    
    // Check for Christmas Package (Dec 22 → Dec 27)
    if (checkinMD === '12-22' && checkoutMD === '12-27') {
        notice.classList.add('visible');
        noticeText.textContent = '✅ 5 dias / 4 noites - Pacote de Natal completo';
        return;
    }
    
    // Check for New Year Package (Dec 27 → Jan 2)
    if (checkinMD === '12-27' && checkoutMD === '01-02') {
        notice.classList.add('visible');
        noticeText.textContent = '✅ 6 dias / 5 noites - Pacote de Ano Novo completo';
        return;
    }
    
    // Helper function to check if a date is in restricted period
    function isInRestrictedPeriod(monthDay) {
        // Christmas restricted period: Dec 22-26
        const christmasPeriod = ['12-22', '12-23', '12-24', '12-25', '12-26'];
        // New Year restricted period: Dec 27 - Jan 2
        const newYearPeriod = ['12-27', '12-28', '12-29', '12-30', '12-31', '01-01', '01-02'];
        
        return christmasPeriod.includes(monthDay) || newYearPeriod.includes(monthDay);
    }
    
    // Check if dates fall within restricted periods but don't match packages
    if (isInRestrictedPeriod(checkinMD) || isInRestrictedPeriod(checkoutMD)) {
        notice.classList.add('visible');
        
        // Determine which package dates to suggest
        const isChristmasPeriod = ['12-22', '12-23', '12-24', '12-25', '12-26'].includes(checkinMD) || 
                                   ['12-22', '12-23', '12-24', '12-25', '12-26'].includes(checkoutMD);
        const isNewYearPeriod = ['12-27', '12-28', '12-29', '12-30', '12-31', '01-01', '01-02'].includes(checkinMD) || 
                                ['12-27', '12-28', '12-29', '12-30', '12-31', '01-01', '01-02'].includes(checkoutMD);
        
        if (isChristmasPeriod && isNewYearPeriod) {
            noticeText.textContent = '⚠ Datas em período de pacote obrigatório - Natal (22 a 27/dez) ou Ano Novo (27/dez a 02/jan)';
        } else if (isChristmasPeriod) {
            noticeText.textContent = '⚠ Datas em período de pacote obrigatório - Pacote de Natal: 22 a 27/dez';
        } else if (isNewYearPeriod) {
            noticeText.textContent = '⚠ Datas em período de pacote obrigatório - Pacote de Ano Novo: 27/dez a 02/jan';
        } else {
            noticeText.textContent = '⚠ Datas em período de pacote obrigatório - Verifique pacotes disponíveis';
        }
        return;
    }
    
    // No holiday package match
    notice.classList.remove('visible');
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
            console.log('🔄 Manual refresh requested');
            loadHotels(true); // Force refresh
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', handleCopyResults);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', handleClearResults);
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
    // Load hotels on page load
    loadHotels();
    
    // Setup event listeners
    setupEventListeners();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
