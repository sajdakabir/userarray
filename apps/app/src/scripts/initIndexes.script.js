import { Workspace } from "../models/lib/workspace.model.js";
import { db } from "../loaders/db.loader.js";

(async () => {
    try {
        console.log("Connecting to the database...");
        await db.asPromise();
        console.log("Database connected successfully");

        await Workspace.createIndexes();
        console.log("Indexes created successfully for the Workspace model");

        process.exit(0);
    } catch (error) {
        console.error("Error creating indexes:", error);
        process.exit(1);
    }
})();
