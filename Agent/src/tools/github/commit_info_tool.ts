import { tool } from 'ai';
import { z } from 'zod';
import { githubService } from '../../services/githubservice.js';

export const getLatestCommits = tool({
  description: 'Fetch the latest commit messages and metadata for a user across all their repositories.',
  inputSchema: z.object({
    username: z.string().describe('The GitHub username'),
    repo: z.string().describe('The project name'),
    days: z.number().default(1).describe('How many days back to look for activity'),
  }),
  execute: async ({ username, repo, days }) => {
    try {
      const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const commits = await githubService.getUserCommitsSince(username, sinceDate, repo);

      if (!commits || commits.length === 0) {
        return {
          message: `No commits found in the last day.`,
          post: false
        };
      }

      const formattedCommits = commits.slice(0, 10).map(c => ({
        project: repo,
        message: c.commit.message,
        date: c.commit.author.date,
        author: c.commit.author.name
      }));

      return {
        count: commits.length,
        latestCommits: formattedCommits
      };

    } catch (error) {
      console.error("Error in getLatestCommits tool:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return { error: `Failed to fetch latest commits: ${errorMessage}` };
    }
  },
});