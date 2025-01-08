import { createCycle, getCycles,getTeamCurrentCycles, getCycle, updateCycle, deleteCycle, addUserFavoriteCycle, getUserFavoriteCycles, deleteUserFavoriteCycle, addItemsToCycle, getCycleItems, deleteCycleItem, archiveCycle } from "../../services/lib/cycle.service.js";

const createCycleController = async (req, res, next) => {
    try {
        const space = res.locals.space;
        const createdBy = res.locals.user;
        const { startDate, endDate, ...otherCycleData } = req.body;
        const cycleData = {
            ...otherCycleData,
            space: space._id,
            workspace: space.workspace,
            createdBy
        };
        if ((startDate === null && endDate === null) || (startDate !== null && endDate !== null)) {
            const newCycle = await createCycle({ startDate, endDate, ...cycleData });

            res.json({
                status: 200,
                response: {
                    newCycle
                }
            });
        } else {
            res.status(400).json({
                error: 'Both start date and end date are either required or should be null'
            });
        }
    } catch (err) {
        next(err);
    }
};

const getCyclesController = async (req, res, next) => {
    try {
        const space = res.locals.space;
        // const cycleView = req.query.cycle_view || 'all';

        const cycles = await getCycles(space.workspace, space._id);

        res.json({
            status: 200,
            response: cycles
        });
    } catch (err) {
        next(err);
    }
}

export const getTeamCurrentCyclesController = async (req, res, next) => {
    try {
        const workspace = res.locals.workspace;
        const { team } = req.params;
        const cycles = await getTeamCurrentCycles(workspace._id, team);
        res.json({
            status: 200,
            response: cycles
        });
    } catch (err) {
        next(err);
    }
}

const getCycleController = async (req, res, next) => {
    try {
        const { cycle: id } = req.params;
        const space = res.locals.space;

        const cycle = await getCycle(id, space._id);

        res.json({
            status: 200,
            response: cycle
        });
    } catch (err) {
        next(err);
    }
}

const updateCycleController = async (req, res, next) => {
    try {
        const { cycle: id } = req.params;
        const updatedData = req.body;
        const space = res.locals.space;

        const updatedCycle = await updateCycle(id, space._id, updatedData);
        res.json({
            status: 200,
            response: updatedCycle
        });
    } catch (err) {
        next(err);
    }
}

const archiveCycleController = async (req, res, next) => {
    const { item: id } = req.params;
    const space = res.locals.space;
    const cycle = await archiveCycle(id, space);
    res.json({
        status: 200,
        message: "Cycle archived successfully",
        response: cycle
    });
}

const deleteCycleController = async (req, res, next) => {
    try {
        const { cycle: id } = req.params;
        const space = res.locals.space;
        await deleteCycle(id, space._id);
        res.json({
            status: 200,
            message: "Cycle deleted successfully"
        });
    } catch (err) {
        next(err);
    }
}

const addUserFavoriteCycleController = async (req, res, next) => {
    try {
        const { id } = req.body;
        const space = res.locals.space;
        const user = res.locals.user;

        const cycle = await getCycle(id, space._id);

        const favoriteCycle = await addUserFavoriteCycle(cycle, user);
        res.json({
            status: 200,
            response: favoriteCycle
        });
    } catch (err) {
        next(err);
    }
}

const getUserFavoriteCyclesController = async (req, res, next) => {
    try {
        const space = res.locals.space;
        const user = res.locals.user;
        const favorites = await getUserFavoriteCycles(user._id, space._id);

        res.json({
            status: 200,
            response: favorites
        });
    } catch (err) {
        next(err);
    }
}

const deleteUserFavoriteCycleController = async (req, res, next) => {
    try {
        const { cycle: id } = req.params;
        const space = res.locals.space;
        const user = res.locals.user;

        const cycle = await getCycle(id, space._id);

        await deleteUserFavoriteCycle(cycle, user);
        res.json({
            status: 200,
            message: "Cycle Remove from Favorite"
        });
    } catch (err) {
        next(err);
    }
}

const addItemsToCycleController = async (req, res, next) => {
    try {
        const { cycle: id } = req.params;
        const space = res.locals.space;
        const cycle = await getCycle(id, space._id);

        if (!cycle || (cycle.endDate && cycle.endDate < new Date())) {
            return res.status(400).json({
                error: 'The Cycle has already been completed so no new issues can be added'
            });
        }

        const createdBy = res.locals.user;

        const itemId = req.body.item;

        if (!itemId) {
            return res.status(400).json({ error: 'Item ID is required' });
        }
        const cycyleItem = await addItemsToCycle(itemId, cycle, createdBy);
        res.json({
            status: 200,
            response: cycyleItem
        });
    } catch (err) {
        next(err);
    }
}

const getCycleItemsController = async (req, res, next) => {
    try {
        const { cycle: id } = req.params;
        const space = res.locals.space;
        const cycle = await getCycle(id, space._id);
        const cycleItems = await getCycleItems(cycle);
        res.json({
            status: 200,
            response: cycleItems
        });
    } catch (err) {
        next(err);
    }
}

const deleteCycleItemController = async (req, res, next) => {
    try {
        const { cycle: id, item: itemId } = req.params;
        const space = res.locals.space;
        const cycle = await getCycle(id, space._id);
        await deleteCycleItem(cycle, itemId);
        res.json({
            status: 200,
            message: "Cycle Item deleted successfully"
        });
    } catch (err) {
        next(err);
    }
}

export {
    createCycleController,
    getCyclesController,
    getCycleController,
    updateCycleController,
    deleteCycleController,
    addItemsToCycleController,
    addUserFavoriteCycleController,
    getUserFavoriteCyclesController,
    deleteUserFavoriteCycleController,
    getCycleItemsController,
    deleteCycleItemController,
    archiveCycleController
}
