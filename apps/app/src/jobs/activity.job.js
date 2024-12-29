import { ItemActivity } from "../models/lib/itemActivity.model.js";
import { Worker } from "bullmq";
import { redisConnection } from "../loaders/redis.loader.js";
import { Label } from "../models/lib/label.model.js";
import { User } from "../models/core/user.model.js";
import { Cycle } from "../models/lib/cycle.model.js"

// Track Changes in name
const trackName = async (
    requestedData,
    currentInstance,
    item,
    space,
    workspace,
    actor
) => {
    if (currentInstance.name !== requestedData.name) {
        const lastActivity = await ItemActivity.findOne({ item }).sort({ createdAt: -1 }).exec();
        if (lastActivity && lastActivity.field === "name" && actor === lastActivity.actor.toString()) {
            lastActivity.newValue = requestedData.name;
            lastActivity.updatedAt = new Date();
            await lastActivity.save();
        } else {
            const itemActivity = new ItemActivity({
                item,
                actor,
                verb: "updated",
                oldValue: currentInstance.name,
                newValue: requestedData.name,
                field: "name",
                space,
                workspace,
                comment: "updated the title",
                cycle: currentInstance.cycles ? currentInstance.cycles[0] : null
            });

            await itemActivity.save();
        }
    }
};

//  Track item description
const trackDescription = async (
    requestedData,
    currentInstance,
    item,
    space,
    workspace,
    actor
) => {
    if (currentInstance.description !== requestedData.description) {
        const lastActivity = await ItemActivity.findOne({ item }).sort({ createdAt: -1 }).exec();
        if (lastActivity && lastActivity.field === "description" && actor === lastActivity.actor.toString()) {
            lastActivity.updatedAt = new Date();
            await lastActivity.save();
        } else {
            const itemActivity = new ItemActivity({
                item,
                actor,
                verb: "updated",
                field: "description",
                space,
                workspace,
                comment: "updated the description",
                cycle: currentInstance.cycles ? currentInstance.cycles[0] : null
            });

            await itemActivity.save();
        }
    }
}

// Track changes in status
const trackStatus = async (
    requestedData,
    currentInstance,
    item,
    space,
    workspace,
    actor
) => {
    if (currentInstance.status !== requestedData.status) {
        const lastActivity = await ItemActivity.findOne({ item }).sort({ createdAt: -1 }).exec();
        if (lastActivity && lastActivity.field === "status" && actor === lastActivity.actor.toString()) {
            lastActivity.newValue = requestedData.status;
            lastActivity.updatedAt = new Date();
            await lastActivity.save();
        } else {
            const itemActivity = new ItemActivity({
                item,
                actor,
                verb: "updated",
                oldValue: currentInstance.status,
                newValue: requestedData.status,
                field: "status",
                space,
                workspace,
                comment: `updated the status from ${currentInstance.status} to ${requestedData.status}`,
                cycle: currentInstance.cycles ? currentInstance.cycles[0] : null
            });

            await itemActivity.save();
        }
    }
}

// Track changes in effort
const trackEffort = async (
    requestedData,
    currentInstance,
    item,
    space,
    workspace,
    actor
) => {
    if (currentInstance.effort !== requestedData.effort) {
        const lastActivity = await ItemActivity.findOne({ item }).sort({ createdAt: -1 }).exec();
        if (lastActivity && lastActivity.field === "effort" && actor === lastActivity.actor.toString()) {
            lastActivity.newValue = requestedData.effort;
            lastActivity.updatedAt = new Date();
            await lastActivity.save();
        } else {
            const itemActivity = new ItemActivity({
                item,
                actor,
                verb: "updated",
                oldValue: currentInstance.effort,
                newValue: requestedData.effort,
                field: "effort",
                space,
                workspace,
                comment: `updated the effort from ${currentInstance.effort} to ${requestedData.effort}`,
                cycle: currentInstance.cycles ? currentInstance.cycles[0] : null
            });

            await itemActivity.save();
        }
    }
}

