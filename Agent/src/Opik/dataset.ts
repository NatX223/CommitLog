import { opikClient } from "../services/opikService";

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

createDataset();