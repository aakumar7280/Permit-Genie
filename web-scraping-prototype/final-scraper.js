const https = require('https');
const http = require('http');
const fs = require('fs');
const url = require('url');

class FinalTorontoScraper {
  constructor() {
    this.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
    this.maxRedirects = 5;
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

      const client = urlParts.protocol === 'https:' ? https : http;
      
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

  async scrapeMultiplePages() {
    console.log('🎯 Starting comprehensive Toronto website scraping...');
    
    const urlsToTry = [
      'https://www.toronto.ca/services-payments/permits/',
      'https://www.toronto.ca/services-payments/permits/building-permits/',
      'https://www.toronto.ca/services-payments/permits/business-licences/',
      'https://www.toronto.ca/services-payments/',
      'https://www.toronto.ca/'
    ];

    const results = [];
    
    for (const testUrl of urlsToTry) {
      console.log(`\n🌐 Testing: ${testUrl}`);
      
      try {
        const html = await this.fetchPageWithRedirects(testUrl);
        
        if (html.length > 0) {
          console.log(`✅ Success: ${html.length} characters`);
          
          const analysis = this.analyzeContent(html, testUrl);
          results.push(analysis);
          
          // Save HTML for this specific page
          const filename = testUrl.replace(/[^a-zA-Z0-9]/g, '_') + '.html';
          await this.ensureDir('./scraped-data');
          fs.writeFileSync(`./scraped-data/${filename}`, html);
          
          console.log(`💾 Saved HTML to: ./scraped-data/${filename}`);
          
          // If this page has good permit content, focus on it
          if (analysis.permitScore > 5) {
            console.log(`🎯 High permit content detected! Focusing on this page.`);
            break;
          }
        } else {
          console.log(`⚠️  Empty response`);
        }
        
      } catch (error) {
        console.log(`❌ Failed: ${error.message}`);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Compile comprehensive analysis
    const finalAnalysis = this.compileAnalysis(results);
    
    // Save complete analysis
    const analysisFile = './scraped-data/comprehensive-analysis.json';
    fs.writeFileSync(analysisFile, JSON.stringify(finalAnalysis, null, 2));
    
    console.log(`\n📊 COMPREHENSIVE ANALYSIS COMPLETE`);
    console.log(`${'='.repeat(60)}`);
    console.log(`💾 Full analysis saved to: ${analysisFile}`);
    
    this.printFinalResults(finalAnalysis);
    
    return finalAnalysis;
  }

  analyzeContent(html, sourceUrl) {
    const analysis = {
      url: sourceUrl,
      scrapedAt: new Date().toISOString(),
      contentLength: html.length,
      permitScore: 0,
      permitContent: {
        permitReferences: 0,
        licenseReferences: 0,
        applicationReferences: 0,
        feeReferences: 0,
        formElements: 0,
        permitLinks: []
      },
      technicalDetails: {
        hasJavaScript: false,
        hasExpandableElements: false,
        hasMetaDescription: false,
        pageTitle: ''
      },
      extractedText: {
        headings: [],
        permitSections: [],
        importantLinks: []
      }
    };

    // Basic technical analysis
    analysis.technicalDetails.hasJavaScript = html.includes('<script') || html.includes('javascript');
    analysis.technicalDetails.hasExpandableElements = 
      html.toLowerCase().includes('accordion') || 
      html.toLowerCase().includes('collapse') || 
      html.toLowerCase().includes('expand') ||
      html.toLowerCase().includes('toggle');
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleMatch) {
      analysis.technicalDetails.pageTitle = titleMatch[1].trim();
    }

    // Count permit-related references
    const permitCount = (html.match(/permit/gi) || []).length;
    const licenseCount = (html.match(/licen[cs]e/gi) || []).length;
    const applicationCount = (html.match(/application/gi) || []).length;
    const feeCount = (html.match(/fee|cost|\$/gi) || []).length;
    
    analysis.permitContent.permitReferences = permitCount;
    analysis.permitContent.licenseReferences = licenseCount;
    analysis.permitContent.applicationReferences = applicationCount;
    analysis.permitContent.feeReferences = feeCount;

    // Calculate permit score
    analysis.permitScore = permitCount + licenseCount + (applicationCount * 0.5) + (feeCount * 0.3);

    // Extract headings
    const headingMatches = html.match(/<h[1-6][^>]*>([^<]*)<\/h[1-6]>/gi) || [];
    analysis.extractedText.headings = headingMatches
      .map(h => h.replace(/<[^>]*>/g, '').trim())
      .filter(h => h.length > 0)
      .slice(0, 20);

    // Find permit-related sections
    const permitSectionRegex = /(?:permit|licen[cs]e|application)[^.]{20,200}/gi;
    const permitSections = html.match(permitSectionRegex) || [];
    analysis.extractedText.permitSections = permitSections
      .map(section => section.replace(/<[^>]*>/g, '').trim())
      .slice(0, 10);

    // Extract permit-related links
    const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]*(?:permit|licen[cs]e|application|apply)[^<]*)<\/a>/gi;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(html)) !== null) {
      analysis.extractedText.importantLinks.push({
        url: linkMatch[1],
        text: linkMatch[2].replace(/<[^>]*>/g, '').trim()
      });
    }

    return analysis;
  }

  compileAnalysis(results) {
    const compiled = {
      totalPagesAnalyzed: results.length,
      bestPage: null,
      overallFindings: {
        totalPermitReferences: 0,
        totalLicenseReferences: 0,
        pagesWithJavaScript: 0,
        pagesWithExpandableContent: 0,
        allPermitLinks: [],
        allHeadings: [],
        bestPermitSections: []
      },
      recommendations: [],
      pageResults: results
    };

    // Find the best page
    let highestScore = 0;
    results.forEach(result => {
      if (result.permitScore > highestScore) {
        highestScore = result.permitScore;
        compiled.bestPage = result;
      }

      // Aggregate data
      compiled.overallFindings.totalPermitReferences += result.permitContent.permitReferences;
      compiled.overallFindings.totalLicenseReferences += result.permitContent.licenseReferences;
      
      if (result.technicalDetails.hasJavaScript) {
        compiled.overallFindings.pagesWithJavaScript++;
      }
      
      if (result.technicalDetails.hasExpandableElements) {
        compiled.overallFindings.pagesWithExpandableContent++;
      }

      // Collect links and headings
      compiled.overallFindings.allPermitLinks.push(...result.extractedText.importantLinks);
      compiled.overallFindings.allHeadings.push(...result.extractedText.headings);
      compiled.overallFindings.bestPermitSections.push(...result.extractedText.permitSections);
    });

    // Generate recommendations
    if (compiled.bestPage) {
      compiled.recommendations.push(`Focus scraping on: ${compiled.bestPage.url} (score: ${compiled.bestPage.permitScore})`);
    }

    if (compiled.overallFindings.pagesWithExpandableContent > 0) {
      compiled.recommendations.push('Use Puppeteer for JavaScript rendering - expandable content detected');
    } else {
      compiled.recommendations.push('Static HTML scraping may be sufficient');
    }

    if (compiled.overallFindings.totalPermitReferences < 20) {
      compiled.recommendations.push('Consider scraping additional Toronto government pages');
    }

    if (compiled.overallFindings.allPermitLinks.length > 0) {
      compiled.recommendations.push(`Found ${compiled.overallFindings.allPermitLinks.length} permit-related links to follow`);
    }

    return compiled;
  }

  printFinalResults(analysis) {
    console.log(`📄 Pages analyzed: ${analysis.totalPagesAnalyzed}`);
    console.log(`🏆 Best page: ${analysis.bestPage?.url || 'None'}`);
    console.log(`📊 Total permit references: ${analysis.overallFindings.totalPermitReferences}`);
    console.log(`📊 Total license references: ${analysis.overallFindings.totalLicenseReferences}`);
    console.log(`⚡ Pages with JavaScript: ${analysis.overallFindings.pagesWithJavaScript}`);
    console.log(`🎛️  Pages with expandable content: ${analysis.overallFindings.pagesWithExpandableContent}`);

    console.log(`\n🔗 Key Permit Links Found:`);
    const uniqueLinks = [...new Set(analysis.overallFindings.allPermitLinks.map(l => l.url))];
    uniqueLinks.slice(0, 10).forEach((link, i) => {
      const linkObj = analysis.overallFindings.allPermitLinks.find(l => l.url === link);
      console.log(`   ${i + 1}. ${linkObj.text} (${link})`);
    });

    console.log(`\n📋 Sample Permit Sections:`);
    analysis.overallFindings.bestPermitSections.slice(0, 5).forEach((section, i) => {
      console.log(`   ${i + 1}. ${section.substring(0, 100)}...`);
    });

    console.log(`\n💡 Recommendations:`);
    analysis.recommendations.forEach(rec => {
      console.log(`   - ${rec}`);
    });
  }

  async ensureDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

// Run the final comprehensive scraper
async function runComprehensiveScraper() {
  console.log('🚀 COMPREHENSIVE TORONTO PERMITS SCRAPING');
  console.log('=' .repeat(60));
  
  const scraper = new FinalTorontoScraper();
  
  try {
    await scraper.scrapeMultiplePages();
    
    console.log('\n🎉 SCRAPING PROTOTYPE COMPLETE!');
    console.log('📁 All results saved in ./scraped-data/ folder');
    console.log('🔍 Review the files to understand Toronto\'s permit structure');
    console.log('⚡ Ready to implement full Puppeteer scraping based on findings!');
    
  } catch (error) {
    console.error('❌ Comprehensive scraping failed:', error);
  }
}

runComprehensiveScraper();
