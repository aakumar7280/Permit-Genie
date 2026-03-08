#!/usr/bin/env node

const TorontoPermitScraper = require('./scraper');

async function main() {
  console.log('🎯 Starting Toronto Permit Scraper Prototype');
  console.log('=' .repeat(50));
  
  const scraper = new TorontoPermitScraper();
  
  try {
    // Initialize browser
    await scraper.initialize();
    
    // Start scraping
    console.log('🕵️ Beginning scrape of Toronto permits...');
    const permits = await scraper.scrapeMainPermitsPage();
    
    console.log(`\n✅ Scraping completed! Found ${permits.length} permits\n`);
    
    // Save results
    const files = await scraper.saveResults(permits);
    
    // Display quick summary
    console.log('📊 Quick Summary:');
    console.log('-'.repeat(30));
    
    const categories = {};
    permits.forEach(permit => {
      const type = permit.type || 'expandable';
      categories[type] = (categories[type] || 0) + 1;
    });
    
    Object.entries(categories).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} permits`);
    });
    
    console.log(`\n🎉 Results saved successfully!`);
    console.log(`📁 Check the './scraped-data' folder for detailed results`);
    
    // Show first few permits as preview
    if (permits.length > 0) {
      console.log('\n🔍 Preview of first 3 permits:');
      console.log('-'.repeat(40));
      
      permits.slice(0, 3).forEach((permit, index) => {
        console.log(`${index + 1}. ${permit.title || 'Untitled'}`);
        if (permit.description) {
          console.log(`   ${permit.description.substring(0, 100)}...`);
        }
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    process.exit(1);
  } finally {
    // Cleanup
    await scraper.cleanup();
  }
}

// Run the scraper
if (require.main === module) {
  main().catch(console.error);
}

module.exports = main;
