const https = require('https');
const http = require('http');
const fs = require('fs');
const url = require('url');

class ImprovedTorontoScraper {
  constructor() {
    this.baseUrl = 'https://www.toronto.ca/services-payments/permits/';
    this.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
  }

  async fetchPage(targetUrl) {
    return new Promise((resolve, reject) => {
      const urlParts = url.parse(targetUrl);
      const options = {
        hostname: urlParts.hostname,
        port: urlParts.port || (urlParts.protocol === 'https:' ? 443 : 80),
        path: urlParts.path,
        method: 'GET',
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'identity', // Don't use gzip to keep it simple
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        }
      };

      const client = urlParts.protocol === 'https:' ? https : http;
      
      const req = client.request(options, (res) => {
        let data = '';
        
        console.log(`📡 Response status: ${res.statusCode}`);
        console.log(`📋 Response headers:`, Object.keys(res.headers));
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve(data);
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  async scrapeTorontoSite() {
    console.log('🌐 Attempting to scrape Toronto permits page...');
    console.log(`🎯 Target URL: ${this.baseUrl}`);
    
    try {
      const html = await this.fetchPage(this.baseUrl);
      
      console.log(`📄 Successfully fetched: ${html.length} characters`);
      
      if (html.length === 0) {
        console.log('⚠️  Empty response - site may require JavaScript or have bot protection');
        return null;
      }

      // Analyze the HTML content
      const analysis = this.analyzeHtml(html);
      
      // Save raw HTML for inspection
      await this.ensureDir('./scraped-data');
      fs.writeFileSync('./scraped-data/toronto-raw-html.html', html);
      
      // Save analysis
      const analysisFile = './scraped-data/toronto-site-analysis.json';
      fs.writeFileSync(analysisFile, JSON.stringify(analysis, null, 2));
      
      this.printAnalysis(analysis);
      
      console.log(`\n💾 Files saved:`);
      console.log(`   Raw HTML: ./scraped-data/toronto-raw-html.html`);
      console.log(`   Analysis: ${analysisFile}`);
      
      return analysis;
      
    } catch (error) {
      console.error('❌ Error scraping site:', error.message);
      
      // Try alternative approach - check if it's a redirect or different issue
      console.log('\n🔄 Trying alternative approach...');
      await this.diagnoseSite();
      
      return null;
    }
  }

  analyzeHtml(html) {
    const analysis = {
      scrapedAt: new Date().toISOString(),
      totalLength: html.length,
      structure: {},
      content: {},
      permits: {
        references: [],
        expandableElements: [],
        forms: [],
        links: []
      }
    };

    // Basic structure analysis
    analysis.structure.hasHtml = html.toLowerCase().includes('<html');
    analysis.structure.hasHead = html.toLowerCase().includes('<head');
    analysis.structure.hasBody = html.toLowerCase().includes('<body');
    analysis.structure.hasJavaScript = html.includes('<script') || html.includes('javascript');
    analysis.structure.hasCSS = html.includes('<style') || html.includes('.css');

    // Content analysis
    analysis.content.title = this.extractBetween(html, '<title>', '</title>');
    analysis.content.hasMetaDescription = html.includes('name="description"');
    
    // Look for permit-related content
    const permitKeywords = ['permit', 'licence', 'license', 'application', 'approval'];
    const expandableKeywords = ['accordion', 'collapse', 'expand', 'toggle', 'dropdown'];
    
    permitKeywords.forEach(keyword => {
      const regex = new RegExp(keyword + '[^<>]{0,100}', 'gi');
      const matches = html.match(regex) || [];
      
      analysis.permits.references.push({
        keyword,
        count: matches.length,
        samples: matches.slice(0, 3)
      });
    });

    // Look for expandable elements
    expandableKeywords.forEach(keyword => {
      if (html.toLowerCase().includes(keyword)) {
        analysis.permits.expandableElements.push(keyword);
      }
    });

    // Look for forms
    const formMatches = html.match(/<form[^>]*>[\s\S]*?<\/form>/gi) || [];
    analysis.permits.forms = formMatches.map((form, index) => ({
      index,
      action: this.extractAttribute(form, 'action'),
      method: this.extractAttribute(form, 'method'),
      hasFileUpload: form.includes('type="file"'),
      length: form.length
    }));

    // Look for permit-related links
    const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]*(?:permit|licen[cs]e|application)[^<]*)<\/a>/gi;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(html)) !== null) {
      analysis.permits.links.push({
        url: linkMatch[1],
        text: linkMatch[2].trim()
      });
    }

    return analysis;
  }

