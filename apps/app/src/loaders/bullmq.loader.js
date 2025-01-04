import { Queue } from 'bullmq';
import { redisConnection } from './redis.loader.js';

export const itemActivityQueue = new Queue('itemActivityQueue', {
    connection: redisConnection
});

export const cycleQueue = new Queue('cycleQueue', {
    connection: redisConnection
});

export const linearQueue = new Queue('linearQueue', {
    connection: redisConnection
});


console.log('Queues setup completed.');
