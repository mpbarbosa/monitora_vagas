// Busca de Vagas em Hotéis Sindicais - Main Application Entry Point
// This is the root component that initializes the web application

// Import core dependencies
import { CONFIG, validateConfiguration, getConfigSummary } from './config/index.js';
import { getNextWeekends } from './utils/dates.js';

// Import components
import { SearchForm } from './components/SearchForm/index.js';
import { SearchFormHandler } from './components/SearchForm/SearchFormHandler.js';
import { ProgressBar } from './components/ProgressBar/index.js';
import { Home } from './pages/Home/index.js';

/**
 * Main Application Class
 * Manages the overall application state and routing
 */
class App {
    constructor() {
        this.config = CONFIG;
        this.currentView = 'home';
        this.searchState = {
            isActive: false,
            progress: 0,
            status: 'idle',
            results: []
        };
        
        // Initialize application
        this.init();
    }
    
    /**
     * Initialize the application
     */
    async init() {
        try {
            // Validate configuration
            const configValidation = validateConfiguration();
            if (!configValidation.valid) {
                console.error('Configuration validation failed:', configValidation.errors);
                this.showError('Erro de configuração da aplicação');
                return;
            }
            
            // Log configuration summary in development
            if (this.config.env.isDevelopment) {
                console.log('App Configuration:', getConfigSummary());
            }
            
            // Set up the application
            this.setupDOM();
            this.setupEventListeners();
            this.renderCurrentView();
            
            console.log('Hotéis Sindicais initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Erro ao inicializar aplicação');
        }
    }
    
    /**
     * Set up the basic DOM structure
     */
    setupDOM() {
        // Ensure we have a root element
        let appRoot = document.getElementById('app');
        if (!appRoot) {
            appRoot = document.createElement('div');
            appRoot.id = 'app';
            document.body.appendChild(appRoot);
        }
        
        // Set up basic application structure
        appRoot.innerHTML = `
            <div class="app-container">
                <header class="app-header">
                    <nav class="app-nav">
                        <div class="nav-brand">
                            <h1>Hotéis Sindicais</h1>
                        </div>
                        <div class="nav-links">
                            <button class="nav-link" data-view="home">Início</button>
                            <button class="nav-link" data-view="search">Buscar</button>
                            <button class="nav-link" data-view="history">Histórico</button>
                        </div>
                    </nav>
                </header>
                
                <main class="app-main" id="main-content">
                    <!-- Dynamic content will be rendered here -->
                </main>
                
                <footer class="app-footer">
                    <p>&copy; 2025 Busca de Vagas em Hotéis Sindicais v${this.config.app.version}</p>
                </footer>
            </div>
        `;
    }
    
