const https = require('https');
const fs = require('fs');
const url = require('url');

class TorontoPermitFormScraper {
  constructor() {
    // Updated URL based on your finding
    this.mainPermitsUrl = 'https://www.toronto.ca/services-payments/permits-licences-bylaws/';
    this.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
    this.maxRedirects = 5;
    this.scrapedData = {
      permits: [],
      forms: [],
      detailedPermits: [],
      scrapingMetadata: {
        startTime: new Date().toISOString(),
        sourceUrl: this.mainPermitsUrl,
        totalLinks: 0,
        permitCategories: []
      }
    };
  }

  async fetchPageWithRedirects(targetUrl, redirectCount = 0) {
    if (redirectCount > this.maxRedirects) {
      throw new Error('Too many redirects');
    }

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
          'Accept-Encoding': 'identity',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        }
      };

      const client = https;
      
      const req = client.request(options, (res) => {
        console.log(`📡 ${targetUrl} -> Status: ${res.statusCode}`);
        
        // Handle redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = url.resolve(targetUrl, res.headers.location);
          console.log(`🔄 Redirecting to: ${redirectUrl}`);
          
          this.fetchPageWithRedirects(redirectUrl, redirectCount + 1)
            .then(resolve)
            .catch(reject);
          return;
        }
        
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve(data);
        });
      });

      req.on('error', reject);
      req.setTimeout(15000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  async scrapeMainPermitsPage() {
    console.log('🎯 Scraping main permits page with form detection...');
    console.log(`📍 URL: ${this.mainPermitsUrl}`);
    
    try {
      const html = await this.fetchPageWithRedirects(this.mainPermitsUrl);
      
      if (html.length === 0) {
        throw new Error('Empty response received');
      }
      
      console.log(`✅ Page loaded: ${html.length} characters`);
      
      // Save raw HTML for inspection
      await this.ensureDir('./scraped-data');
      fs.writeFileSync('./scraped-data/toronto-permits-licences-bylaws.html', html);
      console.log(`💾 Raw HTML saved`);
      
      // Extract permit structure
      const permitStructure = this.extractPermitStructure(html);
      
      // Extract all permit-related links
      const permitLinks = this.extractPermitLinks(html);
      
      // Analyze forms
      const formAnalysis = this.analyzeFormStructure(html);
      
      // Categorize permits
      const categories = this.categorizePermits(html);
      
      // Compile results
      this.scrapedData = {
        ...this.scrapedData,
        permits: permitStructure,
        permitLinks: permitLinks,
        formAnalysis: formAnalysis,
        categories: categories,
        scrapingMetadata: {
          ...this.scrapedData.scrapingMetadata,
          endTime: new Date().toISOString(),
          totalPermitsFound: permitStructure.length,
          totalLinksFound: permitLinks.length,
          totalCategories: categories.length,
          hasExpandableContent: html.toLowerCase().includes('accordion') || 
                                html.toLowerCase().includes('collapse') || 
                                html.toLowerCase().includes('expand'),
          hasJavaScript: html.includes('<script'),
          contentLength: html.length
        }
      };
      
      // Save structured data
      const outputFile = './scraped-data/toronto-permits-structure.json';
      fs.writeFileSync(outputFile, JSON.stringify(this.scrapedData, null, 2));
      
      console.log(`\n📊 PERMIT STRUCTURE ANALYSIS`);
      console.log(`${'='.repeat(60)}`);
      this.printAnalysis();
      
      return this.scrapedData;
      
    } catch (error) {
      console.error('❌ Error scraping permits page:', error);
      throw error;
    }
  }

  extractPermitStructure(html) {
    console.log('🔍 Extracting permit structure...');
    
    const permits = [];
    
    // Look for various permit indicators
    const permitPatterns = [
      // Links containing permit/license/bylaw keywords
      /<a[^>]*href="([^"]*)"[^>]*>([^<]*(?:permit|licen[cs]e|bylaw|application)[^<]*)<\/a>/gi,
      // Headings with permit content
      /<h[1-6][^>]*>([^<]*(?:permit|licen[cs]e|bylaw)[^<]*)<\/h[1-6]>/gi,
      // List items with permit content
      /<li[^>]*>([^<]*(?:permit|licen[cs]e|bylaw)[^<]*)<\/li>/gi
    ];
    
    permitPatterns.forEach((pattern, patternIndex) => {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        const permitData = {
          id: `permit_${permits.length + 1}`,
          type: patternIndex === 0 ? 'link' : patternIndex === 1 ? 'heading' : 'list_item',
          title: patternIndex === 0 ? match[2] : match[1],
          url: patternIndex === 0 ? match[1] : null,
          rawContent: match[0].substring(0, 200) + '...'
        };
        
        // Clean up title
        if (permitData.title) {
          permitData.title = permitData.title.replace(/\s+/g, ' ').trim();
          
          // Only add if it looks like a real permit
          if (permitData.title.length > 10 && 
              permitData.title.length < 150 &&
              !permitData.title.toLowerCase().includes('javascript') &&
              !permitData.title.toLowerCase().includes('stylesheet')) {
            permits.push(permitData);
          }
        }
      }
    });
    
    // Deduplicate based on title similarity
    const uniquePermits = this.deduplicatePermits(permits);
    
    console.log(`   Found ${permits.length} raw permits, ${uniquePermits.length} unique`);
    return uniquePermits;
  }

  extractPermitLinks(html) {
    console.log('🔗 Extracting permit-related links...');
    
    const links = [];
    
    // More comprehensive link extraction
    const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>/gi;
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
      const linkUrl = match[1];
      const linkText = match[2].replace(/\s+/g, ' ').trim();
      
      // Filter for permit/license/bylaw related links
      const isPermitRelated = linkText.toLowerCase().match(/permit|licen[cs]e|bylaw|application|form|fee|requirement/);
      
      if (isPermitRelated && linkText.length > 5 && linkText.length < 200) {
        // Resolve relative URLs
        const fullUrl = linkUrl.startsWith('http') ? linkUrl : 
                       linkUrl.startsWith('/') ? 'https://www.toronto.ca' + linkUrl : 
                       'https://www.toronto.ca/' + linkUrl;
        
        links.push({
          id: `link_${links.length + 1}`,
          text: linkText,
          url: fullUrl,
          category: this.categorizeLink(linkText),
          hasForm: linkText.toLowerCase().includes('form') || linkText.toLowerCase().includes('application'),
          hasFee: linkText.toLowerCase().includes('fee') || linkText.toLowerCase().includes('cost'),
          priority: this.calculateLinkPriority(linkText, linkUrl)
        });
      }
    }
    
    // Sort by priority
    links.sort((a, b) => b.priority - a.priority);
    
    console.log(`   Found ${links.length} permit-related links`);
    return links.slice(0, 50); // Limit to top 50 for manageability
  }

  analyzeFormStructure(html) {
    console.log('📝 Analyzing form structure...');
    
    const formAnalysis = {
      totalForms: 0,
      formTypes: [],
      hasOnlineForms: false,
      hasPdfForms: false,
      hasFileUploads: false,
      formLinks: []
    };
    
    // Count forms in HTML
    const formMatches = html.match(/<form[^>]*>/gi) || [];
    formAnalysis.totalForms = formMatches.length;
    
    // Look for form-related keywords
    const formKeywords = ['online form', 'pdf form', 'application form', 'submit form', 'download form'];
    formKeywords.forEach(keyword => {
      if (html.toLowerCase().includes(keyword.toLowerCase())) {
        formAnalysis.formTypes.push(keyword);
      }
    });
    
    // Check for online vs PDF forms
    formAnalysis.hasOnlineForms = html.toLowerCase().includes('online') && html.toLowerCase().includes('form');
    formAnalysis.hasPdfForms = html.toLowerCase().includes('pdf') && html.toLowerCase().includes('form');
    formAnalysis.hasFileUploads = html.toLowerCase().includes('upload') || html.toLowerCase().includes('file');
    
    // Extract form-specific links
    const formLinkRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]*(?:form|application)[^<]*)<\/a>/gi;
    let match;
    while ((match = formLinkRegex.exec(html)) !== null) {
      formAnalysis.formLinks.push({
        url: match[1],
        text: match[2].trim(),
        isPdf: match[1].toLowerCase().includes('.pdf'),
        isOnline: match[1].toLowerCase().includes('form') && !match[1].toLowerCase().includes('.pdf')
      });
    }
    
    console.log(`   Found ${formAnalysis.totalForms} HTML forms, ${formAnalysis.formLinks.length} form links`);
    return formAnalysis;
  }

  categorizePermits(html) {
    console.log('📂 Categorizing permits...');
    
    const categories = [];
    
    // Common permit categories for Toronto
    const categoryKeywords = {
      'Building & Construction': ['building', 'construction', 'renovation', 'demolition', 'structural'],
      'Business & Commercial': ['business', 'commercial', 'retail', 'restaurant', 'shop'],
      'Events & Entertainment': ['event', 'festival', 'parade', 'concert', 'gathering'],
      'Parking & Transportation': ['parking', 'transportation', 'vehicle', 'taxi', 'transit'],
      'Health & Safety': ['health', 'safety', 'fire', 'emergency', 'inspection'],
      'Zoning & Planning': ['zoning', 'planning', 'development', 'land use', 'variance'],
      'Environmental': ['environment', 'waste', 'water', 'sewer', 'pollution'],
      'Signs & Advertising': ['sign', 'advertising', 'billboard', 'display', 'banner']
    };
    
    Object.entries(categoryKeywords).forEach(([categoryName, keywords]) => {
      let matchCount = 0;
      const matchedKeywords = [];
      
      keywords.forEach(keyword => {
        const regex = new RegExp(keyword, 'gi');
        const matches = html.match(regex) || [];
        if (matches.length > 0) {
          matchCount += matches.length;
          matchedKeywords.push(keyword);
        }
      });
      
      if (matchCount > 0) {
        categories.push({
          name: categoryName,
          matchCount: matchCount,
          keywords: matchedKeywords,
          relevanceScore: matchCount / keywords.length
        });
      }
    });
    
    // Sort by relevance
    categories.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    console.log(`   Identified ${categories.length} permit categories`);
    return categories;
  }

  deduplicatePermits(permits) {
    const unique = [];
    const seen = new Set();
    
    permits.forEach(permit => {
      const normalizedTitle = permit.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!seen.has(normalizedTitle)) {
        seen.add(normalizedTitle);
        unique.push(permit);
      }
    });
    
    return unique;
  }

  categorizeLink(linkText) {
    const text = linkText.toLowerCase();
    
    if (text.includes('building') || text.includes('construction')) return 'Building';
    if (text.includes('business') || text.includes('commercial')) return 'Business';
    if (text.includes('event') || text.includes('festival')) return 'Events';
    if (text.includes('parking') || text.includes('vehicle')) return 'Transportation';
    if (text.includes('sign') || text.includes('advertising')) return 'Signs';
    if (text.includes('zoning') || text.includes('planning')) return 'Planning';
    
    return 'General';
  }

  calculateLinkPriority(linkText, linkUrl) {
    let priority = 1;
    
    // Higher priority for form/application links
    if (linkText.toLowerCase().includes('form')) priority += 3;
    if (linkText.toLowerCase().includes('application')) priority += 3;
    if (linkText.toLowerCase().includes('apply')) priority += 2;
    
    // Higher priority for fee information
    if (linkText.toLowerCase().includes('fee')) priority += 2;
    if (linkText.toLowerCase().includes('cost')) priority += 2;
    
    // Higher priority for requirements
    if (linkText.toLowerCase().includes('requirement')) priority += 2;
    if (linkText.toLowerCase().includes('guideline')) priority += 1;
    
    // Lower priority for general info
    if (linkText.toLowerCase().includes('information')) priority -= 1;
    if (linkText.toLowerCase().includes('about')) priority -= 1;
    
    return priority;
  }

  printAnalysis() {
    const data = this.scrapedData;
    
    console.log(`📄 Content Analysis:`);
    console.log(`   Page size: ${data.scrapingMetadata.contentLength} characters`);
    console.log(`   Has JavaScript: ${data.scrapingMetadata.hasJavaScript}`);
    console.log(`   Has expandable content: ${data.scrapingMetadata.hasExpandableContent}`);
    
    console.log(`\n🎯 Permits Found: ${data.permits.length}`);
    const typeCounts = {};
    data.permits.forEach(permit => {
      typeCounts[permit.type] = (typeCounts[permit.type] || 0) + 1;
    });
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });
    
    console.log(`\n🔗 High-Priority Links: ${data.permitLinks.length}`);
    data.permitLinks.slice(0, 10).forEach((link, i) => {
      console.log(`   ${i + 1}. ${link.text} (${link.category}) [Priority: ${link.priority}]`);
    });
    
    console.log(`\n📝 Form Analysis:`);
    console.log(`   HTML forms: ${data.formAnalysis.totalForms}`);
    console.log(`   Form links: ${data.formAnalysis.formLinks.length}`);
    console.log(`   Has online forms: ${data.formAnalysis.hasOnlineForms}`);
    console.log(`   Has PDF forms: ${data.formAnalysis.hasPdfForms}`);
    
    console.log(`\n📂 Top Categories:`);
    data.categories.slice(0, 5).forEach((cat, i) => {
      console.log(`   ${i + 1}. ${cat.name} (${cat.matchCount} matches)`);
    });
    
    console.log(`\n💡 Next Steps Recommendations:`);
    if (data.scrapingMetadata.hasExpandableContent) {
      console.log(`   - Use Puppeteer to interact with expandable elements`);
    }
    if (data.formAnalysis.formLinks.length > 5) {
      console.log(`   - Follow form links to get detailed requirements`);
    }
    if (data.permitLinks.filter(l => l.hasForm).length > 0) {
      console.log(`   - Scrape ${data.permitLinks.filter(l => l.hasForm).length} application form pages`);
    }
    if (data.categories.length > 3) {
      console.log(`   - Organize permits by ${data.categories.length} identified categories`);
    }
  }

  async ensureDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

// Run the enhanced scraper
async function runEnhancedScraper() {
  console.log('🚀 ENHANCED TORONTO PERMITS & FORMS SCRAPER');
  console.log('=' .repeat(60));
  console.log('🎯 Target: https://www.toronto.ca/services-payments/permits-licences-bylaws/');
  console.log('');
  
  const scraper = new TorontoPermitFormScraper();
  
  try {
    await scraper.scrapeMainPermitsPage();
    
    console.log(`\n🎉 ENHANCED SCRAPING COMPLETE!`);
    console.log(`📁 Results saved in ./scraped-data/`);
    console.log(`📋 Check toronto-permits-structure.json for detailed analysis`);
    console.log(`🌐 Raw HTML saved for manual inspection`);
    console.log(`\n🔄 Ready to implement Puppeteer-based deep scraping!`);
    
  } catch (error) {
    console.error('❌ Enhanced scraping failed:', error);
  }
}

runEnhancedScraper();
