import express from 'express';
import { firebaseService } from '../services/firebaseService';

const router = express.Router();

// POST /api/waitlist - Add email to waitlist
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if email already exists in waitlist
    const existingEntry = await firebaseService.getDocumentByField('waitlist', 'email', email);
    if (existingEntry) {
      return res.status(409).json({
        success: false,
        message: 'This email is already on our waitlist'
      });
    }

    // Create waitlist entry
    const waitlistEntry = {
      email: email.toLowerCase().trim(),
      joinedAt: new Date().toISOString(),
      timestamp: Date.now(),
      status: 'pending',
      source: 'website'
    };

    // Save to Firebase
    const docId = await firebaseService.addDocument('waitlist', waitlistEntry);

    console.log(`New waitlist signup: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Successfully joined the waitlist!',
      data: {
        id: docId,
        email: waitlistEntry.email,
        joinedAt: waitlistEntry.joinedAt
      }
    });

  } catch (error) {
    console.error('Error adding to waitlist:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// GET /api/waitlist/count - Get waitlist count (optional endpoint for stats)
router.get('/count', async (req, res) => {
  try {
    const waitlistDocs = await firebaseService.getAllDocuments('waitlist');
    const count = waitlistDocs.length;

    res.json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error('Error getting waitlist count:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;