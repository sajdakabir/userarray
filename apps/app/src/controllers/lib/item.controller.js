import { createItem, getItem, updateItem, deleteItem, getItems, getMembersTodayWorkItems, getMembersWorkItemsByDate } from "../../services/lib/item.service.js";
import { itemActivityQueue } from "../../loaders/bullmq.loader.js";
import moment from "moment-timezone";
import { ItemPayload } from "../../payloads/lib/item.payload.js";

const createItemController = async (req, res, next) => {
    try {
        const space = res.locals.space;
        const createdBy = res.locals.user;

        // const { error, value: requestedData } = ItemPayload.validate(req.body);

        // if (error) {
        //     const err = error.details[0].message;
        //     err.statusCode = 400;
        //     throw err;
        // }
        const requestedData = req.body;
        const item = await createItem(space, createdBy, requestedData);

        await itemActivityQueue.add('trackIssueActivity', {
            type: 'item.activity.created',
            requestedData,
            currentInstance: null,
            item: item._id,
            space: space._id,
            workspace: space.workspace,
            actor: createdBy._id,
            notification: true
            // origin: req.get('origin')
        });

        res.status(200).json({
            status: 200,
            response: item
        });
    } catch (err) {
        next(err);
    }
};

const getItemsController = async (req, res, next) => {
    try {
        const space = res.locals.space;
        const Items = await getItems(space.workspace, space._id);

        res.json({
            status: 200,
            response: Items
        });
    } catch (err) {
        next(err);
    }
}

const getItemController = async (req, res, next) => {
    try {
        const { item: id } = req.params;
        const space = res.locals.space;
        const item = await getItem(space, id)
        res.json({
            status: 200,
            response: item
        });
    } catch (err) {
        next(err);
    }
}

const updateItemController = async (req, res, next) => {
    try {
        const { item: id } = req.params;
        const updatedBy = res.locals.user
        const { error, value: updatedData } = ItemPayload.validate(req.body);

        if (error) {
            const err = error.details[0].message;
            err.statusCode = 400;
            throw err;
        }
        const updatedItem = await updateItem(id, updatedData, updatedBy);
        res.json({
            status: 200,
            response: updatedItem
        });
    } catch (err) {
        next(err);
    }
}

const deleteItemController = async (req, res, next) => {
    try {
        const { item: id } = req.params;
        const actor = res.locals.user;
        const space = res.locals.space;
        const item = await getItem(space, id);
        await deleteItem(space, item);
        await itemActivityQueue.add('trackIssueActivity', {
            type: 'item.activity.deleted',
            item: item._id,
            space: space._id,
            workspace: space.workspace,
            actor,
            notification: true
        });
        res.json({
            status: 200,
            message: "Item deleted successfully"
        });
    } catch (err) {
        next(err);
    }
}


const getMembersTodayWorkItemsControlle = async (req, res, next) => {
    try {
        const { member: id } = req.params;
        const workspace = res.locals.workspace;
        const { current, overdue } = await getMembersTodayWorkItems(workspace, id);
        res.json({
            status: 200,
            response: {
                current,
                overdue
            }
        });
    } catch (err) {
        next(err);
    }
};

const getMembersWorkItemsByDateControlle = async (req, res, next) => {
    try {
        const { member: id, date } = req.params;
        const workspace = res.locals.workspace;
        const itemDate = moment(date).startOf('day').toDate();
        const item = await getMembersWorkItemsByDate(itemDate, id, workspace._id);
        res.json({
            status: 200,
            response: item
        });
    } catch (err) {
        next(err);
    }
};

export {
    createItemController,
    getItemsController,
    getItemController,
    updateItemController,
    deleteItemController,
    getMembersTodayWorkItemsControlle,
    getMembersWorkItemsByDateControlle
};
