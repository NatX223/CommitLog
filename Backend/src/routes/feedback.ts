import express from 'express';
import { firebaseService } from '../services/firebaseService.js';

const router = express.Router();

router.post('/api/feedback', async (req, res) => {
    const { userId, responseId, humaneScore, accuracyScore, improvement } = req.body;

    try {
        await firebaseService.createDocument('feedback', {
            userId,
            humaneScore,
            accuracyScore,
            improvement,
            timestamp: new Date()
        }, responseId);

        console.log("Schedule created successfully");

        res.status(200).json({ message: 'Feedback recorded successfully' });

    } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({ error: 'Failed to create schedule' });
    }
});

export default router;