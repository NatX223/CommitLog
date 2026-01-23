import express from 'express';
import { firebaseService } from '../services/firebaseService.js';
import userData from '../models/userSchema.js';

const router = express.Router();

router.post('/api/createSchedule', async (req, res) => {
    const { userId, repo, schedule } = req.body;

    try {
        // Get user's display name from users collection
        const userDoc = await firebaseService.getDocument<userData>('users', userId);
        console.log(userId, repo, schedule);
        
        if (!userDoc) {
            console.log("error");
            return res.status(404).json({ error: 'User not found' });
        }
        
        const username = userDoc.profile.displayName;
        const scheduleData = {
            userId,
            username,
            repo
        };

        // Save to appropriate collections based on schedule type
        if (schedule.length == 2) {
            await firebaseService.createDocument('dailyposts', scheduleData);
            await firebaseService.createDocument('weeklyposts', scheduleData);
        }

        if (schedule.length == 1) {
            if (schedule[0] === 'daily') {
                await firebaseService.createDocument('dailyposts', scheduleData);
                await firebaseService.addToSubcollection('users', userId, 'schedule', { repo: repo, type: schedule[0] });
            }
            if (schedule[0] === 'weekly') {
                await firebaseService.createDocument('weeklyposts', scheduleData);
                await firebaseService.addToSubcollection('users', userId, 'schedule', { repo: repo, type: schedule[0] });
            }          
        }
        
        if (schedule === 'weekly' || schedule === 'both') {
            await firebaseService.createDocument('weeklyposts', scheduleData);
            await firebaseService.addToSubcollection('users', userId, 'schedule', { repo: repo, type: 'daily and weekly' });
        }

        console.log("Schedule created successfully");
        
        res.status(200).json({ message: 'Schedule created successfully' });
    } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({ error: 'Failed to create schedule' });
    }
})

export default router;