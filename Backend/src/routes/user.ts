import express from 'express';
import { firebaseService } from '../services/firebaseService.js';
import { userData, userSchedule } from '../models/userSchema.js';
import { githubService } from '../services/githubService.js';

const router = express.Router();

router.get('/api/user', async (req, res) => {
    const { userId } = req.query;

    // Validate userId parameter
    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'Valid userId is required' });
    }

    try {
        const userDoc = await firebaseService.getDocument<userData>('users', userId);
        const userSchedules = await firebaseService.getSubcollectionDocuments<userSchedule>('users', userId, 'schedules');

        if (!userDoc) {
            console.log("error");
            return res.status(404).json({ error: 'User not found' });
        }

        const username = userDoc.profile.displayName;
        const avatarUrl = userDoc.profile.avatarUrl;

        const hasGithub = !!userDoc.connectedAccounts?.github;
        const hasX = !!userDoc.connectedAccounts?.x;

        const userRepos = await githubService.getUserRepositories(userDoc.connectedAccounts.github?.accessToken!, username);

        const userData = {
            userId,
            username,
            avatarUrl,
            hasGithub,
            hasX,
            repos: userRepos,
            schedules: userSchedules
        };

        console.log("user data fetched successfully");

        res.status(200).json({ userData: userData });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
});

export default router;