// Test regex patterns for hotel vacancy detection

const testContent = `
Homem de Melo (até 2 pessoas)
27/10 - 29/10 (2 dias livres) - 8 Quarto(s)
27/10 - 29/10 (2 dias livres) - 2 Quarto(s) - adaptado

Perdizes (até 2 pessoas)
27/10 - 29/10 (2 dias livres) - 1 Quarto(s) - adaptado
27/10 - 29/10 (2 dias livres) - 11 Quarto(s)

Sumaré (até 2 pessoas)
27/10 - 29/10 (2 dias livres) - 25 Quarto(s)

Triplo (até 3 pessoas)
27/10 - 29/10 (2 dias livres) - 1 Quarto(s)

BLUES Luxo (até 3 pessoas)
27/10 - 29/10 (2 dias livres) - 1 Quarto(s)
`;

// Current hotel vacancy regex
const hotelVacancyRegex = /(?:BLUES\s+)?(?:Triplo|Duplo|Apartamento|Chalé|Homem\s+de\s+Melo|Perdizes|Sumaré)\s*(?:Luxo|PcD)?\s*\(até\s+\d+\s+pessoas?\)[\s\n]*(?:\d{1,2}\/\d{1,2}\s*-\s*\d{1,2}\/\d{1,2}\s*\(\d+\s+dias?\s+livres?\)\s*-\s*\d+\s+Quarto\(s\)(?:\s*-\s*adaptado)?[\s\n]*)+/gi;

// Hotel location pattern (multi-line)
const hotelLocationPattern = /(Homem\s+de\s+Melo|Perdizes|Sumaré)\s*\(até\s+\d+\s+pessoas?\)[\s\n]+((?:\d{1,2}\/\d{1,2}\s*-\s*\d{1,2}\/\d{1,2}\s*\(\d+\s+dias?\s+livres?\)\s*-\s*\d+\s+Quarto\(s\)(?:\s*-\s*adaptado)?[\s\n]*)+)/gi;

console.log("=== TESTING REGEX PATTERNS ===\n");

console.log("1. Testing hotelVacancyRegex:");
const vacancyMatches = testContent.match(hotelVacancyRegex) || [];
console.log(`Found ${vacancyMatches.length} matches:`);
vacancyMatches.forEach((match, index) => {
    console.log(`  ${index + 1}. "${match.trim()}"`);
});

console.log("\n2. Testing hotelLocationPattern:");
const locationMatches = testContent.match(hotelLocationPattern) || [];
console.log(`Found ${locationMatches.length} matches:`);
locationMatches.forEach((match, index) => {
    console.log(`  ${index + 1}. "${match.trim()}"`);
});

console.log("\n3. Testing individual hotel locations:");
const hotelNames = ['Homem de Melo', 'Perdizes', 'Sumaré'];
hotelNames.forEach(hotel => {
    const hotelPattern = new RegExp(`${hotel.replace(/\s+/g, '\\s+')}\\s*\\(até\\s+\\d+\\s+pessoas?\\)`, 'gi');
    const matches = testContent.match(hotelPattern) || [];
    console.log(`  ${hotel}: ${matches.length} match(es) - ${matches.join(', ')}`);
});

console.log("\n4. Testing simplified multi-line pattern:");
const simpleMultiLinePattern = /(Homem\s+de\s+Melo|Perdizes|Sumaré)\s*\([^)]+\)[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi;
const simpleMatches = testContent.match(simpleMultiLinePattern) || [];
console.log(`Found ${simpleMatches.length} matches:`);
simpleMatches.forEach((match, index) => {
    console.log(`  ${index + 1}. "${match.trim()}"`);
});