import { ItemComment } from "../../models/lib/item.model.js";
import { CycleComment } from "../../models/lib/cycleComment.model.js"

const createItemComment = async (data, space, user, item) => {
    const newComment = new ItemComment({
        ...data,
        space: space._id,
        workspace: space.workspace,
        item,
        actor: user
    });

    const savedComment = await newComment.save();
    return savedComment;
}

const getItemComments = async (item, space) => {
    const itemComments = await ItemComment.find({
        item,
        space: space._id,
        workspace: space.workspace
    })

    if (!itemComments) {
        const error = new Error("item comments not found");
        error.statusCode = 404;
        throw error;
    }

    return itemComments;
}

const getItemComment = async (item, commentId, space) => {
    const itemComment = await ItemComment.find({
        uuid: commentId,
        item,
        space: space._id,
        workspace: space.workspace
    })

    if (!itemComment) {
        const error = new Error("item comment not found");
        error.statusCode = 404;
        throw error;
    }

    return itemComment;
}

const updateItemComment = async (item, updatedData, user, space, commentId) => {
    const currentInstance = await ItemComment.findOne({
        uuid: commentId,
        workspace: space.workspace,
        space: space._id
    });
    if (!currentInstance) {
        const error = new Error("Item comment not found");
        error.statusCode = 500;
        throw error;
    }
    // await itemActivityQueue.add('trackIssueActivity', {
    //     type: 'comment.activity.updated',
    //     requestedData: updatedData,
    //     currentInstance,
    //     item,
    //     space: space._id,
    //     workspace: space.workspace,
    //     actor: user,
    //     notification: true
    // });
    // const { error, value } = validatePartialUpdate(req.body); // Assuming you have a validation function
    // if (error) {
    //     return res.status(400).json(error.details);
    // }

    Object.assign(currentInstance, updatedData);
    await currentInstance.save();
    return currentInstance;
}

const deleteItemComment = async (space, commentId, item) => {
    await ItemComment.findOneAndDelete({
        uuid: commentId,
        item,
        space: space._id,
        workspace: space.workspace
    });
    return 'OK';
}

const createCycleComment = async (data, space, user, cycle) => {
    const newComment = new CycleComment({
        ...data,
        space: space._id,
        workspace: space.workspace,
        cycle,
        actor: user
    });

    const savedComment = await newComment.save();
    return savedComment;
}

const getCycleComments = async (cycle, space) => {
    const cycleComments = await CycleComment.find({
        cycle,
        space: space._id,
        workspace: space.workspace
    })

    if (!cycleComments) {
        const error = new Error("Cycle comments not found");
        error.statusCode = 404;
        throw error;
    }

    return cycleComments;
}

const updateCycleComment = async (cycle, updatedData, space, commentId) => {
    const currentInstance = await CycleComment.findOne({
        cycle,
        uuid: commentId,
        workspace: space.workspace,
        space: space._id
    });
    if (!currentInstance) {
        const error = new Error("Cycle comment not found");
        error.statusCode = 500;
        throw error;
    }
    Object.assign(currentInstance, updatedData);
    await currentInstance.save();
    return currentInstance;
}

const getCycleComment = async (cycle, commentId, space) => {
    const cycleComment = await CycleComment.findOne({
        uuid: commentId,
        cycle,
        space: space._id,
        workspace: space.workspace
    });

    if (!cycleComment) {
        const error = new Error("Cycle comment not found");
        error.statusCode = 404;
        throw error;
    }

    return cycleComment;
}

const deleteCycleComment = async (space, commentId, cycle) => {
    await CycleComment.findOneAndDelete({
        uuid: commentId,
        cycle,
        space: space._id,
        workspace: space.workspace
    });

    return 'OK';
}

export {
    createItemComment,
    getItemComments,
    getItemComment,
    updateItemComment,
    deleteItemComment,
    createCycleComment,
    getCycleComments,
    updateCycleComment,
    getCycleComment,
    deleteCycleComment
}
