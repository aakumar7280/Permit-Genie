const express = require('express');
const router = express.Router();
const PermitSearchService = require('../../services/permitSearchService');
const TorontoPermitImporter = require('../../services/permitImporter');

const searchService = new PermitSearchService();
const importer = new TorontoPermitImporter();

// Search permits
router.get('/search', async (req, res) => {
  try {
    const { q: query, limit = 5 } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Query must be at least 2 characters long'
      });
    }
    
    const permits = await searchService.searchPermits(query, parseInt(limit));
    
    res.json({
      success: true,
      query,
      count: permits.length,
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
