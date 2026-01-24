import { hourlyPosts } from "./services/agentService";

async function run() {
  console.log("🤖 Agent Worker Starting...");
  await hourlyPosts();
  console.log("✅ Agent Worker Finished.");
  process.exit(0); 
}

run();