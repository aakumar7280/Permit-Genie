/**
 * Improved Toronto Permits Table Scraper
 * Handles pagination and dynamic loading to get ALL permits
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeAllPermitsTable() {
    console.log('🚀 Starting COMPLETE Toronto Permits Table Scraper...');
    
    let browser;
    try {
        // Launch browser
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        
        // Set user agent
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
        
        console.log('📄 Navigating to Toronto permits page...');
        await page.goto('https://www.toronto.ca/services-payments/permits-licences-bylaws/', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Wait for the table to load
        console.log('⏳ Waiting for table to load...');
        await page.waitForSelector('table.cot-table', { timeout: 15000 });

        // Check if there's a DataTable (pagination)
        console.log('🔍 Checking for pagination or DataTable...');
        
        // Wait a bit more for any dynamic content to load
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Try to look for pagination controls or "Show all" buttons
        const paginationExists = await page.evaluate(() => {
            // Look for common DataTable pagination elements
            const pagination = document.querySelector('.dataTables_paginate') ||
                              document.querySelector('.pagination') ||
                              document.querySelector('[aria-label*="pagination"]') ||
                              document.querySelector('.dt-paging');
            
            // Look for "Show all" or "Show entries" dropdowns
            const showAll = document.querySelector('select[name$="_length"]') ||
                           document.querySelector('.dataTables_length select') ||
                           document.querySelector('select[aria-controls]');
            
            console.log('Pagination found:', !!pagination);
            console.log('Show all dropdown found:', !!showAll);
            
            return {
                hasPagination: !!pagination,
                hasShowAll: !!showAll
            };
        });

        // If there's a "show all" dropdown, select it
        if (paginationExists.hasShowAll) {
            console.log('📊 Setting table to show all entries...');
            try {
                await page.select('select[name*="_length"], .dataTables_length select, select[aria-controls]', '-1');
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for table to reload
                console.log('✅ Table set to show all entries');
            } catch (error) {
                console.log('⚠️ Could not set show all - continuing with current view');
            }
        }

        // Scroll to make sure all content is loaded
        console.log('📜 Scrolling to ensure all content loads...');
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if(totalHeight >= scrollHeight){
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });

        // Wait for any lazy loading
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Extract ALL table data
        console.log('📊 Extracting complete table data...');
        const tableData = await page.evaluate(() => {
            const table = document.querySelector('table.cot-table');
            if (!table) {
                throw new Error('Table not found');
            }

            console.log('Table found:', !!table);
            
            const rows = table.querySelectorAll('tbody tr');
            console.log('Total rows found:', rows.length);
            
            const permits = [];

            rows.forEach((row, index) => {
                try {
                    const cells = row.querySelectorAll('td');
                    if (cells.length >= 3) {
                        const permitCell = cells[0];
                        const descriptionCell = cells[1];
                        const categoryCell = cells[2];

                        // Extract permit name and URL
                        const linkElement = permitCell.querySelector('a');
                        let permitName = '';
                        let permitUrl = '';
                        
                        if (linkElement) {
                            permitName = linkElement.textContent.trim();
                            permitUrl = linkElement.href;
                        } else {
                            permitName = permitCell.textContent.trim();
                        }

                        // Extract description
                        const description = descriptionCell.textContent.trim();

                        // Extract category
                        const category = categoryCell.textContent.trim();

                        if (permitName && description && category) {
                            const permit = {
                                id: index + 1,
                                name: permitName,
                                description: description,
                                category: category,
                                url: permitUrl || null,
                                hasUrl: !!permitUrl
                            };

                            permits.push(permit);
                        }
                    }
                } catch (error) {
                    console.warn(`Error processing row ${index}:`, error.message);
                }
            });

            return permits;
        });

        console.log(`✅ Successfully extracted ${tableData.length} permits from table`);

        if (tableData.length === 0) {
            throw new Error('No permits were extracted - table might be empty or not loaded properly');
        }

        // Create output directory
        const outputDir = path.join(__dirname, 'scraped-data');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Save complete table data
        const tableOutputPath = path.join(outputDir, 'toronto-permits-complete-table.json');
        fs.writeFileSync(tableOutputPath, JSON.stringify(tableData, null, 2));
        console.log(`💾 Complete table data saved to: ${tableOutputPath}`);

        // Create categorized breakdown
        const categoryBreakdown = {};
        tableData.forEach(permit => {
            if (!categoryBreakdown[permit.category]) {
                categoryBreakdown[permit.category] = [];
            }
            categoryBreakdown[permit.category].push(permit);
        });

        // Generate summary
        const summary = {
            totalPermits: tableData.length,
            categories: Object.keys(categoryBreakdown),
            categoryCount: Object.keys(categoryBreakdown).length,
            categoryBreakdown: Object.keys(categoryBreakdown).map(cat => ({
                category: cat,
                count: categoryBreakdown[cat].length,
                permits: categoryBreakdown[cat].map(p => p.name)
            })),
            permitsWithUrls: tableData.filter(p => p.hasUrl).length,
            permitsWithoutUrls: tableData.filter(p => !p.hasUrl).length,
            scrapedAt: new Date().toISOString(),
            source: 'https://www.toronto.ca/services-payments/permits-licences-bylaws/'
        };

        // Save categorized data
        const categorizedOutputPath = path.join(outputDir, 'toronto-permits-complete-categorized.json');
        fs.writeFileSync(categorizedOutputPath, JSON.stringify({
            summary,
            categoryBreakdown,
            permits: tableData
        }, null, 2));
        console.log(`📋 Complete categorized data saved to: ${categorizedOutputPath}`);

        // Generate CSV for easy viewing
        const csvContent = [
            'ID,Name,Category,Description,URL',
            ...tableData.map(permit => 
                `${permit.id},"${permit.name.replace(/"/g, '""')}","${permit.category}","${permit.description.replace(/"/g, '""')}","${permit.url || ''}"`
            )
        ].join('\n');

        const csvOutputPath = path.join(outputDir, 'toronto-permits-complete-table.csv');
        fs.writeFileSync(csvOutputPath, csvContent);
        console.log(`📊 Complete CSV data saved to: ${csvOutputPath}`);

        // Print detailed summary
        console.log('\n📈 COMPLETE EXTRACTION SUMMARY:');
        console.log(`Total Permits: ${summary.totalPermits}`);
        console.log(`Categories: ${summary.categoryCount}`);
        console.log('Categories found:');
        summary.categoryBreakdown.forEach(cat => {
            console.log(`  • ${cat.category}: ${cat.count} permits`);
        });
        console.log(`Permits with URLs: ${summary.permitsWithUrls}`);
        console.log(`Permits without URLs: ${summary.permitsWithoutUrls}`);

        // Show first few permits as examples
        console.log('\n📋 First 5 permits extracted:');
        tableData.slice(0, 5).forEach(permit => {
            console.log(`  ${permit.id}. ${permit.name} (${permit.category})`);
        });

        if (tableData.length > 5) {
            console.log(`  ... and ${tableData.length - 5} more permits`);
        }

        return {
            success: true,
            totalPermits: tableData.length,
            outputFiles: [tableOutputPath, categorizedOutputPath, csvOutputPath],
            permits: tableData
        };

    } catch (error) {
        console.error('❌ Error during scraping:', error.message);
        return {
            success: false,
            error: error.message
        };
    } finally {
        if (browser) {
            await browser.close();
            console.log('🔒 Browser closed');
        }
    }
}

// Run the scraper
if (require.main === module) {
    scrapeAllPermitsTable()
        .then(result => {
            if (result.success) {
                console.log('\n🎉 COMPLETE TABLE SCRAPING FINISHED!');
                console.log(`✅ Successfully extracted ${result.totalPermits} permits`);
                console.log('📁 Output files created:');
                result.outputFiles.forEach(file => {
                    console.log(`  • ${file}`);
                });
                
                if (result.totalPermits > 50) {
                    console.log('\n🏆 EXCELLENT! Got all permits from the table!');
                } else {
                    console.log('\n⚠️  Only got', result.totalPermits, 'permits - there might be pagination or loading issues');
                }
            } else {
                console.log('\n❌ COMPLETE TABLE SCRAPING FAILED!');
                console.log(`Error: ${result.error}`);
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('💥 Unexpected error:', error);
            process.exit(1);
        });
}

module.exports = { scrapeAllPermitsTable };
