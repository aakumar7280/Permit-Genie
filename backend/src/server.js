const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const permitRoutes = require('./routes/permits');
const applicationRoutes = require('./routes/applications');
const savedPermitRoutes = require('./routes/savedPermits');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Permit Genie Backend Server is running!',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/permits', permitRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/saved-permits', savedPermitRoutes);

// API info endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Welcome to Permit Genie API!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile (requires auth)',
        test: 'GET /api/auth/test (requires auth)'
      },
      permits: {
        search: 'GET /api/permits/search?q=query&limit=5',
        byId: 'GET /api/permits/:id',
        byCategory: 'GET /api/permits/category/:category',
        categories: 'GET /api/permits/meta/categories',
        import: 'POST /api/permits/import'
      },
      projects: '/api/projects/* (coming soon)',
      documents: '/api/documents/* (coming soon)'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Permit Genie Backend Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
});

module.exports = app;
