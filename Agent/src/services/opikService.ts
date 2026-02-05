import { OpikExporter } from "opik-vercel";
import { Opik, EvaluationTask } from "opik";
import { generateText, tool, stepCountIs  } from 'ai';
import { google } from '@ai-sdk/google';
import { GoogleGenAI } from "@google/genai";
import { trackGemini } from "opik-gemini";
import dotenv from 'dotenv';
import { getLatestCommits } from "../tools/github/commit_info_tool.js";

dotenv.config();

export type JsonListStringPublic = Record<string, unknown> | Record<string, unknown>[] | string;

declare const FeedbackScorePublicSource: {
  readonly Ui: "ui";
  readonly Sdk: "sdk";
  readonly OnlineScoring: "online_scoring";
};
type FeedbackScorePublicSource = (typeof FeedbackScorePublicSource)[keyof typeof FeedbackScorePublicSource];


export interface FeedbackScorePublic {
  name: string;
  categoryName?: string;
  value: number;
  reason?: string;
  source: FeedbackScorePublicSource;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  createdBy?: string;
  lastUpdatedBy?: string;
  valueByAuthor?: Record<string, ValueEntryPublic>;
}

declare const ValueEntryPublicSource: {
  readonly Ui: "ui";
  readonly Sdk: "sdk";
  readonly OnlineScoring: "online_scoring";
};
type ValueEntryPublicSource = (typeof ValueEntryPublicSource)[keyof typeof ValueEntryPublicSource];


interface ValueEntryPublic {
  value?: number;
  reason?: string;
  categoryName?: string;
  source?: ValueEntryPublicSource;
  lastUpdatedAt?: Date;
  spanType?: string;
  spanId?: string;
}


type DatasetItem = {
  input: JsonListStringPublic | undefined;
  output: JsonListStringPublic | undefined;
  feedbackScore: FeedbackScorePublic[] | undefined;
}

export const opikClient = new Opik({
    apiKey: process.env.OPIK_API_KEY,
    apiUrl: process.env.OPIK_URL_OVERRIDE,
    projectName: process.env.OPIK_PROJECT_NAME,
    workspaceName: process.env.OPIK_WORKSPACE,
});

export const traceExporter = new OpikExporter({
    client: opikClient,
    tags: ["hackathon", "commit-to-change"],
    metadata: {
      environment: "production",
      version: "0.1.0",
    //   team: "natx223",
    },
    // Optional: associate traces with a conversation thread
    // threadId: "conversation-123",
});

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const llmTask: EvaluationTask<DatasetItem> = async (datasetItem) => {
  const _prompt = datasetItem.input;
  // const trackedGenAI = trackGemini(genAI);

  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: 'user', parts: [{ text: String(_prompt) }] }]
  });

  console.log(response.text);

  return { output: response.text };
};