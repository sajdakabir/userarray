import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const NoteSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    content: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workspace: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    }
}, {
    timestamps: true
});
NoteSchema.index({ date: 1, user: 1, workspace: 1 }, { unique: true });
const Note = db.model('Note', NoteSchema, 'notes');

export {
    Note
}
