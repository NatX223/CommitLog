import { TwitterApi } from 'twitter-api-v2';
import { firebaseService } from './firebaseService.js';
import userData from "../models/userSchema.js";

export class TwitterService {
  async getValidClient(userId: string) {
    const userDoc = await firebaseService.getDocument<userData>('users', userId);
    if (!userDoc) {
      throw new Error(`User with ID ${userId} not found`);
    }
    if (!userDoc.connectedAccounts.x) {
      throw new Error(`User ${userId} does not have X account connected`);
    }
    const xConfig = userDoc.connectedAccounts.x;

    // 1. Check if token is expired or about to expire (within 5 mins)
    const isExpired = Date.now() > (xConfig.expiresAt - 300000);

    if (isExpired) {
      console.log("🔄 X Token expired. Refreshing...");

      const client = new TwitterApi({
        clientId: process.env.X_CLIENT_ID!,
        clientSecret: process.env.X_CLIENT_SECRET,
      });

      // 2. Perform the refresh
      const { client: refreshedClient, accessToken, refreshToken, expiresIn } =
        await client.refreshOAuth2Token(xConfig.refreshToken);

      // 3. Update Firestore with new values immediately
      await firebaseService.updateDocument('users', userId, {
        'connectedAccounts.x.accessToken': accessToken,
        'connectedAccounts.x.refreshToken': refreshToken,
        'connectedAccounts.x.expiresAt': Date.now() + expiresIn * 1000,
        'connectedAccounts.x.updatedAt': Date.now(),
      });

      return refreshedClient.readWrite;
    }

    // 4. If not expired, just return a client with the current token
    const client = new TwitterApi(xConfig.accessToken);
    return client.readWrite;
  }

  async sendTweet(userId: any, text: string) {
    const client = await this.getValidClient(userId);
  
    try {
      const { data: createdTweet } = await client.v2.tweet(text);
  
      return {
        id: createdTweet.id,
        text: createdTweet.text,
        url: `https://x.com/i/status/${createdTweet.id}`
      };
    } catch (error) {
      console.error("❌ Failed to send tweet:", error);
      throw error;
    }
  }
}

export const twitterService = new TwitterService();