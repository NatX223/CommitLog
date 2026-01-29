import { DateTime } from 'luxon';
import { google } from '@ai-sdk/google';
import { generateText, tool, stepCountIs  } from 'ai';
import { dailyPostPrompt, weeklyPostPrompt } from '../constants.js';
import { getLatestCommits } from '../tools/github/commit_info_tool.js';
import { postTweet } from '../tools/post/x_post_tool.js';
import { recordHistory } from '../tools/record/record_history_tool.js';
import { firebaseService } from './firebaseService.js';
import userData from '../models/userSchema.js';
import postSchedule from '../models/postSchedule.js';
import { githubService } from './githubservice.js';
import { sdk } from './opikService.js';
import { OpikExporter } from 'opik-vercel';

// sdk.start();

export async function hourlyPosts() {
  sdk.start();
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
            - UserId: ${userId}
            - Repository: ${repo}
            - Timeframe: Last 1 day
            
            GOAL: Retrieve commits, write a post, publish it to X and record it in user history.
        `;

        const { text, steps } = await generateText({
            // model: google('gemini-3-pro-preview'),
            model: google('gemini-2.5-flash'),
            system: systemPrompt,
            
            // The prompt that kicks off the chain of events
            prompt: `Please check the latest commits for ${username}/${repo}, post a Build-in-Public update to X and record it in user history.`,

            experimental_telemetry: OpikExporter.getSettings({
              name: "daily-posts-trace",
            }),
            
            // Enable multi-step tool calls (The "Step Management")
            stopWhen: stepCountIs(5), 

            // 4. Tool Definitions
            tools: {
                getLatestCommits,
                postTweet,
                recordHistory
            },
        });

        // 5. Send response back to client
        // 'text' will contain the final response from the agent (e.g., "I've posted your update!")
        console.log('Agent finished:', text, steps);

        await sdk.shutdown();

      } catch (err) {
        console.error(`❌ Error in dailyPost for user ${userId}:`, err);
        // Important: We catch here so the loop continues for other users!
      }
    });

    // Wait for all users to finish
    await Promise.all(promises);

  } catch (error) {
    console.error("Critical Agent Error:", error);
    throw error; // Re-throw to alert Railway that the cron failed
  }
}

export async function weeklyPosts() {
  sdk.start();
  const now = DateTime.now().toUTC();
  const currentUtcHour = now.hour;
  const currentDayName = now.weekdayLong;

  console.log(`⏳ Starting Agent Batch for UTC Hour: ${currentUtcHour}:00`);

  try {
    const weeklyPosts = await firebaseService.queryDocuments<postSchedule>(
        'weeklyposts', 
        (collection) => collection
        .where('postUTCHour', '==', currentUtcHour)
        .where('day', '==', currentDayName)
    );

    if (weeklyPosts.length == 0) {
      console.log("💤 No users scheduled for this hour.");
      return;
    }

    console.log(`🚀 Found ${weeklyPosts.length} posts to process.`);

    const promises = weeklyPosts.map(async (post) => {
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
            ${weeklyPostPrompt}
            
            CURRENT CONTEXT:
            - User: ${username}
            - UserId: ${userId}
            - Repository: ${repo}
            - Timeframe: Last 7 days
            
            GOAL: Retrieve commits, write a post, and publish it to X and record it in user history.
        `;

        const { text, steps } = await generateText({
            // model: google('gemini-3-pro-preview'),
            model: google('gemini-2.5-flash'),
            system: systemPrompt,
            
            // The prompt that kicks off the chain of events
            prompt: `Please check the latest commits for ${username}/${repo} and post a Build-in-Public update to X and record it in user history.`,
            
            experimental_telemetry: OpikExporter.getSettings({
              name: "weekly-posts-trace",
            }),

            // Enable multi-step tool calls (The "Step Management")
            stopWhen: stepCountIs(5), 

            // 4. Tool Definitions
            tools: {
                getLatestCommits,
                postTweet,
                recordHistory
            },
        });

        // 5. Send response back to client
        // 'text' will contain the final response from the agent (e.g., "I've posted your update!")
        console.log('Agent finished:', text, steps);

        await sdk.shutdown();

      } catch (err) {
        console.error(`❌ Error in dailyPost for user ${userId}:`, err);
        // Important: We catch here so the loop continues for other users!
      }
    });

    // Wait for all users to finish
    await Promise.all(promises);    
  } catch (error) {
    console.error("Critical Agent Error:", error);
    throw error; // Re-throw to alert Railway that the cron failed    
  }
  
}