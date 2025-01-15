import { createLabel, getLabels, getLabel, updateLabel, deleteLabel } from "../../services/lib/label.service.js";
import { CreateLabelPayload, UpdateLabelPayload } from "../../payloads/lib/label.payload.js";

const createLabelController = async (req, res, next) => {
    try {
        const { error, value: labelData } = CreateLabelPayload.validate(req.body);

        if (error) {
            const err = error.details[0].message;
            err.statusCode = 400;
            throw err;
        }
        const space = res.locals.space;
        const label = await createLabel(labelData, space);

        res.json({
            status: 200,
            response: label
        });
    } catch (err) {
        next(err);
    }
};

const getLabelsController = async (req, res, next) => {
    try {
        const workspace = res.locals.workspace;
        const labels = await getLabels(workspace);

        res.json({
            status: 200,
            response: labels
        });
    } catch (err) {
        next(err);
    }
};

const getLabelController = async (req, res, next) => {
    try {
        const { label: id } = req.params;
        const workspace = res.locals.workspace;
        const label = await getLabel(id, workspace);

        res.json({
            status: 200,
            response: label
        });
    } catch (err) {
        next(err);
    }
};

const updateLabelController = async (req, res, next) => {
    try {
        const { label: id } = req.params;
        const space = res.locals.space;
        const { error, value: updatedData } = UpdateLabelPayload.validate(req.body);

        if (error) {
            const err = error.details[0].message;
            err.statusCode = 400;
            throw err;
        }
        const updatedLabel = await updateLabel(id, space, updatedData);
        res.json({
            status: 200,
            response: updatedLabel
        });
    } catch (err) {
        next(err);
    }
};

const deleteLabelController = async (req, res, next) => {
    try {
        const { label: id } = req.params;
        const space = res.locals.space;
        await deleteLabel(id, space);
        res.json({
            status: 200,
            message: "Label deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

export {
    createLabelController,
    getLabelsController,
    getLabelController,
    updateLabelController,
    deleteLabelController
}
