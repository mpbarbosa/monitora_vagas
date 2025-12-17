export function ProgressBar({ current = 0, total = 9, status = 'ready' }) {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    
    return `
        <div class="progress-container">
            <div class="progress-header">
                <h3>Progresso da Busca</h3>
                <span class="progress-text">${current} de ${total} finais de semana</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="progress-status ${status}">
                ${getStatusContent(status)}
            </div>
        </div>
    `;
}

function getStatusContent(status) {
    const statusConfig = {
        ready: {
            icon: '⏳',
            text: 'Pronto para iniciar a busca',
            spinning: false
        },
        searching: {
            icon: '�',
            text: 'Buscando vagas disponíveis...',
            spinning: true
        },
        completed: {
            icon: '✅',
            text: 'Busca concluída com sucesso!',
            spinning: false
        },
        error: {
            icon: '❌',
            text: 'Erro durante a busca',
            spinning: false
        }
    };
    
    const config = statusConfig[status] || statusConfig.ready;
    const spinClass = config.spinning ? ' spinning' : '';
    
    return `
        <span class="status-icon${spinClass}">${config.icon}</span>
        <span>${config.text}</span>
    `;
}