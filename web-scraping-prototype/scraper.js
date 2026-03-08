const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

class TorontoPermitScraper {
  constructor() {
    this.baseUrl = 'https://www.toronto.ca';
    this.permitPages = [
      'https://www.toronto.ca/services-payments/permits/',
      'https://www.toronto.ca/services-payments/permits/building-permits/',
      'https://www.toronto.ca/services-payments/permits/business-licences/',
      'https://www.toronto.ca/services-payments/permits/development-approvals/'
    ];
    this.outputDir = './scraped-data';
  }

  async initialize() {
    // Ensure output directory exists
    await fs.ensureDir(this.outputDir);
    
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for production
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    console.log('🚀 Browser initialized');
  }

  async scrapeMainPermitsPage() {
    console.log('🌐 Starting to scrape Toronto permits page...');
    
    const page = await this.browser.newPage();
    const permits = [];

    try {
      await page.goto('https://www.toronto.ca/services-payments/permits/', {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      console.log('📄 Page loaded successfully');

      // Wait for page to fully load
      await page.waitForTimeout(2000);

      // Look for various types of expandable elements
      const expandableSelectors = [
        '.accordion-item',
        '.collapse-toggle',
        '[data-toggle="collapse"]',
        '.expandable-section',
        '.permit-category',
        'details summary',
        '.faq-item',
        'button[aria-expanded]'
      ];

      let foundElements = [];
      
      for (const selector of expandableSelectors) {
        try {
          const elements = await page.$$(selector);
          if (elements.length > 0) {
            console.log(`✅ Found ${elements.length} elements with selector: ${selector}`);
            foundElements.push({ selector, elements });
          }
        } catch (error) {
          console.log(`❌ Selector ${selector} not found or failed`);
        }
      }

      // If no expandable elements, try to scrape static content
      if (foundElements.length === 0) {
        console.log('🔍 No expandable elements found, scraping static content...');
        permits.push(...await this.scrapeStaticContent(page));
      } else {
        // Process each type of expandable element
        for (const { selector, elements } of foundElements) {
          console.log(`🔄 Processing ${elements.length} ${selector} elements...`);
          
          for (let i = 0; i < Math.min(elements.length, 10); i++) { // Limit to 10 for testing
            try {
              const permit = await this.scrapeExpandableElement(page, selector, i);
              if (permit && permit.title) {
                permits.push(permit);
                console.log(`📋 Scraped: ${permit.title}`);
              }
            } catch (error) {
              console.log(`❌ Error scraping element ${i}: ${error.message}`);
            }
          }
        }
      }

      // Also scrape any visible permit links
      const permitLinks = await this.scrapePermitLinks(page);
      permits.push(...permitLinks);

    } catch (error) {
      console.error('❌ Error scraping main page:', error);
    } finally {
      await page.close();
    }

    return permits;
  }

  async scrapeExpandableElement(page, selector, index) {
    try {
      const elements = await page.$$(selector);
      if (!elements[index]) return null;

      // Scroll to element
      await elements[index].scrollIntoView();
      await page.waitForTimeout(500);

      // Try to click and expand
      await elements[index].click();
      await page.waitForTimeout(2000); // Wait for expansion

      // Extract data after expansion
      const permitData = await page.evaluate((sel, idx) => {
        const elements = document.querySelectorAll(sel);
        const element = elements[idx];
        if (!element) return null;

        // Look for expanded content
        const expandedContent = element.querySelector('.collapse.show, .expanded-content, .panel-body, .accordion-body');
        
        // Get title from various possible locations
        const titleElement = element.querySelector('h1, h2, h3, h4, h5, .title, .heading, .permit-title, summary');
        const title = titleElement ? titleElement.textContent.trim() : '';

        // Get description
        let description = '';
        if (expandedContent) {
          const descElement = expandedContent.querySelector('p, .description, .content');
          description = descElement ? descElement.textContent.trim() : expandedContent.textContent.trim();
        }

        // Get requirements (look for lists)
        const requirements = [];
        if (expandedContent) {
          const listItems = expandedContent.querySelectorAll('li, .requirement, .step');
          listItems.forEach(item => {
            const text = item.textContent.trim();
            if (text && text.length > 10) { // Filter out short/empty items
              requirements.push(text);
            }
          });
        }

        // Look for fees
        const feeKeywords = ['fee', 'cost', 'price', '$', 'dollar'];
        let fee = '';
        if (expandedContent) {
          const allText = expandedContent.textContent.toLowerCase();
          feeKeywords.forEach(keyword => {
            if (allText.includes(keyword)) {
              const sentences = expandedContent.textContent.split('.').filter(s => 
                s.toLowerCase().includes(keyword) && (s.includes('$') || s.toLowerCase().includes('fee'))
              );
              if (sentences.length > 0) {
                fee = sentences[0].trim();
              }
            }
          });
        }

        // Look for timeline/processing time
        const timeKeywords = ['processing', 'timeline', 'days', 'weeks', 'business days'];
        let timeline = '';
        if (expandedContent) {
          const allText = expandedContent.textContent.toLowerCase();
          timeKeywords.forEach(keyword => {
            if (allText.includes(keyword)) {
              const sentences = expandedContent.textContent.split('.').filter(s => 
                s.toLowerCase().includes(keyword)
              );
              if (sentences.length > 0) {
                timeline = sentences[0].trim();
              }
            }
          });
        }

        // Get links
        const links = [];
        if (expandedContent) {
          const linkElements = expandedContent.querySelectorAll('a[href]');
          linkElements.forEach(link => {
            links.push({
              text: link.textContent.trim(),
              url: link.href
            });
          });
        }

        return {
          title,
          description: description.substring(0, 500), // Limit description length
          requirements: requirements.slice(0, 10), // Limit requirements
          fee,
          timeline,
          links: links.slice(0, 5), // Limit links
          selector: sel,
          scrapedAt: new Date().toISOString()
        };
      }, selector, index);

      return permitData;

    } catch (error) {
      console.log(`❌ Error expanding element ${index}: ${error.message}`);
      return null;
    }
  }

  async scrapeStaticContent(page) {
    console.log('🔍 Scraping static content...');
    
    const staticPermits = await page.evaluate(() => {
      const permits = [];
      
      // Look for permit-related headings and content
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5');
      
      headings.forEach((heading, index) => {
        const text = heading.textContent.trim();
        
        // Filter for permit-related headings
        if (text.toLowerCase().includes('permit') || 
            text.toLowerCase().includes('licence') || 
            text.toLowerCase().includes('license') ||
            text.toLowerCase().includes('approval')) {
          
          let description = '';
          let nextElement = heading.nextElementSibling;
          
          // Get following paragraphs as description
          while (nextElement && permits.length < 20) {
            if (nextElement.tagName === 'P') {
              description += nextElement.textContent.trim() + ' ';
            } else if (nextElement.tagName.match(/H[1-6]/)) {
              break; // Stop at next heading
            }
            nextElement = nextElement.nextElementSibling;
          }
          
          if (description.trim()) {
            permits.push({
              title: text,
              description: description.trim().substring(0, 300),
              type: 'static',
              scrapedAt: new Date().toISOString()
            });
          }
        }
      });
      
      return permits;
    });
    
    return staticPermits;
  }

  async scrapePermitLinks(page) {
    console.log('🔗 Scraping permit-related links...');
    
    const permitLinks = await page.evaluate(() => {
      const links = [];
      const linkElements = document.querySelectorAll('a[href]');
      
      linkElements.forEach(link => {
        const text = link.textContent.trim();
        const href = link.href;
        
        if ((text.toLowerCase().includes('permit') || 
             text.toLowerCase().includes('licence') ||
             text.toLowerCase().includes('license')) &&
            text.length > 10 && text.length < 100) {
          
          links.push({
            title: text,
            url: href,
            type: 'link',
            scrapedAt: new Date().toISOString()
          });
        }
      });
      
      return links.slice(0, 15); // Limit to 15 links
    });
    
    return permitLinks;
  }

  async saveResults(permits) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Save as JSON
    const jsonFile = path.join(this.outputDir, `toronto-permits-${timestamp}.json`);
    await fs.writeJson(jsonFile, permits, { spaces: 2 });
    
    // Save as readable text summary
    const txtFile = path.join(this.outputDir, `toronto-permits-summary-${timestamp}.txt`);
    const summary = this.generateSummary(permits);
    await fs.writeFile(txtFile, summary);
    
    console.log(`💾 Results saved to:`);
    console.log(`   JSON: ${jsonFile}`);
    console.log(`   Summary: ${txtFile}`);
    
    return { jsonFile, txtFile };
  }

  generateSummary(permits) {
    let summary = `Toronto Permits Scraping Results\n`;
    summary += `Generated: ${new Date().toISOString()}\n`;
    summary += `Total permits found: ${permits.length}\n\n`;
    summary += `${'='.repeat(60)}\n\n`;
    
    permits.forEach((permit, index) => {
      summary += `${index + 1}. ${permit.title || 'No Title'}\n`;
      summary += `   Type: ${permit.type || 'expandable'}\n`;
      
      if (permit.description) {
        summary += `   Description: ${permit.description.substring(0, 200)}${permit.description.length > 200 ? '...' : ''}\n`;
      }
      
      if (permit.requirements && permit.requirements.length > 0) {
        summary += `   Requirements (${permit.requirements.length}):\n`;
        permit.requirements.slice(0, 3).forEach(req => {
          summary += `     - ${req.substring(0, 100)}${req.length > 100 ? '...' : ''}\n`;
        });
      }
      
      if (permit.fee) {
        summary += `   Fee: ${permit.fee}\n`;
      }
      
      if (permit.timeline) {
        summary += `   Timeline: ${permit.timeline}\n`;
      }
      
      if (permit.links && permit.links.length > 0) {
        summary += `   Links: ${permit.links.length} found\n`;
      }
      
      if (permit.url) {
        summary += `   URL: ${permit.url}\n`;
      }
      
      summary += `\n${'-'.repeat(40)}\n\n`;
    });
    
    return summary;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('🔒 Browser closed');
    }
  }
}

module.exports = TorontoPermitScraper;
