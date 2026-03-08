const { PrismaClient } = require('../src/generated/prisma');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

class TorontoPermitImporter {
  
  async importPermitsFromCSV() {
    console.log('🚀 Starting Toronto Permits Import...');
    
    const csvPath = path.join(__dirname, '../toronto-permits-final-table.csv');
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at: ${csvPath}`);
    }

    const permits = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          // Generate keywords for better search
          const keywords = this.generateKeywords(row.Name, row.Description, row.Category);
          
          permits.push({
            csvId: parseInt(row.ID),
            name: row.Name,
            category: row.Category,
            description: row.Description,
            url: row.URL,
            keywords: keywords.join(' ')
          });
        })
        .on('end', async () => {
          try {
            // Clear existing Toronto permits
            console.log('🗑️  Clearing existing permits...');
            await prisma.torontoPermit.deleteMany();
            
            // Import new permits
            console.log(`📝 Importing ${permits.length} permits...`);
            await prisma.torontoPermit.createMany({
              data: permits
            });
            
            console.log(`✅ Successfully imported ${permits.length} Toronto permits!`);
            resolve(permits);
          } catch (error) {
            console.error('❌ Error importing permits:', error);
            reject(error);
          }
        })
        .on('error', reject);
    });
  }
  
  generateKeywords(name, description, category) {
    const text = `${name} ${description} ${category}`.toLowerCase();
    
    // Extract relevant keywords
    const keywords = new Set();
    
    // Add exact words (3+ chars)
    const words = text.match(/\b\w{3,}\b/g) || [];
    words.forEach(word => keywords.add(word));
    
    // Add category-specific keywords
    const categoryKeywords = this.getCategoryKeywords(category);
    categoryKeywords.forEach(keyword => keywords.add(keyword));
    
    // Add variations of the name
    const nameWords = name.toLowerCase().split(/[\s\-\(\)&]+/);
    nameWords.forEach(word => {
      if (word.length > 2) {
        keywords.add(word);
        // Add partial matches for compound words
        if (word.length > 6) {
          keywords.add(word.substring(0, word.length - 2));
        }
      }
    });
    
    return Array.from(keywords);
  }
  
  getCategoryKeywords(category) {
    const keywordMap = {
      'Business': ['business', 'commercial', 'shop', 'store', 'company', 'establishment', 'retail', 'service'],
      'Building': ['construction', 'building', 'renovation', 'demolition', 'structure', 'permit', 'contractor', 'build'],
      'Vehicle': ['vehicle', 'car', 'truck', 'automotive', 'transport', 'driving', 'motor', 'auto'],
      'Trade': ['trade', 'contractor', 'professional', 'service', 'installer', 'worker', 'tradesperson'],
      'Right of Way': ['street', 'sidewalk', 'public', 'outdoor', 'signage', 'vending', 'roadway', 'pathway'],
      'Driver': ['driver', 'license', 'driving', 'operator', 'chauffeur', 'transportation'],
      'Parking': ['parking', 'vehicle', 'space', 'lot', 'street', 'meter', 'zone'],
      'Lottery': ['lottery', 'gaming', 'raffle', 'bingo', 'tickets', 'gambling', 'draw'],
      'General': ['permit', 'license', 'general', 'application', 'authorization'],
      'Water': ['water', 'hydrant', 'sewer', 'plumbing', 'utilities', 'pipes', 'drainage'],
      'Animals': ['pet', 'animal', 'dog', 'cat', 'licensing', 'veterinary', 'kennel'],
      'Licence': ['license', 'permit', 'authorization', 'certification', 'approval']
    };
    
    return keywordMap[category] || [];
  }

  async getImportStats() {
    const total = await prisma.torontoPermit.count();
    const categories = await prisma.torontoPermit.groupBy({
      by: ['category'],
      _count: true
    });
    
    return {
      total,
      categories: categories.map(cat => ({
        category: cat.category,
        count: cat._count
      }))
    };
  }
}

module.exports = TorontoPermitImporter;