// Track changes in item due date
const trackDueDate = async (
    requestedData,
    currentInstance,
    item,
    space,
    workspace,
    actor
) => {
    if (currentInstance.dueDate !== requestedData.dueDate) {
        const lastActivity = await ItemActivity.findOne({ item }).sort({ createdAt: -1 }).exec();
        if (lastActivity && lastActivity.field === "dueDate" && actor === lastActivity.actor.toString()) {
            lastActivity.newValue = requestedData.dueDate;
            lastActivity.updatedAt = new Date();
            await lastActivity.save();
        } else {
            const itemActivity = new ItemActivity({
                item,
                actor,
                verb: "updated",
                oldValue: currentInstance.dueDate ? currentInstance.dueDate : "",
                newValue: requestedData.dueDate ? requestedData.dueDate : "",
                field: "dueDate",
                space,
                workspace,
                comment: "updated the due date",
                cycle: currentInstance.cycles ? currentInstance.cycles[0] : null
            });

            await itemActivity.save();
        }
    }
}

// track changes in item labels
const trackLabels = async (
    requestedData,
    currentInstance,
    item,
    space,
    workspace,
    actor
) => {
    const requestedLabels = new Set(requestedData.labels.map(lab => lab.toString()));
    const currentLabels = new Set(currentInstance.labels.map(lab => lab.toString()));

    const addedLabels = [...requestedLabels].filter(label => !currentLabels.has(label));
    const droppedLabels = [...currentLabels].filter(label => !requestedLabels.has(label));

    // Set of newly added labels
    for (const addedLabel of addedLabels) {
        const label = await Label.findById(addedLabel);
        if (label) {
            const itemActivity = new ItemActivity({
                item,
                actor,
                space,
                workspace,
                verb: "updated",
                field: "labels",
                comment: "added label",
                oldValue: "",
                newValue: label.name,
                newIdentifier: label._id,
                oldIdentifier: null,
                cycle: currentInstance.cycles ? currentInstance.cycles[0] : null
            });

            await itemActivity.save();
        }
    }

    // Set of dropped labels
    for (const droppedLabel of droppedLabels) {
        const label = await Label.findById(droppedLabel);
        if (label) {
            const itemActivity = new ItemActivity({
                item,
                actor,
                verb: "updated",
                oldValue: label.name,
                newValue: "",
                field: "labels",
                space,
                workspace,
                comment: "removed label",
                oldIdentifier: label._id,
                newIdentifier: null,
                cycle: currentInstance.cycles ? currentInstance.cycles[0] : null
            });

            await itemActivity.save();
        }
    }
}

// track chnages in item assignees
const trackAssignees = async (
    requestedData,
    currentInstance,
    item,
    space,
    workspace,
    actor
) => {
    const requestedAssignees = new Set((requestedData.assignees || []).map(asg => asg.toString()));
    const currentAssignees = new Set((currentInstance.assignees || []).map(asg => asg.toString()));

    const addedAssignees = [...requestedAssignees].filter(asg => !currentAssignees.has(asg));
    const droppedAssignees = [...currentAssignees].filter(asg => !requestedAssignees.has(asg));
    // const bulkSubscribers = [];

    for (const addedAssignee of addedAssignees) {
        const assignee = await User.findById(addedAssignee)
        if (assignee) {
            const itemActivity = new ItemActivity({
                item,
                actor,
                space,
                workspace,
                verb: "updated",
                field: "assignees",
                comment: "added assignee",
                oldValue: "",
                newValue: assignee.userName || assignee.fullName,
                newIdentifier: assignee._id,
                cycle: currentInstance.cycles ? currentInstance.cycles[0] : null
            });

            await itemActivity.save();

            // when implement Subscribers
            // bulkSubscribers.push({
            //     subscriberId: assignee._id,
            //     item,
            //     workspace,
            //     space,
            //     createdById: actor,
            //     updatedById: actor
            // });
        }
    }

    // Bulk insert new assignees as subscribers, ignoring duplicates
    // if (bulkSubscribers.length > 0) {
    //     await ItemSubscriber.insertMany(bulkSubscribers, { ordered: false });
    // }

    for (const droppedAssignee of droppedAssignees) {
        const assignee = await User.findById(droppedAssignee)
        if (assignee) {
            const itemActivity = new ItemActivity({
                item,
                actor,
                verb: "updated",
                oldValue: assignee.userName || assignee.fullName,
                newValue: "",
                field: "assignees",
                space,
                workspace,
                comment: "removed assignee",
                oldIdentifier: assignee._id,
                cycle: currentInstance.cycles ? currentInstance.cycles[0] : null
            });

            await itemActivity.save();
        }
    }
}