    /**
     * Set up global event listeners
     */
    setupEventListeners() {
        // Navigation event listeners
        document.addEventListener('click', (event) => {
            if (event.target.matches('.nav-link')) {
                const view = event.target.dataset.view;
                this.navigateTo(view);
            }
        });
        
        // Global search event listeners
        document.addEventListener('search:start', (event) => {
            this.handleSearchStart(event.detail);
        });
        
        document.addEventListener('search:progress', (event) => {
            this.handleSearchProgress(event.detail);
        });
        
        document.addEventListener('search:complete', (event) => {
            this.handleSearchComplete(event.detail);
        });
        
        document.addEventListener('search:error', (event) => {
            this.handleSearchError(event.detail);
        });
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            const view = event.state?.view || 'home';
            this.navigateTo(view, false);
        });
    }
    
    /**
     * Navigate to a different view
     * @param {string} view - The view to navigate to
     * @param {boolean} pushState - Whether to push state to history
     */
    navigateTo(view, pushState = true) {
        if (this.currentView === view) return;
        
        this.currentView = view;
        
        // Update URL and history
        if (pushState) {
            history.pushState({ view }, '', `#${view}`);
        }
        
        // Update navigation active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.view === view) {
                link.classList.add('active');
            }
        });
        
        // Render the new view
        this.renderCurrentView();
    }
    
    /**
     * Render the current view
     */
    renderCurrentView() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;
        
        switch (this.currentView) {
            case 'home':
                this.renderHomeView(mainContent);
                break;
            case 'search':
                this.renderSearchView(mainContent);
                break;
            case 'history':
                this.renderHistoryView(mainContent);
                break;
            default:
                this.renderHomeView(mainContent);
        }
    }
    
    /**
     * Render the home view
     */
    renderHomeView(container) {
        container.innerHTML = Home();
        
        // Initialize search form handler for date selection
        setTimeout(() => {
            new SearchFormHandler();
        }, 100);
        
        // Initialize QuickSearch component
        setTimeout(() => {
            // Import and initialize QuickSearch
            import('./components/QuickSearch/QuickSearch.js').then(({ initializeQuickSearch }) => {
                initializeQuickSearch();
            });
        }, 150);
    }
    
    /**
     * Render the search view
     */
    renderSearchView(container) {
        container.innerHTML = `
            <div class="search-page">
                <div class="search-header">
                    <h2>Buscar Disponibilidade</h2>
                    <p>Configure sua busca por ofertas em hotéis sindicais</p>
                </div>
                
                <div class="search-form-container" id="search-form-container">
                    <!-- Search form will be rendered here -->
                </div>
                
                <div class="search-progress-container" id="search-progress-container" style="display: none;">
                    <!-- Progress bar will be rendered here -->
                </div>
                
                <div class="search-results-container" id="search-results-container" style="display: none;">
                    <!-- Search results will be rendered here -->
                </div>
            </div>
        `;
        
        // Render search form
        const formContainer = container.querySelector('#search-form-container');
        formContainer.innerHTML = SearchForm();
        
        // Initialize search form handler for date selection
        setTimeout(() => {
            new SearchFormHandler();
        }, 100);
        
        // Initialize progress bar (hidden initially)
        const progressContainer = container.querySelector('#search-progress-container');
        progressContainer.innerHTML = ProgressBar({ current: 0, total: 9, status: 'ready' });
    }
    
    /**
     * Render the history view
     */
    renderHistoryView(container) {
        container.innerHTML = `
            <div class="history-page">
                <div class="history-header">
                    <h2>Histórico de Buscas</h2>
                    <p>Visualize suas buscas anteriores</p>
                </div>
                
                <div class="history-content">
                    <p class="coming-soon">Em desenvolvimento...</p>
                </div>
            </div>
        `;
    }
    
    /**
     * Handle search start event
     */
    handleSearchStart(details) {
        this.searchState.isActive = true;
        this.searchState.progress = 0;
        this.searchState.status = 'running';
        
        // Show progress bar
        const progressContainer = document.getElementById('search-progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'block';
        }
        
        // Hide results
        const resultsContainer = document.getElementById('search-results-container');
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
    }
    
    /**
     * Handle search progress event
     */
    handleSearchProgress(details) {
        this.searchState.progress = details.progress;
        
        // Update progress bar
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${details.progress}%`;
        }
        
        const progressText = document.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = details.status || `${details.progress}% concluído`;
        }
    }
    
    /**
     * Handle search complete event
     */
    handleSearchComplete(details) {
        this.searchState.isActive = false;
        this.searchState.progress = 100;
        this.searchState.status = 'completed';
        this.searchState.results = details.results || [];
        
        // Hide progress bar
        const progressContainer = document.getElementById('search-progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
        
        // Show results
        this.renderSearchResults(details.results);
    }
    
    /**
     * Handle search error event
     */
    handleSearchError(details) {
        this.searchState.isActive = false;
        this.searchState.status = 'error';
        
        console.error('Search error:', details.error);
        this.showError(details.message || 'Erro durante a busca');
        
        // Hide progress bar
        const progressContainer = document.getElementById('search-progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
    }
    
    /**
     * Render search results
     */
    renderSearchResults(results) {
        const resultsContainer = document.getElementById('search-results-container');
        if (!resultsContainer) return;
        
        if (!results || results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <h3>Nenhuma vaga encontrada</h3>
                    <p>Não foram encontradas vagas disponíveis para os critérios especificados.</p>
                </div>
            `;
        } else {
            resultsContainer.innerHTML = `
                <div class="results-header">
                    <h3>Vagas Encontradas</h3>
                    <p>Encontradas ${results.length} vaga(s) disponível(is)</p>
                </div>
                
                <div class="results-list">
                    ${results.map(result => `
                        <div class="result-item">
                            <h4>${result.hotel}</h4>
                            <p>${result.vacancy}</p>
                            <small>${result.dates}</small>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        resultsContainer.style.display = 'block';
    }
    
    /**
     * Show error message
     */
    showError(message) {
        // Simple error display - can be enhanced with a proper modal/toast system
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 1000;
        `;
        
        document.body.appendChild(errorDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.afpespApp = new App();
});

// Export for potential external use
export default App;