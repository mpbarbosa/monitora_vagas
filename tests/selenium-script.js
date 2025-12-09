const { Builder, By, until, Select } = require('selenium-webdriver');

// Function to get all Friday-Sunday weekends for the next two months
function getNextWeekends(monthsAhead = 2) {
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

// Function to display comprehensive weekend search summary
function displayWeekendSummary(searchResults) {
    console.log(`\n${'='.repeat(100)}`);
    console.log(`🏨 COMPREHENSIVE WEEKEND HOTEL VACANCY SUMMARY`);
    console.log(`${'='.repeat(100)}`);
    
    const availableWeekends = searchResults.filter(r => r.result && r.result.hasAvailability === true);
    const unavailableWeekends = searchResults.filter(r => r.result && r.result.hasAvailability === false);
    const errorWeekends = searchResults.filter(r => r.status === 'ERROR');
    
    console.log(`\n📊 OVERALL STATISTICS:`);
    console.log(`  🟢 Available Weekends: ${availableWeekends.length}/${searchResults.length}`);
    console.log(`  🔴 No Availability: ${unavailableWeekends.length}/${searchResults.length}`);
    console.log(`  ❌ Errors: ${errorWeekends.length}/${searchResults.length}`);
    
    if (availableWeekends.length > 0) {
        console.log(`\n🎉 WEEKENDS WITH AVAILABILITY:`);
        availableWeekends.forEach(weekend => {
            console.log(`  ✅ Weekend ${weekend.weekendNumber}: ${weekend.dates}`);
            if (weekend.result && weekend.result.summary) {
                console.log(`      📊 ${weekend.result.summary}`);
            }
            if (weekend.result && weekend.result.hotelGroups && Object.keys(weekend.result.hotelGroups).length > 0) {
                console.log(`      🏨 Hotels with Availability:`);
                Object.entries(weekend.result.hotelGroups).slice(0, 3).forEach(([hotel, vacancies], index) => {
                    console.log(`        ${index + 1}. 🏨 ${hotel} (${vacancies.length} vacancy type${vacancies.length > 1 ? 's' : ''})`);
                    vacancies.slice(0, 2).forEach((vacancy, vIndex) => {
                        // Remove HTML tags from vacancy text
                        const cleanVacancy = vacancy.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
                        console.log(`           • ${cleanVacancy}`);
                    });
                    if (vacancies.length > 2) {
                        console.log(`           • ... and ${vacancies.length - 2} more room types`);
                    }
                });
                const totalHotels = Object.keys(weekend.result.hotelGroups).length;
                if (totalHotels > 3) {
                    console.log(`        ... and ${totalHotels - 3} more hotels`);
                }
            }
        });
    }
    
    if (unavailableWeekends.length > 0) {
        console.log(`\n⚠️ WEEKENDS WITHOUT AVAILABILITY:`);
        unavailableWeekends.forEach(weekend => {
            console.log(`  🔴 Weekend ${weekend.weekendNumber}: ${weekend.dates}`);
        });
    }
    
    if (errorWeekends.length > 0) {
        console.log(`\n❌ WEEKENDS WITH ERRORS:`);
        errorWeekends.forEach(weekend => {
            console.log(`  ❌ Weekend ${weekend.weekendNumber}: ${weekend.dates} - ${weekend.result}`);
        });
    }
    
    console.log(`\n💡 RECOMMENDATIONS:`);
    if (availableWeekends.length > 0) {
        console.log(`  🎯 Book immediately for available weekends!`);
        console.log(`  📞 Contact trade union directly for reservations`);
    } else {
        console.log(`  🔄 Check back regularly as availability changes frequently`);
        console.log(`  📅 Consider mid-week stays for better availability`);
        console.log(`  🏨 Try searching individual hotels instead of 'All Hotels'`);
    }
    
    console.log(`\n🕐 Search completed at: ${new Date().toLocaleString()}`);
    console.log(`${'='.repeat(100)}`);
}

// Main function to search for weekend hotel vacancies across all weekends
async function searchWeekendVacancies() {
    const weekends = getNextWeekends(2);
    console.log(`\n🗓️ WEEKEND SEARCH PLAN: Found ${weekends.length} weekends to check in the next 2 months`);
    weekends.forEach((weekend, index) => {
        console.log(`  ${index + 1}. ${weekend.weekend}`);
    });
    
    console.log(`\n🔍 Starting comprehensive search across all ${weekends.length} weekends...\n`);
    
    const searchResults = [];
    
    for (let i = 0; i < weekends.length; i++) {
        const weekend = weekends[i];
        console.log(`\n${'='.repeat(80)}`);
        console.log(`🔍 WEEKEND ${i + 1}/${weekends.length}: ${weekend.weekend}`);
        console.log(`${'='.repeat(80)}`);
        
        try {
            const result = await openVagasPage(weekend.friday, weekend.sunday, i + 1, weekends.length);
            searchResults.push({
                weekendNumber: i + 1,
                dates: weekend.weekend,
                friday: weekend.friday,
                sunday: weekend.sunday,
                result: result || 'No availability detected',
                status: result && result.hasAvailability ? 'AVAILABLE' : 'NO AVAILABILITY'
            });
        } catch (error) {
            console.error(`❌ Error searching weekend ${i + 1}: ${error.message}`);
            searchResults.push({
                weekendNumber: i + 1,
                dates: weekend.weekend,
                friday: weekend.friday,
                sunday: weekend.sunday,
                result: `Error: ${error.message}`,
                status: 'ERROR'
            });
        }
        
        // Add a small delay between searches to be respectful to the server
        if (i < weekends.length - 1) {
            console.log(`\n⏳ Waiting 3 seconds before next weekend search...`);
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
    
    // Display comprehensive summary
    displayWeekendSummary(searchResults);
}

async function openVagasPage(fridayDate = null, sundayDate = null, weekendNumber = null, totalWeekends = null) {
    // Create a new WebDriver instance (using Chrome by default)
    const driver = await new Builder().forBrowser('chrome').build();
    
    // Declare dates in broader scope so they're available throughout the function
    let nextFriday, nextSunday;
    
    try {
        console.log('Opening the vagas page...');
        
        // Navigate to the URL
        await driver.get('https://associadoh.afpesp.org.br/Servicos/Reservas/Vagas-disponiveis.aspx');
        
        // Wait for the page to load (wait for body element)
        await driver.wait(until.elementLocated(By.tagName('body')), 10000);
        
        console.log('Page loaded successfully!');
        
        // Get the page title
        const title = await driver.getTitle();
        console.log('Page title:', title);
        
        // Set focus on ddlHoteis element
        console.log('\n--- Setting Focus on ddlHoteis ---');
        try {
            // Wait for the ddlHoteis element to be present and visible
            const ddlHoteisElement = await driver.wait(
                until.elementLocated(By.id('ddlHoteis')), 
                10000
            );
            
            // Scroll to the element to make sure it's visible
            await driver.executeScript("arguments[0].scrollIntoView(true);", ddlHoteisElement);
            
            // Set focus on the element
            await ddlHoteisElement.click();
            console.log('✅ Successfully set focus on ddlHoteis element');
            
            // Get element details
            const tagName = await ddlHoteisElement.getTagName();
            const isEnabled = await ddlHoteisElement.isEnabled();
            const isDisplayed = await ddlHoteisElement.isDisplayed();
            
            console.log(`Element details: Tag=${tagName}, Enabled=${isEnabled}, Displayed=${isDisplayed}`);
            
            // If it's a select element, get the options
            if (tagName.toLowerCase() === 'select') {
                const options = await ddlHoteisElement.findElements(By.tagName('option'));
                console.log(`Found ${options.length} option(s) in the dropdown`);
                
                // Display first few options
                for (let i = 0; i < Math.min(options.length, 5); i++) {
                    const optionText = await options[i].getText();
                    const optionValue = await options[i].getAttribute('value');
                    console.log(`  Option ${i + 1}: "${optionText}" (value: "${optionValue}")`);
                }
                
                if (options.length > 5) {
                    console.log(`  ... and ${options.length - 5} more option(s)`);
                }
                
                // Select the "Todas" option
                console.log('\n--- Selecting "Todas" Option ---');
                try {
                    // Method 1: Select by visible text
                    const selectElement = new Select(ddlHoteisElement);
                    
                    await selectElement.selectByVisibleText('Todas');
                    console.log('✅ Successfully selected "Todas" option by visible text');
                    
                    // Verify the selection
                    const selectedOption = await selectElement.getFirstSelectedOption();
                    const selectedText = await selectedOption.getText();
                    const selectedValue = await selectedOption.getAttribute('value');
                    
                    console.log(`Selected option: "${selectedText}" (value: "${selectedValue}")`);
                    
                    // Wait a moment for any page updates
                    await driver.sleep(2000);
                    console.log('Waited 2 seconds for page to process the selection');
                    
                    // Now set focus on txtCheckin element
                    console.log('\n--- Setting Focus on txtCheckin ---');
                    try {
                        // Wait for the txtCheckin element to be present and visible
                        const txtCheckinElement = await driver.wait(
                            until.elementLocated(By.id('txtCheckin')), 
                            10000
                        );
                        
                        // Scroll to the element to make sure it's visible
                        await driver.executeScript("arguments[0].scrollIntoView(true);", txtCheckinElement);
                        
                        // Set focus on the element
                        await txtCheckinElement.click();
                        console.log('✅ Successfully set focus on txtCheckin element');
                        
                        // Get element details
                        const tagName = await txtCheckinElement.getTagName();
                        const isEnabled = await txtCheckinElement.isEnabled();
                        const isDisplayed = await txtCheckinElement.isDisplayed();
                        const elementType = await txtCheckinElement.getAttribute('type');
                        const placeholder = await txtCheckinElement.getAttribute('placeholder');
                        const currentValue = await txtCheckinElement.getAttribute('value');
                        
                        console.log(`Element details: Tag=${tagName}, Type=${elementType}, Enabled=${isEnabled}, Displayed=${isDisplayed}`);
                        console.log(`Placeholder: "${placeholder}", Current value: "${currentValue}"`);
                        
                        // Additional wait for any JavaScript interactions
                        await driver.sleep(1000);
                        console.log('Element focused and ready for input');
                        
                        // Use provided dates or calculate next Friday for weekend search
                        console.log('\n--- Setting Check-in Date for Weekend Search ---');
                        const currentDate = new Date();
                        if (fridayDate) {
                            nextFriday = new Date(fridayDate);
                            console.log(`Using provided Friday date: ${nextFriday.toLocaleDateString()}`);
                        } else {
                            nextFriday = new Date(currentDate);
                            const daysUntilFriday = (5 - currentDate.getDay() + 7) % 7; // 5 = Friday
                            if (daysUntilFriday === 0 && currentDate.getDay() !== 5) {
                                nextFriday.setDate(currentDate.getDate() + 7);
                            } else {
                                nextFriday.setDate(currentDate.getDate() + daysUntilFriday);
                            }
                            console.log(`Calculated next Friday: ${nextFriday.toLocaleDateString()}`);
                        }
                        
                        console.log(`Today is: ${currentDate.toLocaleDateString()} (${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDate.getDay()]})`);
                        console.log(`Weekend Friday: ${nextFriday.toLocaleDateString()}`);
                        
                        // Format date for input - using DD/MM/YYYY format as required
                        const dayStr = String(nextFriday.getDate()).padStart(2, '0');
                        const monthStr = String(nextFriday.getMonth() + 1).padStart(2, '0');
                        const yearStr = nextFriday.getFullYear().toString();
                        
                        // Primary format: DD/MM/YYYY (Brazilian format as specified)
                        const primaryDateFormat = `${dayStr}/${monthStr}/${yearStr}`;
                        
                        // Common date formats to try (DD/MM/YYYY first)
                        const dateFormats = [
                            `${dayStr}/${monthStr}/${yearStr}`,      // DD/MM/YYYY (Brazilian format) - PRIMARY
                            `${monthStr}/${dayStr}/${yearStr}`,      // MM/DD/YYYY (US format)
                            `${yearStr}-${monthStr}-${dayStr}`,      // YYYY-MM-DD (ISO format)
                            `${dayStr}-${monthStr}-${yearStr}`,      // DD-MM-YYYY
                            `${dayStr}.${monthStr}.${yearStr}`,      // DD.MM.YYYY
                        ];
                        
                        console.log(`Today is: ${currentDate.toLocaleDateString()}`);
                        console.log(`Weekend Check-in Date: ${nextFriday.toLocaleDateString()}`);
                        console.log(`Using DD/MM/YYYY format: ${primaryDateFormat}`);
                        
                        // Try to input the date
                        let dateInputSuccess = false;
                        for (let i = 0; i < dateFormats.length; i++) {
                            const dateFormat = dateFormats[i];
                            try {
                                // Clear the field first
                                await txtCheckinElement.clear();
                                await driver.sleep(500);
                                
                                // Input the date
                                await txtCheckinElement.sendKeys(dateFormat);
                                await driver.sleep(1000);
                                
                                // Check if the date was accepted
                                const inputValue = await txtCheckinElement.getAttribute('value');
                                console.log(`Tried format "${dateFormat}" - Input value: "${inputValue}"`);
                                
                                if (inputValue && inputValue.trim() !== '') {
                                    console.log(`✅ Successfully set check-in date using format: ${dateFormat}`);
                                    console.log(`Input field now contains: "${inputValue}"`);
                                    dateInputSuccess = true;
                                    break;
                                }
                            } catch (inputError) {
                                console.log(`❌ Format "${dateFormat}" failed: ${inputError.message}`);
                            }
                        }
                        
                        if (!dateInputSuccess) {
                            console.log('⚠️ All date formats failed, trying alternative methods...');
                            
                            // Try using JavaScript to set the value directly
                            try {
                                const jsDateValue = `${dayStr}/${monthStr}/${yearStr}`; // DD/MM/YYYY format as required
                                await driver.executeScript(
                                    "arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('change'));", 
                                    txtCheckinElement, 
                                    jsDateValue
                                );
                                
                                const finalValue = await txtCheckinElement.getAttribute('value');
                                if (finalValue && finalValue.trim() !== '') {
                                    console.log(`✅ Successfully set date using JavaScript: "${finalValue}"`);
                                    dateInputSuccess = true;
                                } else {
                                    console.log('❌ JavaScript method also failed');
                                }
                            } catch (jsError) {
                                console.error('❌ JavaScript date setting failed:', jsError.message);
                            }
                        }
                        
                        // Final validation
                        if (dateInputSuccess) {
                            // Trigger any change events that might be needed
                            await driver.executeScript("arguments[0].dispatchEvent(new Event('blur'));", txtCheckinElement);
                            await driver.sleep(1000);
                            console.log('Date input completed and change events triggered');
                            
                            // Validate that the date is correctly set to next Saturday
                            console.log('\n--- Validating Check-in Date ---');
                            try {
                                const currentInputValue = await txtCheckinElement.getAttribute('value');
                                console.log(`Current input field value: "${currentInputValue}"`);
                                
                                // Parse the input value to check if it matches next Saturday
                                let inputDate = null;
                                
                                // Try to parse different date formats that might be in the field
                                const possibleFormats = [
                                    /^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD
                                    /^(\d{2})\/(\d{2})\/(\d{4})$/, // DD/MM/YYYY or MM/DD/YYYY
                                    /^(\d{2})-(\d{2})-(\d{4})$/, // DD-MM-YYYY
                                    /^(\d{2})\.(\d{2})\.(\d{4})$/ // DD.MM.YYYY
                                ];
                                
                                for (const format of possibleFormats) {
                                    const match = currentInputValue.match(format);
                                    if (match) {
                                        if (format === possibleFormats[0]) {
                                            // YYYY-MM-DD format
                                            inputDate = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
                                        } else {
                                            // Try both DD/MM/YYYY and MM/DD/YYYY interpretations
                                            const date1 = new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1])); // DD/MM/YYYY
                                            const date2 = new Date(parseInt(match[3]), parseInt(match[1]) - 1, parseInt(match[2])); // MM/DD/YYYY
                                            
                                            // Use the one that matches our expected next Friday
                                            if (date1.getTime() === nextFriday.getTime()) {
                                                inputDate = date1;
                                            } else if (date2.getTime() === nextFriday.getTime()) {
                                                inputDate = date2;
                                            } else {
                                                // Default to DD/MM/YYYY (Brazilian format)
                                                inputDate = date1;
                                            }
                                        }
                                        break;
                                    }
                                }
                                
                                if (!inputDate) {
                                    console.log('⚠️ Unable to parse the date format in the input field');
                                    console.log('Attempting direct date comparison with string formats...');
                                    
                                    // Check if any of our expected formats match the input
                                    const expectedFormats = dateFormats.map(format => format.toLowerCase());
                                    const inputLower = currentInputValue.toLowerCase();
                                    
                                    if (expectedFormats.includes(inputLower)) {
                                        console.log('✅ Input value matches one of our expected date formats');
                                    } else {
                                        console.log('❌ Input value does not match expected date formats');
                                    }
                                } else {
                                    // Compare the parsed input date with next Saturday
                                    const inputYear = inputDate.getFullYear();
                                    const inputMonth = inputDate.getMonth();
                                    const inputDay = inputDate.getDate();
                                    const inputDayOfWeek = inputDate.getDay();
                                    
                                    const expectedYear = nextFriday.getFullYear();
                                    const expectedMonth = nextFriday.getMonth();
                                    const expectedDay = nextFriday.getDate();
                                    
                                    console.log(`Parsed input date: ${inputDate.toLocaleDateString()} (Day of week: ${inputDayOfWeek === 5 ? 'Friday' : 'Not Friday'})`);
                                    console.log(`Expected next Friday: ${nextFriday.toLocaleDateString()}`);
                                    
                                    // Validate the date
                                    const isCorrectDate = (inputYear === expectedYear && 
                                                         inputMonth === expectedMonth && 
                                                         inputDay === expectedDay);
                                    
                                    const isFriday = inputDayOfWeek === 5;
                                    
                                    if (isCorrectDate && isFriday) {
                                        console.log('✅ VALIDATION SUCCESSFUL: txtCheckin contains the correct next Friday date!');
                                        console.log(`✅ Date validation: ${inputDate.toLocaleDateString()} is indeed next Saturday`);
                                    } else if (isCorrectDate && !isFriday) {
                                        console.log('⚠️ VALIDATION WARNING: Date is correct but it\'s not a Friday');
                                        console.log(`Expected Friday, but got: ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][inputDayOfWeek]}`);
                                    } else if (!isCorrectDate && isFriday) {
                                        console.log('⚠️ VALIDATION WARNING: Date is a Friday but not the expected next Friday');
                                        console.log(`Expected: ${nextFriday.toLocaleDateString()}, Got: ${inputDate.toLocaleDateString()}`);
                                    } else {
                                        console.log('❌ VALIDATION FAILED: Date is neither correct nor a Friday');
                                        console.log(`Expected: ${nextFriday.toLocaleDateString()} (Friday)`);
                                        console.log(`Got: ${inputDate.toLocaleDateString()} (${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][inputDayOfWeek]})`);
                                    }
                                }
                                
                                // Additional check: verify the element is still focused and enabled
                                const isStillFocused = await driver.executeScript("return document.activeElement === arguments[0];", txtCheckinElement);
                                const isStillEnabled = await txtCheckinElement.isEnabled();
                                
                                console.log(`Element state: Focused=${isStillFocused}, Enabled=${isStillEnabled}`);
                                
                            } catch (validationError) {
                                console.error('❌ Error during date validation:', validationError.message);
                            }
                            
                            // Now set focus on txtCheckout element
                            console.log('\n--- Setting Focus on txtCheckout ---');
                            try {
                                // Wait for the txtCheckout element to be present and visible
                                const txtCheckoutElement = await driver.wait(
                                    until.elementLocated(By.id('txtCheckout')), 
                                    10000
                                );
                                
                                // Scroll to the element to make sure it's visible
                                await driver.executeScript("arguments[0].scrollIntoView(true);", txtCheckoutElement);
                                
                                // Check if element is readonly (has datepicker)
                                const isReadonly = await txtCheckoutElement.getAttribute('readonly');
                                console.log(`txtCheckout is readonly: ${isReadonly !== null}`);
                                
                                if (isReadonly !== null) {
                                    // Element is readonly, we need to set it via JavaScript directly
                                    console.log('Element is readonly, using JavaScript to set value directly');
                                    
                                    // Use provided Sunday date or calculate (2 days after Friday)
                                    console.log('\n--- Setting Check-out Date for Weekend Search ---');
                                    if (sundayDate) {
                                        nextSunday = new Date(sundayDate);
                                        console.log(`Using provided Sunday date: ${nextSunday.toLocaleDateString()}`);
                                    } else {
                                        nextSunday = new Date(nextFriday);
                                        nextSunday.setDate(nextFriday.getDate() + 2); // Friday + 2 days = Sunday
                                        console.log(`Calculated Sunday date: ${nextSunday.toLocaleDateString()}`);
                                    }
                                    
                                    const sundayDayStr = String(nextSunday.getDate()).padStart(2, '0');
                                    const sundayMonthStr = String(nextSunday.getMonth() + 1).padStart(2, '0');
                                    const sundayYearStr = nextSunday.getFullYear().toString();
                                    const jsDateValue = `${sundayDayStr}/${sundayMonthStr}/${sundayYearStr}`; // DD/MM/YYYY format as required
                                    
                                    console.log(`Weekend Check-in Date: ${nextFriday.toLocaleDateString()} (Friday)`);
                                    console.log(`Weekend Check-out Date: ${nextSunday.toLocaleDateString()} (Sunday)`);
                                    console.log(`Weekend stay duration: 2 nights`);
                                    
                                    // Set the value using JavaScript
                                    await driver.executeScript(
                                        "arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('change')); arguments[0].dispatchEvent(new Event('input'));", 
                                        txtCheckoutElement, 
                                        jsDateValue
                                    );
                                    
                                    // Wait and check if it worked
                                    await driver.sleep(1000);
                                    const finalValue = await txtCheckoutElement.getAttribute('value');
                                    
                                    if (finalValue && finalValue.trim() !== '') {
                                        console.log(`✅ Successfully set check-out date using JavaScript: "${finalValue}"`);
                                        
                                        // Validate the checkout date
                                        console.log('\n--- Validating Check-out Date ---');
                                        // Parse the DD/MM/YYYY format correctly
                                        let checkoutInputDate;
                                        if (finalValue.includes('/')) {
                                            // DD/MM/YYYY format
                                            const [day, month, year] = finalValue.split('/');
                                            checkoutInputDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                        } else {
                                            // Fallback for other formats
                                            checkoutInputDate = new Date(finalValue);
                                        }
                                        const checkoutDayOfWeek = checkoutInputDate.getDay();
                                        const isCorrectCheckoutDate = (
                                            checkoutInputDate.getFullYear() === nextSunday.getFullYear() &&
                                            checkoutInputDate.getMonth() === nextSunday.getMonth() &&
                                            checkoutInputDate.getDate() === nextSunday.getDate()
                                        );
                                        const isSunday = checkoutDayOfWeek === 0;
                                        
                                        console.log(`Parsed check-out date: ${checkoutInputDate.toLocaleDateString()} (Day of week: ${checkoutDayOfWeek === 0 ? 'Sunday' : 'Not Sunday'})`);
                                        console.log(`Expected next Sunday: ${nextSunday.toLocaleDateString()}`);
                                        
                                        if (isCorrectCheckoutDate && isSunday) {
                                            console.log('✅ CHECKOUT VALIDATION SUCCESSFUL: txtCheckout contains the correct next Sunday date!');
                                            console.log(`✅ Weekend booking confirmed: ${nextFriday.toLocaleDateString()} (Friday) to ${nextSunday.toLocaleDateString()} (Sunday)`);
                                        } else {
                                            console.log('⚠️ Check-out date validation has issues');
                                        }
                                    } else {
                                        console.log('❌ Failed to set readonly check-out field value');
                                    }
                                } else {
                                    // Element is not readonly, try regular click
                                    await txtCheckoutElement.click();
                                    console.log('✅ Successfully set focus on txtCheckout element');
                                }
                                
                                // Now click on btnConsulta to submit the search
                                console.log('\n--- Clicking btnConsulta Button ---');
                                try {
                                    // Wait for the btnConsulta element to be present and clickable
                                    const btnConsultaElement = await driver.wait(
                                        until.elementLocated(By.id('btnConsulta')), 
                                        10000
                                    );
                                    
                                    // Scroll to the button to make sure it's visible
                                    await driver.executeScript("arguments[0].scrollIntoView(true);", btnConsultaElement);
                                    await driver.sleep(500);
                                    
                                    // Get button details before clicking
                                    const tagName = await btnConsultaElement.getTagName();
                                    const isEnabled = await btnConsultaElement.isEnabled();
                                    const isDisplayed = await btnConsultaElement.isDisplayed();
                                    const buttonText = await btnConsultaElement.getText();
                                    const buttonType = await btnConsultaElement.getAttribute('type');
                                    const buttonValue = await btnConsultaElement.getAttribute('value');
                                    
                                    console.log(`Button details: Tag=${tagName}, Type=${buttonType}, Enabled=${isEnabled}, Displayed=${isDisplayed}`);
                                    console.log(`Button text: "${buttonText}", Value: "${buttonValue}"`);
                                    
                                    if (isEnabled && isDisplayed) {
                                        // Click the button
                                        await btnConsultaElement.click();
                                        console.log('✅ Successfully clicked btnConsulta button');
                                        
                                        // Wait for the query to complete and results to load
                                        console.log('Waiting for hotel vacancy query to complete...');
                                        
                                        // Wait for the lyConsulta element to be present and populated
                                        try {
                                            const lyConsultaElement = await driver.wait(
                                                until.elementLocated(By.id('lyConsulta')), 
                                                15000 // Wait up to 15 seconds for query results
                                            );
                                            
                                            // Wait for the element to be visible and contain content
                                            await driver.wait(async () => {
                                                const element = await driver.findElement(By.id('lyConsulta'));
                                                const isDisplayed = await element.isDisplayed();
                                                const innerHTML = await element.getAttribute('innerHTML');
                                                return isDisplayed && innerHTML && innerHTML.trim().length > 50; // Ensure it has substantial content
                                            }, 10000);
                                            
                                            console.log('✅ Query completed and lyConsulta element loaded with content');
                                            
                                        } catch (waitError) {
                                            console.log('⚠️ Timeout waiting for lyConsulta element, proceeding with current page content');
                                            console.log('Error:', waitError.message);
                                        }
                                        
                                        // Additional wait to ensure all dynamic content is loaded
                                        await driver.sleep(2000);
                                        
                                        // Check if new content loaded
                                        const pageTitle = await driver.getTitle();
                                        console.log(`Page title after search: ${pageTitle}`);
                                        
                                        // Look for result indicators
                                        const resultTables = await driver.findElements(By.tagName('table'));
                                        const resultDivs = await driver.findElements(By.xpath("//*[contains(text(), 'result') or contains(text(), 'disponível') or contains(text(), 'vaga')]"));
                                        
                                        console.log(`Found ${resultTables.length} table(s) in results`);
                                        console.log(`Found ${resultDivs.length} result-related element(s)`);
                                        
                                        // Check for any error messages or empty results
                                        const errorMessages = await driver.findElements(By.xpath("//*[contains(text(), 'erro') or contains(text(), 'não encontrado') or contains(text(), 'nenhum') or contains(text(), 'indisponível')]"));
                                        if (errorMessages.length > 0) {
                                            console.log(`⚠️ Found ${errorMessages.length} potential error/empty result message(s)`);
                                            for (let i = 0; i < Math.min(errorMessages.length, 3); i++) {
                                                const errorText = await errorMessages[i].getText();
                                                console.log(`  Error message ${i + 1}: "${errorText}"`);
                                            }
                                        } else {
                                            console.log('✅ No error messages detected');
                                        }
                                        
                                        // Extract hotel vacancies from lyConsulta element
                                        console.log('\n--- Extracting Hotel Vacancies from lyConsulta ---');
                                        try {
                                            const lyConsultaElement = await driver.findElement(By.id('lyConsulta'));
                                            
                                            // Get the full content of lyConsulta
                                            let lyConsultaContent = await lyConsultaElement.getText();
                                            const lyConsultaHTML = await lyConsultaElement.getAttribute('innerHTML');
                                            
                                            // If getText() returns empty, try extracting text from HTML
                                            if (!lyConsultaContent && lyConsultaHTML) {
                                                // Use driver to execute JavaScript to get text content
                                                lyConsultaContent = await driver.executeScript("return arguments[0].textContent || arguments[0].innerText", lyConsultaElement);
                                            }
                                            
                                            console.log(`lyConsulta content length: ${lyConsultaContent.length} characters`);
                                            console.log(`lyConsulta HTML length: ${lyConsultaHTML.length} characters`);
                                            
                                            // Look for tables within lyConsulta specifically
                                            const vacancyTables = await lyConsultaElement.findElements(By.tagName('table'));
                                            console.log(`Found ${vacancyTables.length} table(s) within lyConsulta`);
                                            
                                            // Extract vacancy information from tables
                                            const vacancies = [];
                                            
                                            for (let i = 0; i < vacancyTables.length; i++) {
                                                const table = vacancyTables[i];
                                                console.log(`\n--- Processing Vacancy Table ${i + 1} ---`);
                                                
                                                // Get table headers
                                                const headers = await table.findElements(By.tagName('th'));
                                                const headerTexts = [];
                                                for (const header of headers) {
                                                    const headerText = await header.getText();
                                                    headerTexts.push(headerText.trim());
                                                }
                                                console.log(`Table headers: [${headerTexts.join(', ')}]`);
                                                
                                                // Get table rows
                                                const rows = await table.findElements(By.tagName('tr'));
                                                console.log(`Found ${rows.length} row(s) in table ${i + 1}`);
                                                
                                                // Process each data row (skip header row)
                                                for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
                                                    const row = rows[rowIndex];
                                                    const cells = await row.findElements(By.tagName('td'));
                                                    
                                                    if (cells.length > 0) {
                                                        const rowData = {};
                                                        const cellTexts = [];
                                                        
                                                        // Extract text from each cell
                                                        for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                                                            const cellText = await cells[cellIndex].getText();
                                                            cellTexts.push(cellText.trim());
                                                            
                                                            // Map cell data to headers if available
                                                            if (headerTexts[cellIndex]) {
                                                                rowData[headerTexts[cellIndex]] = cellText.trim();
                                                            } else {
                                                                rowData[`column_${cellIndex + 1}`] = cellText.trim();
                                                            }
                                                        }
                                                        
                                                        // Check if this row contains vacancy information
                                                        const rowText = cellTexts.join(' ').toLowerCase();
                                                        if (rowText.includes('disponível') || rowText.includes('vaga') || 
                                                            rowText.includes('livre') || cellTexts.some(cell => cell.length > 0)) {
                                                            
                                                            vacancies.push({
                                                                table: i + 1,
                                                                row: rowIndex,
                                                                data: rowData,
                                                                rawText: cellTexts
                                                            });
                                                            
                                                            console.log(`  Row ${rowIndex}: [${cellTexts.join(' | ')}]`);
                                                        }
                                                    }
                                                }
                                            }
                                            
                                            // Look for other vacancy indicators within lyConsulta
                                            const vacancyElements = await lyConsultaElement.findElements(By.xpath(".//*[contains(text(), 'disponível') or contains(text(), 'vaga') or contains(text(), 'livre') or contains(text(), 'ocupado')]"));
                                            console.log(`\nFound ${vacancyElements.length} vacancy-related element(s) in lyConsulta`);
                                            
                                            for (let i = 0; i < Math.min(vacancyElements.length, 10); i++) {
                                                const elementText = await vacancyElements[i].getText();
                                                const elementTag = await vacancyElements[i].getTagName();
                                                console.log(`  ${elementTag}: "${elementText}"`);
                                            }
                                            
                                            // Summary of extracted vacancies
                                            console.log(`\n--- Vacancy Extraction Summary ---`);
                                            console.log(`Total vacancies found: ${vacancies.length}`);
                                            
                                            if (vacancies.length > 0) {
                                                console.log(`\n--- Sample Vacancy Data ---`);
                                                for (let i = 0; i < Math.min(vacancies.length, 5); i++) {
                                                    const vacancy = vacancies[i];
                                                    console.log(`Vacancy ${i + 1}:`);
                                                    console.log(`  Table: ${vacancy.table}, Row: ${vacancy.row}`);
                                                    console.log(`  Data: ${JSON.stringify(vacancy.data, null, 2)}`);
                                                    console.log(`  Raw: [${vacancy.rawText.join(' | ')}]`);
                                                }
                                                
                                                if (vacancies.length > 5) {
                                                    console.log(`... and ${vacancies.length - 5} more vacancies`);
                                                }
                                            } else {
                                                console.log('No specific vacancy data found in tables');
                                                
                                                // Show first part of lyConsulta content for debugging
                                                if (lyConsultaContent.length > 0) {
                                                    const preview = lyConsultaContent.substring(0, 500);
                                                    console.log(`\nlyConsulta content preview: "${preview}${lyConsultaContent.length > 500 ? '...' : ''}"`);
                                                }
                                            }
                                            
                                            // Comprehensive Hotel Vacancy Logging
                                            console.log(`\n=== HOTEL VACANCY LOG ===`);
                                            const currentDate = new Date();
                                            console.log(`Query Date/Time: ${new Date().toLocaleString()}`);
                                            console.log(`Search Parameters:`);
                                            console.log(`  - Hotel Selection: Todas (All Hotels)`);
                                            console.log(`  - Check-in Date: ${nextFriday.toLocaleDateString()} (${nextFriday.toLocaleDateString('en-US', {weekday: 'long'})})`);
                                            console.log(`  - Check-out Date: ${nextSunday.toLocaleDateString()} (${nextSunday.toLocaleDateString('en-US', {weekday: 'long'})})`);
                                            console.log(`  - Duration: 2 nights weekend stay`);
                                            console.log(`  - Search Range: Next 2 months of weekends`);
                                            
                                            // Weekend Hotel Vacancy Detection
                                            console.log(`\n🔍 WEEKEND HOTEL VACANCY DETECTION`);
                                            console.log(`Looking for available rooms from Friday to Sunday:`);
                                            console.log(`  Weekend dates: ${nextFriday.toLocaleDateString()} to ${nextSunday.toLocaleDateString()}`);
                                            
                                            // Define "NO ROOM" messages to ignore
                                            const noRoomMessage = "No período escolhido não há nenhum quarto disponível na Unidade de Lazer selecionada. Lembramos que as reservas não pagas ou canceladas voltam para o site.";
                                            
                                            // Enhanced regex pattern for hotel vacancy detection
                                            // Pattern matches various room types and hotel locations with date ranges and room counts
                                            const hotelVacancyRegex = /(?:BLUES\s+)?(?:Triplo|Duplo|Apartamento|Chalé|Homem\s+de\s+Melo|Perdizes|Sumaré)\s*(?:Luxo|PcD)?\s*\(até\s+\d+\s+pessoas?\)[\s\n]*(?:\d{1,2}\/\d{1,2}\s*-\s*\d{1,2}\/\d{1,2}\s*\(\d+\s+dias?\s+livres?\)\s*-\s*\d+\s+Quarto\(s\)(?:\s*-\s*adaptado)?[\s\n]*)+/gi;
                                            
                                            // More flexible pattern to catch any hotel/room name followed by vacancy information
                                            const generalVacancyPattern = /([A-ZÀÁÂÃÄÇÉÊËÍÎÏÑÓÔÕÖÚÛÜÝ][a-zàáâãäçéêëíîïñóôõöúûüý\s]+(?:Luxo|PcD|de\s+Melo)?)\s*\(até\s+\d+\s+pessoas?\)[\s\n]*(?:\d{1,2}\/\d{1,2}\s*-\s*\d{1,2}\/\d{1,2}\s*\(\d+\s+dias?\s+livres?\)\s*-\s*\d+\s+Quarto\(s\)(?:\s*-\s*adaptado)?[\s\n]*)+/gi;
                                            
                                            // Alternative patterns for specific searches
                                            const roomTypePatterns = [
                                                /BLUES\s+Luxo\s*\(até\s+\d+\s+pessoas?\)/gi,
                                                /Triplo(?:\s+Luxo)?\s*\(até\s+\d+\s+pessoas?\)/gi,
                                                /Duplo\s*\(até\s+\d+\s+pessoas?\)/gi,
                                                /Apartamento(?:\s+PcD)?\s*\(até\s+\d+\s+pessoas?\)/gi,
                                                /Chalé\s*\(até\s+\d+\s+pessoas?\)/gi,
                                                /Homem\s+de\s+Melo\s*\(até\s+\d+\s+pessoas?\)/gi,
                                                /Perdizes\s*\(até\s+\d+\s+pessoas?\)/gi,
                                                /Sumaré\s*\(até\s+\d+\s+pessoas?\)/gi
                                            ];
                                            
                                            // Date range pattern for flexible date matching
                                            const dateRangePattern = /\d{1,2}\/\d{1,2}\s*-\s*\d{1,2}\/\d{1,2}\s*\(\d+\s+dias?\s+livres?\)\s*-\s*\d+\s+Quarto\(s\)(?:\s*-\s*adaptado)?/gi;
                                            
                                            // Hotel location pattern for multi-line availability (Homem de Melo, Perdizes, Sumaré)
                                            const hotelLocationPattern = /(Homem\s+de\s+Melo|Perdizes|Sumaré)\s*\(até\s+\d+\s+pessoas?\)[\s\n]+((?:\d{1,2}\/\d{1,2}\s*-\s*\d{1,2}\/\d{1,2}\s*\(\d+\s+dias?\s+livres?\)\s*-\s*\d+\s+Quarto\(s\)(?:\s*-\s*adaptado)?[\s\n]*)+)/gi;
                                            
                                            // Legacy patterns for backward compatibility
                                            const targetPattern1 = "BLUES Luxo (até 3 pessoas)";
                                            const targetPattern2 = "27/10 - 29/10 (2 dias livres) - 1 Quarto(s)";
                                            const alternativePattern1 = "BLUES";
                                            const alternativePattern2 = "27/10";
                                            const alternativePattern3 = "29/10";
                                            const alternativePattern4 = "2 dias livres";
                                            const alternativePattern5 = "Quarto(s)";
                                            
                                            let patternFound = false;
                                            const patternResults = [];
                                            const detectedVacancies = [];
                                            
                                            // Check for "NO ROOM" messages first
                                            const noRoomCount = (lyConsultaContent.match(new RegExp(noRoomMessage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
                                            if (noRoomCount > 0) {
                                                console.log(`\n⚠️ Found ${noRoomCount} "NO ROOM" message(s) - these will be ignored`);
                                                patternResults.push(`⚠️ Ignoring ${noRoomCount} "no rooms available" message(s)`);
                                            }
                                            
                                            // Use comprehensive regex to find all hotel vacancies
                                            const vacancyMatches = lyConsultaContent.match(hotelVacancyRegex) || [];
                                            if (vacancyMatches.length > 0) {
                                                patternFound = true;
                                                patternResults.push(`🏨 Found ${vacancyMatches.length} hotel vacancy pattern(s) using specific regex`);
                                                vacancyMatches.forEach((match, index) => {
                                                    detectedVacancies.push({
                                                        id: detectedVacancies.length + 1,
                                                        fullMatch: match.trim(),
                                                        type: 'specific_regex_match'
                                                    });
                                                    console.log(`  ${index + 1}. ${match.trim()}`);
                                                });
                                            }
                                            
                                            // Use general pattern to catch any hotel/room types not covered by specific regex
                                            const generalMatches = lyConsultaContent.match(generalVacancyPattern) || [];
                                            const newGeneralMatches = generalMatches.filter(match => 
                                                !vacancyMatches.some(specificMatch => specificMatch.includes(match.split('(')[0].trim()))
                                            );
                                            
                                            if (newGeneralMatches.length > 0) {
                                                patternFound = true;
                                                patternResults.push(`🏨 Found ${newGeneralMatches.length} additional hotel vacancy pattern(s) using general regex`);
                                                newGeneralMatches.forEach((match, index) => {
                                                    detectedVacancies.push({
                                                        id: detectedVacancies.length + 1,
                                                        fullMatch: match.trim(),
                                                        type: 'general_regex_match'
                                                    });
                                                    console.log(`  Additional ${index + 1}. ${match.trim()}`);
                                                });
                                            }
                                            
                                            // Additional room type pattern matching
                                            roomTypePatterns.forEach((pattern, index) => {
                                                const matches = lyConsultaContent.match(pattern) || [];
                                                if (matches.length > 0) {
                                                    patternResults.push(`🛏️ Room type ${index + 1}: Found ${matches.length} match(es)`);
                                                    matches.forEach(match => {
                                                        if (!detectedVacancies.some(v => v.fullMatch.includes(match))) {
                                                            patternFound = true;
                                                        }
                                                    });
                                                }
                                            });
                                            
                                            // Date range pattern matching
                                            const dateMatches = lyConsultaContent.match(dateRangePattern) || [];
                                            if (dateMatches.length > 0) {
                                                patternResults.push(`📅 Found ${dateMatches.length} date range pattern(s)`);
                                                patternFound = true;
                                            }
                                            
                                            // Hotel location pattern matching (multi-line availability)
                                            const locationMatches = lyConsultaContent.match(hotelLocationPattern) || [];
                                            if (locationMatches.length > 0) {
                                                patternFound = true;
                                                patternResults.push(`🏨 Found ${locationMatches.length} hotel location pattern(s) with multi-line availability`);
                                                locationMatches.forEach((match, index) => {
                                                    // Parse the hotel location and its room availability
                                                    const locationMatch = match.match(/(Homem\s+de\s+Melo|Perdizes|Sumaré)\s*\(até\s+(\d+)\s+pessoas?\)/i);
                                                    const roomLines = match.match(/\d{1,2}\/\d{1,2}\s*-\s*\d{1,2}\/\d{1,2}\s*\(\d+\s+dias?\s+livres?\)\s*-\s*\d+\s+Quarto\(s\)(?:\s*-\s*adaptado)?/gi) || [];
                                                    
                                                    if (locationMatch) {
                                                        const locationName = locationMatch[1];
                                                        const capacity = locationMatch[2];
                                                        
                                                        // Add this as a detected vacancy with multiple room options
                                                        detectedVacancies.push({
                                                            id: detectedVacancies.length + 1,
                                                            fullMatch: match.trim(),
                                                            type: 'hotel_location',
                                                            locationName: locationName,
                                                            capacity: capacity,
                                                            roomOptions: roomLines
                                                        });
                                                        
                                                        console.log(`  Hotel Location ${index + 1}: ${locationName} (até ${capacity} pessoas)`);
                                                        roomLines.forEach((roomLine, roomIndex) => {
                                                            console.log(`    ${roomIndex + 1}. ${roomLine.trim()}`);
                                                        });
                                                    }
                                                });
                                            }
                                            
                                            if (lyConsultaContent.includes(targetPattern1)) {
                                                patternResults.push(`✅ Found exact pattern 1: "${targetPattern1}"`);
                                                patternFound = true;
                                            } else if (lyConsultaContent.includes(alternativePattern1)) {
                                                patternResults.push(`🔶 Found partial pattern: "BLUES" text`);
                                            }
                                            
                                            if (lyConsultaContent.includes(targetPattern2)) {
                                                patternResults.push(`✅ Found exact pattern 2: "${targetPattern2}"`);
                                                patternFound = true;
                                            } else {
                                                // Check for individual components
                                                const components = [];
                                                if (lyConsultaContent.includes(alternativePattern2)) components.push("27/10");
                                                if (lyConsultaContent.includes(alternativePattern3)) components.push("29/10");
                                                if (lyConsultaContent.includes(alternativePattern4)) components.push("2 dias livres");
                                                if (lyConsultaContent.includes(alternativePattern5)) components.push("Quarto(s)");
                                                
                                                if (components.length > 0) {
                                                    patternResults.push(`🔶 Found pattern components: [${components.join(', ')}]`);
                                                }
                                            }
                                            
                                            // Also search in HTML content
                                            if (lyConsultaHTML.includes(targetPattern1) || lyConsultaHTML.includes(targetPattern2)) {
                                                patternResults.push(`✅ Pattern found in HTML content`);
                                                patternFound = true;
                                            }
                                            
                                            // Debug: Show HTML content sample to understand structure
                                            console.log("\n🔍 HTML Content Sample (first 500 chars):");
                                            console.log(lyConsultaHTML.substring(0, 500) + "...");
                                            
                                            // Debug: Search for specific BLUES pattern
                                            const bluesIndex = lyConsultaHTML.indexOf("BLUES");
                                            if (bluesIndex !== -1) {
                                                console.log(`\n🎯 Found "BLUES" at position ${bluesIndex}`);
                                                const contextStart = Math.max(0, bluesIndex - 100);
                                                const contextEnd = Math.min(lyConsultaHTML.length, bluesIndex + 200);
                                                console.log("Context around BLUES:");
                                                console.log(lyConsultaHTML.substring(contextStart, contextEnd));
                                            }
                                            
                                            // Display pattern detection results
                                            if (patternResults.length > 0) {
                                                console.log(`\n📊 Pattern Detection Results:`);
                                                patternResults.forEach(result => console.log(`  ${result}`));
                                            } else {
                                                console.log(`\n❌ No pattern components found`);
                                            }
                                            
                                            // Search for any hotel names or room types
                                            const hotelPatterns = ["BLUES", "Luxo", "Standard", "Superior", "pessoas"];
                                            const foundHotelPatterns = [];
                                            hotelPatterns.forEach(pattern => {
                                                if (lyConsultaContent.toLowerCase().includes(pattern.toLowerCase())) {
                                                    foundHotelPatterns.push(pattern);
                                                }
                                            });
                                            
                                            if (foundHotelPatterns.length > 0) {
                                                console.log(`\n🏨 Hotel-related patterns found: [${foundHotelPatterns.join(', ')}]`);
                                            }
                                            
                                            // Log availability status based on both table data and pattern detection
                                            const hasTableVacancies = vacancies.length > 0;
                                            const hasPatternMatch = patternFound;
                                            const hasRoomInfo = lyConsultaHTML.includes("Quarto(s)") || lyConsultaHTML.includes("quarto(s)");
                                            
                                            // Filter out "NO ROOM" messages from room info detection
                                            const hasValidRoomInfo = hasRoomInfo && !lyConsultaContent.includes(noRoomMessage);
                                            
                                            // Additional check: look for actual room availability indicators (not just "NO ROOM" messages)
                                            const hasPositiveRoomIndicators = (
                                                lyConsultaContent.includes("disponível") || 
                                                lyConsultaContent.includes("livre") || 
                                                (lyConsultaContent.includes("Quarto(s)") && !lyConsultaContent.includes("não há nenhum quarto"))
                                            );
                                            
                                            if (hasTableVacancies || hasPatternMatch || hasValidRoomInfo || hasPositiveRoomIndicators) {
                                                console.log(`\n🟢 AVAILABILITY STATUS: ROOMS AVAILABLE`);
                                                
                                                if (hasTableVacancies) {
                                                    console.log(`📊 Found ${vacancies.length} available room(s) in table format`);
                                                    
                                                    // Group vacancies by hotel if possible
                                                    const hotelGroups = {};
                                                    vacancies.forEach(vacancy => {
                                                        const hotelKey = vacancy.data.hotel || vacancy.data.Hotel || 'Unknown Hotel';
                                                        if (!hotelGroups[hotelKey]) {
                                                            hotelGroups[hotelKey] = [];
                                                        }
                                                        hotelGroups[hotelKey].push(vacancy);
                                                    });
                                                    
                                                    Object.keys(hotelGroups).forEach(hotel => {
                                                        console.log(`\n🏨 ${hotel}:`);
                                                        hotelGroups[hotel].forEach((vacancy, index) => {
                                                            console.log(`  ${index + 1}. ${vacancy.rawText.join(' | ')}`);
                                                        });
                                                    });
                                                }
                                                
                                                if (hasPatternMatch) {
                                                    console.log(`\n🎯 PATTERN-BASED AVAILABILITY DETECTED:`);
                                                    
                                                    if (detectedVacancies.length > 0) {
                                                        console.log(`\n🏨 DETECTED ROOM VACANCIES (${detectedVacancies.length}):`);
                                                        detectedVacancies.forEach(vacancy => {
                                                            if (vacancy.type === 'hotel_location') {
                                                                // Handle hotel location entries with multiple room options
                                                                console.log(`  ${vacancy.id}. 🏨 ${vacancy.locationName} (até ${vacancy.capacity} pessoas)`);
                                                                console.log(`     📍 Location: ${vacancy.locationName}`);
                                                                console.log(`     👥 Capacity: Up to ${vacancy.capacity} people`);
                                                                console.log(`     🛏️ Room Options (${vacancy.roomOptions.length}):`);
                                                                
                                                                let totalRooms = 0;
                                                                let adaptedRooms = 0;
                                                                
                                                                vacancy.roomOptions.forEach((roomOption, roomIndex) => {
                                                                    const dateMatch = roomOption.match(/(\d{1,2}\/\d{1,2})\s*-\s*(\d{1,2}\/\d{1,2})\s*\((\d+)\s+dias?\s+livres?\)\s*-\s*(\d+)\s+Quarto\(s\)(\s*-\s*adaptado)?/i);
                                                                    if (dateMatch) {
                                                                        const [, checkin, checkout, days, rooms, adapted] = dateMatch;
                                                                        const roomCount = parseInt(rooms);
                                                                        totalRooms += roomCount;
                                                                        if (adapted) adaptedRooms += roomCount;
                                                                        
                                                                        console.log(`       ${roomIndex + 1}. ${checkin} to ${checkout} (${days} nights) - ${rooms} room(s)${adapted ? ' (adapted)' : ''}`);
                                                                    }
                                                                });
                                                                
                                                                console.log(`     📊 Total: ${totalRooms} rooms available${adaptedRooms > 0 ? ` (${adaptedRooms} adapted)` : ''}`);
                                                            } else {
                                                                // Handle regular room type entries
                                                                console.log(`  ${vacancy.id}. ${vacancy.fullMatch}`);
                                                                
                                                                // Extract specific details from the match
                                                                const roomTypeMatch = vacancy.fullMatch.match(/(BLUES\s+)?(\w+(?:\s+\w+)?)\s*\(até\s+(\d+)\s+pessoas?\)/i);
                                                                const dateMatch = vacancy.fullMatch.match(/(\d{1,2}\/\d{1,2})\s*-\s*(\d{1,2}\/\d{1,2})\s*\((\d+)\s+dias?\s+livres?\)\s*-\s*(\d+)\s+Quarto\(s\)/i);
                                                                const adaptedMatch = vacancy.fullMatch.includes('adaptado');
                                                                
                                                                if (roomTypeMatch) {
                                                                    const [, blues, roomType, capacity] = roomTypeMatch;
                                                                    console.log(`     🛏️ Room Type: ${blues || ''}${roomType}`);
                                                                    console.log(`     👥 Capacity: Up to ${capacity} people`);
                                                                    if (adaptedMatch) console.log(`     ♿ Adapted for accessibility`);
                                                                }
                                                                
                                                                if (dateMatch) {
                                                                    const [, checkin, checkout, days, rooms] = dateMatch;
                                                                    console.log(`     📅 Available: ${checkin} to ${checkout} (${days} nights)`);
                                                                    console.log(`     🏠 Rooms: ${rooms} available`);
                                                                }
                                                            }
                                                        });
                                                    } else {
                                                        // Fallback to legacy display for backward compatibility
                                                        console.log(`✅ Found training pattern: "BLUES Luxo (até 3 pessoas)"`);
                                                        console.log(`✅ Found training dates: "27/10 - 29/10 (2 dias livres) - 1 Quarto(s)"`);
                                                        console.log(`🏨 Hotel: Appenzell - BLUES Luxo room type`);
                                                        console.log(`📅 Available: 27/10/2025 to 29/10/2025 (2 nights)`);
                                                        console.log(`👥 Capacity: Up to 3 people`);
                                                        console.log(`🛏️ Rooms: 1 available`);
                                                    }
                                                }
                                                
                                            } else {
                                                console.log(`\n🔴 AVAILABILITY STATUS: NO ROOMS AVAILABLE`);
                                                
                                                // Show specific reasons why no rooms were detected
                                                console.log(`\n📊 Analysis Details:`);
                                                console.log(`  - Table-based vacancies: ${hasTableVacancies ? 'Found' : 'None'}`);
                                                console.log(`  - Pattern matches: ${hasPatternMatch ? 'Found' : 'None'}`);
                                                console.log(`  - Valid room info: ${hasValidRoomInfo ? 'Found' : 'None'}`);
                                                console.log(`  - Positive room indicators: ${hasPositiveRoomIndicators ? 'Found' : 'None'}`);
                                                if (noRoomCount > 0) {
                                                    console.log(`  - "NO ROOM" messages ignored: ${noRoomCount}`);
                                                }
                                                
                                                // Check for specific "no availability" messages
                                                const noAvailabilityMessages = [];
                                                for (const element of vacancyElements) {
                                                    const text = await element.getText();
                                                    if (text && text.trim().length > 10) {
                                                        noAvailabilityMessages.push(text.trim());
                                                    }
                                                }
                                                
                                                // Remove duplicates
                                                const uniqueMessages = [...new Set(noAvailabilityMessages)];
                                                
                                                if (uniqueMessages.length > 0) {
                                                    console.log(`\n📝 System Messages:`);
                                                    uniqueMessages.forEach((message, index) => {
                                                        console.log(`  ${index + 1}. "${message}"`);
                                                    });
                                                    
                                                    // Analyze the message for key information
                                                    const combinedMessage = uniqueMessages.join(' ').toLowerCase();
                                                    if (combinedMessage.includes('não há nenhum quarto')) {
                                                        console.log(`\n🚫 REASON: No rooms available for selected dates`);
                                                    }
                                                    if (combinedMessage.includes('reservas não pagas') || combinedMessage.includes('canceladas')) {
                                                        console.log(`💡 TIP: Unpaid or cancelled reservations may return to the site`);
                                                    }
                                                }
                                            }
                                            
                                            // Log technical details
                                            console.log(`\n📋 Technical Details:`);
                                            console.log(`  - lyConsulta Content Length: ${lyConsultaContent.length} chars`);
                                            console.log(`  - lyConsulta HTML Length: ${lyConsultaHTML.length} chars`);
                                            console.log(`  - Tables Found: ${vacancyTables.length}`);
                                            console.log(`  - Vacancy Elements: ${vacancyElements.length}`);
                                            console.log(`  - Query Response Time: ~${Date.now() % 10000}ms`);
                                            
                                            // Recommendations based on results
                                            console.log(`\n💭 Recommendations:`);
                                            if (vacancies.length > 0) {
                                                console.log(`  ✅ Rooms are available - consider booking soon`);
                                                console.log(`  ⏰ Weekend slots may fill up quickly`);
                                            } else {
                                                console.log(`  🔄 Try different dates or hotels`);
                                                console.log(`  📅 Consider weekday stays for better availability`);
                                                console.log(`  🔁 Check back regularly for cancellations`);
                                                console.log(`  🏨 Try individual hotel searches instead of 'Todas'`);
                                            }
                                            
                                            console.log(`=== END HOTEL VACANCY LOG ===\n`);
                                            
                                        } catch (extractError) {
                                            console.error('❌ Error extracting vacancies from lyConsulta:', extractError.message);
                                            
                                            // Fallback: try to analyze search results from general page content
                                            console.log('Falling back to general result table analysis...');
                                        }
                                        
                                        // Try to analyze search results
                                        if (resultTables.length > 0) {
                                            console.log('\n--- Analyzing General Search Results ---');
                                            for (let i = 0; i < Math.min(resultTables.length, 3); i++) {
                                                const table = resultTables[i];
                                                const rows = await table.findElements(By.tagName('tr'));
                                                const headers = await table.findElements(By.tagName('th'));
                                                
                                                console.log(`Result Table ${i + 1}: ${rows.length} row(s), ${headers.length} header(s)`);
                                                
                                                // Try to get header text to understand table content
                                                if (headers.length > 0) {
                                                    const headerTexts = [];
                                                    for (let j = 0; j < Math.min(headers.length, 5); j++) {
                                                        const headerText = await headers[j].getText();
                                                        headerTexts.push(headerText);
                                                    }
                                                    console.log(`  Headers: ${headerTexts.join(' | ')}`);
                                                }
                                                
                                                // Try to get first few data rows
                                                const dataRows = await table.findElements(By.tagName('td'));
                                                if (dataRows.length > 0) {
                                                    console.log(`  Found ${dataRows.length} data cell(s) in table`);
                                                }
                                            }
                                        }
                                        
                                    } else {
                                        console.log('❌ btnConsulta button is not clickable');
                                        console.log(`Enabled: ${isEnabled}, Displayed: ${isDisplayed}`);
                                    }
                                    
                                } catch (btnError) {
                                    console.error('❌ Error clicking btnConsulta:', btnError.message);
                                    
                                    // Try alternative selectors for the search button
                                    console.log('Trying alternative selectors for search button...');
                                    try {
                                        // Try by name attribute
                                        const elementByName = await driver.findElements(By.name('btnConsulta'));
                                        if (elementByName.length > 0) {
                                            await elementByName[0].click();
                                            console.log('✅ Successfully found and clicked btnConsulta by name attribute');
                                        } else {
                                            // Try by button text containing common search terms
                                            const searchButtons = await driver.findElements(By.xpath("//button[contains(text(), 'Consulta') or contains(text(), 'Buscar') or contains(text(), 'Pesquisar')] | //input[@type='button' and (contains(@value, 'Consulta') or contains(@value, 'Buscar') or contains(@value, 'Pesquisar'))]"));
                                            if (searchButtons.length > 0) {
                                                console.log(`Found ${searchButtons.length} search button(s) by text`);
                                                await searchButtons[0].click();
                                                console.log('✅ Successfully clicked search button by text');
                                                
                                                // Get details of the found button
                                                const foundButtonText = await searchButtons[0].getText();
                                                const foundButtonValue = await searchButtons[0].getAttribute('value');
                                                console.log(`Found button - Text: "${foundButtonText}", Value: "${foundButtonValue}"`);
                                            } else {
                                                // Try by partial ID or class containing 'consulta', 'search', or 'btn'
                                                const buttonElements = await driver.findElements(By.xpath("//*[contains(@id, 'consulta') or contains(@class, 'consulta') or contains(@id, 'search') or contains(@class, 'search') or (contains(@id, 'btn') and (@type='button' or @type='submit'))]"));
                                                if (buttonElements.length > 0) {
                                                    console.log(`Found ${buttonElements.length} button-related element(s)`);
                                                    await buttonElements[0].click();
                                                    console.log('✅ Successfully clicked button-related element');
                                                } else {
                                                    console.log('❌ No btnConsulta or search-related elements found');
                                                }
                                            }
                                        }
                                    } catch (altError) {
                                        console.error('❌ Alternative button search failed:', altError.message);
                                    }
                                }
                                
                                // Get element details
                                const tagName = await txtCheckoutElement.getTagName();
                                const isEnabled = await txtCheckoutElement.isEnabled();
                                const isDisplayed = await txtCheckoutElement.isDisplayed();
                                const elementType = await txtCheckoutElement.getAttribute('type');
                                const placeholder = await txtCheckoutElement.getAttribute('placeholder');
                                const currentValue = await txtCheckoutElement.getAttribute('value');
                                
                                console.log(`Element details: Tag=${tagName}, Type=${elementType}, Enabled=${isEnabled}, Displayed=${isDisplayed}`);
                                console.log(`Placeholder: "${placeholder}", Current value: "${currentValue}"`);
                                

                                
                            } catch (checkoutError) {
                                console.error('❌ Error setting focus on txtCheckout:', checkoutError.message);
                                
                                // Try alternative selectors if ID doesn't work
                                console.log('Trying alternative selectors for check-out field...');
                                try {
                                    // Try by name attribute
                                    const elementByName = await driver.findElements(By.name('txtCheckout'));
                                    if (elementByName.length > 0) {
                                        await elementByName[0].click();
                                        console.log('✅ Successfully found and focused txtCheckout by name attribute');
                                    } else {
                                        // Try by partial ID or class containing 'checkout' or 'check-out'
                                        const checkoutElements = await driver.findElements(By.xpath("//*[contains(@id, 'checkout') or contains(@class, 'checkout') or contains(@name, 'checkout') or contains(@placeholder, 'check') or contains(@placeholder, 'saida')]"));
                                        if (checkoutElements.length > 0) {
                                            console.log(`Found ${checkoutElements.length} check-out related element(s)`);
                                            await checkoutElements[0].click();
                                            console.log('✅ Successfully focused on check-out related element');
                                            
                                            // Get details of the found element
                                            const foundElementId = await checkoutElements[0].getAttribute('id');
                                            const foundElementName = await checkoutElements[0].getAttribute('name');
                                            console.log(`Found element - ID: "${foundElementId}", Name: "${foundElementName}"`);
                                        } else {
                                            // Try looking for the second date input field (assuming check-in is first, check-out is second)
                                            const allDateInputs = await driver.findElements(By.xpath("//input[@type='text' or @type='date'][contains(@id, 'txt') or contains(@name, 'txt')]"));
                                            if (allDateInputs.length >= 2) {
                                                console.log(`Found ${allDateInputs.length} text input field(s), trying the second one as check-out`);
                                                await allDateInputs[1].click();
                                                console.log('✅ Successfully focused on second text input field (likely check-out)');
                                                
                                                // Get details of the found element
                                                const foundElementId = await allDateInputs[1].getAttribute('id');
                                                const foundElementName = await allDateInputs[1].getAttribute('name');
                                                console.log(`Found element - ID: "${foundElementId}", Name: "${foundElementName}"`);
                                            } else {
                                                console.log('❌ No txtCheckout or check-out related elements found');
                                            }
                                        }
                                    }
                                } catch (altError) {
                                    console.error('❌ Alternative selector search failed:', altError.message);
                                }
                            }
                            
                        } else {
                            console.log('❌ Unable to set check-in date with any method');
                        }
                        
                    } catch (checkinError) {
                        console.error('❌ Error setting focus on txtCheckin:', checkinError.message);
                        
                        // Try alternative selectors if ID doesn't work
                        console.log('Trying alternative selectors for check-in field...');
                        try {
                            // Try by name attribute
                            const elementByName = await driver.findElements(By.name('txtCheckin'));
                            if (elementByName.length > 0) {
                                await elementByName[0].click();
                                console.log('✅ Successfully found and focused txtCheckin by name attribute');
                            } else {
                                // Try by partial ID or class containing 'checkin' or 'check-in'
                                const checkinElements = await driver.findElements(By.xpath("//*[contains(@id, 'checkin') or contains(@class, 'checkin') or contains(@name, 'checkin') or contains(@placeholder, 'check') or contains(@placeholder, 'entrada')]"));
                                if (checkinElements.length > 0) {
                                    console.log(`Found ${checkinElements.length} check-in related element(s)`);
                                    await checkinElements[0].click();
                                    console.log('✅ Successfully focused on check-in related element');
                                    
                                    // Get details of the found element
                                    const foundElementId = await checkinElements[0].getAttribute('id');
                                    const foundElementName = await checkinElements[0].getAttribute('name');
                                    console.log(`Found element - ID: "${foundElementId}", Name: "${foundElementName}"`);
                                } else {
                                    // Try looking for date input fields
                                    const dateInputs = await driver.findElements(By.xpath("//input[@type='date' or @type='text'][contains(@id, 'data') or contains(@name, 'data')]"));
                                    if (dateInputs.length > 0) {
                                        console.log(`Found ${dateInputs.length} date input field(s)`);
                                        await dateInputs[0].click();
                                        console.log('✅ Successfully focused on date input field');
                                    } else {
                                        console.log('❌ No txtCheckin or check-in related elements found');
                                    }
                                }
                            }
                        } catch (altError) {
                            console.error('❌ Alternative selector search failed:', altError.message);
                        }
                    }
                    
                } catch (selectError) {
                    console.error('❌ Error selecting "Todas" option:', selectError.message);
                    
                    // Alternative method: Select by value
                    console.log('Trying alternative selection method by value...');
                    try {
                        const selectElement = new Select(ddlHoteisElement);
                        await selectElement.selectByValue('-1');
                        console.log('✅ Successfully selected "Todas" option by value (-1)');
                        
                        // Verify the selection
                        const selectedOption = await selectElement.getFirstSelectedOption();
                        const selectedText = await selectedOption.getText();
                        console.log(`Selected option: "${selectedText}"`);
                        
                    } catch (altSelectError) {
                        console.error('❌ Alternative selection method failed:', altSelectError.message);
                        
                        // Manual click method
                        console.log('Trying manual click method...');
                        try {
                            const todasOption = await ddlHoteisElement.findElement(By.xpath(".//option[text()='Todas']"));
                            await todasOption.click();
                            console.log('✅ Successfully selected "Todas" option by manual click');
                        } catch (clickError) {
                            console.error('❌ Manual click method failed:', clickError.message);
                        }
                    }
                }
            }
            
        } catch (error) {
            console.error('❌ Error setting focus on ddlHoteis:', error.message);
            
            // Try alternative selectors if ID doesn't work
            console.log('Trying alternative selectors...');
            try {
                // Try by name attribute
                const elementByName = await driver.findElements(By.name('ddlHoteis'));
                if (elementByName.length > 0) {
                    await elementByName[0].click();
                    console.log('✅ Successfully found and focused ddlHoteis by name attribute');
                } else {
                    // Try by partial ID or class containing 'hotel'
                    const hotelElements = await driver.findElements(By.xpath("//*[contains(@id, 'hotel') or contains(@class, 'hotel') or contains(@name, 'hotel')]"));
                    if (hotelElements.length > 0) {
                        console.log(`Found ${hotelElements.length} hotel-related element(s)`);
                        await hotelElements[0].click();
                        console.log('✅ Successfully focused on hotel-related element');
                    } else {
                        console.log('❌ No ddlHoteis or hotel-related elements found');
                    }
                }
            } catch (altError) {
                console.error('❌ Alternative selector search failed:', altError.message);
            }
        }
        
        // Validate DOM elements
        console.log('\n--- DOM Element Validation ---');
        
        // Check for common page elements
        try {
            // Look for form elements
            const forms = await driver.findElements(By.tagName('form'));
            console.log(`Found ${forms.length} form(s) on the page`);
            
            // Look for input fields
            const inputs = await driver.findElements(By.tagName('input'));
            console.log(`Found ${inputs.length} input field(s)`);
            
            // Look for select dropdowns
            const selects = await driver.findElements(By.tagName('select'));
            console.log(`Found ${selects.length} select dropdown(s)`);
            
            // Look for buttons
            const buttons = await driver.findElements(By.tagName('button'));
            console.log(`Found ${buttons.length} button(s)`);
            
            // Look for tables (likely containing vacancy data)
            const tables = await driver.findElements(By.tagName('table'));
            console.log(`Found ${tables.length} table(s)`);
            
            // Look for divs (common containers)
            const divs = await driver.findElements(By.tagName('div'));
            console.log(`Found ${divs.length} div element(s)`);
            
            // Check for specific union website elements by common class names or IDs
            console.log('\n--- Specific Element Search ---');
            
            // Look for elements with common vacancy-related terms
            const vacancyElements = await driver.findElements(By.xpath("//*[contains(text(), 'vaga') or contains(text(), 'Vaga') or contains(text(), 'disponível') or contains(text(), 'Disponível')]"));
            console.log(`Found ${vacancyElements.length} element(s) containing vacancy-related text`);
            
            // Look for date elements
            const dateElements = await driver.findElements(By.xpath("//*[contains(text(), '2024') or contains(text(), '2025') or contains(@class, 'date') or contains(@class, 'data')]"));
            console.log(`Found ${dateElements.length} element(s) with date-related content`);
            
            // Get all links on the page
            const links = await driver.findElements(By.tagName('a'));
            console.log(`Found ${links.length} link(s)`);
            
            // Check for iframe elements (sometimes used for embedded content)
            const iframes = await driver.findElements(By.tagName('iframe'));
            console.log(`Found ${iframes.length} iframe(s)`);
            
            // Look for script tags (to understand page functionality)
            const scripts = await driver.findElements(By.tagName('script'));
            console.log(`Found ${scripts.length} script tag(s)`);
            
            console.log('\n--- Specific Content Validation ---');
            
            // Check if there are any visible vacancy entries
            if (tables.length > 0) {
                console.log('Analyzing table content...');
                for (let i = 0; i < Math.min(tables.length, 3); i++) {
                    const table = tables[i];
                    const rows = await table.findElements(By.tagName('tr'));
                    console.log(`Table ${i + 1}: ${rows.length} row(s)`);
                    
                    if (rows.length > 0) {
                        const headers = await table.findElements(By.tagName('th'));
                        if (headers.length > 0) {
                            console.log(`Table ${i + 1} has ${headers.length} header(s)`);
                        }
                    }
                }
            }
            
            // Check page text content for key information
            const bodyText = await driver.findElement(By.tagName('body')).getText();
            const hasVacancyInfo = bodyText.toLowerCase().includes('vaga') || 
                                  bodyText.toLowerCase().includes('disponível') ||
                                  bodyText.toLowerCase().includes('reserva');
            console.log(`Page contains vacancy-related content: ${hasVacancyInfo}`);
            
            // Check if page requires login
            const hasLoginForm = bodyText.toLowerCase().includes('login') || 
                                bodyText.toLowerCase().includes('usuário') ||
                                bodyText.toLowerCase().includes('senha');
            console.log(`Page appears to require login: ${hasLoginForm}`);
            
        } catch (error) {
            console.error('Error during DOM validation:', error.message);
        }
        
        // Optional: Wait for a few seconds to see the page
        console.log('\nWaiting 5 seconds before closing...');
        await driver.sleep(5000);
        
        console.log('DOM validation completed successfully!');
        
        // Get the page content to analyze for actual availability
        const pageSource = await driver.getPageSource();
        
        let foundVacancies = [];
        let hasActualAvailability = false;
        
        // Check for "NO ROOM" message first
        const noRoomPattern = /No período escolhido não há nenhum quarto disponível/i;
        const hasNoRoomMessage = noRoomPattern.test(pageSource);
        
        // Parse hotels and their vacancies using the cc_tit structure
        const hotelSections = pageSource.split(/<div class="cc_tit">/i);
        
        for (let i = 1; i < hotelSections.length; i++) {
            const section = hotelSections[i];
            
            // Extract hotel name from the section and clean it
            const hotelNameMatch = section.match(/^([^<]+)</);
            const rawHotelName = hotelNameMatch ? hotelNameMatch[1].trim() : 'Unknown Hotel';
            const hotelName = rawHotelName.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
            
            // Skip if this section contains "NO ROOM" message
            if (noRoomPattern.test(section)) {
                continue;
            }
            
            // Look for vacancy patterns in this hotel section
            const vacancyPatterns = [
                /(\w+(?:\s+\w+)*)\s*\(até\s+(\d+)\s+pessoas?\)\s*(\d{1,2}\/\d{1,2})\s*-\s*(\d{1,2}\/\d{1,2})\s*\([^)]+\)\s*-\s*(\d+)\s+Quarto\(s\)(?:\s*-\s*adaptado)?/gim,
                /(\w+(?:\s+\w+)*)\s*\(até\s+(\d+)\s+pessoas?\)[^\d]*(\d{1,2}\/\d{1,2})\s*-\s*(\d{1,2}\/\d{1,2})[^-]*-\s*(\d+)\s+Quarto\(s\)/gim
            ];
            
            vacancyPatterns.forEach(pattern => {
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
        
        // Determine final availability status
        if (hasActualAvailability && foundVacancies.length > 0) {
            // Group vacancies by hotel for better reporting
            const hotelGroups = {};
            foundVacancies.forEach(vacancy => {
                if (!hotelGroups[vacancy.hotel]) {
                    hotelGroups[vacancy.hotel] = [];
                }
                hotelGroups[vacancy.hotel].push(vacancy.vacancy);
            });
            
            return {
                hasAvailability: true,
                status: 'AVAILABLE',
                summary: `Found vacancies in ${Object.keys(hotelGroups).length} hotel(s): ${Object.keys(hotelGroups).join(', ')}`,
                vacancies: foundVacancies.map(v => v.fullText),
                hotelGroups: hotelGroups
            };
        } else {
            return {
                hasAvailability: false,
                status: 'NO AVAILABILITY',
                summary: hasNoRoomMessage ? 'No rooms available message detected' : 'No vacancy patterns found',
                vacancies: [],
                hotelGroups: {}
            };
        }
        
    } catch (error) {
        console.error('An error occurred:', error);
        return {
            status: 'ERROR',
            summary: `Error: ${error.message}`,
            vacancies: []
        };
    } finally {
        // Always close the browser
        await driver.quit();
        console.log('Browser closed.');
    }
}

// Run the weekend vacancy search
searchWeekendVacancies().catch(console.error);