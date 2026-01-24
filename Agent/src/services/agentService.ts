import { DateTime } from 'luxon';
import { google } from '@ai-sdk/google';
import { generateText, tool, stepCountIs  } from 'ai';
import { dailyPostPrompt } from '../constants.js';
import { getLatestCommits } from '../tools/github/commit_info_tool.js';
import { postTweet } from '../tools/post/x_post_tool.js';
import { firebaseService } from './firebaseService.js';
import userData from '../models/userSchema.js';
import postSchedule from '../models/postSchedule.js';
import { githubService } from './githubservice.js';

export async function hourlyPosts() {
  const currentUtcHour = new Date().getUTCHours();

  console.log(`⏳ Starting Agent Batch for UTC Hour: ${currentUtcHour}:00`);

  try {
    const hourPosts = await firebaseService.queryDocuments<postSchedule>(
        'dailyposts', 
        (collection) => collection
        .where('postUTCHour', '==', currentUtcHour)
    );

    if (hourPosts.length == 0) {
      console.log("💤 No users scheduled for this hour.");
      return;
    }

    console.log(`🚀 Found ${hourPosts.length} posts to process.`);

    const promises = hourPosts.map(async (post) => {
      const userId = post.userId;
      const repo = post.repo;

      // get accessToken
      const userData: userData | null = await firebaseService.getDocument('users', userId);
      const accessToken = userData?.connectedAccounts?.github?.accessToken;
      const user = await githubService.getUserByToken(accessToken!);
      const username = user?.login;

      try {
        console.log(`Processing user: ${userId}`);

        const systemPrompt = `
            ${dailyPostPrompt}
            
            CURRENT CONTEXT:
            - User: ${username}
            - Repository: ${repo}
            - Timeframe: Last 1 day
            
            GOAL: Retrieve commits, write a post, and publish it to X.
        `;

        const { text, steps } = await generateText({
            // model: google('gemini-3-pro-preview'),
            model: google('gemini-2.5-flash'),
            system: systemPrompt,
            
            // The prompt that kicks off the chain of events
            prompt: `Please check the latest commits for ${username}/${repo} and post a Build-in-Public update to X.`,
            
            // Enable multi-step tool calls (The "Step Management")
            stopWhen: stepCountIs(5), 

            // 4. Tool Definitions
            tools: {
                getLatestCommits,
                postTweet
            },
        });

        // 5. Send response back to client
        // 'text' will contain the final response from the agent (e.g., "I've posted your update!")
        console.log('Agent finished:', text, steps);

      } catch (err) {
        console.error(`❌ Error in dailyPost for user ${userId}:`, err);
        // Important: We catch here so the loop continues for other users!
      }
    });

    // Wait for all users to finish
    await Promise.all(promises);

  } catch (error) {
    console.error("🔥 Critical Agent Error:", error);
    throw error; // Re-throw to alert Railway that the cron failed
  }
}