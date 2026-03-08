const TorontoPermitScraper = require('./scraper');

async function testScraper() {
  console.log('🧪 Testing Toronto Permit Scraper');
  console.log('=' .repeat(40));
  
  const scraper = new TorontoPermitScraper();
  
  try {
    await scraper.initialize();
    
    console.log('✅ Browser initialized successfully');
    console.log('🌐 Testing page load...');
    
    // Test with a smaller scope first
    const permits = await scraper.scrapeMainPermitsPage();
    
    console.log(`\n📊 Test Results:`);
    console.log(`   Total permits found: ${permits.length}`);
    
    if (permits.length > 0) {
      console.log(`\n📋 Sample permit data:`);
      console.log(JSON.stringify(permits[0], null, 2));
      
      // Save test results
      await scraper.saveResults(permits);
      console.log(`\n💾 Test results saved to ./scraped-data/`);
    } else {
      console.log(`\n⚠️  No permits found - may need to adjust selectors`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await scraper.cleanup();
  }
}

// Run test
testScraper();
