/**
 * Toronto Permits Table Scraper
 * Extracts the main permits table data with Licence/Permit, Description, and Category
 * Target: https://www.toronto.ca/services-payments/permits-licences-bylaws/
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapePermitsTable() {
    console.log('🚀 Starting Toronto Permits Table Scraper...');
    
    let browser;
    try {
        // Launch browser
        browser = await puppeteer.launch({
            headless: false, // Set to true for production
            defaultViewport: null,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        
        // Set user agent to avoid detection
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
        
        console.log('📄 Navigating to Toronto permits page...');
        await page.goto('https://www.toronto.ca/services-payments/permits-licences-bylaws/', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Wait for the table to load
        console.log('⏳ Waiting for table to load...');
        await page.waitForSelector('table.cot-table', { timeout: 15000 });

        // Extract table data
        console.log('📊 Extracting table data...');
        const tableData = await page.evaluate(() => {
            const table = document.querySelector('table.cot-table');
            if (!table) {
                throw new Error('Table not found');
            }

            const rows = table.querySelectorAll('tbody tr');
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

                        // Create permit object
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
                } catch (error) {
                    console.warn(`Error processing row ${index}:`, error.message);
                }
            });

            return permits;
        });

        console.log(`✅ Successfully extracted ${tableData.length} permits from table`);

        // Create output directory
        const outputDir = path.join(__dirname, 'scraped-data');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Save raw table data
        const tableOutputPath = path.join(outputDir, 'toronto-permits-table.json');
        fs.writeFileSync(tableOutputPath, JSON.stringify(tableData, null, 2));
        console.log(`💾 Raw table data saved to: ${tableOutputPath}`);

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
        const categorizedOutputPath = path.join(outputDir, 'toronto-permits-categorized.json');
        fs.writeFileSync(categorizedOutputPath, JSON.stringify({
            summary,
            categoryBreakdown,
            permits: tableData
        }, null, 2));
        console.log(`📋 Categorized data saved to: ${categorizedOutputPath}`);

        // Generate simple CSV for easy viewing
        const csvContent = [
            'ID,Name,Category,Description,URL',
            ...tableData.map(permit => 
                `${permit.id},"${permit.name.replace(/"/g, '""')}","${permit.category}","${permit.description.replace(/"/g, '""')}","${permit.url || ''}"`
            )
        ].join('\n');

        const csvOutputPath = path.join(outputDir, 'toronto-permits-table.csv');
        fs.writeFileSync(csvOutputPath, csvContent);
        console.log(`📊 CSV data saved to: ${csvOutputPath}`);

        // Print summary
        console.log('\n📈 EXTRACTION SUMMARY:');
        console.log(`Total Permits: ${summary.totalPermits}`);
        console.log(`Categories: ${summary.categoryCount}`);
        console.log('Categories found:');
        summary.categoryBreakdown.forEach(cat => {
            console.log(`  • ${cat.category}: ${cat.count} permits`);
        });
        console.log(`Permits with URLs: ${summary.permitsWithUrls}`);
        console.log(`Permits without URLs: ${summary.permitsWithoutUrls}`);

        return {
            success: true,
            totalPermits: tableData.length,
            outputFiles: [tableOutputPath, categorizedOutputPath, csvOutputPath]
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
    scrapePermitsTable()
        .then(result => {
            if (result.success) {
                console.log('\n🎉 TABLE SCRAPING COMPLETED SUCCESSFULLY!');
                console.log(`✅ Extracted ${result.totalPermits} permits`);
                console.log('📁 Output files:');
                result.outputFiles.forEach(file => {
                    console.log(`  • ${file}`);
                });
            } else {
                console.log('\n❌ TABLE SCRAPING FAILED!');
                console.log(`Error: ${result.error}`);
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('💥 Unexpected error:', error);
            process.exit(1);
        });
}

module.exports = { scrapePermitsTable };
