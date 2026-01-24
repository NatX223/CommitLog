import { Router } from 'express';
import { google } from '@ai-sdk/google';
import { generateText, tool, stepCountIs  } from 'ai';
import { dailyPostPrompt } from '../constants.js';
import { getLatestCommits } from '../tools/github/commit_info_tool.js';
import { postTweet } from '../tools/post/x_post_tool.js';

const router = Router();

router.get('/agent/dailyPost', async (req, res) => {
    // Hardcoded for testing as per your snippet, but easily swappable for query params
    const username = "NatX223";
    const repo = "CommitLog";
    const days = 1;

    try {
        // 2. Construct the dynamic system prompt
        // merging the base personality with specific context
        const systemPrompt = `
            ${dailyPostPrompt}
            
            CURRENT CONTEXT:
            - User: ${username}
            - Repository: ${repo}
            - Timeframe: Last ${days} day(s)
            
            GOAL: Retrieve commits, write a post, and publish it to X.
        `;

        // 3. The Agent Workflow
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
        console.log('Agent finished:', text);
        res.json({ 
            success: true, 
            message: text,
            steps: steps.length 
        });

    } catch (error) {
        console.error('Error in dailyPost agent:', error);
        res.status(500).json({ error: 'Failed to run agent workflow' });
    }
});

export default router;