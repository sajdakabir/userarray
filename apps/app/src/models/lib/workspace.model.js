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
        type: String
    },
    teams: [{
        type: Schema.Types.ObjectId,
        ref: 'Team'
    }],
    integration: {
        linear: {
            accessToken: String,
            teamId: String,
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
WorkspaceSchema.index({ slug: 1 }, { unique: true });

WorkspaceSchema.index({ name: "text" });
const Workspace = db.model('Workspace', WorkspaceSchema, 'workspaces')

export {
    Workspace
};
