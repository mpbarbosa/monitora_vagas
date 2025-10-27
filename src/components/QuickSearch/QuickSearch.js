export function QuickSearch() {
    return `
        <div class="quick-search">
            <div class="quick-search-content">
                <div class="quick-search-header">
                    <h2>Encontre Hotéis Sindicais</h2>
                    <p class="quick-search-subtitle">Busque ofertas exclusivas com descontos de até 30%</p>
                </div>
                
                <!-- Trust Indicators Above Fold -->
                <div class="trust-indicators">
                    <div class="trust-item">
                        <span class="trust-icon">🏨</span>
                        <span class="trust-text">50+ Hotéis</span>
                    </div>
                    <div class="trust-item">
                        <span class="trust-icon">💰</span>
                        <span class="trust-text">30% Desconto</span>
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
                
                <!-- Simplified 2-Field Search -->
                <form id="quick-hotel-search-form" class="quick-search-form">
                    <div class="quick-form-fields">
                        <div class="quick-field-group">
                            <select id="quick-region" name="region" class="quick-select">
                                <option value="todas">🏨 Todas as Regiões</option>
                                <option value="litoral">🏖️ Litoral</option>
                                <option value="serra">🏔️ Serra</option>
                                <option value="interior">🌾 Interior</option>
                                <option value="capital">🏙️ Capital</option>
                            </select>
                        </div>
                        
                        <div class="quick-field-group">
                            <select id="quick-period" name="period" class="quick-select">
                                <option value="current">📅 Mês Atual</option>
                                <option value="next">📅 Próximo Mês</option>
                                <option value="both" selected>📅 Próximos 2 Meses</option>
                            </select>
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