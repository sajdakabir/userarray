import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const CycleSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    name: {
        type: String
    },
    id: {
        type: String
    },
    linearTeamId: {
        type: String
    },
    startsAt: {
        type: Date,
        default: null
    },
    endsAt: {
        type: Date,
        default: null
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    workspace: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace'
    },
    completedAt: {
        type: Date,
        default: null
    },
    isArchived: {
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


const Cycle = db.model('Cycle', CycleSchema, 'cycles')

export {
    Cycle
}
