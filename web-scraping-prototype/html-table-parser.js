/**
 * Direct HTML Table Parser
 * Parses the complete table data from the saved HTML file
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

async function parseTableFromHTML() {
    console.log('🚀 Starting Direct HTML Table Parser...');
    
    try {
        const htmlFilePath = path.join(__dirname, 'scraped-data', 'toronto-permits-licences-bylaws.html');
        
        if (!fs.existsSync(htmlFilePath)) {
            throw new Error(`HTML file not found: ${htmlFilePath}`);
        }

        console.log('📄 Reading HTML file...');
        const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
        
        console.log('🔍 Parsing HTML with Cheerio...');
        const $ = cheerio.load(htmlContent);
        
        const permits = [];
        
        // Find the table
        const table = $('table.cot-table');
        if (table.length === 0) {
            throw new Error('Table with class "cot-table" not found');
        }
        
        console.log('📊 Extracting table rows...');
        
        // Get all rows in tbody
        const rows = table.find('tbody tr');
        console.log(`Found ${rows.length} table rows`);
        
        rows.each((index, row) => {
            const $row = $(row);
            const cells = $row.find('td');
            
            if (cells.length >= 3) {
                const $permitCell = $(cells[0]);
                const $descriptionCell = $(cells[1]);
                const $categoryCell = $(cells[2]);
                
                // Extract permit name and URL
                const $link = $permitCell.find('a');
                let permitName = '';
                let permitUrl = '';
                
                if ($link.length > 0) {
                    permitName = $link.text().trim();
                    permitUrl = $link.attr('href');
                } else {
                    permitName = $permitCell.text().trim();
                }
                
                // Extract description
                const description = $descriptionCell.text().trim();
                
                // Extract category
                const category = $categoryCell.text().trim();
                
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
        });
        
        console.log(`✅ Successfully parsed ${permits.length} permits from HTML`);
        
        if (permits.length === 0) {
            throw new Error('No permits were extracted - table might be empty');
        }
        
        // Create output directory
        const outputDir = path.join(__dirname, 'scraped-data');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Save complete table data
        const tableOutputPath = path.join(outputDir, 'toronto-permits-final-table.json');
        fs.writeFileSync(tableOutputPath, JSON.stringify(permits, null, 2));
        console.log(`💾 Final table data saved to: ${tableOutputPath}`);
        
        // Create categorized breakdown
        const categoryBreakdown = {};
        permits.forEach(permit => {
            if (!categoryBreakdown[permit.category]) {
                categoryBreakdown[permit.category] = [];
            }
            categoryBreakdown[permit.category].push(permit);
        });
        
        // Generate summary
        const summary = {
            totalPermits: permits.length,
            categories: Object.keys(categoryBreakdown),
            categoryCount: Object.keys(categoryBreakdown).length,
            categoryBreakdown: Object.keys(categoryBreakdown).map(cat => ({
                category: cat,
                count: categoryBreakdown[cat].length,
                permits: categoryBreakdown[cat].map(p => p.name)
            })),
            permitsWithUrls: permits.filter(p => p.hasUrl).length,
            permitsWithoutUrls: permits.filter(p => !p.hasUrl).length,
            scrapedAt: new Date().toISOString(),
            source: 'https://www.toronto.ca/services-payments/permits-licences-bylaws/',
            method: 'Direct HTML parsing from saved file'
        };
        
        // Save categorized data
        const categorizedOutputPath = path.join(outputDir, 'toronto-permits-final-categorized.json');
        fs.writeFileSync(categorizedOutputPath, JSON.stringify({
            summary,
            categoryBreakdown,
            permits
        }, null, 2));
        console.log(`📋 Final categorized data saved to: ${categorizedOutputPath}`);
        
        // Generate CSV for easy viewing
        const csvContent = [
            'ID,Name,Category,Description,URL',
            ...permits.map(permit => 
                `${permit.id},"${permit.name.replace(/"/g, '""')}","${permit.category}","${permit.description.replace(/"/g, '""')}","${permit.url || ''}"`
            )
        ].join('\n');
        
        const csvOutputPath = path.join(outputDir, 'toronto-permits-final-table.csv');
        fs.writeFileSync(csvOutputPath, csvContent);
        console.log(`📊 Final CSV data saved to: ${csvOutputPath}`);
        
        // Print detailed summary
        console.log('\n📈 FINAL EXTRACTION SUMMARY:');
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
        permits.slice(0, 5).forEach(permit => {
            console.log(`  ${permit.id}. ${permit.name} (${permit.category})`);
        });
        
        if (permits.length > 5) {
            console.log(`  ... and ${permits.length - 5} more permits`);
        }
        
        return {
            success: true,
            totalPermits: permits.length,
            outputFiles: [tableOutputPath, categorizedOutputPath, csvOutputPath],
            permits: permits
        };
        
    } catch (error) {
        console.error('❌ Error during parsing:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// Run the parser
if (require.main === module) {
    parseTableFromHTML()
        .then(result => {
            if (result.success) {
                console.log('\n🎉 TABLE PARSING COMPLETED SUCCESSFULLY!');
                console.log(`✅ Successfully extracted ${result.totalPermits} permits`);
                console.log('📁 Output files created:');
                result.outputFiles.forEach(file => {
                    console.log(`  • ${file}`);
                });
                
                console.log('\n🏆 SUCCESS! Extracted the complete permits table data!');
                console.log('📋 Data includes: Name, Description, Category, and URL for each permit');
            } else {
                console.log('\n❌ TABLE PARSING FAILED!');
                console.log(`Error: ${result.error}`);
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('💥 Unexpected error:', error);
            process.exit(1);
        });
}

module.exports = { parseTableFromHTML };
