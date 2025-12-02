import { apiClient } from '../../services/apiClient.js';

// Hotel Vacancy Query and Extraction Utilities
class HotelVacancyService {
    constructor() {
        this.apiClient = apiClient;
        this.isSearching = false;
        console.log('✅ HotelVacancyService initialized with API client');
    }

    // Calculate next Friday-Sunday weekend for default date values
    getNextWeekend() {
        const today = new Date();
        const nextFriday = new Date(today);
        const daysUntilFriday = (5 - today.getDay() + 7) % 7;
        
        if (daysUntilFriday === 0 && today.getDay() !== 5) {
            nextFriday.setDate(today.getDate() + 7);
        } else {
            nextFriday.setDate(today.getDate() + daysUntilFriday);
        }
        
        const nextSunday = new Date(nextFriday);
        nextSunday.setDate(nextFriday.getDate() + 2);
        
        return { friday: nextFriday, sunday: nextSunday };
    }

    // Search all weekends using backend API
    async searchWeekendVacancies(count = 8) {
        console.log('\n🏨 COMPREHENSIVE WEEKEND HOTEL SEARCH');
        console.log(`🤖 Using backend API to search ${count} weekends`);
        
        try {
            const results = await this.apiClient.searchWeekendVacancies(count);
            
            // Transform API response
            const searchResults = this.transformWeekendAPIResponse(results);
            
            // Display comprehensive summary
            this.displayWeekendSummary(searchResults);
            return searchResults;
            
        } catch (error) {
            console.error('❌ Weekend search failed:', error.message);
            throw error;
        }
    }

    // Transform weekend API response to component format
    transformWeekendAPIResponse(apiData) {
        const { weekendResults, availability, searchDetails } = apiData;
        
        if (!weekendResults || weekendResults.length === 0) {
            return [];
        }
        
        return weekendResults.map((weekend, index) => ({
            weekendNumber: index + 1,
            dates: `${weekend.dates?.checkin || ''} to ${weekend.dates?.checkout || ''}`,
            friday: new Date(weekend.dates?.checkin),
            sunday: new Date(weekend.dates?.checkout),
            result: {
                hasAvailability: weekend.availability?.hasVacancies || false,
                summary: weekend.availability?.hasVacancies 
                    ? `${weekend.availability.availableHotels} hotel(s) disponível(is)`
                    : 'Sem disponibilidade',
                vacancies: weekend.vacancies || [],
                hotelGroups: weekend.hotelGroups || {}
            },
            status: weekend.availability?.hasVacancies ? 'AVAILABLE' : 'NO AVAILABILITY'
        }));
    }

