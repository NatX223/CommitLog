// import { processHourlyPosts } from "../lib/agent-logic";

async function run() {
  console.log("🤖 Agent Worker Starting...");
  await processHourlyPosts();
  console.log("✅ Agent Worker Finished.");
  process.exit(0); 
}

run();