  extractBetween(text, start, end) {
    const startIndex = text.indexOf(start);
    if (startIndex === -1) return '';
    
    const contentStart = startIndex + start.length;
    const endIndex = text.indexOf(end, contentStart);
    if (endIndex === -1) return '';
    
    return text.substring(contentStart, endIndex).trim();
  }

  extractAttribute(html, attribute) {
    const regex = new RegExp(`${attribute}="([^"]*)"`, 'i');
    const match = html.match(regex);
    return match ? match[1] : '';
  }

  printAnalysis(analysis) {
    console.log('\n📊 WEBSITE ANALYSIS RESULTS');
    console.log('=' .repeat(50));
    
    console.log(`📄 Page Structure:`);
    console.log(`   Valid HTML: ${analysis.structure.hasHtml}`);
    console.log(`   Has JavaScript: ${analysis.structure.hasJavaScript}`);
    console.log(`   Page title: ${analysis.content.title || 'Not found'}`);
    
    console.log(`\n🔍 Permit Content Analysis:`);
    let totalPermitRefs = 0;
    analysis.permits.references.forEach(ref => {
      totalPermitRefs += ref.count;
      console.log(`   "${ref.keyword}": ${ref.count} references`);
    });
    
    console.log(`\n🎛️  Expandable Elements:`);
    if (analysis.permits.expandableElements.length > 0) {
      console.log(`   Found: ${analysis.permits.expandableElements.join(', ')}`);
      console.log(`   ⚠️  This site likely needs JavaScript rendering for full content`);
    } else {
      console.log(`   None detected - content may be static`);
    }
    
    console.log(`\n📝 Forms Found: ${analysis.permits.forms.length}`);
    analysis.permits.forms.slice(0, 3).forEach((form, i) => {
      console.log(`   ${i + 1}. Action: ${form.action || 'none'}, Method: ${form.method || 'GET'}`);
    });
    
    console.log(`\n🔗 Permit-related Links: ${analysis.permits.links.length}`);
    analysis.permits.links.slice(0, 5).forEach((link, i) => {
      console.log(`   ${i + 1}. ${link.text} (${link.url})`);
    });
    
    // Recommendations
    console.log(`\n💡 Scraping Recommendations:`);
    if (analysis.structure.hasJavaScript && analysis.permits.expandableElements.length > 0) {
      console.log(`   ✅ Use Puppeteer - site has dynamic content`);
    } else if (totalPermitRefs > 10) {
      console.log(`   ✅ Static scraping may work - lots of permit content found`);
    } else {
      console.log(`   ⚠️  Limited permit content found - may need different pages`);
    }
  }

  async diagnoseSite() {
    console.log('🔍 Diagnosing site access issues...');
    
    // Try a simple HEAD request first
    try {
      const response = await this.makeHeadRequest(this.baseUrl);
      console.log(`✅ HEAD request successful: ${response}`);
    } catch (error) {
      console.log(`❌ HEAD request failed: ${error.message}`);
    }
    
    // Try alternative Toronto pages
    const alternativeUrls = [
      'https://www.toronto.ca/',
      'https://www.toronto.ca/services-payments/',
      'https://www.toronto.ca/city-government/',
    ];
    
    for (const altUrl of alternativeUrls) {
      try {
        console.log(`🔄 Trying: ${altUrl}`);
        const html = await this.fetchPage(altUrl);
        console.log(`✅ Success: ${html.length} characters from ${altUrl}`);
        break;
      } catch (error) {
        console.log(`❌ Failed: ${altUrl} - ${error.message}`);
      }
    }
  }

  async makeHeadRequest(targetUrl) {
    return new Promise((resolve, reject) => {
      const urlParts = url.parse(targetUrl);
      const options = {
        hostname: urlParts.hostname,
        port: urlParts.port || (urlParts.protocol === 'https:' ? 443 : 80),
        path: urlParts.path,
        method: 'HEAD',
        headers: {
          'User-Agent': this.userAgent
        }
      };

      const client = urlParts.protocol === 'https:' ? https : http;
      
      const req = client.request(options, (res) => {
        resolve(res.statusCode);
      });

      req.on('error', reject);
      req.setTimeout(5000, () => {
        req.destroy();
        reject(new Error('HEAD request timeout'));
      });

      req.end();
    });
  }

  async ensureDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

// Run the improved scraper
async function runImprovedScraper() {
  console.log('🎯 Toronto Website Scraping Analysis');
  console.log('=' .repeat(50));
  
  const scraper = new ImprovedTorontoScraper();
  await scraper.scrapeTorontoSite();
  
  console.log('\n🎉 Analysis complete!');
  console.log('📁 Check ./scraped-data/ folder for detailed results');
}

runImprovedScraper();
