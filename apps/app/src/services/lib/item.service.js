import { Item } from "../../models/lib/item.model.js";
import moment from 'moment-timezone';
import { itemActivityQueue } from "../../loaders/bullmq.loader.js";

const createItem = async (space, createdBy, itemData) => {
    const newItem = new Item({
        ...itemData,
        space: space._id,
        workspace: space.workspace,
        createdBy: createdBy._id
    });
    if (!newItem) {
        const error = new Error("Failed to create the item")
        error.statusCode = 500
        throw error
    }

    const item = await newItem.save()

    return item;
};

const getItem = async (space, id) => {
    const item = await Item.findOne({
        space: space._id,
        workspace: space.workspace,
        uuid: id,
        isArchived: false,
        isDeleted: false
    })
    // .populate('parent')
    // .populate({
    //     path: 'assignees',
    //     select: 'userName fullName avatar'
    // })
    // .populate('roadmaps')
    // .populate('cycles')
    // .populate('labels')
    if (!item) {
        const error = new Error("Item not found")
        error.statusCode = 404
        throw error
    }
    return item;
}

const updateItem = async (id, updatedData, updatedBy) => {
    const currentInstance = await Item.findOne({ uuid: id });
    const assigneesList = updatedData.assignees;
    const labelsList = updatedData.labels;

    await itemActivityQueue.add('issueActivityQueue', {
        type: 'item.activity.updated',
        requestedData: updatedData,
        currentInstance,
        item: currentInstance._id,
        space: currentInstance.space,
        workspace: currentInstance.space,
        actor: updatedBy._id,
        notification: true
    });
    if (assigneesList !== undefined) {
        currentInstance.assignees = assigneesList;
    }

    if (labelsList !== undefined) {
        currentInstance.labels = labelsList;
    }
    Object.assign(currentInstance, updatedData);
    await currentInstance.save();

    return currentInstance;
}

// const updateItem = async (space, id, updatedData) => {
//     const { assignees, roadmaps, cycles, labels, ...rest } = updatedData;
//     const updateQuery = {};

//     if (assignees) {
//         updateQuery.$addToSet = { assignees: { $each: assignees } };
//     }

//     if (roadmaps) {
//         updateQuery.$addToSet = { roadmaps: { $each: roadmaps } };
//     }

//     if (cycles) {
//         updateQuery.$addToSet = { cycles: { $each: cycles } };
//     }

//     if (labels) {
//         updateQuery.$addToSet = { labels: { $each: labels } };
//     }
//     Object.assign(updateQuery, rest);
//     const updatedItem = await Item.findOneAndUpdate(
//         { uuid: id, space },
//         updateQuery,
//         { new: true }
//     );

//     if (!updatedItem) {
//         const error = new Error("Failed to update item");
//         error.statusCode = 500;
//         throw error;
//     }

//     return updatedItem;
// }

// const updateItem = async (space, id, updatedData) => {
//     const { assignees, roadmaps, cycles, labels, ...rest } = updatedData;
//     const updateQuery = {};

//     const arrayProperties = ['assignees', 'roadmaps', 'cycles', 'labels'];
//     arrayProperties.forEach(property => {
//         if (updatedData[property]) {
//             updateQuery.$addToSet = { [property]: { $each: updatedData[property] } };
//         }
//     });

//     Object.assign(updateQuery, rest);

//     const updatedItem = await Item.findOneAndUpdate(
//         { uuid: id, space },
//         updateQuery,
//         { new: true }
//     );

//     if (!updatedItem) {
//         const error = new Error("Failed to update item");
//         error.statusCode = 500;
//         throw error;
//     }

//     return updatedItem;
// }

const deleteItem = async (space, item) => {
    await item.updateOne({
        $set: {
            isDeleted: true
        }
    })
}

const getItems = async (workspaceId, spaceId) => {
    const items = await Item.find({
        // 'workspace': workspaceId,
        'space': spaceId,
        isArchived: false,
        isDeleted: false
    }).sort({ created_at: -1 });
    return items;
};

const getWorkSpaceItems = async (workspace) => {
    const items = await Item.find({
        workspace: workspace._id,
        isArchived: false,
        isDeleted: false
    }).sort({ sortOrder: 1 });

    return items;
}


const getMembersTodayWorkItems = async (workspace, member) => {
    const startOfDay = moment().startOf('day'); // Set start of today (without time component)
    const current = await Item.find({
        assignees: member,
        workspace: workspace._id,
        isArchived: false,
        isDeleted: false,
        // dueDate: today
        dueDate: { $gte: startOfDay, $lt: moment().endOf('day') }
    });

    const overdue = await Item.find({
        assignees: member,
        workspace: workspace._id,
        isArchived: false,
        isDeleted: false,
        dueDate: { $lt: startOfDay }, // Due date is before start of today (without time component)
        status: { $ne: "done" }
    });

    return { current, overdue };
}

const getMembersWorkItemsByDate = async (date, member, workspace) => {
    const item = await Item.find({
        assignees: member,
        workspace,
        isArchived: false,
        isDeleted: false,
        dueDate: date
    });
    return item;
}

export {
    createItem,
    getItem,
    updateItem,
    deleteItem,
    getItems,
    getWorkSpaceItems,
    getMembersTodayWorkItems,
    getMembersWorkItemsByDate
};
