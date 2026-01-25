import { TwitterApi } from 'twitter-api-v2';
import express from 'express';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { firebaseService } from '../services/firebaseService.js';

const router = express.Router();

const oauthStates = new Map<string, { timestamp: number, userId: string }>();

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

router.post('/api/auth/signin', async (req, res) => {
    try {
        const { userId, avatarUrl, email, displayName } = req.body;
        const userDoc = await firebaseService.getDocument('users', userId);
        if (userDoc) {
            console.log(`user ${userId} sign in`);
            
            // await firebaseService.updateDocument('users', userId, {
            //     'connectedAccounts.github': {
            //         accessToken
            //     },
            //     updatedAt: new Date()
            // });
    
            // await firebaseService.updateDocument('users', userId, {
            //     'profile.x': {
            //         avatarUrl
            //     }
            // });   
        } else {
            const userData = {
                id: userId,
                profile: {
                    displayName: displayName,
                    avatarUrl: avatarUrl,
                    email: email
                },
                createdAt: new Date(),
                updatedAt: new Date()
            }
            await firebaseService.createDocument('users', userData, userId);
        }
        res.json({ success: true });
    } catch (error) {
        console.error('❌ Error initiating signin:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to sign in',
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});

router.post('/api/auth/github', async (req, res) => {
    try {
        const { userId } = req.body;
        console.log("user id", userId);

        const user = await firebaseService.getDocument('users', userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found - create an account first'
            });
        }

        const state = randomUUID();
        oauthStates.set(state, {
            timestamp: Date.now(),
            userId
        });

        const clientId = process.env.GITHUB_CLIENT_ID!;
        const redirectUri = process.env.GITHUB_REDIRECT_URI!;
        const scope = 'repo read:user user:email';
        const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;

        // Return JSON response instead of redirecting
        res.json({
            success: true,
            redirectUrl: authUrl
        });

    } catch (error) {
        console.error('❌ Error initiating github OAuth:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to initiate github OAuth flow',
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});

router.get('/api/auth/callback/github', async (req, res) => {
    try {
        const { code, state } = req.query;

        if (!code || !state) {
            return res.status(400).json({
                success: false,
                error: 'Missing authorization code or state'
            });
        }

        const userId = oauthStates.get(state as string)?.userId;

        // Exchange code for access token
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: code as string
        }, {
            headers: {
                'Accept': 'application/json'
            }
        });

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) {
            return res.status(400).json({
                success: false,
                error: 'Failed to obtain access token'
            });
        }

        await firebaseService.updateDocument('users', userId!, {
            'connectedAccounts.github': {
                accessToken
            },
            updatedAt: new Date()
        });

        oauthStates.delete(state as string);
        console.log(`Successfully authenticated user ${userId} with GitHub`);

        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);

    } catch (error) {
        console.error('❌ Error in GitHub OAuth callback:', error);
        res.redirect(process.env.FRONTEND_URL!);
    }
});

router.post('/api/auth/x', async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await firebaseService.getDocument('users', userId);
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
            userId: userId
        };

        await firebaseService.createDocument('temp_auth', tempAuthData, state);

        // Return the OAuth URL instead of redirecting
        res.json({
            success: true,
            redirectUrl: url
        });

    } catch (error) {
        console.error('❌ Error initiating X OAuth:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to initiate X OAuth flow'
        });
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

        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (error) {
        console.error('X OAuth callback error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

export default router;