// track chnages in item cycle
const trackCycle = async (
    requestedData,
    currentInstance,
    item,
    space,
    workspace,
    actor
) => {
    console.log("requ: ", requestedData);
    let updatedRecords;
    let createdRecords;
    let deleteRecord;

    if (currentInstance.cycles && requestedData.cycles && currentInstance.cycles.length && requestedData.cycles.length) {
        if (currentInstance.cycles[0] !== requestedData.cycles[0]) {
            updatedRecords = currentInstance.cycles;
        }
    } else if (Array.isArray(currentInstance.cycles) && currentInstance.cycles.length === 0 && requestedData.cycles) {
        createdRecords = requestedData.cycles;
    } else if (Array.isArray(currentInstance.cycles) && currentInstance.cycles.length > 0 && Array.isArray(requestedData.cycles) && requestedData.cycles.length === 0) {
        deleteRecord = currentInstance.cycles;
    }

    if (updatedRecords) {
        const oldCycle = await Cycle.findById(currentInstance.cycles);
        const newCycle = await Cycle.findById(requestedData.cycles);
        const lastActivity = await ItemActivity.findOne({ item }).sort({ createdAt: -1 }).exec();
        if (lastActivity && lastActivity.field === "cycle" && actor === lastActivity.actor.toString()) {
            lastActivity.newValue = newCycle.name;
            lastActivity.oldValue = oldCycle.name;
            lastActivity.comment = `updated cycle from ${oldCycle.name} to ${newCycle.name}`;
            lastActivity.updatedAt = new Date();
            await lastActivity.save();
        } else {
            const itemActivity = new ItemActivity({
                item,
                actor,
                verb: "updated",
                oldValue: oldCycle ? oldCycle.name : '',
                newValue: newCycle ? newCycle.name : '',
                field: "cycle",
                space,
                workspace,
                comment: `from ${oldCycle ? oldCycle.name : ''} to ${newCycle ? newCycle.name : ''}`,
                oldIdentifier: oldCycle ? oldCycle._id : null,
                newIdentifier: newCycle ? newCycle._id : null,
                cycle: requestedData.cycles[0]
            });

            await itemActivity.save();
        }
    }

    if (createdRecords) {
        const cycle = await Cycle.findById(requestedData.cycles);

        const itemActivity = new ItemActivity({
            item,
            actor,
            verb: "created",
            oldValue: '',
            newValue: cycle ? cycle.name : '',
            field: "cycle",
            space,
            workspace,
            comment: `to cycle ${cycle.name}`,
            newIdentifier: cycle ? cycle._id : null,
            cycle: requestedData.cycles[0]
        });

        await itemActivity.save();
    }
    if (deleteRecord) {
        const cycle = await Cycle.findById(currentInstance.cycles);

        const itemActivity = new ItemActivity({
            item,
            actor,
            verb: "deleted",
            oldValue: cycle ? cycle.name : '',
            newValue: '',
            field: "cycle",
            space,
            workspace,
            comment: `from ${cycle.name}`,
            oldIdentifier: cycle ? cycle._id : null,
            cycle: currentInstance.cycles[0]
        });

        await itemActivity.save();
    }
}

const createItemActivity = async (data) => {
    const { requestedData, currentInstance, item, space, workspace, actor } = data;

    const issueActivity = new ItemActivity({
        item,
        space,
        workspace,
        field: "item",
        comment: 'created the item',
        verb: 'created',
        actor,
        cycle: requestedData.cycles ? requestedData.cycles[0] : null
    });

    await issueActivity.save();

    if (requestedData.assignee_ids) {
        trackAssignees(requestedData, currentInstance, item, space, workspace, actor);
    }
}

const ITEM_ACTIVITY_MAPPER = {
    name: trackName,
    effort: trackEffort,
    status: trackStatus,
    description: trackDescription,
    dueDate: trackDueDate,
    labels: trackLabels,
    assignees: trackAssignees,
    cycles: trackCycle
};

