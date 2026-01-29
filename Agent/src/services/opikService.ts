import { OpikExporter } from "opik-vercel";
import { Opik } from "opik";
import dotenv from 'dotenv';
  
dotenv.config();

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
  