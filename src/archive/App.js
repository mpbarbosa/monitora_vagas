// Main application component
import { Home } from './pages/Home/index.js';

export function App() {
    return `
        <div class="app">
            <header class="app-header">
                <h1>AFPESP Hotel Vacancy Monitor</h1>
                <p>Monitor hotel availability across multiple weekends</p>
            </header>
            <main class="app-main">
                ${Home()}
            </main>
            <footer class="app-footer">
                <p>&copy; 2025 AFPESP Hotel Vacancy Monitor</p>
            </footer>
        </div>
    `;
}