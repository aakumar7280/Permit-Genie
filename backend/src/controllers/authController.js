const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

// JWT secret (in production, this should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

// Register a new user
const register = async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    const { firstName, lastName, name, email, password, phoneNumber, companyName } = req.body;

    // Handle both name formats (split name if only name is provided)
    let first = firstName;
    let last = lastName;
    
    if (!firstName && !lastName && name) {
      const nameParts = name.trim().split(' ');
      first = nameParts[0];
      last = nameParts.slice(1).join(' ') || '';
    }

    console.log('Processed names - firstName:', first, 'lastName:', last);

    // Validate required fields
    if (!first || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user in database
    const newUser = await prisma.user.create({
      data: {
        firstName: first,
        lastName: last || '',
        email,
        password: hashedPassword,
        phoneNumber: phoneNumber || null,
        companyName: companyName || null,
      }
    });

    // Generate token
    const token = generateToken(newUser.id);

    // Return user data (without password)
    const userResponse = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber || '',
      companyName: newUser.companyName || '',
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during registration'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }

    // Find user by email in database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user data (without password)
    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      companyName: user.companyName || '',
      createdAt: user.createdAt
    };

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during login'
    });
  }
};

// Get user profile (protected route)
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Set by auth middleware

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Return user data (without password)
    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      companyName: user.companyName || '',
      createdAt: user.createdAt
    };

    res.json({
      status: 'success',
      data: {
        user: userResponse
      }
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Test route for authenticated users
const testAuth = (req, res) => {
  res.json({
    status: 'success',
    message: 'Authentication test successful',
    data: {
      userId: req.user.userId,
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = {
  register,
  login,
  getProfile,
  testAuth
};
