import { tool } from 'ai';
import { z } from 'zod';
import { firebaseService } from '../../services/firebaseService.js';

export const recordHistory = tool({
  description: 'This tool gets the agent generated tweet and post link on X and saves them to history on the DB.',
  inputSchema: z.object({
    tweet: z.string().describe('The generated tweet'),
    userId: z.string().describe('The user id of the user'),
    tweetLink: z.string().describe('The link to the generated tweet'),
    subDocId: z.string().describe('The subdocument id of the history doc'),
  }),
  execute: async ({ tweet, userId, tweetLink, subDocId }) => {
    try {

      await firebaseService.addToSubcollection('users', userId, 'history', subDocId, { content: tweet, link: tweetLink, timestamp: new Date() });
      return {
        result: "post history saved successfully"
      }

    } catch (error) {
      console.error("Error in history recording tool:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return { error: `Failed to post tweet: ${errorMessage}` };
    }
  },
});