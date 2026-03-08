const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../generated/prisma');
const { authenticate } = require('../middleware/auth');

const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticate);

// GET /api/saved-permits — list saved permits for current user
router.get('/', async (req, res) => {
  try {
    const saved = await prisma.savedPermit.findMany({
      where: { userId: req.user.userId },
      include: { permit: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, savedPermits: saved });
  } catch (err) {
    console.error('Error fetching saved permits:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch saved permits' });
  }
});

// GET /api/saved-permits/check/:permitId — check if a permit is saved
router.get('/check/:permitId', async (req, res) => {
  try {
    const existing = await prisma.savedPermit.findUnique({
      where: {
        userId_permitId: {
          userId: req.user.userId,
          permitId: parseInt(req.params.permitId),
        },
      },
    });
    res.json({ success: true, saved: !!existing });
  } catch (err) {
    console.error('Error checking saved permit:', err);
    res.status(500).json({ success: false, error: 'Failed to check saved status' });
  }
});

// POST /api/saved-permits — save a permit
router.post('/', async (req, res) => {
  try {
    const { permitId } = req.body;
    if (!permitId) {
      return res.status(400).json({ success: false, error: 'permitId is required' });
    }

    // Check if already saved
    const existing = await prisma.savedPermit.findUnique({
      where: {
        userId_permitId: {
          userId: req.user.userId,
          permitId: parseInt(permitId),
        },
      },
    });

    if (existing) {
      return res.json({ success: true, savedPermit: existing, message: 'Already saved' });
    }

    const savedPermit = await prisma.savedPermit.create({
      data: {
        userId: req.user.userId,
        permitId: parseInt(permitId),
      },
      include: { permit: true },
    });

    res.status(201).json({ success: true, savedPermit });
  } catch (err) {
    console.error('Error saving permit:', err);
    res.status(500).json({ success: false, error: 'Failed to save permit' });
  }
});

// DELETE /api/saved-permits/:permitId — unsave a permit
router.delete('/:permitId', async (req, res) => {
  try {
    await prisma.savedPermit.delete({
      where: {
        userId_permitId: {
          userId: req.user.userId,
          permitId: parseInt(req.params.permitId),
        },
      },
    });
    res.json({ success: true, message: 'Permit unsaved' });
  } catch (err) {
    // If record doesn't exist, that's fine
    if (err.code === 'P2025') {
      return res.json({ success: true, message: 'Already unsaved' });
    }
    console.error('Error unsaving permit:', err);
    res.status(500).json({ success: false, error: 'Failed to unsave permit' });
  }
});

module.exports = router;
