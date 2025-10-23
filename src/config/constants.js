// Constants used throughout the AFPESP Hotel Vacancy Monitor application
// Centralized location for all application constants

/**
 * Hotel configuration constants
 */
export const HOTELS = {
    GUARUJA: {
        id: 'guaruja',
        name: 'Guarujá',
        fullName: 'Hotel AFPESP Guarujá',
        location: 'Praia do Guarujá, SP',
        description: 'Hotel com vista para o mar na bela Praia do Guarujá',
        type: 'beach',
        amenities: ['Piscina', 'Praia', 'Restaurante', 'Wi-Fi'],
        maxOccupancy: 4,
        roomTypes: ['BLUES Luxo', 'Apartamento', 'Apartamento PcD']
    },
    CAMPOS_JORDAO: {
        id: 'campos-jordao',
        name: 'Campos do Jordão',
        fullName: 'Hotel AFPESP Campos do Jordão',
        location: 'Campos do Jordão, SP',
        description: 'Ambiente de montanha na Serra da Mantiqueira',
        type: 'mountain',
        amenities: ['Lareira', 'Trilhas', 'Restaurante', 'Wi-Fi'],
        maxOccupancy: 3,
        roomTypes: ['Triplo', 'Duplo', 'Chalé', 'Homem de Melo', 'Perdizes', 'Sumaré']
    }
};

/**
 * Search type constants
 */
export const SEARCH_TYPES = {
    WEEKEND: {
        id: 'weekend',
        name: 'Finais de Semana',
        description: 'Busca automática por finais de semana consecutivos',
        icon: '📅'
    },
    SPECIFIC_DATES: {
        id: 'specific-dates',
        name: 'Datas Específicas',
        description: 'Busca por datas específicas escolhidas pelo usuário',
        icon: '🗓️'
    }
};

/**
 * Room type constants with capacity information
 */
export const ROOM_TYPES = {
    BLUES_LUXO: {
        id: 'blues-luxo',
        name: 'BLUES Luxo',
        capacity: 3,
        description: 'Quarto luxo com vista privilegiada'
    },
    TRIPLO: {
        id: 'triplo',
        name: 'Triplo',
        capacity: 3,
        description: 'Quarto para até 3 pessoas'
    },
    TRIPLO_LUXO: {
        id: 'triplo-luxo',
        name: 'Triplo Luxo',
        capacity: 3,
        description: 'Quarto triplo categoria luxo'
    },
    DUPLO: {
        id: 'duplo',
        name: 'Duplo',
        capacity: 2,
        description: 'Quarto para casal'
    },
    APARTAMENTO: {
        id: 'apartamento',
        name: 'Apartamento',
        capacity: 4,
        description: 'Apartamento completo'
    },
    APARTAMENTO_PCD: {
        id: 'apartamento-pcd',
        name: 'Apartamento PcD',
        capacity: 4,
        description: 'Apartamento adaptado para pessoa com deficiência'
    },
    CHALE: {
        id: 'chale',
        name: 'Chalé',
        capacity: 4,
        description: 'Chalé independente'
    },
    HOMEM_DE_MELO: {
        id: 'homem-de-melo',
        name: 'Homem de Melo',
        capacity: 4,
        description: 'Acomodação Homem de Melo'
    },
    PERDIZES: {
        id: 'perdizes',
        name: 'Perdizes',
        capacity: 4,
        description: 'Acomodação Perdizes'
    },
    SUMARE: {
        id: 'sumare',
        name: 'Sumaré',
        capacity: 4,
        description: 'Acomodação Sumaré'
    }
};

/**
 * Search status constants
 */
export const SEARCH_STATUS = {
    IDLE: {
        id: 'idle',
        name: 'Aguardando',
        description: 'Pronto para iniciar busca',
        color: '#6c757d'
    },
    RUNNING: {
        id: 'running',
        name: 'Buscando',
        description: 'Busca em andamento',
        color: '#007bff'
    },
    SUCCESS: {
        id: 'success',
        name: 'Concluído',
        description: 'Busca concluída com sucesso',
        color: '#28a745'
    },
    ERROR: {
        id: 'error',
        name: 'Erro',
        description: 'Erro durante a busca',
        color: '#dc3545'
    },
    CANCELLED: {
        id: 'cancelled',
        name: 'Cancelado',
        description: 'Busca cancelada pelo usuário',
        color: '#ffc107'
    }
};

/**
 * Date and time constants
 */
export const DATE_CONSTANTS = {
    // Weekend configuration
    WEEKEND_START_DAY: 5, // Friday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    WEEKEND_END_DAY: 0,   // Sunday
    WEEKEND_DURATION_DAYS: 3, // Friday to Sunday
    
    // Date formats
    DISPLAY_DATE_FORMAT: 'DD/MM/YYYY',
    API_DATE_FORMAT: 'YYYY-MM-DD',
    SHORT_DATE_FORMAT: 'DD/MM',
    
    // Search limits
    MIN_WEEKENDS: 1,
    MAX_WEEKENDS: 12,
    DEFAULT_WEEKENDS: 8,
    
    // Days of the week in Portuguese
    DAYS_OF_WEEK: [
        'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
        'Quinta-feira', 'Sexta-feira', 'Sábado'
    ],
    
    // Months in Portuguese
    MONTHS: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
};

/**
 * API endpoints and URLs
 */
export const API_ENDPOINTS = {
    // Search endpoints
    SEARCH_AVAILABILITY: '/search/availability',
    SEARCH_WEEKEND: '/search/weekend',
    SEARCH_SPECIFIC_DATES: '/search/specific-dates',
    
    // History endpoints
    SEARCH_HISTORY: '/history',
    SAVE_SEARCH: '/history/save',
    DELETE_SEARCH: '/history/delete',
    
    // Configuration endpoints
    CONFIG: '/config',
    HOTELS: '/config/hotels',
    ROOM_TYPES: '/config/room-types'
};

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet e tente novamente.',
    SERVER_ERROR: 'Erro interno do servidor. Tente novamente mais tarde.',
    INVALID_DATES: 'Datas inválidas. Verifique os valores inseridos.',
    NO_RESULTS: 'Nenhum resultado encontrado para os critérios especificados.',
    SEARCH_TIMEOUT: 'A busca demorou mais que o esperado. Tente novamente.',
    INVALID_HOTEL: 'Hotel selecionado inválido.',
    EXCEEDED_LIMIT: 'Limite de buscas excedido. Tente novamente mais tarde.'
};

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
    SEARCH_COMPLETED: 'Busca concluída com sucesso!',
    SEARCH_SAVED: 'Busca salva no histórico.',
    SEARCH_DELETED: 'Busca removida do histórico.',
    DATA_EXPORTED: 'Dados exportados com sucesso.'
};

/**
 * UI constants
 */
export const UI_CONSTANTS = {
    // Animation durations (milliseconds)
    ANIMATION_DURATION_FAST: 150,
    ANIMATION_DURATION_NORMAL: 300,
    ANIMATION_DURATION_SLOW: 500,
    
    // Breakpoints (pixels)
    BREAKPOINT_MOBILE: 768,
    BREAKPOINT_TABLET: 1024,
    BREAKPOINT_DESKTOP: 1200,
    
    // Z-index values
    Z_INDEX_MODAL: 1000,
    Z_INDEX_TOOLTIP: 1010,
    Z_INDEX_DROPDOWN: 1020,
    
    // Pagination
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
};

/**
 * Regular expressions for validation
 */
export const REGEX_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    DATE: /^\d{2}\/\d{2}\/\d{4}$/,
    PHONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
};