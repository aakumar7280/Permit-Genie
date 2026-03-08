const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

class PermitSearchService {
  
  async searchPermits(query, limit = 5) {
    if (!query || query.trim().length < 2) {
      throw new Error('Query must be at least 2 characters long');
    }

    console.log(`🔍 Searching for: "${query}"`);
    
    // Get all permits and score them
    const allPermits = await prisma.torontoPermit.findMany();
    
    const searchTerms = this.extractSearchTerms(query);
    console.log('📝 Search terms:', searchTerms);
    
    // Score and rank permits by relevance
    const scoredPermits = allPermits.map(permit => {
      const score = this.calculateRelevanceScore(permit, searchTerms, query);
      return { ...permit, relevanceScore: score };
    });
    
    // Sort by relevance score and return top results
    const results = scoredPermits
      .filter(permit => permit.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
    
    console.log(`✅ Found ${results.length} relevant permits`);
    
    return results;
  }
  
  extractSearchTerms(query) {
    return query.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(term => term.length > 2);
  }
  
  calculateRelevanceScore(permit, searchTerms, originalQuery) {
    let score = 0;
    const name = permit.name.toLowerCase();
    const description = permit.description.toLowerCase();
    const category = permit.category.toLowerCase();
    const keywords = (permit.keywords || '').toLowerCase();
    const queryLower = originalQuery.toLowerCase();
    
    // Exact phrase match in name (highest priority)
    if (name.includes(queryLower)) {
      score += 100;
    }
    
    // Exact phrase match in description
    if (description.includes(queryLower)) {
      score += 50;
    }
    
    // Individual term matching
    searchTerms.forEach(term => {
      // Name matches (high priority)
      if (name.includes(term)) score += 20;
      
      // Category matches (medium-high priority)
      if (category.includes(term)) score += 15;
      
      // Keywords matches (medium priority)
      if (keywords.includes(term)) score += 10;
      
      // Description matches (lower priority)
      if (description.includes(term)) score += 5;
    });
    
    // Pattern-based boosting
    score += this.getPatternBoost(queryLower, permit);
    
    return Math.round(score);
  }
  
  getPatternBoost(query, permit) {
    let boost = 0;
    const nameLower = permit.name.toLowerCase();
    const categoryLower = permit.category.toLowerCase();
    
    // Common search patterns
    const patterns = [
      // Building/Construction related
      { 
        pattern: /building|construction|renovation|repair|demolition|contractor/,
        condition: () => nameLower.includes('building') || nameLower.includes('renovation') || categoryLower === 'building',
        boost: 15
      },
      
      // Business related
      { 
        pattern: /business|shop|store|restaurant|cafe|retail/,
        condition: () => categoryLower === 'business' || nameLower.includes('establishment'),
        boost: 12
      },
      
      // Transportation related  
      { 
        pattern: /taxi|driver|vehicle|car|truck|transport/,
        condition: () => categoryLower === 'vehicle' || categoryLower === 'driver' || nameLower.includes('taxi'),
        boost: 12
      },
      
      // Signs and advertising
      { 
        pattern: /sign|signage|advertising|banner/,
        condition: () => nameLower.includes('sign') || nameLower.includes('banner'),
        boost: 15
      },
      
      // Food and dining
      { 
        pattern: /food|restaurant|eating|dining|kitchen/,
        condition: () => nameLower.includes('food') || nameLower.includes('eating') || nameLower.includes('restaurant'),
        boost: 12
      },
      
      // Parking
      { 
        pattern: /parking|lot/,
        condition: () => nameLower.includes('parking') || categoryLower === 'parking',
        boost: 15
      }
    ];
    
    patterns.forEach(({ pattern, condition, boost: patternBoost }) => {
      if (pattern.test(query) && condition()) {
        boost += patternBoost;
      }
    });
    
    return boost;
  }
  
  async getPermitById(id) {
    return await prisma.torontoPermit.findUnique({
      where: { id: parseInt(id) }
    });
  }
  
  async getPermitsByCategory(category, limit = 10) {
    return await prisma.torontoPermit.findMany({
      where: { 
        category: {
          equals: category,
          mode: 'insensitive'
        }
      },
      take: limit,
      orderBy: { name: 'asc' }
    });
  }
  
  async getAllCategories() {
    const categories = await prisma.torontoPermit.groupBy({
      by: ['category'],
      _count: true,
      orderBy: { category: 'asc' }
    });
    
    return categories.map(cat => ({
      name: cat.category,
      count: cat._count
    }));
  }
}

module.exports = PermitSearchService;
