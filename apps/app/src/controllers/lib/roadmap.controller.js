import { createRoadmap, getRoadmap, updateRoadmap, deleteRoadmap, getRoadmaps, addItemsToRoadmap, getRoadmapItems, deleteRoadmapItem } from "../../services/lib/roadmap.service.js"

const createRoadmapController = async (req, res, next) => {
    try {
        const space = res.locals.space;
        const createdBy = res.locals.user;

        const roadmapData = req.body;
        const roadmap = await createRoadmap(space, createdBy, roadmapData)
        res.json({
            status: 200,
            response: roadmap
        });
    } catch (err) {
        next(err);
    }
}

const getRoadmapsController = async (req, res, next) => {
    try {
        const space = res.locals.space;

        const groupedRoadmapsMap = await getRoadmaps(space.workspace, space._id);

        res.json({
            status: 200,
            response: groupedRoadmapsMap
        });
    } catch (err) {
        next(err);
    }
}

const getRoadmapController = async (req, res, next) => {
    try {
        const { roadmap: id } = req.params;
        const space = res.locals.space;

        const roadmap = await getRoadmap(id, space._id);

        res.json({
            status: 200,
            response: roadmap
        });
    } catch (err) {
        next(err);
    }
}

const updateRoadmapController = async (req, res, next) => {
    try {
        const { roadmap: id } = req.params;
        const updatedData = req.body;
        const space = res.locals.space;
        const updatedBy = res.locals.user;

        const updatedRoadmap = await updateRoadmap(id, space._id, updatedData, updatedBy);
        res.json({
            status: 200,
            response: updatedRoadmap
        });
    } catch (err) {
        next(err);
    }
}

const deleteRoadmapController = async (req, res, next) => {
    try {
        const { roadmap: id } = req.params;
        const space = res.locals.space;
        await deleteRoadmap(id, space._id);
        res.json({
            status: 200,
            message: "Roadmap deleted successfully"
        });
    } catch (err) {
        next(err);
    }
}

const addItemsToRoadmapController = async (req, res, next) => {
    try {
        const { roadmap: id } = req.params;
        const space = res.locals.space;
        const roadmap = await getRoadmap(id, space._id);
        const createdBy = res.locals.user;

        const itemId = req.body.item;

        if (!itemId) {
            return res.status(400).json({ error: 'Item ID is required' });
        }
        const roadmapItem = await addItemsToRoadmap(itemId, roadmap, createdBy);
        res.json({
            status: 200,
            response: roadmapItem
        });
    } catch (err) {
        next(err);
    }
}

const getRoadmapItemsController = async (req, res, next) => {
    try {
        const { roadmap: id } = req.params;
        const space = res.locals.space;
        const roadmap = await getRoadmap(id, space._id);
        const roadmapItems = await getRoadmapItems(roadmap);
        res.json({
            status: 200,
            response: roadmapItems
        });
    } catch (err) {
        next(err);
    }
}

const deleteRoadmapItemController = async (req, res, next) => {
    try {
        const { roadmap: id, item: itemId } = req.params;
        const space = res.locals.space;
        const roadmap = await getRoadmap(id, space._id);
        await deleteRoadmapItem(roadmap, itemId);
        res.json({
            status: 200,
            message: "Roadmap Item deleted successfully"
        });
    } catch (err) {
        next(err);
    }
}

export {
    createRoadmapController,
    getRoadmapsController,
    getRoadmapController,
    updateRoadmapController,
    deleteRoadmapController,
    addItemsToRoadmapController,
    getRoadmapItemsController,
    deleteRoadmapItemController
}
