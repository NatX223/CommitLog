import express from 'express';
import { firebaseService } from '../services/firebaseService.js';
import userData from '../models/userSchema.js';
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

        if (!userDoc) {
            console.log("error");
            return res.status(404).json({ error: 'User not found' });
        }

        const username = userDoc.profile.displayName;
        const avatarUrl = userDoc.profile.avatarUrl;

        const hasGithub = !!userDoc.connectedAccounts?.github;
        const hasX = !!userDoc.connectedAccounts?.x;

        const userRepos = githubService.getUserRepositories(username);

        const userData = {
            userId,
            username,
            avatarUrl,
            hasGithub,
            hasX,
            repos: userRepos
        };

        console.log("Schedule created successfully");
        console.log(userRepos);

        res.status(200).json({ userData: userData });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
});

export default router;