// import { Space } from "../models/lib/space.model.js";
// import { Cycle } from "../models/lib/cycle.model.js";
// import { Item } from "../models/lib/item.model.js";
// import { createCycle } from "../services/lib/cycle.service.js";
// import { cycleQueue } from "../loaders/bullmq.loader.js";
// import { Worker } from "bullmq";
// import { redisConnection } from "../loaders/redis.loader.js";

// const transferWorkItems = async (incompleteItems, activeCycle) => {
//     try {
//         for (const item of incompleteItems) {
//             item.cycles = [activeCycle._id];
//             await item.save();
//         }
//     } catch (error) {
//         console.error('Error transferring work items:', error);
//     }
// };

// const createActiveCycleForSpace = async (spaceId, startDate) => {
//     try {
//         let activeCycle = await Cycle.findOne({
//             space: spaceId,
//             startDate: { $gte: startDate },
//             isArchived: false,
//             isDeleted: false
//         }).sort({ startDate: 1 });

//         if (!activeCycle) {
//             const endDate = new Date(startDate);
//             endDate.setDate(endDate.getDate() + 6);

//             activeCycle = new Cycle({
//                 space: spaceId,
//                 startDate,
//                 endDate,
//                 isArchived: false,
//                 isDeleted: false
//             });

//             await activeCycle.save();
//             console.log("Active cycle created");
//         }
//         return activeCycle;
//     } catch (error) {
//         console.error('Error creating or getting active cycle:', error);
//         return null;
//     }
// };

// const findSpacesWithCycleEndingToday = async (today) => {
//     try {
//         // Find cycles ending today
//         const cyclesEndingToday = await Cycle.find({
//             endDate: today
//         });

//         console.log("cyclesEndingToday: ", cyclesEndingToday);

//         for (const cycle of cyclesEndingToday) {
//             const incompleteItems = await Item.find({
//                 cycles: cycle._id,
//                 status: { $ne: 'done' },
//                 isArchived: false,
//                 isDeleted: false
//             });
//             console.log("incompleteItems: ", incompleteItems);

//             const activeCycle = await createActiveCycleForSpace(cycle.space, today);

//             console.log("activeCycle: ", activeCycle);
//             await transferWorkItems(incompleteItems, activeCycle);
//         }

//         const spaceIds = cyclesEndingToday.map(cycle => cycle.space);
//         const spaces = await Space.find({
//             _id: { $in: spaceIds }
//         });

//         return spaces;
//     } catch (error) {
//         console.error('Error finding spaces with cycles ending today:', error);
//         return [];
//     }
// };

// const processCycleJob = async () => {
//     try {
//         console.log('Job started...');

//         const today = new Date();
//         today.setUTCHours(0, 0, 0, 0);

//         console.log('today: ', today);

//         const spaces = await findSpacesWithCycleEndingToday(today);

//         for (const space of spaces) {
//             const startDate = new Date(today);
//             startDate.setDate(today.getDate() + 7);

//             const endDate = new Date(startDate);
//             endDate.setDate(startDate.getDate() + 6);

//             // const existingCycle = await Cycle.findOne({
//             //     space: space._id,
//             //     startDate: { $eq: startDate },
//             //     endDate: { $eq: endDate },
//             //     isArchived: false,
//             //     isDeleted: false
//             // });
//             await createCycle({
//                 startDate,
//                 endDate,
//                 space: space._id,
//                 workspace: space.workspace
//             });
//         }
//         console.log('Job ended');
//     } catch (error) {
//         console.error('Error creating cycles:', error);
//     }
// };

// const cycleWorker = new Worker('cycleQueue', async (job) => {
//     console.log("Worker processing job...");
//     await processCycleJob();
// }, { connection: redisConnection });

// const scheduleCycleCreation = () => {
//     console.log("Scheduling job...");
//     cycleQueue.add('createCycle', {}, {
//         repeat: {
//             cron: '0 0 * * *',
//             tz: 'UTC'
//         },
//         removeOnComplete: true
//     }).then(() => {
//         console.log('Job scheduled successfully');
//     }).catch((error) => {
//         console.error('Error scheduling job:', error);
//     });
// };

// export {
//     scheduleCycleCreation,
//     cycleWorker
// };

