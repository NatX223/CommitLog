import express from 'express';
import { firebaseService } from '../services/firebaseService.js';
import { FeedbackScorePublic, JsonListStringPublic, llmTask, opikClient } from '../services/opikService.js';
import { evaluate, EvaluateOptions, Hallucination, AnswerRelevance } from "opik";

const router = express.Router();


type DatasetItem = {
    input: JsonListStringPublic | undefined;
    output: JsonListStringPublic | undefined;
    feedbackScore: FeedbackScorePublic[] | undefined;
}

router.post('/api/feedback', async (req, res) => {
    const { userId, responseId, correctnessScore, featureScore, improvement } = req.body;

    try {
        await firebaseService.createDocument('feedback', {
            userId,
            correctnessScore,
            featureScore,
            improvement,
            timestamp: new Date()
        }, responseId);

        console.log("feedback recorded successfully");

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
        const traceIds = traces.map(trace => ({
          id: trace.id
        }));
        const commitLogDataset = await opikClient.getDataset<DatasetItem>("commitlog-baseline");

        opikClient.logTracesFeedbackScores([
          { id: traceIds[0].id!, name: "correctnes", value: correctnessScore },
          { id: traceIds[0].id!, name: "feature match", value: featureScore }
        ]);

        console.log(trace);

        if (correctnessScore >= 0.5 && featureScore >= 0.5) {      
          await commitLogDataset.insert(trace);
        }
        else{
          const hallucination = new Hallucination();
          const answerrelevance = new AnswerRelevance();

          const evaluationResult = await evaluate({
            dataset: commitLogDataset,
            task: llmTask, 
            scoringMetrics: [hallucination, answerrelevance], 
            projectName: "CommitLog", 
            experimentName: "CommitLogExperiment", 
            client: opikClient
          });
          console.log(`Experiment ID: ${evaluationResult.experimentId}`);
          console.log(`Total test cases: ${evaluationResult.testResults.length}`);
        }

        res.status(200).json({ message: 'Feedback recorded successfully' });

    } catch (error) {
        console.error('Error giving feedback:', error);
        res.status(500).json({ error: 'Failed to give feedback' });
    }
});

export default router;