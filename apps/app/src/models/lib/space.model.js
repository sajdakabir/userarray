import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const SpaceSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    name: {
        type: String,
        required: true
    },
    identifier: {
        type: String,
        required: true,
        uppercase: true
    },
    workspace: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    cycleView: {
        type: Boolean,
        default: true
    },
    roadmapView: {
        type: Boolean,
        default: true
    },
    backlogView: {
        type: Boolean,
        default: true
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

SpaceSchema.pre("save", async function (next) {
    const space = this;

    const existingSpace = await Space.findOne({
        $or: [
            { name: space.name },
            { identifier: space.identifier }
        ],
        workspace: space.workspace
    });

    if (existingSpace) {
        if (existingSpace.name === space.name) {
            const error = new Error("The Space name is already taken.");
            error.statusCode = 400;
            return next(error);
        }
        if (existingSpace.identifier === space.identifier) {
            const error = new Error("The Space identifier is already taken.");
            error.statusCode = 400;
            return next(error);
        }
    }

    next();
});

const Space = db.model('Space', SpaceSchema, 'spaces')

export {
    Space
};
