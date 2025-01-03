import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const WorkspaceSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    website: {
        type: String,
        required: true
    },
    spaces: [{
        type: Schema.Types.ObjectId,
        ref: 'Space'
    }],
    integration: {
        linear: {
            accessToken: String,
            workspaceId: String,
            connected: { type: Boolean, default: false }
        }
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

WorkspaceSchema.index({
    name: "text"
})


const Workspace = db.model('Workspace', WorkspaceSchema, 'workspaces')

export {
    Workspace
};
