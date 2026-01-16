import { TwitterApi } from 'twitter-api-v2';
import { db } from '../config/firebase.js';

export class TwitterService {
  async getValidClient(userId) {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const { xConfig } = userDoc.data();

    // 1. Check if token is expired or about to expire (within 5 mins)
    const isExpired = Date.now() > (xConfig.expiresAt - 300000);

    if (isExpired) {
      console.log("🔄 X Token expired. Refreshing...");
      
      const client = new TwitterApi({
        clientId: process.env.X_CLIENT_ID,
        clientSecret: process.env.X_CLIENT_SECRET,
      });

      // 2. Perform the refresh
      const { client: refreshedClient, accessToken, refreshToken, expiresIn } = 
        await client.refreshOAuth2Token(xConfig.refreshToken);

      // 3. Update Firestore with new values immediately
      await userRef.update({
        'xConfig.accessToken': accessToken,
        'xConfig.refreshToken': refreshToken,
        'xConfig.expiresAt': Date.now() + expiresIn * 1000,
        'xConfig.updatedAt': Date.now(),
      });

      return refreshedClient.readWrite;
    }

    // 4. If not expired, just return a client with the current token
    const client = new TwitterApi(xConfig.accessToken);
    return client.readWrite;
  }

  async sendTweet(userId: any, text: string) {
    const client = await this.getValidClient(userId);
    return await client.v2.tweet(text);
  }
}

export const twitterService = new TwitterService();