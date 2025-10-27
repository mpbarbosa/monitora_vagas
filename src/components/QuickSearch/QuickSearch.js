export function QuickSearch() {
    return `
        <div class="quick-search">
            <div class="quick-search-content">
                <div class="quick-search-header">
                    <h2>Encontre Hotéis Sindicais</h2>
                    <p class="quick-search-subtitle">Busque ofertas exclusivas com tarifas preferenciais</p>
                </div>
                
                <!-- Trust Indicators Above Fold -->
                <div class="trust-indicators">
                    <div class="trust-item">
                        <span class="trust-icon">🏨</span>
                        <span class="trust-text">50+ Hotéis</span>
                    </div>
                    <div class="trust-item">
                        <span class="trust-icon">💰</span>
                        <span class="trust-text">Tarifas Especiais</span>
                    </div>
                    <div class="trust-item">
                        <span class="trust-icon">✨</span>
                        <span class="trust-text">100% Gratuito</span>
                    </div>
                    <div class="trust-item">
                        <span class="trust-icon">👥</span>
                        <span class="trust-text">1000+ Atendidos</span>
                    </div>
                </div>
                
                <!-- Date-Based Search Form -->
                <form id="quick-hotel-search-form" class="quick-search-form">
                    <div class="quick-form-fields">
                        <div class="quick-field-group">
                            <select id="quick-union" name="union" class="quick-select">
                                <option value="afpesp" selected>🏛️ AFPESP - Associação dos Funcionários Públicos do Estado de São Paulo</option>
                            </select>
                        </div>
                        
                        <div class="quick-field-group">
                            <input type="date" id="quick-start-date" name="startDate" class="quick-select">
                        </div>
                        
                        <div class="quick-field-group">
                            <input type="date" id="quick-end-date" name="endDate" class="quick-select">
                        </div>
                    </div>
                    
                    <button type="submit" class="quick-search-button">
                        <span class="search-icon">🔍</span>
                        <span>Buscar Ofertas Agora</span>
                    </button>
                    
                    <!-- Progressive Disclosure Link -->
                    <button type="button" class="advanced-options-toggle" id="show-advanced-search">
                        <span>+ Opções Avançadas</span>
                    </button>
                </form>
            </div>
        </div>
    `;
}