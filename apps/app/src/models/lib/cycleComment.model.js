import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const CycleCommentSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    comment: {
        type: String,
        default: ''
    },
    attachments: {
        type: [String],
        default: []
    },
    space: {
        type: Schema.Types.ObjectId,
        ref: 'Space'
    },
    workspace: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace'
    },
    cycle: {
        type: Schema.Types.ObjectId,
        ref: 'Cycle'
    },
    actor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const CycleComment = db.model('CycleComment', CycleCommentSchema, 'cycle-comments');

export {
    CycleComment
}
