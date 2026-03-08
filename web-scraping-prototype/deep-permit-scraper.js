const https = require('https');
const fs = require('fs');
const url = require('url');

class DeepPermitDetailsScraper {
  constructor() {
    this.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
    this.delayBetweenRequests = 2000; // 2 second delay to be respectful
    this.detailedPermits = [];
    this.formsFound = [];
    this.requirementsExtracted = [];
  }

  async loadPermitStructure() {
    try {
      const structureData = fs.readFileSync('./scraped-data/toronto-permits-structure.json', 'utf8');
      const data = JSON.parse(structureData);
      return data.permits.filter(permit => permit.type === 'link' && permit.url);
    } catch (error) {
      console.error('❌ Could not load permit structure data');
      throw error;
    }
  }

  async fetchPageWithRedirects(targetUrl, redirectCount = 0) {
    if (redirectCount > 5) {
      throw new Error('Too many redirects');
    }

    return new Promise((resolve, reject) => {
      const urlParts = url.parse(targetUrl);
      const options = {
        hostname: urlParts.hostname,
        port: urlParts.port || 443,
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

      const req = https.request(options, (res) => {
        // Handle redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = url.resolve(targetUrl, res.headers.location);
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

  async scrapePermitDetails(permit) {
    console.log(`🔍 Scraping: ${permit.title}`);
    
    try {
      const html = await this.fetchPageWithRedirects(permit.url);
      
      if (html.length === 0) {
        console.log(`   ⚠️  Empty response for ${permit.title}`);
        return null;
      }
      
      console.log(`   ✅ Loaded: ${html.length} characters`);
      
      // Extract detailed information
      const details = {
        ...permit,
        scrapedAt: new Date().toISOString(),
        pageSize: html.length,
        
        // Extract page title
        pageTitle: this.extractPageTitle(html),
        
        // Extract description/overview
        description: this.extractDescription(html),
        
        // Extract requirements
        requirements: this.extractRequirements(html),
        
        // Extract fees
        fees: this.extractFees(html),
        
        // Extract processing time
        processingTime: this.extractProcessingTime(html),
        
        // Extract forms and applications
        forms: this.extractForms(html),
        
        // Extract contact information
        contacts: this.extractContacts(html),
        
        // Extract steps/process
        process: this.extractProcess(html),
        
        // Check for online application
        hasOnlineApplication: this.checkOnlineApplication(html),
        
        // Extract related links
        relatedLinks: this.extractRelatedLinks(html)
      };
      
      return details;
      
    } catch (error) {
      console.log(`   ❌ Failed to scrape ${permit.title}: ${error.message}`);
      return {
        ...permit,
        error: error.message,
        scrapedAt: new Date().toISOString()
      };
    }
  }

  extractPageTitle(html) {
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleMatch) {
      return titleMatch[1].replace(/&#8211;|&ndash;|–|-/g, '-').replace(/&amp;/g, '&').trim();
    }
    return '';
  }

  extractDescription(html) {
    // Look for main content descriptions
    const descriptionPatterns = [
      /<p[^>]*class="[^"]*lead[^"]*"[^>]*>([^<]+)<\/p>/gi,
      /<div[^>]*class="[^"]*intro[^"]*"[^>]*>([^<]+)<\/div>/gi,
      /<p[^>]*>([^<]{100,500})<\/p>/gi
    ];
    
    const descriptions = [];
    
    descriptionPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(html)) !== null && descriptions.length < 3) {
        const text = match[1].replace(/\s+/g, ' ').trim();
        if (text.length > 50 && !text.includes('javascript') && !text.includes('stylesheet')) {
          descriptions.push(text);
        }
      }
    });
    
    return descriptions[0] || '';
  }

  extractRequirements(html) {
    const requirements = [];
    
    // Look for requirements in lists
    const requirementPatterns = [
      /<li[^>]*>([^<]*(?:require|need|must|document|proof)[^<]*)<\/li>/gi,
      /<li[^>]*>([^<]{20,200})<\/li>/gi
    ];
    
    requirementPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(html)) !== null && requirements.length < 15) {
        const text = match[1].replace(/\s+/g, ' ').trim();
        if (text.length > 10 && text.length < 300 && 
            !text.includes('javascript') && !text.includes('cookie')) {
          requirements.push(text);
        }
      }
    });
    
    // Deduplicate requirements
    return [...new Set(requirements)].slice(0, 10);
  }

  extractFees(html) {
    const fees = [];
    
    // Look for fee information
    const feePatterns = [
      /fee[s]?[:\s]+\$?([0-9,]+(?:\.[0-9]{2})?)/gi,
      /cost[s]?[:\s]+\$?([0-9,]+(?:\.[0-9]{2})?)/gi,
      /\$([0-9,]+(?:\.[0-9]{2})?)/g
    ];
    
    feePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(html)) !== null && fees.length < 5) {
        fees.push(match[0]);
      }
    });
    
    // Also look for fee-related sentences
    const feeTextPattern = /[^.]*(?:fee|cost|charge)[^.]*\$[^.]*/gi;
    let match;
    while ((match = feeTextPattern.exec(html)) !== null && fees.length < 8) {
      const text = match[0].trim();
      if (text.length > 10 && text.length < 200) {
        fees.push(text);
      }
    }
    
    return [...new Set(fees)].slice(0, 5);
  }

  extractProcessingTime(html) {
    const timePatterns = [
      /processing\s+time[:\s]+([^<.]*(?:day|week|month)[^<.]*)/gi,
      /timeline[:\s]+([^<.]*(?:day|week|month)[^<.]*)/gi,
      /([0-9]+)\s*(?:business\s+)?(?:day|week|month)s?\s*(?:to\s+process|processing)/gi,
      /(?:takes|allow)\s+([^<.]*(?:day|week|month)[^<.]*)/gi
    ];
    
    const times = [];
    
    timePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(html)) !== null && times.length < 3) {
        const text = match[1] || match[0];
        if (text.length > 5 && text.length < 100) {
          times.push(text.trim());
        }
      }
    });
    
    return times[0] || '';
  }

  extractForms(html) {
    const forms = [];
    
    // Look for form links
    const formLinkPattern = /<a[^>]*href="([^"]*)"[^>]*>([^<]*(?:form|application|apply)[^<]*)<\/a>/gi;
    let match;
    while ((match = formLinkPattern.exec(html)) !== null) {
      const formUrl = match[1];
      const formText = match[2].trim();
      
      if (formText.length > 5 && formText.length < 150) {
        const fullUrl = formUrl.startsWith('http') ? formUrl : 
                       formUrl.startsWith('/') ? 'https://www.toronto.ca' + formUrl : 
                       'https://www.toronto.ca/' + formUrl;
        
        forms.push({
          text: formText,
          url: fullUrl,
          isPdf: formUrl.toLowerCase().includes('.pdf'),
          isOnline: !formUrl.toLowerCase().includes('.pdf') && 
                   (formText.toLowerCase().includes('online') || 
                    formText.toLowerCase().includes('apply') ||
                    formUrl.includes('form'))
        });
      }
    }
    
    return forms;
  }

  extractContacts(html) {
    const contacts = [];
    
    // Look for contact information
    const contactPatterns = [
      /(?:phone|call)[:\s]+([0-9]{3}[-.\\s]?[0-9]{3}[-.\\s]?[0-9]{4})/gi,
      /([0-9]{3}[-.\\s]?[0-9]{3}[-.\\s]?[0-9]{4})/g,
      /email[:\s]+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi,
      /([a-zA-Z0-9._%+-]+@toronto\.ca)/gi
    ];
    
    contactPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(html)) !== null && contacts.length < 5) {
        const contact = match[1] || match[0];
        if (contact.length > 5) {
          contacts.push(contact.trim());
        }
      }
    });
    
    return [...new Set(contacts)];
  }

  extractProcess(html) {
    const steps = [];
    
    // Look for numbered steps or process lists
    const stepPatterns = [
      /<(?:ol|ul)[^>]*>([\s\S]*?)<\/(?:ol|ul)>/gi,
      /step\s+[0-9]+[:\.]?\s*([^<.]*)/gi
    ];
    
    stepPatterns.forEach(pattern => {
      let match;
      if ((match = pattern.exec(html)) !== null) {
        if (pattern.source.includes('ol|ul')) {
          // Extract list items
          const listContent = match[1];
          const listItems = listContent.match(/<li[^>]*>([^<]+)<\/li>/gi) || [];
          listItems.forEach((item, index) => {
            const text = item.replace(/<[^>]*>/g, '').trim();
            if (text.length > 10 && text.length < 200 && steps.length < 8) {
              steps.push(`${index + 1}. ${text}`);
            }
          });
        } else {
          const text = match[1].trim();
          if (text.length > 10 && text.length < 200) {
            steps.push(text);
          }
        }
      }
    });
    
    return steps.slice(0, 6);
  }

  checkOnlineApplication(html) {
    const onlineKeywords = ['apply online', 'online application', 'submit online', 'online form'];
    return onlineKeywords.some(keyword => 
      html.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  extractRelatedLinks(html) {
    const links = [];
    
    // Look for related/useful links
    const linkPattern = /<a[^>]*href="([^"]*toronto\.ca[^"]*)"[^>]*>([^<]{10,100})<\/a>/gi;
    let match;
    while ((match = linkPattern.exec(html)) !== null && links.length < 8) {
      const linkUrl = match[1];
      const linkText = match[2].replace(/\s+/g, ' ').trim();
      
      if (!linkText.includes('Home') && !linkText.includes('Skip') && linkText.length > 5) {
        links.push({
          text: linkText,
          url: linkUrl
        });
      }
    }
    
    return links;
  }

  async scrapeAllPermitDetails() {
    console.log('🚀 DEEP PERMIT DETAILS SCRAPING');
    console.log('=' .repeat(60));
    
    try {
      // Load the permit structure
      const permits = await this.loadPermitStructure();
      console.log(`📋 Found ${permits.length} permits to scrape in detail`);
      
      // Limit to first 10 for testing (remove this limit for full scraping)
      const permitsToScrape = permits.slice(0, 10);
      console.log(`🎯 Scraping first ${permitsToScrape.length} permits for testing\n`);
      
      const results = [];
      
      for (let i = 0; i < permitsToScrape.length; i++) {
        const permit = permitsToScrape[i];
        
        console.log(`[${i + 1}/${permitsToScrape.length}] Processing: ${permit.title}`);
        
        const details = await this.scrapePermitDetails(permit);
        if (details) {
          results.push(details);
        }
        
        // Respectful delay between requests
        if (i < permitsToScrape.length - 1) {
          console.log(`   ⏱️  Waiting ${this.delayBetweenRequests}ms before next request...\n`);
          await new Promise(resolve => setTimeout(resolve, this.delayBetweenRequests));
        }
      }
      
      // Save detailed results
      await this.ensureDir('./scraped-data');
      const outputFile = './scraped-data/toronto-detailed-permits.json';
      fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
      
      // Generate summary report
      this.generateSummaryReport(results);
      
      console.log(`\n🎉 DEEP SCRAPING COMPLETE!`);
      console.log(`💾 Detailed results saved to: ${outputFile}`);
      console.log(`📊 Check the summary report above for insights`);
      
      return results;
      
    } catch (error) {
      console.error('❌ Deep scraping failed:', error);
      throw error;
    }
  }

  generateSummaryReport(results) {
    console.log(`\n📊 DETAILED PERMITS ANALYSIS`);
    console.log(`${'='.repeat(60)}`);
    
    const stats = {
      totalPermits: results.length,
      withDescriptions: results.filter(p => p.description).length,
      withRequirements: results.filter(p => p.requirements && p.requirements.length > 0).length,
      withFees: results.filter(p => p.fees && p.fees.length > 0).length,
      withProcessingTime: results.filter(p => p.processingTime).length,
      withForms: results.filter(p => p.forms && p.forms.length > 0).length,
      withOnlineApplication: results.filter(p => p.hasOnlineApplication).length,
      withContacts: results.filter(p => p.contacts && p.contacts.length > 0).length
    };
    
    console.log(`📈 Data Quality Statistics:`);
    Object.entries(stats).forEach(([key, value]) => {
      const percentage = ((value / stats.totalPermits) * 100).toFixed(1);
      console.log(`   ${key}: ${value}/${stats.totalPermits} (${percentage}%)`);
    });
    
    console.log(`\n🏆 Best Detailed Permits:`);
    const bestPermits = results
      .filter(p => p.description && p.requirements && p.requirements.length > 2)
      .sort((a, b) => (b.requirements?.length || 0) - (a.requirements?.length || 0))
      .slice(0, 5);
    
    bestPermits.forEach((permit, i) => {
      console.log(`   ${i + 1}. ${permit.title}`);
      console.log(`      Requirements: ${permit.requirements?.length || 0}`);
      console.log(`      Forms: ${permit.forms?.length || 0}`);
      console.log(`      Has online application: ${permit.hasOnlineApplication ? 'Yes' : 'No'}`);
    });
    
    console.log(`\n📝 Forms Found:`);
    const allForms = results.flatMap(p => p.forms || []);
    const onlineForms = allForms.filter(f => f.isOnline).length;
    const pdfForms = allForms.filter(f => f.isPdf).length;
    
    console.log(`   Total forms: ${allForms.length}`);
    console.log(`   Online forms: ${onlineForms}`);
    console.log(`   PDF forms: ${pdfForms}`);
    
    if (allForms.length > 0) {
      console.log(`   Sample forms:`);
      allForms.slice(0, 5).forEach((form, i) => {
        console.log(`     ${i + 1}. ${form.text} (${form.isOnline ? 'Online' : 'PDF'})`);
      });
    }
  }

  async ensureDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

// Run the deep scraper
async function runDeepScraper() {
  const scraper = new DeepPermitDetailsScraper();
  await scraper.scrapeAllPermitDetails();
}

runDeepScraper();
