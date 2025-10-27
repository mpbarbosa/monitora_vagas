import { QuickSearch } from '../../components/QuickSearch/index.js';
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
            
            <!-- Features Section -->
            <section class="info-section">
                <div class="features-container">
                    <div class="features-header">
                        <h2>Por que usar nosso serviço?</h2>
                        <p class="features-subtitle">Ferramentas poderosas para encontrar as melhores ofertas em hotéis sindicais</p>
                    </div>
                    <div class="features-grid">
                        <div class="info-card">
                            <div class="card-icon">🏨</div>
                            <h3>Rede de Hotéis</h3>
                            <p>Acesse uma ampla rede de hotéis conveniados com sindicatos e federações em destinos turísticos por todo o país.</p>
                        </div>
                        
                        <div class="info-card">
                            <div class="card-icon">🔍</div>
                            <h3>Busca Inteligente</h3>
                            <p>Sistema avançado que compara preços e benefícios dos convênios sindicais, garantindo as melhores condições para filiados.</p>
                        </div>
                        
                        <div class="info-card">
                            <div class="card-icon">⚡</div>
                            <h3>Tarifas Especiais</h3>
                            <p>Aproveite tarifas preferenciais e ofertas exclusivas para sindicalistas, com condições de pagamento facilitadas.</p>
                        </div>
                        
                        <div class="info-card">
                            <div class="card-icon">📱</div>
                            <h3>Acesso Simplificado</h3>
                            <p>Interface moderna e intuitiva que permite pesquisar e reservar hotéis sindicais de forma rápida e segura.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Stats Section -->
            <section class="stats-section">
                <div class="stats-container">
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-number">50+</span>
                            <span class="stat-label">Hotéis Conveniados</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">5★</span>
                            <span class="stat-label">Avaliação Média</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">1000+</span>
                            <span class="stat-label">Sindicalistas Atendidos</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">100%</span>
                            <span class="stat-label">Gratuito</span>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- CTA Section -->
            <section class="cta-section">
                <div class="cta-container">
                    <h2>Pronto para suas férias sindicais?</h2>
                    <p>Comece agora mesmo a buscar as melhores ofertas em hotéis conveniados e garanta sua próxima viagem com tranquilidade!</p>
                    <a href="#hero-section" class="cta-button">
                        <span>Buscar Ofertas</span>
                        <span>→</span>
                    </a>
                </div>
            </section>
            
            <!-- Advanced Search Modal (Progressive Disclosure) -->
            ${AdvancedSearchModal()}
        </div>
    `;
}