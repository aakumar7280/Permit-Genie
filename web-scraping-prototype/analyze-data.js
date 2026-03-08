const fs = require('fs-extra');
const path = require('path');

class DataAnalyzer {
  constructor() {
    this.dataDir = './scraped-data';
  }

  async analyzeLatestResults() {
    console.log('📊 Analyzing scraped permit data...\n');
    
    try {
      // Find the latest JSON file
      const files = await fs.readdir(this.dataDir);
      const jsonFiles = files.filter(f => f.endsWith('.json')).sort().reverse();
      
      if (jsonFiles.length === 0) {
        console.log('❌ No scraped data files found. Run the scraper first.');
        return;
      }
      
      const latestFile = jsonFiles[0];
      console.log(`📁 Analyzing: ${latestFile}\n`);
      
      const filePath = path.join(this.dataDir, latestFile);
      const permits = await fs.readJson(filePath);
      
      this.generateAnalysis(permits);
      
    } catch (error) {
      console.error('❌ Analysis failed:', error);
    }
  }
  
  generateAnalysis(permits) {
    console.log(`🎯 PERMIT DATA ANALYSIS`);
    console.log(`${'='.repeat(50)}\n`);
    
    // Basic stats
    console.log(`📋 Basic Statistics:`);
    console.log(`   Total permits: ${permits.length}`);
    
    // Categorize by type
    const typeStats = {};
    permits.forEach(permit => {
      const type = permit.type || 'unknown';
      typeStats[type] = (typeStats[type] || 0) + 1;
    });
    
    console.log(`   Types found:`);
    Object.entries(typeStats).forEach(([type, count]) => {
      console.log(`     ${type}: ${count} permits`);
    });
    
    // Data quality analysis
    console.log(`\n🔍 Data Quality Analysis:`);
    
    const quality = {
      withTitle: permits.filter(p => p.title && p.title.trim()).length,
      withDescription: permits.filter(p => p.description && p.description.trim()).length,
      withRequirements: permits.filter(p => p.requirements && p.requirements.length > 0).length,
      withFees: permits.filter(p => p.fee && p.fee.trim()).length,
      withTimeline: permits.filter(p => p.timeline && p.timeline.trim()).length,
      withLinks: permits.filter(p => p.links && p.links.length > 0).length
    };
    
    Object.entries(quality).forEach(([field, count]) => {
      const percentage = ((count / permits.length) * 100).toFixed(1);
      console.log(`   ${field}: ${count}/${permits.length} (${percentage}%)`);
    });
    
    // Content analysis
    console.log(`\n📝 Content Analysis:`);
    
    // Most common keywords in titles
    const titleWords = {};
    permits.forEach(permit => {
      if (permit.title) {
        const words = permit.title.toLowerCase()
          .split(/\W+/)
          .filter(w => w.length > 3 && !['permit', 'license', 'licence', 'city', 'toronto'].includes(w));
        
        words.forEach(word => {
          titleWords[word] = (titleWords[word] || 0) + 1;
        });
      }
    });
    
    const topWords = Object.entries(titleWords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    if (topWords.length > 0) {
      console.log(`   Most common keywords in titles:`);
      topWords.forEach(([word, count]) => {
        console.log(`     "${word}": ${count} times`);
      });
    }
    
    // Sample high-quality permits
    console.log(`\n🌟 Sample High-Quality Permits:`);
    
    const highQuality = permits.filter(permit => 
      permit.title && 
      permit.description && 
      (permit.requirements?.length > 0 || permit.fee || permit.timeline)
    ).slice(0, 3);
    
    highQuality.forEach((permit, index) => {
      console.log(`\n   ${index + 1}. ${permit.title}`);
      if (permit.description) {
        console.log(`      Description: ${permit.description.substring(0, 100)}...`);
      }
      if (permit.requirements?.length > 0) {
        console.log(`      Requirements: ${permit.requirements.length} items`);
      }
      if (permit.fee) {
        console.log(`      Fee: ${permit.fee.substring(0, 50)}...`);
      }
      if (permit.timeline) {
        console.log(`      Timeline: ${permit.timeline.substring(0, 50)}...`);
      }
    });
    
    // Potential issues
    console.log(`\n⚠️  Potential Issues:`);
    
    const issues = [];
    
    if (permits.length < 5) {
      issues.push('Very few permits found - may need better selectors');
    }
    
    if (quality.withDescription < permits.length * 0.3) {
      issues.push('Low percentage of permits with descriptions');
    }
    
    if (quality.withRequirements < permits.length * 0.2) {
      issues.push('Very few permits have requirement details');
    }
    
    const duplicateTitles = {};
    permits.forEach(permit => {
      if (permit.title) {
        const title = permit.title.toLowerCase().trim();
        duplicateTitles[title] = (duplicateTitles[title] || 0) + 1;
      }
    });
    
    const duplicates = Object.values(duplicateTitles).filter(count => count > 1).length;
    if (duplicates > 0) {
      issues.push(`${duplicates} potential duplicate titles found`);
    }
    
    if (issues.length > 0) {
      issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log(`   ✅ No major issues detected`);
    }
    
    // Recommendations
    console.log(`\n💡 Recommendations:`);
    
    const recommendations = [];
    
    if (quality.withFees < permits.length * 0.3) {
      recommendations.push('Improve fee extraction - look for $ symbols and fee-related text');
    }
    
    if (quality.withTimeline < permits.length * 0.3) {
      recommendations.push('Enhance timeline extraction - search for days/weeks/processing keywords');
    }
    
    if (permits.filter(p => p.type === 'static').length > permits.length * 0.7) {
      recommendations.push('Focus on finding more expandable content for detailed information');
    }
    
    if (permits.length < 20) {
      recommendations.push('Try additional pages or sections of the Toronto website');
    }
    
    if (recommendations.length > 0) {
      recommendations.forEach(rec => console.log(`   - ${rec}`));
    } else {
      console.log(`   ✅ Data extraction looks good!`);
    }
    
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🎉 Analysis complete! Check the data files for detailed results.`);
  }
}

// Run analysis
const analyzer = new DataAnalyzer();
analyzer.analyzeLatestResults();
