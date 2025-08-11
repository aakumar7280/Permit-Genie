const express = require('express');
const { register, login, getProfile, testAuth } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', authenticate, getProfile);
router.get('/test', authenticate, testAuth);

module.exports = router;