const updateItemActivity = async (data) => {
    const { requestedData, currentInstance, item, space, workspace, actor } = data;

    for (const key in requestedData) {
        if (Object.prototype.hasOwnProperty.call(requestedData, key)) {
            const func = ITEM_ACTIVITY_MAPPER[key];
            if (func) {
                await func(
                    requestedData,
                    currentInstance,
                    item,
                    space,
                    workspace,
                    actor
                );
            } else {
                console.warn(`No mapping function found for key: ${key}`);
            }
        }
    }
}

const deleteItemActivity = async (data) => {
    const { item, space, workspace, actor } = data;
    const itemActivity = new ItemActivity({
        item,
        space,
        workspace,
        comment: "deleted the item",
        verb: "deleted",
        actor,
        field: "item"
    });

    await itemActivity.save();
};

const createCommentActivity = async (data) => {
    const { requestedData, item, space, workspace, actor } = data;
    const activity = new ItemActivity({
        item,
        space,
        workspace,
        comment: "created a comment",
        verb: "created",
        actor,
        field: "comment",
        newValue: requestedData.comment || "",
        newIdentifier: requestedData._id || null,
        issueCommentId: requestedData._id || null
    });

    await activity.save();
};

const updateCommentActivity = async (data) => {
    const { requestedData, currentInstance, item, space, workspace, actor } = data;
    if (currentInstance.comment !== requestedData.comment) {
        const itemActivity = new ItemActivity({
            item,
            space,
            workspace,
            comment: "updated a comment",
            verb: "updated",
            actor,
            field: "comment",
            oldValue: currentInstance.comment || "",
            newValue: requestedData.comment || "",
            oldIdentifier: currentInstance._id,
            newIdentifier: currentInstance._id || null,
            issue_comment_id: currentInstance._id || null
        });

        await itemActivity.save();
    }
};

const deleteCommentActivity = async (data) => {
    const { item, space, workspace, actor } = data;
    const itemActivity = new ItemActivity({
        item,
        space,
        workspace,
        comment: "deleted the comment",
        verb: "deleted",
        actor,
        field: "comment"
    });

    await itemActivity.save();
};

const createCycleActivity = async (data) => {
    // const { requestedData, currentInstance, item, space, workspace, actor } = data;

    // const itemActivity = new ItemActivity({
    //     requestedData,
    //     currentInstance,
    //     item,
    //     space,
    //     workspace,
    //     actor,
    //     verb: 'Created',
    //     comment: 'Item added to the cycle',
    //     field: 'Cycle'

    // })
    // await itemActivity.save();
}

const issueActivityWorker = new Worker('itemActivityQueue', async (job) => {
    if (job.data.type === 'item.activity.created') {
        await createItemActivity(job.data);
    } else if (job.data.type === 'item.activity.updated') {
        await updateItemActivity(job.data);
    } else if (job.data.type === 'item.activity.deleted') {
        await deleteItemActivity(job.data);
    } else if (job.data.type === 'comment.activity.created') {
        await createCommentActivity(job.data);
    } else if (job.data.type === 'comment.activity.updated') {
        await updateCommentActivity(job.data);
    } else if (job.data.type === 'comment.activity.deleted') {
        await deleteCommentActivity(job.data);
    }
}, {
    connection: redisConnection
});

issueActivityWorker.on('completed', async (job) => {
    console.log(`Job ${job.id} has completed!`);
    // Remove the job from the queue after completion
    await job.remove();
});

issueActivityWorker.on('failed', (job, err) => {
    console.error(`Job ${job.id} has failed with ${err.message}`);
});

issueActivityWorker.on('error', (err) => {
    console.error('Worker encountered an error:', err);
});

console.log('Worker setup completed.');

export {
    trackName,
    trackDescription,
    trackEffort,
    trackStatus,
    trackDueDate,
    trackLabels,
    trackAssignees,
    trackCycle,
    createItemActivity,
    updateItemActivity,
    deleteItemActivity,
    createCommentActivity,
    updateCommentActivity,
    deleteCommentActivity,
    createCycleActivity,
    issueActivityWorker
};
