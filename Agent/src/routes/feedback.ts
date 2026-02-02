import express from 'express';
import { firebaseService } from '../services/firebaseService.js';
import { opikClient } from '../services/opikService.js';

const router = express.Router();

router.post('/api/feedback', async (req, res) => {
    const { userId, responseId, score, improvement } = req.body;

    try {
        await firebaseService.createDocument('feedback', {
            userId,
            score,
            improvement,
            timestamp: new Date()
        }, responseId);

        console.log("feedback recorded successfully");

        if (score >= 0.5) {
          const traceTag = Number(responseId);
          const traces = await opikClient.searchTraces({
            projectName: "CommitLog",
            maxResults: 1,
              
            filterString: `tags contains ${traceTag}`
          });
            
          const trace = traces.map(trace => ({
            input: trace.input,
            output: trace.output,
            feedbackScore: trace.feedbackScores
          }));
          const commitLogDataset = await opikClient.getDataset("commitlog-baseline");

          await commitLogDataset.insert(trace);
        }

        res.status(200).json({ message: 'Feedback recorded successfully' });

    } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({ error: 'Failed to create schedule' });
    }
});

export default router;