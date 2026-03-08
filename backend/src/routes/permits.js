const express = require('express');
const router = express.Router();
const PermitSearchService = require('../../services/permitSearchService');
const AISearchService = require('../../services/aiSearchService');
const TorontoPermitImporter = require('../../services/permitImporter');

const searchService = new PermitSearchService();
const aiSearchService = new AISearchService();
const importer = new TorontoPermitImporter();

// Search permits (AI-powered with keyword fallback)
router.get('/search', async (req, res) => {
  try {
    const { q: query, limit = 5, mode } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Query must be at least 2 characters long'
      });
    }

    // Use AI search if available and not explicitly requesting keyword mode
    const useAI = mode !== 'keyword' && aiSearchService.isAvailable;

    if (useAI) {
      try {
        const aiResult = await aiSearchService.searchPermits(query, parseInt(limit));
        
        return res.json({
          success: true,
          query,
          count: aiResult.permits.length,
          intent: aiResult.intent,
          aiPowered: true,
          permits: aiResult.permits.map(permit => ({
            id: permit.id,
            csvId: permit.csvId,
            name: permit.name,
            category: permit.category,
            description: permit.description,
            url: permit.url,
            relevanceScore: permit.relevanceScore,
            aiReason: permit.aiReason,
          }))
        });
      } catch (aiError) {
        console.warn('⚠️  AI search failed, falling back to keyword search:', aiError.message);
        // Fall through to keyword search below
      }
    }
    
    // Keyword-based fallback search
    const permits = await searchService.searchPermits(query, parseInt(limit));
    
    res.json({
      success: true,
      query,
      count: permits.length,
      aiPowered: false,
      permits: permits.map(permit => ({
        id: permit.id,
        csvId: permit.csvId,
        name: permit.name,
        category: permit.category,
        description: permit.description,
        url: permit.url,
        relevanceScore: permit.relevanceScore
      }))
    });
  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Chat-based permit search (conversational, with history)
router.post('/chat', async (req, res) => {
  try {
    const { messages, limit = 8 } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required'
      });
    }

    if (!aiSearchService.isAvailable) {
      // Fallback: use keyword search on the latest user message
      const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || '';
      const permits = await searchService.searchPermits(lastUserMsg, parseInt(limit));
      return res.json({
        success: true,
        message: `I found ${permits.length} permit${permits.length !== 1 ? 's' : ''} that might be relevant to your search. Take a look and let me know if you need something more specific!`,
        aiPowered: false,
        permits: permits.map(permit => ({
          id: permit.id,
          csvId: permit.csvId,
          name: permit.name,
          category: permit.category,
          description: permit.description,
          url: permit.url,
          relevanceScore: permit.relevanceScore
        }))
      });
    }

    try {
      const chatResult = await aiSearchService.chatSearch(messages, parseInt(limit));
      return res.json({
        success: true,
        message: chatResult.message,
        aiPowered: true,
        permits: chatResult.permits.map(permit => ({
          id: permit.id,
          csvId: permit.csvId,
          name: permit.name,
          category: permit.category,
          description: permit.description,
          url: permit.url,
          relevanceScore: permit.relevanceScore,
          aiReason: permit.aiReason,
        }))
      });
    } catch (aiError) {
      console.warn('⚠️  AI chat failed, falling back to keyword search:', aiError.message);
      const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || '';
      const permits = await searchService.searchPermits(lastUserMsg, parseInt(limit));
      return res.json({
        success: true,
        message: `I found ${permits.length} permit${permits.length !== 1 ? 's' : ''} that might match what you're looking for. Feel free to give me more details so I can refine the suggestions!`,
        aiPowered: false,
        aiError: aiError.message,
        permits: permits.map(permit => ({
          id: permit.id,
          csvId: permit.csvId,
          name: permit.name,
          category: permit.category,
          description: permit.description,
          url: permit.url,
          relevanceScore: permit.relevanceScore
        }))
      });
    }
  } catch (error) {
    console.error('❌ Chat error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get permit by ID
router.get('/:id', async (req, res) => {
  try {
    const permit = await searchService.getPermitById(req.params.id);
    
    if (!permit) {
      return res.status(404).json({
        success: false,
        error: 'Permit not found'
      });
    }
    
    res.json({ 
      success: true, 
      permit 
    });
  } catch (error) {
    console.error('❌ Get permit error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get permits by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;
    
    const permits = await searchService.getPermitsByCategory(category, parseInt(limit));
    
    res.json({
      success: true,
      category,
      count: permits.length,
      permits
    });
  } catch (error) {
    console.error('❌ Category search error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await searchService.getAllCategories();
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('❌ Categories error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Import permit data (admin endpoint)
router.post('/import', async (req, res) => {
  try {
    console.log('🔄 Starting permit import...');
    const permits = await importer.importPermitsFromCSV();
    const stats = await importer.getImportStats();
    
    res.json({
      success: true,
      message: `Successfully imported ${permits.length} permits`,
      stats
    });
  } catch (error) {
    console.error('❌ Import error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