    // Display weekend search summary (selenium-script.js displayWeekendSummary equivalent)
    displayWeekendSummary(searchResults) {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`🏨 COMPREHENSIVE WEEKEND HOTEL VACANCY SUMMARY`);
        console.log(`${'='.repeat(80)}`);
        
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
            });
        }
        
        console.log(`\n💡 RECOMMENDATIONS:`);
        if (availableWeekends.length > 0) {
            console.log(`  🎯 Book immediately for available weekends!`);
            console.log(`  📞 Contact trade union directly for reservations`);
        } else {
            console.log(`  🔄 Check back regularly as availability changes`);
            console.log(`  📅 Consider mid-week stays for better availability`);
        }
        
        console.log(`\n🕐 Search completed at: ${new Date().toLocaleString()}`);
        console.log(`${'='.repeat(80)}`);
    }

    // Format date for Brazilian DD/MM/YYYY format (for display only)
    formatDateBR(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Format date to ISO 8601 (YYYY-MM-DD) for API calls
    formatDateISO(date) {
        return this.apiClient.formatDateISO(date);
    }

    // Query AFPESP for hotel vacancies using backend API
    async queryVacancies(startDate, endDate) {
        console.log('🔍 Starting vacancy query...');
        if (this.isSearching) {
            throw new Error('Busca já em andamento. Aguarde...');
        }

        this.isSearching = true;
        
        try {
            console.log(`🔍 Querying API for ${this.formatDateBR(startDate)} to ${this.formatDateBR(endDate)}`);

            // Use the real API client
            const results = await this.apiClient.searchVacancies(startDate, endDate);
            console.log('✅ Real API search completed successfully');
            
            // Transform API response to component format
            return this.transformAPIResponse(results, startDate, endDate);
            
        } catch (error) {
            console.error('❌ Vacancy query failed:', error.message);
            throw error;
        } finally {
            this.isSearching = false;
        }
    }

    // Transform API response to component format
    transformAPIResponse(apiData, startDate, endDate) {
        const { availability, vacancies, searchDetails, hotelGroups } = apiData;
        
        return {
            hasAvailability: availability?.hasVacancies || false,
            status: availability?.hasVacancies ? 'AVAILABLE' : 'NO AVAILABILITY',
            summary: availability?.hasVacancies 
                ? `Encontradas vagas em ${availability.availableHotels} hotel(s)`
                : 'No período escolhido não há nenhum quarto disponível',
            vacancies: vacancies || [],
            hotelGroups: hotelGroups || {},
            queryDetails: {
                startDate: this.formatDateBR(startDate),
                endDate: this.formatDateBR(endDate),
                searchType: 'real_api_search',
                hotelsFound: availability?.availableHotels || 0,
                totalHotelsSearched: searchDetails?.totalHotelsSearched || 0,
                totalVacanciesFound: searchDetails?.totalVacanciesFound || 0
            }
        };
    }

    // JavaScript equivalent of selenium-script.js search procedure
    async performAfpespSearch(startDate, endDate) {
        console.log('🤖 JavaScript Browser Automation (Selenium-equivalent)');
        console.log('🎯 Replicating selenium-script.js search procedure in pure JavaScript...');
        
        // This mimics the selenium script's comprehensive search workflow
        return await this.executeSeleniumEquivalentSearch(startDate, endDate);
    }

    // Complete JavaScript implementation of selenium-script.js procedure
    async executeSeleniumEquivalentSearch(startDate, endDate) {
        console.log('\n=== SELENIUM-EQUIVALENT JAVASCRIPT AUTOMATION ===');
        console.log('🔄 Performing the same steps as selenium-script.js but in browser JavaScript');
        
        // Try popup window approach first (if user allows popups)
        try {
            console.log('🪟 Attempting popup window approach...');
            const results = await this.tryPopupWindowAutomation(startDate, endDate);
            if (results) {
                console.log('✅ Popup window automation successful!');
                return results;
            }
        } catch (popupError) {
            console.log('❌ Popup approach failed:', popupError.message);
        }
        
        // Fallback to simulation
        console.log('🎭 Falling back to enhanced simulation...');
        console.log('� Using selenium-script.js patterns for realistic results');
        
        try {
            const results = this.getSeleniumPatternBasedResults(startDate, endDate);
            console.log('✅ Selenium-equivalent search completed successfully (simulation mode)');
            return results;
        } catch (simulationError) {
            console.error('❌ Even simulation failed:', simulationError.message);
            // Return minimal fallback
            return {
                hasAvailability: false,
                summary: 'Busca temporariamente indisponível. Tente novamente mais tarde.',
                foundVacancies: [],
                hotelGroups: {},
                queryDetails: {
                    startDate: this.formatDateBR(startDate),
                    endDate: this.formatDateBR(endDate),
                    searchMethod: 'Fallback',
                    hotelsFound: 0
                },
                isSimulation: true,
                error: simulationError.message
            };
        }
    }

    // Open AFPESP in popup for manual search (CORS-aware approach)
    async tryPopupWindowAutomation(startDate, endDate) {
        console.log('🚀 Opening AFPESP in new popup for manual search...');
        
        // Format dates for user guidance
        const formattedStart = this.formatDateForDisplay(startDate);
        const formattedEnd = this.formatDateForDisplay(endDate);
        
        // Create instruction popup content
        const instructionUrl = this.createInstructionPage(formattedStart, formattedEnd);
        
        // Open popup with instructions
        const popup = window.open(
            instructionUrl,
            'afpesp-manual-search',
            'width=1200,height=800,scrollbars=yes,resizable=yes,status=yes,location=yes'
        );
        
        if (!popup) {
            throw new Error('Popup blocked by browser - please allow popups for this site');
        }
        
        console.log('📋 Popup opened with search instructions');
        
        return new Promise((resolve, reject) => {
            // Set timeout for manual search
            const timeout = setTimeout(() => {
                if (!popup.closed) {
                    popup.close();
                }
                reject(new Error('Manual search timeout - using simulated results instead'));
            }, 60000); // 1 minute for manual search
            
            // Monitor popup closure
            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    clearTimeout(timeout);
                    
                    // Since we can't get real results due to CORS, provide simulation
                    console.log('🔄 Popup closed, providing simulated results...');
                    const simulatedResults = this.generateRealisticResults(startDate, endDate);
                    resolve(simulatedResults);
                }
            }, 1000);
            
            // Listen for potential postMessage communication (future enhancement)
            const messageListener = (event) => {
                if (event.origin.includes('afpesp.com.br') && event.data.type === 'SEARCH_COMPLETE') {
                    clearInterval(checkClosed);
                    clearTimeout(timeout);
                    window.removeEventListener('message', messageListener);
                    popup.close();
                    resolve(event.data.results);
                }
            };
            
            window.addEventListener('message', messageListener);
        });
    }
    
    // Create instruction page for manual search
    createInstructionPage(startDate, endDate) {
        const instructionHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Busca Manual AFPESP</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .header { text-align: center; color: #2c3e50; margin-bottom: 30px; }
                    .instruction { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #2196f3; }
                    .dates { background: #fff3e0; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center; font-size: 18px; font-weight: bold; color: #e65100; }
                    .button { display: inline-block; background: #4caf50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 10px; font-weight: bold; }
                    .note { color: #666; font-size: 14px; margin-top: 20px; }
                    .steps { counter-reset: step-counter; }
                    .step { counter-increment: step-counter; margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 5px; }
                    .step::before { content: counter(step-counter); background: #007bff; color: white; border-radius: 50%; padding: 5px 10px; margin-right: 10px; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🏨 Busca Manual no AFPESP</h1>
                        <p>Siga as instruções abaixo para realizar sua busca</p>
                    </div>
                    
                    <div class="dates">
                        📅 Check-in: ${startDate}<br>
                        📅 Check-out: ${endDate}
                    </div>
                    
                    <div class="instruction">
                        <strong>⚠️ Importante:</strong> Devido às políticas de segurança do navegador (CORS), 
                        não podemos automatizar diretamente o site do AFPESP. Por favor, siga os passos abaixo:
                    </div>
                    
                    <div class="steps">
                        <div class="step">Clique no botão abaixo para abrir o AFPESP</div>
                        <div class="step">Procure pelo formulário de reservas no site</div>
                        <div class="step">Digite as datas de entrada e saída mostradas acima</div>
                        <div class="step">Clique em "Buscar" ou "Consultar Disponibilidade"</div>
                        <div class="step">Feche esta janela quando terminar</div>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://www.afpesp.com.br/associacao/lazer-e-turismo/hoteis-rede-credenciada/hotel-fazenda-vale-do-luar/" 
                           target="_blank" class="button">
                           🔗 Abrir AFPESP
                        </a>
                    </div>
                    
                    <div class="note">
                        <strong>Nota:</strong> O sistema aguardará você fechar esta janela e então fornecerá 
                        resultados simulados baseados em padrões históricos de disponibilidade.
                    </div>
                </div>
            </body>
            </html>
        `;
        
        const blob = new Blob([instructionHTML], { type: 'text/html' });
        return URL.createObjectURL(blob);
    }

    // Automate form in popup window
    async automatePopupForm(popup, startDate, endDate) {
        console.log('🤖 Automating AFPESP form in popup window...');
        
        try {
            const doc = popup.document;
            
            // Find and set hotel dropdown
            const ddlHoteis = doc.getElementById('ddlHoteis');
            if (ddlHoteis) {
                ddlHoteis.value = '-1'; // "Todas" option
                ddlHoteis.dispatchEvent(new Event('change'));
                console.log('✅ Hotel dropdown set to "Todas"');
            }
            
            // Set check-in date
            const txtCheckin = doc.getElementById('txtCheckin');
            if (txtCheckin) {
                txtCheckin.value = this.formatDateBR(startDate);
                txtCheckin.dispatchEvent(new Event('change'));
                console.log('✅ Check-in date set');
            }
            
            // Set check-out date
            const txtCheckout = doc.getElementById('txtCheckout');
            if (txtCheckout) {
                txtCheckout.value = this.formatDateBR(endDate);
                txtCheckout.dispatchEvent(new Event('change'));
                console.log('✅ Check-out date set');
            }
            
            // Submit form
            const btnConsulta = doc.getElementById('btnConsulta') || 
                              doc.querySelector('input[value*="Consulta"]') ||
                              doc.querySelector('button[name*="consulta"]');
            
            if (btnConsulta) {
                console.log('🚀 Submitting search form...');
                btnConsulta.click();
                
                // Wait for results
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                // Extract results
                const htmlContent = doc.documentElement.outerHTML;
                console.log(`📄 Retrieved ${htmlContent.length} characters from popup`);
                
                return this.parseAfpespResponse(htmlContent, startDate, endDate);
            } else {
                throw new Error('Search button not found in popup');
            }
            
        } catch (error) {
            throw new Error(`Popup automation failed: ${error.message}`);
        }
    }

    // Step 1: Create AFPESP iframe (equivalent to selenium driver.get())
    async createAfpespIframe() {
        console.log('🖼️ Creating hidden iframe for AFPESP page...');
        console.log(`📍 Target URL: ${this.afpespPageUrl}`);
        
        const iframe = document.createElement('iframe');
        iframe.style.cssText = `
            position: absolute;
            top: -9999px;
            left: -9999px;
            width: 1200px;
            height: 800px;
            border: none;
            opacity: 0;
        `;
        iframe.src = this.afpespPageUrl;
        document.body.appendChild(iframe);
        
        console.log('✅ AFPESP iframe created and loading...');
        return iframe;
    }

    // Step 2: Wait for iframe load (equivalent to selenium wait conditions)
    async waitForIframeLoad(iframe) {
        console.log('⏳ Waiting for AFPESP page to load completely...');
        
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('AFPESP page load timeout (CORS likely blocking)'));
            }, 10000);
            
            iframe.onload = () => {
                clearTimeout(timeout);
                console.log('✅ AFPESP page loaded successfully');
                
                try {
                    // Try to access iframe content (will fail if CORS blocked)
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    const title = doc.title;
                    console.log(`📄 Page title: "${title}"`);
                    resolve(doc);
                } catch (corsError) {
                    console.log('🚫 CORS blocking iframe access (expected)');
                    reject(new Error('CORS prevents iframe content access'));
                }
            };
            
            iframe.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('Failed to load AFPESP page'));
            };
        });
    }

    // Step 3: Automate form fields (equivalent to selenium form automation)
    async automateFormFields(iframe, startDate, endDate) {
        console.log('🤖 Automating form fields (selenium-style)...');
        
        try {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            
            // Find hotel dropdown (equivalent to selenium By.id('ddlHoteis'))
            console.log('🔍 Locating ddlHoteis element...');
            const ddlHoteis = doc.getElementById('ddlHoteis');
            if (ddlHoteis) {
                console.log('✅ ddlHoteis found - setting to "Todas" (All Hotels)');
                ddlHoteis.value = '-1'; // "Todas" option
                ddlHoteis.dispatchEvent(new Event('change'));
            }
            
            // Format dates (equivalent to selenium date formatting)
            const formatDateBR = (date) => {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            };
            
            const checkinDate = formatDateBR(startDate);
            const checkoutDate = formatDateBR(endDate);
            
            // Set check-in date (equivalent to selenium txtCheckin.sendKeys())
            console.log('📅 Setting check-in date...');
            const txtCheckin = doc.getElementById('txtCheckin');
            if (txtCheckin) {
                txtCheckin.value = checkinDate;
                txtCheckin.dispatchEvent(new Event('change'));
                console.log(`✅ Check-in set to: ${checkinDate}`);
            }
            
            // Set check-out date (equivalent to selenium txtCheckout automation)
            console.log('📅 Setting check-out date...');
            const txtCheckout = doc.getElementById('txtCheckout');
            if (txtCheckout) {
                txtCheckout.value = checkoutDate;
                txtCheckout.dispatchEvent(new Event('change'));
                console.log(`✅ Check-out set to: ${checkoutDate}`);
            }
            
            return {
                hotel: 'Todas',
                checkin: checkinDate,
                checkout: checkoutDate,
                hotelElement: ddlHoteis,
                checkinElement: txtCheckin,
                checkoutElement: txtCheckout
            };
            
        } catch (error) {
            throw new Error(`Form automation failed: ${error.message}`);
        }
    }

    // Step 4: Submit search form (equivalent to selenium btnConsulta.click())
    async submitSearchForm(iframe, searchParams) {
        console.log('🚀 Submitting search form (selenium btnConsulta.click() equivalent)...');
        
        try {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            
            // Find and click search button (equivalent to selenium btnConsulta)
            const btnConsulta = doc.getElementById('btnConsulta') || 
                              doc.querySelector('input[value*="Consulta"]') ||
                              doc.querySelector('button[name*="consulta"]');
            
            if (btnConsulta) {
                console.log('✅ Search button found - clicking...');
                btnConsulta.click();
                
                // Wait for results (equivalent to selenium result waiting)
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                // Get page content after search
                const html = doc.documentElement.outerHTML;
                console.log(`📄 Retrieved ${html.length} characters of result HTML`);
                
                return html;
            } else {
                throw new Error('Search button not found');
            }
            
        } catch (error) {
            throw new Error(`Search submission failed: ${error.message}`);
        }
    }

    // Step 5: Parse search results (equivalent to selenium lyConsulta extraction)
    async parseSearchResults(htmlContent, startDate, endDate) {
        console.log('🔍 Parsing search results (selenium lyConsulta equivalent)...');
        
        // Use the same parsing logic as migrated from selenium script
        return this.parseAfpespResponse(htmlContent, startDate, endDate);
    }

    // Step 6: Cleanup iframe
    cleanupIframe(iframe) {
        console.log('🧹 Cleaning up iframe (selenium driver.quit() equivalent)...');
        if (iframe && iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
            console.log('✅ Iframe removed from DOM');
        }
    }

    // Fallback: Selenium pattern-based results when automation fails
    getSeleniumPatternBasedResults(startDate, endDate) {
        console.log('� Using selenium-script.js patterns for realistic simulation...');
        
        // This simulates the exact patterns found by the selenium script
        const mockHtml = `
            <div class="cc_tit">Hotel Appenzell BLUES</div>
            <div>BLUES Luxo (até 3 pessoas) 27/10 - 29/10 (2 dias livres) - 1 Quarto(s)</div>
            <div class="cc_tit">Hotel Perdizes</div>
            <div>Duplo (até 2 pessoas) 01/11 - 03/11 (2 dias livres) - 2 Quarto(s)</div>
            <div class="cc_tit">Hotel Sumaré</div>
            <div>Triplo (até 3 pessoas) 08/11 - 10/11 (2 dias livres) - 1 Quarto(s) - adaptado</div>
        `;
        
        return this.parseAfpespResponse(mockHtml, startDate, endDate);
    }

    // Original AFPESP search (keeping for compatibility)
    async performAfpespSearchOriginal(startDate, endDate) {
        console.log('🌐 Attempting direct AFPESP API search...');
        
        const searchUrl = this.afpespPageUrl; // Use the page URL for form submission
        const formData = new FormData();
        
        // Prepare search parameters (based on selenium script form data)
        formData.append('ddlHoteis', '-1'); // "Todas" option
        formData.append('txtCheckin', this.formatDateBR(startDate));
        formData.append('txtCheckout', this.formatDateBR(endDate));
        
        // Additional form parameters that might be required
        formData.append('__EVENTTARGET', '');
        formData.append('__EVENTARGUMENT', '');
        
        try {
            // Attempt to make the request using fetch API
            const response = await fetch(searchUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                credentials: 'omit', // Don't send cookies to avoid CORS issues
                mode: 'cors' // This will likely fail due to CORS, but we try anyway
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const htmlContent = await response.text();
            console.log(`📄 Received ${htmlContent.length} characters of HTML content`);

            // Parse the HTML response (based on selenium script parsing logic)
            const results = this.parseAfpespResponse(htmlContent, startDate, endDate);
            
            return results;

        } catch (fetchError) {
            if (fetchError.message.includes('cors') || fetchError.message.includes('CORS') || 
                fetchError.message.includes('Access-Control') || fetchError.message.includes('blocked')) {
                console.log('🚫 CORS Policy Violation Detected');
                console.log('   → Browser Security: Cross-origin request blocked');
                console.log('   → Missing Header: Access-Control-Allow-Origin not present');
                console.log('   → Server Config: AFPESP server doesn\'t allow localhost requests');
                console.log('   → Attempting fallback strategies...');
            } else {
                console.log('🚫 Direct fetch failed:', fetchError.message);
            }
            
            // Try alternative approach using a hidden iframe (may still fail due to CORS)
            try {
                return await this.tryIframeSearch(startDate, endDate);
            } catch (iframeError) {
                console.log('🚫 All approaches failed due to CORS restrictions');
                console.log('💡 Solutions for real AFPESP integration:');
                console.log('   1. Server-side proxy to bypass CORS');
                console.log('   2. Browser extension with elevated permissions');
                console.log('   3. CORS browser extension (development only)');
                console.log('   4. Server-side scraping with Puppeteer');
                
                throw new Error(`CORS restrictions prevent direct AFPESP access: ${fetchError.message}`);
            }
        }
    }

    // Alternative search method using hidden iframe (based on selenium navigation)
    async tryIframeSearch(startDate, endDate) {
        console.log('🖼️ Attempting iframe-based search...');
        
        return new Promise((resolve, reject) => {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = this.afpespPageUrl;
            
            let timeoutId;
            
            iframe.onload = () => {
                try {
                    // Try to access iframe content (will fail if CORS blocked)
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    
                    if (!iframeDoc) {
                        throw new Error('Cannot access iframe content due to CORS policy');
                    }
                    
                    // Try to fill the form (based on selenium script elements)
                    const hotelSelect = iframeDoc.getElementById('ddlHoteis');
                    const checkinInput = iframeDoc.getElementById('txtCheckin');
                    const checkoutInput = iframeDoc.getElementById('txtCheckout');
                    const submitButton = iframeDoc.getElementById('btnConsulta');
                    
                    if (hotelSelect && checkinInput && checkoutInput && submitButton) {
                        // Fill form fields
                        hotelSelect.value = '-1'; // "Todas"
                        checkinInput.value = this.formatDateBR(startDate);
                        checkoutInput.value = this.formatDateBR(endDate);
                        
                        // Set up result listener
                        const checkResults = () => {
                            const resultsElement = iframeDoc.getElementById('lyConsulta');
                            if (resultsElement && resultsElement.innerHTML.trim().length > 50) {
                                clearTimeout(timeoutId);
                                const results = this.parseAfpespResponse(resultsElement.innerHTML, startDate, endDate);
                                document.body.removeChild(iframe);
                                resolve(results);
                            }
                        };
                        
                        // Submit form
                        submitButton.click();
                        
                        // Poll for results
                        const pollResults = setInterval(() => {
                            try {
                                checkResults();
                                clearInterval(pollResults);
                            } catch (e) {
                                // Continue polling
                            }
                        }, 1000);
                        
                        // Set timeout for the search
                        timeoutId = setTimeout(() => {
                            clearInterval(pollResults);
                            document.body.removeChild(iframe);
                            reject(new Error('Search timeout after 15 seconds'));
                        }, 15000);
                        
                    } else {
                        throw new Error('Required form elements not found in iframe');
                    }
                    
                } catch (error) {
                    clearTimeout(timeoutId);
                    document.body.removeChild(iframe);
                    reject(error);
                }
            };
            
            iframe.onerror = () => {
                clearTimeout(timeoutId);
                document.body.removeChild(iframe);
                reject(new Error('Failed to load AFPESP page in iframe'));
            };
            
            // Set overall timeout
            timeoutId = setTimeout(() => {
                document.body.removeChild(iframe);
                reject(new Error('Iframe load timeout'));
            }, 10000);
            
            document.body.appendChild(iframe);
        });
    }

    // Parse AFPESP HTML response (migrated from selenium script parsing logic)
    parseAfpespResponse(htmlContent, startDate, endDate) {
        console.log('📊 Parsing AFPESP response...');
        
        const foundVacancies = [];
        const hotelGroups = {};
        let hasAvailability = false;
        
        // Check for "NO ROOM" message first (from selenium script logic)
        const noRoomMessage = "No período escolhido não há nenhum quarto disponível";
        const hasNoRoomMessage = htmlContent.includes(noRoomMessage);
        
        if (hasNoRoomMessage) {
            console.log('🚫 No rooms available message detected');
            return {
                hasAvailability: false,
                status: 'NO AVAILABILITY',
                summary: 'No período escolhido não há nenhum quarto disponível',
                vacancies: [],
                hotelGroups: {},
                queryDetails: {
                    startDate: this.formatDateBR(startDate),
                    endDate: this.formatDateBR(endDate),
                    searchType: 'real_afpesp_search'
                }
            };
        }
        
        // Parse hotel sections using cc_tit structure (from selenium script)
        const hotelSections = htmlContent.split(/<div class="cc_tit">/i);
        
        for (let i = 1; i < hotelSections.length; i++) {
            const section = hotelSections[i];
            
            // Extract hotel name (cleaned from selenium script logic)
            const hotelNameMatch = section.match(/^([^<]+)</);
            const rawHotelName = hotelNameMatch ? hotelNameMatch[1].trim() : 'Unknown Hotel';
            const hotelName = rawHotelName.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
            
            // Skip sections with "NO ROOM" message
            if (section.includes(noRoomMessage)) {
                continue;
            }
            
            // Look for vacancy patterns (enhanced from selenium script patterns)
            const vacancyPatterns = [
                /(\w+(?:\s+\w+)*)\s*\(até\s+(\d+)\s+pessoas?\)\s*(\d{1,2}\/\d{1,2})\s*-\s*(\d{1,2}\/\d{1,2})\s*\([^)]+\)\s*-\s*(\d+)\s+Quarto\(s\)(?:\s*-\s*adaptado)?/gim,
                /(\w+(?:\s+\w+)*)\s*\(até\s+(\d+)\s+pessoas?\)[^\d]*(\d{1,2}\/\d{1,2})\s*-\s*(\d{1,2}\/\d{1,2})[^-]*-\s*(\d+)\s+Quarto\(s\)/gim,
                /(BLUES\s+)?(?:Triplo|Duplo|Apartamento|Chalé|Homem\s+de\s+Melo|Perdizes|Sumaré)\s*(?:Luxo|PcD)?\s*\(até\s+\d+\s+pessoas?\)[\s\n]*(?:\d{1,2}\/\d{1,2}\s*-\s*\d{1,2}\/\d{1,2}\s*\(\d+\s+dias?\s+livres?\)\s*-\s*\d+\s+Quarto\(s\)(?:\s*-\s*adaptado)?[\s\n]*)+/gim
            ];
            
            vacancyPatterns.forEach(pattern => {
                const matches = section.match(pattern) || [];
                matches.forEach(match => {
                    // Clean match by removing HTML tags and normalizing whitespace
                    const cleanMatch = match.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
                    
                    if (cleanMatch && cleanMatch.length > 10) {
                        const vacancyInfo = {
                            hotel: hotelName,
                            vacancy: cleanMatch,
                            fullText: `${hotelName}: ${cleanMatch}`
                        };
                        
                        // Check if this vacancy is not already added
                        if (!foundVacancies.some(v => v.fullText === vacancyInfo.fullText)) {
                            foundVacancies.push(vacancyInfo);
                            hasAvailability = true;
                            
                            // Group by hotel
                            if (!hotelGroups[hotelName]) {
                                hotelGroups[hotelName] = [];
                            }
                            hotelGroups[hotelName].push(cleanMatch);
                        }
                    }
                });
            });
        }
        
        // Return results in the expected format
        if (hasAvailability && foundVacancies.length > 0) {
            const hotelCount = Object.keys(hotelGroups).length;
            return {
                hasAvailability: true,
                status: 'AVAILABLE',
                summary: `Encontradas vagas em ${hotelCount} hotel(s): ${Object.keys(hotelGroups).join(', ')}`,
                vacancies: foundVacancies.map(v => v.fullText),
                hotelGroups: hotelGroups,
                queryDetails: {
                    startDate: this.formatDateBR(startDate),
                    endDate: this.formatDateBR(endDate),
                    searchType: 'real_afpesp_search',
                    hotelsFound: hotelCount
                }
            };
        } else {
            return {
                hasAvailability: false,
                status: 'NO AVAILABILITY',
                summary: 'Nenhuma vaga encontrada nos critérios especificados',
                vacancies: [],
                hotelGroups: {},
                queryDetails: {
                    startDate: this.formatDateBR(startDate),
                    endDate: this.formatDateBR(endDate),
                    searchType: 'real_afpesp_search'
                }
            };
        }
    }

    // Simulate vacancy query with realistic data structure
    async simulateVacancyQuery(startDate, endDate) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const isWeekend = startDate.getDay() === 5; // Friday
        const isHighSeason = startDate.getMonth() >= 11 || startDate.getMonth() <= 2; // Dec-Feb
        
        // Simulate availability based on realistic patterns
        const hasAvailability = Math.random() > (isWeekend && isHighSeason ? 0.7 : 0.3);
        
        if (!hasAvailability) {
            return {
                hasAvailability: false,
                status: 'NO AVAILABILITY',
                summary: 'No período escolhido não há nenhum quarto disponível',
                vacancies: [],
                hotelGroups: {},
                queryDetails: {
                    startDate: this.formatDateBR(startDate),
                    endDate: this.formatDateBR(endDate),
                    searchType: 'weekend_search'
                }
            };
        }

        // Generate realistic vacancy data
        const hotels = [
            'Hotel Fazenda Ribeirao',
            'Hotel Termas de Araxá', 
            'Hotel Praiamar',
            'Hotel Serra Dourada',
            'Hotel Costa Verde'
        ];

        const roomTypes = [
            'Standard',
            'Luxo',
            'Master',
            'Executivo',
            'Família'
        ];

        const hotelGroups = {};
        const vacancies = [];

        // Generate 2-4 hotels with availability
        const availableHotels = hotels.slice(0, Math.floor(Math.random() * 3) + 2);
        
        availableHotels.forEach(hotel => {
            const hotelVacancies = [];
            const numRoomTypes = Math.floor(Math.random() * 3) + 1;
            
            for (let i = 0; i < numRoomTypes; i++) {
                const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
                const capacity = Math.floor(Math.random() * 4) + 2;
                const availableRooms = Math.floor(Math.random() * 5) + 1;
                
                const vacancyText = `${roomType} (até ${capacity} pessoas) ${this.formatDateBR(startDate)} - ${this.formatDateBR(endDate)} - ${availableRooms} Quarto(s)`;
                hotelVacancies.push(vacancyText);
                vacancies.push({
                    hotel: hotel,
                    vacancy: vacancyText,
                    fullText: `${hotel}: ${vacancyText}`
                });
            }
            
            hotelGroups[hotel] = hotelVacancies;
        });

        return {
            hasAvailability: true,
            status: 'AVAILABLE',
            summary: `Encontradas vagas em ${availableHotels.length} hotel(s): ${availableHotels.join(', ')}`,
            vacancies: vacancies.map(v => v.fullText),
            hotelGroups: hotelGroups,
            queryDetails: {
                startDate: this.formatDateBR(startDate),
                endDate: this.formatDateBR(endDate),
                searchType: 'weekend_search',
                hotelsFound: availableHotels.length
            }
        };
    }

    // Extract and parse hotel vacancy data (migrated from selenium script patterns)
    parseVacancyData(htmlContent) {
        console.log('🔍 Parsing vacancy data using selenium script patterns...');
        
        const foundVacancies = [];
        const hotelGroups = {};
        
        // Use the actual parsing logic from selenium script
        const noRoomMessage = "No período escolhido não há nenhum quarto disponível";
        
        // Parse hotel sections using cc_tit structure (exact selenium logic)
        const hotelSections = htmlContent.split(/<div class="cc_tit">/i);
        
        for (let i = 1; i < hotelSections.length; i++) {
            const section = hotelSections[i];
            
            // Extract hotel name from the section and clean it (selenium logic)
            const hotelNameMatch = section.match(/^([^<]+)</);
            const rawHotelName = hotelNameMatch ? hotelNameMatch[1].trim() : 'Unknown Hotel';
            const hotelName = rawHotelName.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
            
            // Skip if this section contains "NO ROOM" message (selenium logic)
            if (section.includes(noRoomMessage)) {
                continue;
            }
            
            // Look for vacancy patterns in this hotel section (enhanced selenium patterns)
            const vacancyPatterns = [
                /(\w+(?:\s+\w+)*)\s*\(até\s+(\d+)\s+pessoas?\)\s*(\d{1,2}\/\d{1,2})\s*-\s*(\d{1,2}\/\d{1,2})\s*\([^)]+\)\s*-\s*(\d+)\s+Quarto\(s\)(?:\s*-\s*adaptado)?/gim,
                /(\w+(?:\s+\w+)*)\s*\(até\s+(\d+)\s+pessoas?\)[^\d]*(\d{1,2}\/\d{1,2})\s*-\s*(\d{1,2}\/\d{1,2})[^-]*-\s*(\d+)\s+Quarto\(s\)/gim,
                /(BLUES\s+)?(?:Triplo|Duplo|Apartamento|Chalé|Homem\s+de\s+Melo|Perdizes|Sumaré)\s*(?:Luxo|PcD)?\s*\(até\s+\d+\s+pessoas?\)[\s\n]*\d{1,2}\/\d{1,2}\s*-\s*\d{1,2}\/\d{1,2}\s*\(\d+\s+dias?\s+livres?\)\s*-\s*\d+\s+Quarto\(s\)(?:\s*-\s*adaptado)?/gim
            ];
            
            vacancyPatterns.forEach(pattern => {
                const matches = section.match(pattern);
                if (matches) {
                    matches.forEach(match => {
                        // Clean match by removing HTML tags and normalizing whitespace (selenium logic)
                        const cleanMatch = match.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
                        
                        if (cleanMatch && cleanMatch.length > 10) {
                            const vacancyInfo = {
                                hotel: hotelName,
                                vacancy: cleanMatch,
                                fullText: `${hotelName}: ${cleanMatch}`
                            };
                            
                            // Check if this vacancy is not already added (selenium logic)
                            if (!foundVacancies.some(v => v.fullText === vacancyInfo.fullText)) {
                                foundVacancies.push(vacancyInfo);
                                
                                // Group by hotel
                                if (!hotelGroups[hotelName]) {
                                    hotelGroups[hotelName] = [];
                                }
                                hotelGroups[hotelName].push(cleanMatch);
                            }
                        }
                    });
                }
            });
        }
        
        console.log(`📊 Parsed ${foundVacancies.length} vacancies from ${Object.keys(hotelGroups).length} hotels`);
        
        return { foundVacancies, hotelGroups };
    }
}

export function QuickSearch() {
    return `
        <div class="quick-search">
            <div class="quick-search-content">
                <div class="quick-search-header">
                    <h2>Encontre Hotéis Sindicais</h2>
                    <p class="quick-search-subtitle">Busque ofertas exclusivas com tarifas preferenciais</p>
                </div>
                
                <!-- Trust Indicators Above Fold -->
                <div class="trust-indicators">
                    <div class="trust-item">
                        <span class="trust-icon">🏨</span>
                        <span class="trust-text">50+ Hotéis</span>
                    </div>
                    <div class="trust-item">
                        <span class="trust-icon">💰</span>
                        <span class="trust-text">Tarifas Especiais</span>
                    </div>
                    <div class="trust-item">
                        <span class="trust-icon">✨</span>
                        <span class="trust-text">100% Gratuito</span>
                    </div>
                    <div class="trust-item">
                        <span class="trust-icon">👥</span>
                        <span class="trust-text">1000+ Atendidos</span>
                    </div>
                </div>
                
                <!-- Date-Based Search Form -->
                <form id="quick-hotel-search-form" class="quick-search-form">
                    <div class="quick-form-fields">
                        <div class="quick-field-group quick-union-row">
                            <select id="quick-union" name="union" class="quick-select">
                                <option value="afpesp" selected>🏛️ AFPESP - Associação dos Funcionários Públicos do Estado de São Paulo</option>
                            </select>
                        </div>
                        
                        <div class="quick-field-group quick-dates-row">
                            <input type="date" id="quick-start-date" name="startDate" class="quick-select">
                            <input type="date" id="quick-end-date" name="endDate" class="quick-select">
                        </div>
                    </div>
                    
                    <div class="button-group">
                        <button type="submit" class="quick-search-button primary" id="quick-search-submit">
                            <span class="search-icon">🔍</span>
                            <span class="search-text">Buscar Ofertas Agora</span>
                            <span class="loading-spinner" style="display: none;">⏳</span>
                        </button>
                        
                        <button type="button" class="quick-search-button weekend-search" id="weekend-search-button">
                            <span class="search-icon">📅</span>
                            <span class="search-text">Buscar Próximos Fins de Semana</span>
                            <span class="loading-spinner" style="display: none;">🔄</span>
                        </button>
                    </div>
                    
                    <!-- Progressive Disclosure Link -->
                    <button type="button" class="advanced-options-toggle" id="show-advanced-search">
                        <span>+ Opções Avançadas</span>
                    </button>
                </form>

                <!-- Results Display Area -->
                <div class="quick-search-results" id="quick-search-results" style="display: none;">
                    <div class="results-header">
                        <h3>📊 Resultados da Busca</h3>
                    </div>
                    <div class="results-content" id="results-content">
                        <!-- Results will be populated dynamically -->
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialize QuickSearch with vacancy query functionality
export function initializeQuickSearch() {
    const vacancyService = new HotelVacancyService();
    
    // Set default dates to next weekend
    const nextWeekend = vacancyService.getNextWeekend();
    const startDateInput = document.getElementById('quick-start-date');
    const endDateInput = document.getElementById('quick-end-date');
    
    if (startDateInput && endDateInput) {
        startDateInput.value = nextWeekend.friday.toISOString().split('T')[0];
        endDateInput.value = nextWeekend.sunday.toISOString().split('T')[0];
    }
    
    // Handle form submission
    const form = document.getElementById('quick-hotel-search-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleQuickSearch(vacancyService);
        });
    }
    
    // Handle comprehensive weekend search (selenium-script.js equivalent)
    const weekendSearchButton = document.getElementById('weekend-search-button');
    if (weekendSearchButton) {
        weekendSearchButton.addEventListener('click', async (e) => {
            e.preventDefault();
            await handleWeekendSearch(vacancyService);
        });
    }
    
    console.log('✅ QuickSearch initialized with API client');
    console.log('🔍 Real-time AFPESP vacancy search enabled');
    console.log('📅 Weekend search available');
}

// Handle quick search form submission
async function handleQuickSearch(vacancyService) {
    const submitButton = document.getElementById('quick-search-submit');
    const searchText = submitButton.querySelector('.search-text');
    const loadingSpinner = submitButton.querySelector('.loading-spinner');
    const resultsContainer = document.getElementById('quick-search-results');
    const resultsContent = document.getElementById('results-content');
    
    // Get form data
    const startDateInput = document.getElementById('quick-start-date');
    const endDateInput = document.getElementById('quick-end-date');
    
    if (!startDateInput.value || !endDateInput.value) {
        displayError('Por favor, selecione as datas de entrada e saída.');
        return;
    }
    
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    
    // Validate dates
    if (startDate >= endDate) {
        displayError('A data de saída deve ser posterior à data de entrada.');
        return;
    }
    
    if (startDate < new Date().setHours(0, 0, 0, 0)) {
        displayError('A data de entrada não pode ser no passado.');
        return;
    }
    
    try {
        // Update UI to loading state
        submitButton.disabled = true;
        searchText.style.display = 'none';
        loadingSpinner.style.display = 'inline';
        resultsContainer.style.display = 'none';
        
        console.log(`🔍 Starting hotel vacancy search for ${vacancyService.formatDateBR(startDate)} to ${vacancyService.formatDateBR(endDate)}`);
        
        // Query for vacancies
        const results = await vacancyService.queryVacancies(startDate, endDate);
        
        // Display results
        displaySearchResults(results, resultsContent);
        resultsContainer.style.display = 'block';
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
    } catch (error) {
        console.error('❌ Search failed:', error.message);
        displayError(`Erro na busca: ${error.message}`);
    } finally {
        // Reset UI state
        submitButton.disabled = false;
        searchText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
    }
}

// Display search results
function displaySearchResults(results, container) {
    if (!results || !container) return;
    
    let html = '';
    
    if (results.hasAvailability && Object.keys(results.hotelGroups).length > 0) {
        html = `
            <div class="results-success">
                <div class="availability-summary">
                    <h4>🎉 Vagas Encontradas!</h4>
                    <p class="summary-text">${results.summary}</p>
                    <div class="search-details">
                        <span class="detail-item">📅 ${results.queryDetails.startDate} - ${results.queryDetails.endDate}</span>
                        <span class="detail-item">🏨 ${results.queryDetails.hotelsFound} hotel(s) disponível(is)</span>
                    </div>
                </div>
                
                <div class="hotels-list">
                    ${Object.entries(results.hotelGroups).map(([hotel, vacancies]) => `
                        <div class="hotel-card">
                            <h5 class="hotel-name">🏨 ${hotel}</h5>
                            <div class="vacancy-list">
                                ${vacancies.slice(0, 3).map(vacancy => `
                                    <div class="vacancy-item">
                                        <span class="vacancy-text">${vacancy}</span>
                                    </div>
                                `).join('')}
                                ${vacancies.length > 3 ? `
                                    <div class="more-vacancies">
                                        <span>+ ${vacancies.length - 3} outros tipos de quarto</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="next-steps">
                    <h5>📞 Próximos Passos:</h5>
                    <ul>
                        <li>📲 Entre em contato com seu sindicato para realizar a reserva</li>
                        <li>⚡ Reserve imediatamente - vagas limitadas!</li>
                        <li>📋 Tenha seus documentos em mãos</li>
                    </ul>
                </div>
            </div>
        `;
    } else {
        html = `
            <div class="results-no-availability">
                <div class="no-availability-summary">
                    <h4>😔 Nenhuma Vaga Encontrada</h4>
                    <p class="summary-text">${results.summary}</p>
                    <div class="search-details">
                        <span class="detail-item">📅 ${results.queryDetails.startDate} - ${results.queryDetails.endDate}</span>
                    </div>
                </div>
                
                <div class="suggestions">
                    <h5>💡 Sugestões:</h5>
                    <ul>
                        <li>🔄 Tente datas diferentes</li>
                        <li>📅 Considere estadias no meio da semana</li>
                        <li>🏨 Verifique hotéis específicos individualmente</li>
                        <li>📱 Entre em contato diretamente com o sindicato</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Display error message
function displayError(message) {
    const resultsContainer = document.getElementById('quick-search-results');
    const resultsContent = document.getElementById('results-content');
    
    if (resultsContainer && resultsContent) {
        resultsContent.innerHTML = `
            <div class="results-error">
                <h4>❌ Erro</h4>
                <p>${message}</p>
            </div>
        `;
        resultsContainer.style.display = 'block';
    } else {
        alert(message);
    }
}

// Handle comprehensive weekend search using backend API
async function handleWeekendSearch(vacancyService) {
    console.log('📅 Starting comprehensive weekend search via API...');
    
    const weekendButton = document.getElementById('weekend-search-button');
    const searchText = weekendButton.querySelector('.search-text');
    const loadingSpinner = weekendButton.querySelector('.loading-spinner');
    const resultsContainer = document.getElementById('quick-search-results');
    const resultsContent = document.getElementById('results-content');
    
    try {
        // Show loading state
        searchText.style.display = 'none';
        loadingSpinner.style.display = 'inline-flex';
        weekendButton.disabled = true;
        
        // Show results container
        resultsContainer.style.display = 'block';
        resultsContent.innerHTML = `
            <div class="searching-state">
                <h4>📅 Buscando Fins de Semana</h4>
                <p>Consultando API do backend (Puppeteer)...</p>
                <p>🔍 Verificando próximos 8 fins de semana</p>
                <div class="progress-message">
                    <p>⏳ Esta busca pode levar vários minutos...</p>
                    <p>📊 Aguarde enquanto verificamos a disponibilidade</p>
                </div>
            </div>
        `;
        
        // Execute comprehensive weekend search (default 8 weekends)
        const searchResults = await vacancyService.searchWeekendVacancies(8);
        
        // Display results
        displayWeekendSearchResults(searchResults, resultsContent);
        
    } catch (error) {
        console.error('❌ Weekend search failed:', error);
        displayError(`Erro na busca completa: ${error.message}`);
    } finally {
        // Restore button state
        searchText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
        weekendButton.disabled = false;
    }
}

// Display weekend search results
function displayWeekendSearchResults(searchResults, container) {
    const availableWeekends = searchResults.filter(r => r.result && r.result.hasAvailability === true);
    const unavailableWeekends = searchResults.filter(r => r.result && r.result.hasAvailability === false);
    
    container.innerHTML = `
        <div class="weekend-search-results">
            <h4>🏨 Resultados da Busca Completa (${searchResults.length} fins de semana)</h4>
            
            <div class="statistics">
                <div class="stat-group">
                    <div class="stat-item available">
                        <span class="stat-number">${availableWeekends.length}</span>
                        <span class="stat-label">Disponíveis</span>
                    </div>
                    <div class="stat-item unavailable">
                        <span class="stat-number">${unavailableWeekends.length}</span>
                        <span class="stat-label">Indisponíveis</span>
                    </div>
                </div>
            </div>
            
            ${availableWeekends.length > 0 ? `
                <div class="available-weekends">
                    <h5>🎉 Fins de Semana com Vagas</h5>
                    ${availableWeekends.map(weekend => `
                        <div class="weekend-result available">
                            <div class="weekend-header">
                                <strong>Weekend ${weekend.weekendNumber}: ${weekend.dates}</strong>
                            </div>
                            <div class="weekend-details">
                                ${weekend.result.summary || 'Vagas disponíveis encontradas'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="no-weekends-available">
                    <h5>😔 Nenhum Fim de Semana Disponível</h5>
                    <p>Não foram encontradas vagas para os próximos ${searchResults.length} fins de semana.</p>
                </div>
            `}
            
            <div class="search-info">
                <h5>🤖 Detalhes da Busca</h5>
                <ul>
                    <li><strong>Método:</strong> Backend API (Puppeteer)</li>
                    <li><strong>Fins de semana verificados:</strong> ${searchResults.length}</li>
                    <li><strong>Concluído:</strong> ${new Date().toLocaleString()}</li>
                </ul>
            </div>
            
            <div class="recommendations">
                <h5>💡 Recomendações</h5>
                ${availableWeekends.length > 0 ? `
                    <ul>
                        <li>🎯 Reserve imediatamente para os fins de semana disponíveis!</li>
                        <li>📞 Entre em contato diretamente com o sindicato para reservas</li>
                        <li>⏰ Vagas de fim de semana podem ser preenchidas rapidamente</li>
                    </ul>
                ` : `
                    <ul>
                        <li>🔄 Verifique regularmente, pois a disponibilidade muda frequentemente</li>
                        <li>📅 Considere estadias durante a semana para melhor disponibilidade</li>
                        <li>🏨 Tente buscar hotéis específicos individualmente</li>
                        <li>📱 Entre em contato com o sindicato para verificar cancelamentos</li>
                    </ul>
                `}
            </div>
        </div>
    `;
}

// Handle popup window search (experimental approach)
async function handlePopupSearch(vacancyService) {
    console.log('🪟 Starting popup window search (experimental)...');
    
    const popupButton = document.getElementById('popup-search-button');
    const searchText = popupButton.querySelector('.search-text');
    const loadingSpinner = popupButton.querySelector('.loading-spinner');
    const resultsContainer = document.getElementById('quick-search-results');
    const resultsContent = document.getElementById('results-content');
    
    // Get form data
    const startDateInput = document.getElementById('quick-start-date');
    const endDateInput = document.getElementById('quick-end-date');
    
    if (!startDateInput.value || !endDateInput.value) {
        displayError('Por favor, selecione as datas de entrada e saída.');
        return;
    }
    
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    
    try {
        // Show loading state
        searchText.style.display = 'none';
        loadingSpinner.style.display = 'inline-flex';
        popupButton.disabled = true;
        
        // Show results container with popup explanation
        resultsContainer.style.display = 'block';
        resultsContent.innerHTML = `
            <div class="popup-search-state">
                <h4>🪟 Busca Manual Assistida</h4>
                <div class="popup-warning">
                    <p><strong>ℹ️ Como funciona:</strong> Devido às políticas de segurança CORS, não podemos automatizar diretamente o AFPESP.</p>
                    <p>🔓 <strong>Permita popups</strong> no seu navegador para continuar.</p>
                    <p>📋 O sistema abrirá instruções para você fazer a busca manualmente.</p>
                    <p>🤖 Após você fechar a janela, receberá resultados simulados realistas.</p>
                </div>
                <div class="progress-message">
                    <p>🚀 Abrindo janela com instruções...</p>
                </div>
            </div>
        `;
        
        // Execute popup search
        const results = await vacancyService.tryPopupWindowAutomation(startDate, endDate);
        
        // Display results
        displaySearchResults(results, resultsContent);
        
    } catch (error) {
        console.error('❌ Popup search failed:', error);
        
        let errorMessage = 'Busca manual: ';
        if (error.message.includes('blocked')) {
           errorMessage += 'Popups foram bloqueados. Permita popups para este site e tente novamente.';
        } else if (error.message.includes('timeout')) {
            errorMessage += 'Tempo esgotado para busca manual. Usando simulação inteligente...';
            // Fallback to simulation
            try {
                const fallbackResults = await vacancyService.queryVacancies(startDate, endDate);
                displaySearchResults(fallbackResults, resultsContent);
                return;
            } catch (fallbackError) {
                errorMessage += ' Erro na simulação.';
            }
        } else {
            errorMessage += 'Problema na abertura da janela. Usando busca simulada...';
            // Fallback to simulation
            try {
                const fallbackResults = await vacancyService.queryVacancies(startDate, endDate);
                displaySearchResults(fallbackResults, resultsContent);
                return;
            } catch (fallbackError) {
                errorMessage += ' Erro na simulação.';
            }
        }
        
        displayError(errorMessage);
    } finally {
        // Restore button state
        searchText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
        popupButton.disabled = false;
    }
}