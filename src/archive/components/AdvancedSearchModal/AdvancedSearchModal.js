export function AdvancedSearchModal() {
    return `
        <div id="advanced-search-modal" class="modal-overlay" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Busca Avançada</h3>
                    <button type="button" class="modal-close" id="close-advanced-search">×</button>
                </div>
                
                <form id="advanced-hotel-search-form" class="advanced-search-form">
                    <div class="advanced-form-grid">
                        <div class="form-group">
                            <label for="advanced-union-selection">Sindicato / Federação</label>
                            <select id="advanced-union-selection" name="unionSelection">
                                <option value="afpesp" selected>🏛️ AFPESP - Associação dos Funcionários Públicos do Estado de São Paulo</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="advanced-hotel-selection">Região de Interesse</label>
                            <select id="advanced-hotel-selection" name="hotelSelection">
                                <option value="todas">🏨 Todas as Regiões</option>
                                <option value="litoral">🏖️ Litoral</option>
                                <option value="serra">🏔️ Serra</option>
                                <option value="interior">🌾 Interior</option>
                                <option value="capital">🏙️ Capital</option>
                            </select>
                        </div>
                        
                        <div class="form-group full-width">
                            <label>Período de Busca</label>
                            <div class="date-selection-container">
                                <!-- Date Method Selection -->
                                <div class="date-method-selection">
                                    <div class="radio-option">
                                        <input type="radio" id="advanced-date-method-months" name="advancedDateMethod" value="months" checked>
                                        <label for="advanced-date-method-months">📅 Por Mês</label>
                                    </div>
                                    <div class="radio-option">
                                        <input type="radio" id="advanced-date-method-range" name="advancedDateMethod" value="range">
                                        <label for="advanced-date-method-range">🗓️ Período Específico</label>
                                    </div>
                                </div>
                                
                                <!-- Month Selection (Default) -->
                                <div id="advanced-month-selection-container" class="date-option-container">
                                    <select id="advanced-month-selection" name="monthSelection">
                                        <option value="current">📅 Mês Atual</option>
                                        <option value="next">📅 Próximo Mês</option>
                                        <option value="both" selected>📅 Próximos 2 Meses</option>
                                    </select>
                                </div>
                                
                                <!-- Date Range Selection -->
                                <div id="advanced-date-range-container" class="date-option-container" style="display: none;">
                                    <div class="date-range-inputs">
                                        <div class="date-input-group">
                                            <label for="advanced-start-date">Data de Entrada</label>
                                            <input type="date" id="advanced-start-date" name="startDate">
                                        </div>
                                        <div class="date-input-group">
                                            <label for="advanced-end-date">Data de Saída</label>
                                            <input type="date" id="advanced-end-date" name="endDate">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group full-width">
                            <label>Tipo de Estadia</label>
                            <div class="radio-group">
                                <div class="radio-option">
                                    <input type="radio" id="advanced-single-weekend" name="advancedSearchType" value="single">
                                    <label for="advanced-single-weekend">Fim de Semana</label>
                                </div>
                                
                                <div class="radio-option">
                                    <input type="radio" id="advanced-all-weekends" name="advancedSearchType" value="all" checked>
                                    <label for="advanced-all-weekends">Semana Completa</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button type="button" class="cancel-button" id="cancel-advanced-search">
                            Cancelar
                        </button>
                        <button type="submit" class="advanced-search-button">
                            <span class="search-icon">🔍</span>
                            <span>Buscar com Filtros</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}