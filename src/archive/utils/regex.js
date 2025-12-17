// Hotel vacancy pattern matching utilities
// Adapted from the existing selenium-script.js regex patterns

/**
 * Hotel vacancy detection patterns
 */
export const HOTEL_VACANCY_PATTERNS = {
    // Comprehensive pattern for hotel vacancies
    general: /([A-ZÀÁÂÃÄÇÉÊËÍÎÏÑÓÔÕÖÚÛÜÝ][a-zàáâãäçéêëíîïñóôõöúûüý\s]+(?:Luxo|PcD|de\s+Melo)?)\s*\(até\s+\d+\s+pessoas?\)[\s\n]*(?:\d{1,2}\/\d{1,2}\s*-\s*\d{1,2}\/\d{1,2}\s*\(\d+\s+dias?\s+livres?\)\s*-\s*\d+\s+Quarto\(s\)(?:\s*-\s*adaptado)?[\s\n]*)+/gi,
    
    // Specific pattern for BLUES luxury rooms
    blues: /BLUES\s+Luxo\s*\(até\s+3\s+pessoas?\)/gi,
    
    // Hotel location pattern (multi-line availability)
    locations: /(Homem\s+de\s+Melo|Perdizes|Sumaré)\s*\(até\s+\d+\s+pessoas?\)[\s\n]+((?:\d{1,2}\/\d{1,2}\s*-\s*\d{1,2}\/\d{1,2}\s*\(\d+\s+dias?\s+livres?\)\s*-\s*\d+\s+Quarto\(s\)(?:\s*-\s*adaptado)?[\s\n]*)+)/gi,
    
    // Date range pattern for flexible date matching
    dateRange: /\d{1,2}\/\d{1,2}\s*-\s*\d{1,2}\/\d{1,2}\s*\(\d+\s+dias?\s+livres?\)\s*-\s*\d+\s+Quarto\(s\)(?:\s*-\s*adaptado)?/gi,
    
    // Room type patterns
    roomTypes: [
        /BLUES\s+Luxo\s*\(até\s+\d+\s+pessoas?\)/gi,
        /Triplo(?:\s+Luxo)?\s*\(até\s+\d+\s+pessoas?\)/gi,
        /Duplo\s*\(até\s+\d+\s+pessoas?\)/gi,
        /Apartamento(?:\s+PcD)?\s*\(até\s+\d+\s+pessoas?\)/gi,
        /Chalé\s*\(até\s+\d+\s+pessoas?\)/gi,
        /Homem\s+de\s+Melo\s*\(até\s+\d+\s+pessoas?\)/gi,
        /Perdizes\s*\(até\s+\d+\s+pessoas?\)/gi,
        /Sumaré\s*\(até\s+\d+\s+pessoas?\)/gi
    ]
};

/**
 * Check for "NO ROOM" messages that should be ignored
 */
export const NO_ROOM_PATTERN = /No período escolhido não há nenhum quarto disponível/i;

/**
 * Parse hotel vacancies from HTML content
 * @param {string} htmlContent - HTML content to parse
 * @returns {Object} Parsed vacancy information
 */
export function parseHotelVacancies(htmlContent) {
    const foundVacancies = [];
    let hasActualAvailability = false;
    
    // Check for "NO ROOM" message first
    const hasNoRoomMessage = NO_ROOM_PATTERN.test(htmlContent);
    
    // Parse hotels and their vacancies using the cc_tit structure
    const hotelSections = htmlContent.split(/<div class="cc_tit">/i);
    
    for (let i = 1; i < hotelSections.length; i++) {
        const section = hotelSections[i];
        
        // Extract hotel name from the section and clean it
        const hotelNameMatch = section.match(/^([^<]+)</);
        const rawHotelName = hotelNameMatch ? hotelNameMatch[1].trim() : 'Unknown Hotel';
        const hotelName = rawHotelName.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        
        // Skip if this section contains "NO ROOM" message
        if (NO_ROOM_PATTERN.test(section)) {
            continue;
        }
        
        // Look for vacancy patterns in this hotel section
        HOTEL_VACANCY_PATTERNS.roomTypes.forEach(pattern => {
            const matches = section.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    // Clean match by removing HTML tags and normalizing whitespace
                    const cleanMatch = match.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
                    const vacancyInfo = {
                        hotel: hotelName,
                        vacancy: cleanMatch,
                        fullText: `${hotelName}: ${cleanMatch}`
                    };
                    
                    // Check if this vacancy is not already added
                    if (!foundVacancies.some(v => v.fullText === vacancyInfo.fullText)) {
                        foundVacancies.push(vacancyInfo);
                        hasActualAvailability = true;
                    }
                });
            }
        });
    }
    
    return {
        hasAvailability: hasActualAvailability,
        vacancies: foundVacancies,
        hasNoRoomMessage
    };
}

/**
 * Clean HTML tags from text content
 * @param {string} text - Text with HTML tags
 * @returns {string} Clean text without HTML tags
 */
export function cleanHtmlTags(text) {
    return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}