# CommitLog

# FlareSec

Your build in public co-pilot

---

## Live Link - https://commitlog.io

## Pitch Deck - https://pitch.com/v/commitlog-6ryrvd/

## Demo - https://www.loom.com/share/8da0e3537254418ea65b5259ea55e4d4

## Table of Contents

1. [Overview](#overview)
2. [Problem Statement](#problem-statement)
3. [Solution](#solution)
4. [How It Works](#how-it-works)
5. [Technologies Used](#technologies-used)
6. [Setup and Deployment](#setup-and-deployment)
7. [Future Improvements](#future-improvements)
8. [Acknowledgments](#acknowledgments)

---

## Overview

CommitLog is an AI agent co-pilot built for developers who struggle with the friction and 
inconsistency of building in public. By integrating directly into your workflow to track 
GitHub commits and developer activity, the agent automatically synthesizes raw progress into 
engaging, metric-driven social media posts. It can also be used by start ups and teams to 
keep their audience updated on their build process by transforming their git commit history 
into a consistent stream of social updates so they can stay focused entirely on the 
building aspect.

---

## Problem Statement

While building in public is a proven growth strategy, most developers suffer from an Invisibility Tax due to the hassle of self-promotion. 
Many "newbie" developers and even "cracked" engineers feel a natural social shyness or "cringe" when talking about their own work, 
leading to a silent build process that goes unnoticed. Others are simply too consumed by the deep-work cycle to maintain a consistent social presence. 
This lack of visibility results in a devastating "Opportunity Gap"—where brilliant software and developers fails to gain the attention from potential
users, employers and customers they deserve.

---

## Solution

CommitLog is an AI-powered agent designed to bridge the gap between technical execution and social presence. 
By directly tethering to your development environment, CommitLog automates the "Build in Public" workflow, 
transforming raw code changes into high-impact social proof without requiring a single context switch.
It does this by connecting your selec

---

## How It Works

The working mechanism of the agent can be broken down into 3 steps

1. **Onboarding & Integration**:
   - Users authenticate via Google OAuth, which instantly initializes their profile.
   - Users link their GitHub (for data retrieval) and X/Twitter (for posting) accounts using restricted-scope permissions..
2. **Personalized Scheduling**:
   - Selection of the specific repository the agent should monitor for that schedule.
   - Users define a custom posting rhythm (e.g., "Every Tuesday and Thursday at 10:00 AM").
3. **Hourly Cron**:
   - A background worker (Cron) triggers every hour to check the global schedule database.
   - If a user’s schedule matches the current window, the agent fetches git commit history, analyzes the technical delta, and uses a specialized prompt to synthesize an engaging tweet.
   - The tweet is posted on X, complete with metric-driven insights.

---

## Technologies Used

| **Technology**    | **Purpose**                                             |
| ----------------- | ------------------------------------------------------- |
| **Opik**          | Trace logging, Dataset creation and agent evaluation.   |
| **Vercel AI SDK** | Agent framework.                                        |
| **Gemini**        | Agent LLM.                                              |
| **Github API**    | Fetching user commits.                                  |
| **X API**         | Posting to X.                                           |

### Opik

In order to build CommitLog, Opik from Comet was utilized for tracing and evaluation.
The section below highlights how Opik was used.

- Trace Logging - We used the trace and span logging capability from Opik to log and track every agent response (post content) and the 
  tools called for every run.
  The logging of tools called was especially useful as it helped us debug agent runs when the tools weren't properly called.
  Below shows how it was utilized in the code.

```typescript
  const traceExporter = new OpikExporter({
    client: opikClient,
    tags: ["hackathon", "commit-to-change", secureId],
    metadata: {
      environment: "production",
      version: "0.1.0",
    //   team: "natx223",
    }
  });

  const sdk = new NodeSDK({
    traceExporter: traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();

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

  console.log('Agent finished:', text, steps);

  await sdk.shutdown();
```
The full code for the use of trace logging can be found [here](https://github.com/NatX223/CommitLog/blob/main/Agent/src/services/agentService.ts).

- User Feadback Scoring - CommitLog cares about user feedback and we used Opik to log and score traces(agent responses).
  The code below highlights how this was done.

```typescript
  opikClient.logTracesFeedbackScores([
    { id: traceIds[0].id!, name: "correctnes", value: correctnessScore },
    { id: traceIds[0].id!, name: "feature match", value: featureScore }
  ]);
```
The full code for the use of user feadback scoring can be found [here](https://github.com/NatX223/CommitLog/blob/main/Agent/src/routes/feedback.ts).

- Dataset creation - In order to run evaluations, a dataset is needed and this handled by inserting positively scored traces into the 
  created dataset. This is to have accurate and informative dataset items to run evaluations against.
  Below is a code snippet showing how this handled.
```typescript
  async function createDataset() {
    try {
        await opikClient.createDataset(
            "commitlog-baseline",
            "A dataset to track ideal changelog and feature posts/reports"
        );
        console.log("Dataset created successfully");
        
    } catch (error) {
        console.log(error);
    }
  }
```
The full code for the use of dataset creation can be found [here](https://github.com/NatX223/CommitLog/blob/main/Agent/src/Opik/dataset.ts).

```typescript
  if (correctnessScore >= 0.5 && featureScore >= 0.5) {      
    await commitLogDataset.insert(trace);
  }
```
The full code for the use of dataset item inserting can be found [here](https://github.com/NatX223/CommitLog/blob/main/Agent/src/routes/feedback.ts).

- Agent Evaluation - We also used Opik for agent evaluation everytime everytime we encountered any low user feedback score, we used   
  this approach so the agent is frequently evaluated and optimized.
  Below is the code for the agent evaluation after a low user feedback score.
```typescript
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
```
The full code for the use of agent evaluation can be found [here](https://github.com/NatX223/CommitLog/blob/main/Agent/src/routes/feedback.ts).

- Prompt optimization - We also used Opik for prompt evaluation, this was done on the Opik dashboard.

The images below show operations done on the dashboard

Project - 
![project](/project.png)

Dashboard -
![dasboard1](/dashboard1.png)
![dasboard2](/dashboard2.png)

Trace Logging - 
![tracelogging](/tracelogging.png)

Prompt Optimization - 
![promptoptimization](/promptoptimization.png)

### Vercel AI SDK

The agent was created using the vercel AI SDK, this was chosen because of its ease of use and the ability to easily integrate with 
multiple LLMs. We used the Opik-Vercel package with Open telementary to log traced from the generateText function(main reasoning and 
tool calling function).
Below is the code showing how we used this:
```typescript
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

  console.log('Agent finished:', text, steps);

  await sdk.shutdown();
```
The full code for the use of Vercel AI SDK can be found [here](https://github.com/NatX223/CommitLog/blob/main/Agent/src/routes/feedback.ts).

### Gemini

We used the 2.5 flash model for the agent, this was chosen because of its speed and cost effectiveness.

### Github and X APIs

We used these APIs to fetch commit data and post to X.

## Setup and Deployment

### Prerequisites

- Node.js v21+
- Opik account
- Gemini API key
- Github API key
- X API key


### Local Setup

The repository has to be cloned first

```bash
  git clone https://github.com/NatX223/CommitLog
```

- Backend

1. Navigate to the Agent directory:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```
PORT=3300
CRED=
GOOGLE_GENERATIVE_AI_API_KEY=
X_CLIENT_ID=
X_CLIENT_SECRET=
OPIK_API_KEY=
OPIK_URL_OVERRIDE=
OPIK_PROJECT_NAME=
OPIK_WORKSPACE=
OPENAI_API_KEY=
```

4. Build the project:

```bash
npm run build
```

5. Deploy locally:

```bash
npm run dev
```

- Backend

1. Navigate to the Backend directory:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```
PORT=3300
CRED=
X_CLIENT_ID=
X_CLIENT_SECRET=
X_CALLBACK_URL=/api/auth/callback/x
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_REDIRECT_URI=/api/auth/callback/github
FRONTEND_URL=
```

4. Build the project:

```bash
npm run build
```

5. Deploy locally:

```bash
npm run dev
```

- App(frontend)

1. Navigate to the frontend directory:

```bash
cd commitlog-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```
LOCAL_BACKEND_URL=http://localhost:3300
NEXT_PUBLIC_BACKEND_URL=
NEXT_PUBLIC_AGENT_URL=
BACKEND_URL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

4. Build the project:

```bash
npm run build
```

5. Deploy locally:

```bash
npm run dev
```


---

## Future Improvements

1. Adding support for more platforms(Gitlab and LinkedIn)
2. Detting more users.
3. further optimizing the agent and prompts.

---

## Acknowledgments

Special thanks to **Commit to Change** organizers: Comet and Encode. Opik played a pivotal role in building CommitLog with it's observability and evaluation capabilities.
