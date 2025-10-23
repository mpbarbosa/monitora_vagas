// Test the updated general pattern

const testContent = `
Homem de Melo (até 2 pessoas)
27/10 - 29/10 (2 dias livres) - 8 Quarto(s)
27/10 - 29/10 (2 dias livres) - 2 Quarto(s) - adaptado

BLUES Luxo (até 3 pessoas)
27/10 - 29/10 (2 dias livres) - 1 Quarto(s)

Santos (até 4 pessoas)
27/10 - 29/10 (2 dias livres) - 3 Quarto(s)

Vila Madalena (até 2 pessoas)
27/10 - 29/10 (2 dias livres) - 5 Quarto(s)
`;

const generalVacancyPattern = /([A-ZÀÁÂÃÄÇÉÊËÍÎÏÑÓÔÕÖÚÛÜÝ][a-zàáâãäçéêëíîïñóôõöúûüý\s]+(?:Luxo|PcD|de\s+Melo)?)\s*\(até\s+\d+\s+pessoas?\)[\s\n]*(?:\d{1,2}\/\d{1,2}\s*-\s*\d{1,2}\/\d{1,2}\s*\(\d+\s+dias?\s+livres?\)\s*-\s*\d+\s+Quarto\(s\)(?:\s*-\s*adaptado)?[\s\n]*)+/gi;

console.log("=== TESTING GENERAL PATTERN ===\n");
const matches = testContent.match(generalVacancyPattern) || [];
console.log(`Found ${matches.length} matches:`);
matches.forEach((match, index) => {
    console.log(`  ${index + 1}. "${match.trim()}"`);
});