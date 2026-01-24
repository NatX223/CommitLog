import { hourlyPosts, weeklyPosts } from "./services/agentService.js";

async function run() {
  console.log("🤖 Agent Worker Starting...");
  await hourlyPosts();
  await weeklyPosts();
  console.log("✅ Agent Worker Finished.");
  process.exit(0); 
}

run();