import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const workspaceMemberSchema = new Schema({
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
    workspace: {
        type: Schema.Types.ObjectId,
        ref: "Workspace",
        required: true
    },
    member: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
}
);

workspaceMemberSchema.index({
    name: "text"
});

const WorkspaceMember = db.model("WorkspaceMember", workspaceMemberSchema, "workspace-members");

export { WorkspaceMember };
