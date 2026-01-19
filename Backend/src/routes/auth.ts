import { TwitterApi } from 'twitter-api-v2';
import express from 'express';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { firebaseService } from '../services/firebaseService';

const router = express.Router();

const oauthStates = new Map<string, { walletAddress: string; provider: string; timestamp: number }>();

setInterval(() => {
    const now = Date.now();
    for (const [state, data] of oauthStates.entries()) {
        if (now - data.timestamp > 10 * 60 * 1000) {
            oauthStates.delete(state);
        }
    }
}, 5 * 60 * 1000);

interface tempAuth {
    codeVerifier: string;
    userId: any;
}

const client = new TwitterApi({
    clientId: process.env.X_CLIENT_ID!,
    clientSecret: process.env.X_CLIENT_SECRET
});

router.post('/api/auth/x', async (req, res) => {
    try {
        const { githubId } = req.body;

        const user = await firebaseService.getDocument('user', githubId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found - connect your github first'
            });
        }

        // 1. Generate Auth Link + PKCE Verifier
        const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
            process.env.X_CALLBACK_URL!,
            { scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'] }
        );

        const tempAuthData = {
            codeVerifier, 
            userId: githubId
        };

        await firebaseService.createDocument('temp_auth', tempAuthData, state);

        res.redirect(url);

    } catch (error) {

    }
});

router.get('/api/auth/callback/x', async (req, res) => {
    try {
        const { state, code } = req.query;

        if (!state || !code || typeof state !== 'string' || typeof code !== 'string') {
            return res.status(400).json({ error: 'Invalid callback parameters' });
        }

        const snap = await firebaseService.getDocument<tempAuth>('temp_auth', state);

        if (!snap) {
            return res.status(400).json({ error: 'Invalid or expired auth state' });
        }

        const { codeVerifier, userId } = snap;

        // const client = new TwitterApi({
        //     clientId: process.env.X_CLIENT_ID!,
        //     clientSecret: process.env.X_CLIENT_SECRET
        // });

        const { accessToken, refreshToken, expiresIn } = await client.loginWithOAuth2({
            code,
            codeVerifier,
            redirectUri: process.env.X_CALLBACK_URL!,
        });

        await firebaseService.updateDocument('users', userId, {
            'connectedAccounts.x': {
                accessToken,
                refreshToken,
                tokenType: 'bearer',
                updatedAt: Date.now(),
                expiresAt: Date.now() + expiresIn * 1000,
            },
            updatedAt: new Date()
        });

        await firebaseService.deleteDocument('temp_auth', state);

        res.send("Successfully connected X! You can close this window.");
    } catch (error) {
        console.error('X OAuth callback error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

export default router;