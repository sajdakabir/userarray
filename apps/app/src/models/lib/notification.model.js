import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const NotificationSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    workspace: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    space: {
        type: Schema.Types.ObjectId,
        ref: 'Space'
        // required: true
    },
    data: {
        type: Schema.Types.Mixed
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        default: ''
    },
    sender: {
        type: String,
        required: true
    },
    triggeredBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    readAt: {
        type: Date
    },
    archivedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const Notification = db.model('Notification', NotificationSchema, 'notifications')

export {
    Notification
}
