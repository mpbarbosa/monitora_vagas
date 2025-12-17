import { QuickSearch, initializeQuickSearch } from '../../components/QuickSearch/QuickSearch.js';
import { AdvancedSearchModal } from '../../components/AdvancedSearchModal/index.js';
import { ProgressBar } from '../../components/ProgressBar/index.js';

export function Home() {
    return `
        <div class="home-page">
            <!-- Above-the-Fold Hero with Integrated Quick Search -->
            <section class="hero-section">
                <div class="hero-content">
                    <h1>Hotéis Sindicais Premium</h1>
                    <p class="hero-description">
                        Encontre as melhores ofertas em hotéis conveniados. Tarifas especiais para sindicalistas.
                    </p>
                </div>
                
                <!-- Quick Search Integrated Above-the-Fold -->
                ${QuickSearch()}
                
                <!-- Progress Bar Container -->
                <div id="progress-bar-container" style="display: none;">
                    ${ProgressBar({ current: 0, total: 9, status: 'ready' })}
                </div>
            </section>
            
            <!-- Advanced Search Modal (Progressive Disclosure) -->
            ${AdvancedSearchModal()}
        </div>
    `;
}