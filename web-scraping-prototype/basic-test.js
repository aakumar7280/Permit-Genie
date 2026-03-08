const fs = require('fs');
const https = require('https');

// Simple web scraper without puppeteer for initial testing
class SimpleTorontoScraper {
  constructor() {
    this.url = 'https://www.toronto.ca/services-payments/permits/';
  }

  async fetchPage() {
    return new Promise((resolve, reject) => {
      https.get(this.url, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve(data);
        });
        
      }).on('error', (err) => {
        reject(err);
      });
    });
  }

  async scrapeBasicInfo() {
    console.log('🌐 Fetching Toronto permits page...');
    
    try {
      const html = await this.fetchPage();
      console.log(`📄 Page loaded: ${html.length} characters`);
      
      // Basic text analysis
      const permitMatches = html.match(/permit[^<]{0,100}/gi) || [];
      const licenseMatches = html.match(/licen[cs]e[^<]{0,100}/gi) || [];
      
      const results = {
        url: this.url,
        scrapedAt: new Date().toISOString(),
        pageSize: html.length,
        permitReferences: permitMatches.length,
        licenseReferences: licenseMatches.length,
        samplePermitText: permitMatches.slice(0, 10),
        sampleLicenseText: licenseMatches.slice(0, 10),
        hasJavaScript: html.includes('javascript') || html.includes('<script'),
        hasExpandableContent: html.includes('collapse') || html.includes('accordion') || html.includes('expand')
      };
      
      // Save results
      const outputFile = './scraped-data/basic-toronto-analysis.json';
      await this.ensureDir('./scraped-data');
      
      fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
      
      console.log('\n📊 Basic Analysis Results:');
      console.log(`   Page size: ${results.pageSize} characters`);
      console.log(`   Permit references: ${results.permitReferences}`);
      console.log(`   License references: ${results.licenseReferences}`);
      console.log(`   Contains JavaScript: ${results.hasJavaScript}`);
      console.log(`   Has expandable content: ${results.hasExpandableContent}`);
      
      console.log('\n🔍 Sample permit references:');
      results.samplePermitText.slice(0, 5).forEach((text, i) => {
        console.log(`   ${i + 1}. ${text.substring(0, 80)}...`);
      });
      
      console.log(`\n💾 Results saved to: ${outputFile}`);
      
      return results;
      
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  }

  async ensureDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

// Run basic scrape
async function runBasicScrape() {
  console.log('🎯 Running Basic Toronto Website Analysis');
  console.log('=' .repeat(50));
  
  const scraper = new SimpleTorontoScraper();
  
  try {
    await scraper.scrapeBasicInfo();
    
    console.log('\n✅ Basic analysis complete!');
    console.log('💡 This shows us what content is available and if we need JavaScript rendering');
    console.log('🔧 If hasExpandableContent is true, we\'ll need puppeteer for full scraping');
    
  } catch (error) {
    console.error('❌ Basic scrape failed:', error);
  }
}

runBasicScrape();
