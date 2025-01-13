import { createItemComment, getItemComments, getItemComment, updateItemComment, deleteItemComment, createCycleComment, getCycleComments, updateCycleComment, getCycleComment, deleteCycleComment } from "../../services/lib/comment.service.js";

const createItemCommentController = async (req, res, next) => {
    try {
        const data = req.body;
        const { item: id } = req.params;
        const space = res.locals.space;
        const user = res.locals.user;
        const comment = await createItemComment(data, space, user._id, id);

        // await itemActivityQueue.add('trackIssueActivity', {
        //     type: 'comment.activity.created',
        //     requestedData: data,
        //     item: id,
        //     space: space._id,
        //     workspace: space.workspace,
        //     actor: user._id,
        //     notification: true
        //     // origin: req.get('origin')
        // });
        res.status(200).json({
            status: 200,
            response: comment
        });
    } catch (err) {
        next(err);
    }
};

const getItemCommentsController = async (req, res, next) => {
    try {
        const { item: id } = req.params;
        const space = res.locals.space;
        const itemComments = await getItemComments(id, space);
        res.status(200).json({
            status: 200,
            response: itemComments
        });
    } catch (err) {
        next(err);
    }
};

const getItemCommentController = async (req, res, next) => {
    try {
        const { item: id, comment: commentId } = req.params;
        const space = res.locals.space;
        const itemComment = await getItemComment(id, commentId, space);
        res.json({
            status: 200,
            response: itemComment
        });
    } catch (err) {
        next(err);
    }
};

const updateItemCommentController = async (req, res, next) => {
    try {
        const { item: id, comment: commentId } = req.params;
        const updatedData = req.body;
        const user = res.locals.user;
        const space = res.locals.space;
        const updatedItem = await updateItemComment(id, updatedData, user._id, space, commentId);
        res.json({
            status: 200,
            response: updatedItem
        });
    } catch (err) {
        next(err);
    }
};

const deleteItemCommentController = async (req, res, next) => {
    try {
        const { item: id, comment: commentId } = req.params;
        // const actor = res.locals.user;
        const space = res.locals.space;
        await deleteItemComment(space, commentId, id);
        // await itemActivityQueue.add('trackIssueActivity', {
        //     type: 'comment.activity.deleted',
        //     item: id,
        //     space: space._id,
        //     workspace: space.workspace,
        //     actor,
        //     notification: true
        // });
        res.json({
            status: 200,
            message: "Item comment deleted successfully"
        })
    } catch (err) {
        next(err);
    }
};



export {
    createItemCommentController,
    getItemCommentsController,
    getItemCommentController,
    updateItemCommentController,
    deleteItemCommentController,
}
