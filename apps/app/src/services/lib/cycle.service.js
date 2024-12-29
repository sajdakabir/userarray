import { Cycle, CycleFavorite } from "../../models/lib/cycle.model.js";
import { Item } from "../../models/lib/item.model.js";
import moment from "moment-timezone";

const createCycle = async (cycleData) => {
    const newCycle = new Cycle(cycleData);
    await newCycle.save();
    if (!newCycle) {
        const error = new Error("Failed to create the cycle");
        error.statusCode = 500;
        throw error;
    }

    return newCycle;
};

// const getCycles = async (workspaceId, spaceId) => {
//     const cycles = await Cycle.find({
//         'workspace': workspaceId,
//         'space': spaceId,
//         isDeleted: false
//     }).sort({ createdAt: -1 });

//     return cycles;
// };

const getCycles = async (workspaceId, spaceId) => {
    const currentDate = moment();
    const cycles = await Cycle.find({
        'workspace': workspaceId,
        'space': spaceId,
        isDeleted: false
    }).sort({ startDate: 1 });

    // const all = [];
    const upcoming = [];
    const completed = [];
    let current;

    cycles.forEach(cycle => {
        const startDate = moment(cycle.startDate);
        const endDate = moment(cycle.endDate);

        if (endDate.isBefore(currentDate, 'day')) {
            completed.push(cycle);
        } else if (startDate.isAfter(currentDate, 'day')) {
            upcoming.push(cycle);
        } else {
            current = cycle;
        }
    });

    return {
        upcoming,
        current,
        completed
    };
};

const getCycle = async (id, space) => {
    const cycle = await Cycle.findOne({
        uuid: id,
        space,
        isDeleted: false
    })
    if (!cycle) {
        const error = new Error("Cycle not found")
        error.statusCode = 404
        throw error;
    }
    return cycle
}

const updateCycle = async (id, space, updatedData) => {
    const cycle = await getCycle(id, space);
    if (cycle.endDate && cycle.endDate < new Date()) {
        const error = new Error("The Cycle has already been completed so it cannot be edited");
        error.statusCode = 400;
        throw error;
    }
    const updatedCycle = await Cycle.findOneAndUpdate({
        uuid: id,
        space
    },
    { $set: updatedData },
    { new: true }
    );

    if (!updatedCycle) {
        const error = new Error("Failed to update cycle");
        error.statusCode = 500;
        throw error;
    }
    return updatedCycle;
}

const archiveCycle = async (id, space) => {
    const cycle = await Cycle.findOneAndUpdate(
        {
            space: space._id,
            workspace: space.workspace,
            uuid: id,
            isArchived: { $ne: true }
        },
        { isArchived: true },
        { new: true }
    );
    return cycle;
}

const deleteCycle = async (id, space) => {
    const cycle = await getCycle(id, space);
    await cycle.updateOne({
        $set: {
            isDeleted: true
        }
    })
}

const addUserFavoriteCycle = async (cycle, user) => {
    const existingFavorite = await CycleFavorite.findOne({
        user: user._id,
        cycle: cycle._id
    });

    if (existingFavorite) {
        const error = new Error("The cycle is already added to favorites")
        error.statusCode = 401
        throw error;
    }

    const newFavorite = new CycleFavorite({
        user: user._id,
        cycle: cycle._id
    });
    await newFavorite.save();
    return newFavorite;
}

const getUserFavoriteCycles = async (userId, spaceId) => {
    const favorites = await CycleFavorite.find({
        user: userId
    }).populate('cycle');

    const cycleIds = favorites.map(favorite => favorite.cycle._id);

    const userFavoriteCycles = await Cycle.find({
        space: spaceId,
        _id: { $in: cycleIds }
    })
        .populate({
            path: 'createdBy',
            select: {
                'accounts.local.password': 0,
                updatedAt: 0,
                __v: 0
            }
        })

    return userFavoriteCycles;
}

const deleteUserFavoriteCycle = async (cycle, user) => {
    await CycleFavorite.findOneAndDelete({
        user: user._id,
        cycle: cycle._id
    });
}

const addItemsToCycle = async (itemId, cycle, createdBy) => {
    const item = await Item.findById(itemId);

    if (!item) {
        const error = new Error("Item not found")
        error.statusCode = 404
        throw error
    }
    item.cycles.push(cycle._id);
    item.updatedBy = createdBy;

    const updatedItem = await item.save();

    return updatedItem;
}

const getCycleItems = async (cycle) => {
    const items = await Item.find({
        'cycles': cycle._id,
        'space': cycle.space,
        'workspace': cycle.workspace,
        'isDeleted': false,
        'isArchived': false
    })
        // .populate('parent')
        // .populate({
        //     path: 'assignees',
        //     select: 'userName fullName avatar'
        // })
        // .populate('cycles')
        // .populate('labels')
        .sort({ created_at: -1 });

    const itemsData = items.map(item => item.toObject());
    return itemsData;
}

const deleteCycleItem = async (cycle, id) => {
    const item = await Item.findOne({
        uuid: id,
        'cycles': cycle._id,
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
    createCycle,
    getCycles,
    getCycle,
    updateCycle,
    archiveCycle,
    deleteCycle,
    addUserFavoriteCycle,
    getUserFavoriteCycles,
    deleteUserFavoriteCycle,
    addItemsToCycle,
    getCycleItems,
    deleteCycleItem
};
