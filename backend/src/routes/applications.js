const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../generated/prisma');
const { authenticate } = require('../middleware/auth');

const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticate);

// GET /api/applications — list current user's applications
router.get('/', async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user.userId },
      include: {
        permit: {
          select: { id: true, name: true, category: true, description: true, url: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      count: applications.length,
      applications: applications.map(app => ({
        id: app.id,
        status: app.status,
        applicantName: app.applicantName,
        applicantEmail: app.applicantEmail,
        applicantPhone: app.applicantPhone,
        businessName: app.businessName,
        businessAddress: app.businessAddress,
        projectDescription: app.projectDescription,
        additionalNotes: app.additionalNotes,
        submittedAt: app.submittedAt,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        permit: app.permit
      }))
    });
  } catch (error) {
    console.error('❌ Error fetching applications:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/applications/:id — get a single application
router.get('/:id', async (req, res) => {
  try {
    const application = await prisma.application.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.userId },
      include: {
        permit: {
          select: { id: true, name: true, category: true, description: true, url: true }
        }
      }
    });

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    res.json({ success: true, application });
  } catch (error) {
    console.error('❌ Error fetching application:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// All allowed application fields (besides permitId and userId)
const APPLICATION_FIELDS = [
  'applicantName', 'applicantEmail', 'applicantPhone', 'applicantDateOfBirth', 'mailingAddress',
  'propertyAddress', 'propertyUnit', 'propertyCity', 'propertyPostalCode', 'propertyWard',
  'propertyLegalDescription', 'propertyType',
  'businessName', 'businessTradeName', 'businessType', 'businessNumber',
  'incorporationNumber', 'businessPhone', 'businessEmail',
  'projectDescription', 'projectPurpose', 'projectStartDate', 'projectEndDate',
  'estimatedCost', 'squareFootage', 'numberOfStoreys',
  'contractorName', 'contractorPhone', 'contractorLicense', 'architectEngineer',
  'zoningConfirmed', 'insuranceProvider', 'insurancePolicyNumber',
  'previousPermitNumber', 'additionalNotes'
];

/**
 * Pick only allowed fields from the request body.
 * For string fields: use the value or null.
 * For boolean fields (zoningConfirmed): keep as boolean.
 */
function pickApplicationData(body) {
  const data = {};
  for (const field of APPLICATION_FIELDS) {
    if (body[field] !== undefined) {
      if (field === 'zoningConfirmed') {
        data[field] = Boolean(body[field]);
      } else {
        data[field] = body[field] || null;
      }
    }
  }
  return data;
}

// POST /api/applications — create a new application
router.post('/', async (req, res) => {
  try {
    const { permitId, applicantName, applicantEmail } = req.body;

    if (!permitId || !applicantName || !applicantEmail) {
      return res.status(400).json({
        success: false,
        error: 'permitId, applicantName, and applicantEmail are required'
      });
    }

    // Verify the user exists
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) {
      return res.status(401).json({ success: false, error: 'User account not found. Please log out and sign up again.' });
    }

    // Verify the permit exists
    const permit = await prisma.torontoPermit.findUnique({ where: { id: parseInt(permitId) } });
    if (!permit) {
      return res.status(404).json({ success: false, error: 'Permit not found' });
    }

    const fieldData = pickApplicationData(req.body);

    const application = await prisma.application.create({
      data: {
        userId: req.user.userId,
        permitId: parseInt(permitId),
        ...fieldData,
        applicantName,          // ensure required fields are always set
        applicantEmail,
        status: 'draft'
      },
      include: {
        permit: {
          select: { id: true, name: true, category: true, description: true, url: true }
        }
      }
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    console.error('❌ Error creating application:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/applications/:id — update a draft application
router.put('/:id', async (req, res) => {
  try {
    const existing = await prisma.application.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.userId }
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    if (existing.status !== 'draft') {
      return res.status(400).json({ success: false, error: 'Only draft applications can be edited' });
    }

    const {
      applicantName,
      applicantEmail,
    } = req.body;

    const updateData = pickApplicationData(req.body);
    // Ensure required fields aren't blanked out
    if (applicantName) updateData.applicantName = applicantName;
    if (applicantEmail) updateData.applicantEmail = applicantEmail;

    const application = await prisma.application.update({
      where: { id: parseInt(req.params.id) },
      data: updateData,
      include: {
        permit: {
          select: { id: true, name: true, category: true, description: true, url: true }
        }
      }
    });

    res.json({ success: true, application });
  } catch (error) {
    console.error('❌ Error updating application:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/applications/:id/submit — submit a draft application
router.post('/:id/submit', async (req, res) => {
  try {
    const existing = await prisma.application.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.userId }
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    if (existing.status !== 'draft') {
      return res.status(400).json({ success: false, error: 'Application has already been submitted' });
    }

    // Validate required fields before submission
    if (!existing.applicantName || !existing.applicantEmail) {
      return res.status(400).json({ success: false, error: 'Applicant name and email are required to submit' });
    }

    const application = await prisma.application.update({
      where: { id: parseInt(req.params.id) },
      data: {
        status: 'submitted',
        submittedAt: new Date()
      },
      include: {
        permit: {
          select: { id: true, name: true, category: true, description: true, url: true }
        }
      }
    });

    res.json({
      success: true,
      message: 'Application submitted successfully! Your application is now being reviewed.',
      application
    });
  } catch (error) {
    console.error('❌ Error submitting application:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/applications/:id — delete a draft application
router.delete('/:id', async (req, res) => {
  try {
    const existing = await prisma.application.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.userId }
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    if (existing.status !== 'draft') {
      return res.status(400).json({ success: false, error: 'Only draft applications can be deleted' });
    }

    await prisma.application.delete({ where: { id: parseInt(req.params.id) } });

    res.json({ success: true, message: 'Application deleted' });
  } catch (error) {
    console.error('❌ Error deleting application:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
