import { TwitterApi } from 'twitter-api-v2';

export class TwitterService {
  /**
   * Initialize a client for a SPECIFIC user using their stored tokens
   * @param {string} accessToken - The user's specific access token from Firestore
  */
  getClientForUser(accessToken: any) {
    const client = new TwitterApi(accessToken);
    return client.readWrite;
  }

  /**
   * Post a tweet for a specific user
  */
  async sendUserTweet(accessToken: any, text: string) {
    try {
      const client = this.getClientForUser(accessToken);
      const { data: createdTweet } = await client.v2.tweet(text);
      return createdTweet;
    } catch (error) {
      // If error is 401, the token might be expired. 
      // This is where you'd use the Refresh Token.
      console.error('X API Error:', error);
      throw error;
    }
  }
}

export const twitterService = new TwitterService();