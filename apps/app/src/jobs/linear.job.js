import { linearQueue } from '../loaders/bullmq.loader.js';
import { Worker } from "bullmq";
import { redisConnection } from "../loaders/redis.loader.js";
import { fetchTeamIssues, saveIssuesToDatabase, fetchCurrentCycle } from "../services/lib/linear.service.js";
import { createLinearCurrentCycle } from "../services/lib/cycle.service.js";


const processLinearJob = async (job) => {
    const { accessToken, linearTeamId, teamId, userId } = job.data;
    try {

        const issues = await fetchTeamIssues(accessToken, linearTeamId);
        await saveIssuesToDatabase(issues, linearTeamId, userId);
        const currentCycle = await fetchCurrentCycle(accessToken, linearTeamId);
        if (currentCycle){
            await createLinearCurrentCycle(currentCycle, linearTeamId);
        }
    } catch (error) {
        console.error('Error processing Linear job:', error);
        throw error;
    }
};

/**
 * Worker setup and event handling
 */
const linearWorker = new Worker('linearQueue', async (job) => {
    await processLinearJob(job);
}, {
    connection: redisConnection,
    concurrency: 5
});

/**
 * Event listener for job completion.
 * Logs the completion and removes the job from the queue.
 *
 * @param {Object} job - The completed job object.
 */
linearWorker.on('completed', async (job) => {
    console.log(`Job with id ${job.id} has been completed`);
    await job.remove();
});

/**
 * Event listener for job failure.
 * Logs the error message.
 *
 * @param {Object} job - The failed job object.
 * @param {Error} err - The error that caused the job to fail.
 */
linearWorker.on('failed', (job, err) => {
    console.error(`Job with id ${job.id} failed with error: ${err.message}`);
});

/**
 * Event listener for worker errors.
 * Logs Redis connection errors.
 *
 * @param {Error} err - The error object.
 */
linearWorker.on('error', (err) => {
    console.error('Redis connection error in linearWorker:', err);
});

export {
    linearQueue,
    linearWorker
};
