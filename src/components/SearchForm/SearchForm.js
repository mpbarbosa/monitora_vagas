export function SearchForm() {
    return `
        <div class="search-form">
            <div class="search-form-header">
                <h2>Configure sua Busca</h2>
                <p class="search-form-subtitle">Escolha os critérios para encontrar as melhores ofertas em hotéis sindicais</p>
            </div>
            
            <form id="hotel-search-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="union-selection">Sindicato / Federação</label>
                        <select id="union-selection" name="unionSelection">
                            <option value="afpesp" selected>🏛️ AFPESP - Associação dos Funcionários Públicos do Estado de São Paulo</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="hotel-selection">Região de Interesse</label>
                        <select id="hotel-selection" name="hotelSelection">
                            <option value="todas">🏨 Todas as Regiões</option>
                            <option value="litoral">🏖️ Litoral</option>
                            <option value="serra">🏔️ Serra</option>
                            <option value="interior">🌾 Interior</option>
                            <option value="capital">🏙️ Capital</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Período de Busca</label>
                        <div class="date-selection-container">
                            <!-- Date Method Selection -->
                            <div class="date-method-selection">
                                <div class="radio-option">
                                    <input type="radio" id="date-method-months" name="dateMethod" value="months" checked>
                                    <label for="date-method-months">📅 Por Mês</label>
                                </div>
                                <div class="radio-option">
                                    <input type="radio" id="date-method-range" name="dateMethod" value="range">
                                    <label for="date-method-range">🗓️ Período Específico</label>
                                </div>
                            </div>
                            
                            <!-- Month Selection (Default) -->
                            <div id="month-selection-container" class="date-option-container">
                                <select id="month-selection" name="monthSelection">
                                    <option value="current">📅 Mês Atual</option>
                                    <option value="next">📅 Próximo Mês</option>
                                    <option value="both" selected>📅 Próximos 2 Meses</option>
                                </select>
                            </div>
                            
                            <!-- Date Range Selection -->
                            <div id="date-range-container" class="date-option-container" style="display: none;">
                                <div class="date-range-inputs">
                                    <div class="date-input-group">
                                        <label for="start-date">Data de Entrada</label>
                                        <input type="date" id="start-date" name="startDate">
                                    </div>
                                    <div class="date-input-group">
                                        <label for="end-date">Data de Saída</label>
                                        <input type="date" id="end-date" name="endDate">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Tipo de Estadia</label>
                    <div class="radio-group">
                        <div class="radio-option">
                            <input type="radio" id="single-weekend" name="searchType" value="single">
                            <label for="single-weekend">Fim de Semana</label>
                        </div>
                        
                        <div class="radio-option">
                            <input type="radio" id="all-weekends" name="searchType" value="all" checked>
                            <label for="all-weekends">Semana Completa</label>
                        </div>
                    </div>
                </div>
                
                <button type="submit" class="search-button">
                    <span class="search-icon">🔍</span>
                    <span>Buscar Ofertas</span>
                </button>
            </form>
        </div>
    `;
}