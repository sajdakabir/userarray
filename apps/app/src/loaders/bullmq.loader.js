import { Queue } from 'bullmq';
import { redisConnection } from './redis.loader.js';

const itemActivityQueue = new Queue('itemActivityQueue', {
    connection: redisConnection
});

const cycleQueue = new Queue('cycleQueue', {
    connection: redisConnection
});

console.log('Queues setup completed.');

export {
    itemActivityQueue,
    cycleQueue
};
