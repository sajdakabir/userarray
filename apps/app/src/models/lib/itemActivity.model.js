import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const ItemActivitySchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    verb: {
        type: String,
        default: 'created'
    },
    field: {
        type: String
    },
    oldValue: {
        type: String
    },
    newValue: {
        type: String
    },
    comment: {
        type: String
    },
    attachments: {
        type: [String], // URLs are stored as strings
        default: []
    },
    oldIdentifier: {
        type: String, // ID is stored as a string
        default: null
    },
    newIdentifier: {
        type: String, // ID is stored as a string
        default: null
    },
    space: {
        type: Schema.Types.ObjectId,
        ref: 'Space'
    },
    workspace: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace'
    },
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Item'
    },
    cycle: {
        type: Schema.Types.ObjectId,
        ref: 'Cycle'
    },
    itemComment: {
        type: Schema.Types.ObjectId,
        ref: 'ItemComment'
    },
    actor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const ItemActivity = db.model('ItemActivity', ItemActivitySchema, 'item-activities');

export {
    ItemActivity
}
