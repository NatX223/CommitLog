import { tool } from 'ai';
import { z } from 'zod';
import { twitterService } from '../../services/xService.js';

export const postTweet = tool({
  description: 'This tool gets the agent generated tweet and posts it on X.',
  inputSchema: z.object({
    tweet: z.string().describe('The generated tweet'),
    userId: z.string().describe('The user id of the user who wants to post the tweet')
  }),
  execute: async ({ tweet, userId }) => {
    try {
      await twitterService.sendTweet(userId, tweet);

      return {
        result: "Tweet posted successfully"
      }

    } catch (error) {
      console.error("Error in twiterService tool:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return { error: `Failed to post tweet: ${errorMessage}` };
    }
  },
});