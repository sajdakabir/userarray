import { getAllSpaces, updateSpace, getSpaceByIdentifier, daleteSpace } from "../../services/lib/workspace.service.js"
import { createSpace } from "../../services/lib/space.service.js";
import { createLabels } from "../../services/lib/label.service.js";
import { createCycle } from "../../services/lib/cycle.service.js";
import { CreateSpacePayload, UpdateSpacePayload } from "../../payloads/lib/space.payload.js";

const createSpaceController = async (req, res, next) => {
    try {
        const workspace = res.locals.workspace;
        const createdBy = res.locals.user;
        const { error, value } = CreateSpacePayload.validate(req.body);

        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const spaceData = {
            ...value,
            workspace: workspace._id,
            createdBy
        };

        const space = await createSpace(spaceData, workspace);

        const labelsData = [
            { "name": "Bug", "color": "#dc2626" },
            { "name": "Feature", "color": "#7c3aed" },
            { "name": "Improvement", "color": "#3b82f6" }
        ];
        await createLabels(labelsData, space);

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const cycle1StartDate = new Date(today);
        const cycle1EndDate = new Date(cycle1StartDate);
        cycle1EndDate.setDate(cycle1EndDate.getDate() + 6);

        const cycle2StartDate = new Date(cycle1EndDate);
        cycle2StartDate.setDate(cycle2StartDate.getDate() + 1);
        const cycle2EndDate = new Date(cycle2StartDate);
        cycle2EndDate.setDate(cycle2EndDate.getDate() + 6);

        await createCycle({ startDate: cycle1StartDate, endDate: cycle1EndDate, space: space._id, workspace: space.workspace });
        await createCycle({ startDate: cycle2StartDate, endDate: cycle2EndDate, space: space._id, workspace: space.workspace });

        res.json({
            status: 200,
            response: space
        });
    } catch (err) {
        next(err);
    }
};

const getAllSpacesController = async (req, res, next) => {
    try {
        const workspace = res.locals.workspace;
        const spaces = await getAllSpaces(workspace);
        res.json({
            status: 200,
            response: spaces
        });
    } catch (err) {
        next(err);
    }
};

const getSpaceByIdentifierController = async (req, res, next) => {
    try {
        const { workspace: slug, space: identifier } = req.params;
        const space = await getSpaceByIdentifier(slug, identifier);
        res.json({
            status: 200,
            response: space
        });
    } catch (err) {
        next(err);
    }
};

const getSpaceByNameController = async (req, res, next) => {
    try {
        const space = res.locals.space;
        res.json({
            status: 200,
            response: space
        });
    } catch (err) {
        next(err);
    }
};

const updateSpaceController = async (req, res, next) => {
    try {
        const { space: name } = req.params;
        const updatedData = req.body;
        // const { error, updatedData } = UpdateSpacePayload.validate(req.body);

        // if (error) {
        //     const err = error.details[0].message;
        //     err.statusCode = 400;
        //     throw err;
        // }

        const workspace = res.locals.workspace;
        const updatedSpace = await updateSpace(name, workspace, updatedData);
        res.json({
            status: 200,
            message: "Space updated successfully",
            response: updatedSpace
        });
    } catch (err) {
        next(err);
    }
};

const daleteSpaceController = async (req, res, next) => {
    try {
        const workspace = res.locals.workspace;
        const space = res.locals.space
        await daleteSpace(space, workspace);
        res.json({
            status: 200,
            message: "Space deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

export {
    createSpaceController,
    getAllSpacesController,
    getSpaceByIdentifierController,
    getSpaceByNameController,
    updateSpaceController,
    daleteSpaceController
};
