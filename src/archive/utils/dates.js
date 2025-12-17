// Weekend calculation and date formatting utilities
// Adapted from the existing selenium-script.js

/**
 * Get all Friday-Sunday weekends for the next specified months
 * @param {number} monthsAhead - Number of months to look ahead (default: 2)
 * @returns {Array} Array of weekend objects with Friday and Sunday dates
 */
export function getNextWeekends(monthsAhead = 2) {
    const weekends = [];
    const today = new Date();
    const endDate = new Date(today);
    endDate.setMonth(today.getMonth() + monthsAhead);
    
    let currentFriday = new Date(today);
    const daysUntilFriday = (5 - today.getDay() + 7) % 7;
    
    if (daysUntilFriday === 0 && today.getDay() !== 5) {
        currentFriday.setDate(today.getDate() + 7);
    } else {
        currentFriday.setDate(today.getDate() + daysUntilFriday);
    }
    
    while (currentFriday <= endDate) {
        const currentSunday = new Date(currentFriday);
        currentSunday.setDate(currentFriday.getDate() + 2);
        
        weekends.push({
            friday: new Date(currentFriday),
            sunday: new Date(currentSunday),
            weekend: `${currentFriday.toLocaleDateString()} to ${currentSunday.toLocaleDateString()}`
        });
        
        // Move to next Friday (7 days later)
        currentFriday.setDate(currentFriday.getDate() + 7);
    }
    
    return weekends;
}

/**
 * Format date in Brazilian format (DD/MM/YYYY)
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
export function formatBrazilianDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}

/**
 * Get the name of the day of the week in Portuguese
 * @param {Date} date - Date object
 * @returns {string} Day name in Portuguese
 */
export function getDayNameInPortuguese(date) {
    const days = [
        'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
        'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
    return days[date.getDay()];
}

/**
 * Check if a date is a weekend (Friday, Saturday, or Sunday)
 * @param {Date} date - Date to check
 * @returns {boolean} True if it's a weekend day
 */
export function isWeekend(date) {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6; // Sun, Fri, Sat
}