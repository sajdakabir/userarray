import { ItemActivity } from "../../models/lib/itemActivity.model.js";

const getItemActivites = async (id, space) => {
    return await ItemActivity.find({
        item: id,
        space: space._id
        // workspace: space.workspace
    })
        // .populate({
        //     path: 'actor',
        //     select: 'userName fullName'
        // })
        .sort('createdAt');
};

const getCycleActivites = async (id, space) => {
    return await ItemActivity.find({
        cycle: id,
        space: space._id
        // workspace: space.workspace
    })
        .sort('createdAt');
};

const mergeAndSortActivitiesAndComments = (activities, comments) => {
    return [...activities, ...comments].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

export {
    getItemActivites,
    getCycleActivites,
    mergeAndSortActivitiesAndComments
}