import { Space } from "../models/lib/space.model.js";
import { Cycle } from "../models/lib/cycle.model.js";
import { Item } from "../models/lib/item.model.js";
import { createCycle } from "../services/lib/cycle.service.js";
import { cycleQueue, itemActivityQueue } from "../loaders/bullmq.loader.js";
import { Worker } from "bullmq";
import { redisConnection } from "../loaders/redis.loader.js";

const transferWorkItems = async (incompleteItems, activeCycle) => {
    try {
        for (const item of incompleteItems) {
            console.log("hi i am working");
            item.cycles = [activeCycle._id];
            await itemActivityQueue.add('issueActivityQueue', {
                type: 'item.activity.updated',
                requestedData: { cycles: [activeCycle._id] },
                currentInstance: item,
                item: item._id,
                space: item.space,
                workspace: item.space,
                // actor: "march bot",
                notification: true
            });
            await item.save();
        }
    } catch (error) {
        console.error('Error transferring work items:', error);
    }
};

const createActiveCycleForSpace = async (spaceId, startDate) => {
    try {
        let activeCycle = await Cycle.findOne({
            space: spaceId,
            startDate: { $gte: startDate },
            isArchived: false,
            isDeleted: false
        }).sort({ startDate: 1 });

        if (!activeCycle) {
            console.log("Active cycle not found so i am creating");
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 6);
            endDate.setUTCHours(23, 59, 59, 999); // Set endDate to 11:59 PM

            activeCycle = new Cycle({
                space: spaceId,
                startDate,
                endDate,
                isArchived: false,
                isDeleted: false
            });

            await activeCycle.save();
            console.log("Active cycle created");
        }
        return activeCycle;
    } catch (error) {
        console.error('Error creating or getting active cycle:', error);
        return null;
    }
};

const findSpacesWithCycleEndingToday = async (today) => {
    try {
        const startOfToday = new Date(today);
        startOfToday.setUTCHours(0, 0, 0, 0);
        const endOfToday = new Date(today);
        endOfToday.setUTCHours(23, 59, 59, 999);

        // Find cycles ending today
        const cyclesEndingToday = await Cycle.find({
            endDate: { $gte: startOfToday, $lte: endOfToday }
        });

        console.log("cyclesEndingToday: ", cyclesEndingToday);

        for (const cycle of cyclesEndingToday) {
            const incompleteItems = await Item.find({
                cycles: cycle._id,
                status: { $ne: 'done' },
                isArchived: false,
                isDeleted: false
            });
            console.log("incompleteItems: ", incompleteItems);

            const activeCycle = await createActiveCycleForSpace(cycle.space, today);

            console.log("activeCycle: ", activeCycle);
            await transferWorkItems(incompleteItems, activeCycle);
        }

        const spaceIds = cyclesEndingToday.map(cycle => cycle.space);
        const spaces = await Space.find({
            _id: { $in: spaceIds }
        });

        return spaces;
    } catch (error) {
        console.error('Error finding spaces with cycles ending today:', error);
        return [];
    }
};

const processCycleJob = async () => {
    try {
        console.log('Job started...');

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        console.log('today: ', today);

        const spaces = await findSpacesWithCycleEndingToday(today);

        for (const space of spaces) {
            const startDate = new Date(today);
            startDate.setDate(today.getDate() + 7);

            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            endDate.setUTCHours(23, 59, 59, 999); // Set endDate to 11:59 PM

            await createCycle({
                startDate,
                endDate,
                space: space._id,
                workspace: space.workspace
            });
        }
        console.log('Job ended');
    } catch (error) {
        console.error('Error creating cycles:', error);
    }
};

const cycleWorker = new Worker('cycleQueue', async (job) => {
    console.log("Worker processing job...");
    await processCycleJob();
}, { connection: redisConnection });

const scheduleCycleCreation = () => {
    console.log("Scheduling job...");
    cycleQueue.add('createCycle', {}, {
        repeat: {
            cron: '0 0 * * *',
            // cron: '*/5 * * * *',
            tz: 'UTC'
        },
        removeOnComplete: true
    }).then(() => {
        console.log('Job scheduled successfully');
    }).catch((error) => {
        console.error('Error scheduling job:', error);
    });
};

export {
    scheduleCycleCreation,
    cycleWorker
};
