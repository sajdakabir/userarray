import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const workspaceMemberInviteSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    role: {
        type: String
    },
    status: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    workspace: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isRevoked: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const WorkspaceMemberInvite = db.model('WorkspaceMemberInvite', workspaceMemberInviteSchema, 'invitations')

export {
    WorkspaceMemberInvite
};
