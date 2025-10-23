const { Builder, By, until, Select } = require('selenium-webdriver');

async function openVagasPage() {
    // Create a new WebDriver instance (using Chrome by default)
    const driver = await new Builder().forBrowser('chrome').build();
    
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
            
            // Check for specific AFPESP elements by common class names or IDs
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
        
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        // Always close the browser
        await driver.quit();
        console.log('Browser closed.');
    }
}

// Run the script
openVagasPage().catch(console.error);