import { Roadmap } from "../../models/lib/roadmap.model.js";
import { Item } from "../../models/lib/item.model.js";

const createRoadmap = async (space, createdBy, roadmapData) => {
    const newRoadmap = new Roadmap({
        ...roadmapData,
        space: space._id,
        workspace: space.workspace,
        createdBy: createdBy._id,
        updatedBy: createdBy._id
    });

    const roadmap = await newRoadmap.save();
    if (!roadmap) {
        const error = new Error("Failed to create the roadmap")
        error.statusCode = 500
        throw error
    }
    return roadmap;
};

const getRoadmap = async (id, space) => {
    const roadmap = await Roadmap.findOne({
        uuid: id,
        space,
        isDeleted: false,
        isArchived: false
    })
    if (!roadmap) {
        const error = new Error("Roadmap not found")
        error.statusCode = 404
        throw error;
    }
    return roadmap;
}

const updateRoadmap = async (id, space, updatedData, updatedBy) => {
    const updatedRoadmap = await Roadmap.findOneAndUpdate({
        uuid: id,
        space,
        isDeleted: false
    },
    { $set: updatedData, updatedBy: updatedBy._id },
    { new: true }
    );

    if (!updatedRoadmap) {
        const error = new Error("Failed to update roadmap");
        error.statusCode = 500;
        throw error;
    }
    return updatedRoadmap;
}

const deleteRoadmap = async (id, space) => {
    const roadmap = await getRoadmap(id, space);
    await roadmap.updateOne({
        $set: {
            isDeleted: true
        }
    })
}

const getRoadmaps = async (workspaceId, spaceId) => {
    const roadmaps = await Roadmap.find({
        'workspace': workspaceId,
        'space': spaceId,
        isDeleted: false
    })
        // .populate({
        //     path: 'assignees',
        //     select: {
        //         'accounts.local.password': 0,
        //         updatedAt: 0,
        //         __v: 0
        //     }
        // })
        // .populate('labels')
        .sort({ created_at: -1 });
    return roadmaps;
}

const addItemsToRoadmap = async (itemId, roadmap, createdBy) => {
    const item = await Item.findById(itemId);

    if (!item) {
        const error = new Error("Item not found")
        error.statusCode = 404
        throw error
    }
    item.roadmaps.push(roadmap._id);
    item.updatedBy = createdBy;

    const updatedItem = await item.save();

    return updatedItem;
}

const getRoadmapItems = async (roadmap) => {
    const items = await Item.find({
        'roadmaps': roadmap._id,
        'space': roadmap.space,
        'workspace': roadmap.workspace,
        'isDeleted': false,
        'isArchived': false
    })
        .populate('parent')
        .populate({
            path: 'assignees',
            select: 'userName fullName avatar'
        })
        .populate('roadmaps')
        .populate('labels')
        .sort({ created_at: -1 });

    return items;
}

const deleteRoadmapItem = async (roadmap, id) => {
    const item = await Item.findOne({
        uuid: id,
        'roadmaps': roadmap._id,
        isDeleted: false
    })

    if (!item) {
        const error = new Error("Item not found or already deleted")
        error.statusCode = 404
        throw error
    }

    item.isDeleted = true;

    await item.save();
}

export {
    createRoadmap,
    getRoadmap,
    updateRoadmap,
    deleteRoadmap,
    getRoadmaps,
    addItemsToRoadmap,
    getRoadmapItems,
    deleteRoadmapItem
}
