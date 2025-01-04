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


const CycleFavoriteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cycle: {
        type: Schema.Types.ObjectId,
        ref: 'Cycle',
        required: true
    }
}, {
    timestamps: true
});

CycleSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const lastCycle = await Cycle.findOne({ space: this.space }).sort({ sequenceId: -1 }).limit(1);
            this.sequenceId = lastCycle ? lastCycle.sequenceId + 1 : 1;
            this.name = this.name || `Week ${this.sequenceId}`;
        } catch (error) {
            console.error(error);
        }
    }

    next();
});

const Cycle = db.model('Cycle', CycleSchema, 'cycles')
// const CycleItem = db.model('CycleItem', CycleItemSchema, 'cycle-items')
const CycleFavorite = db.model('CycleFavorite', CycleFavoriteSchema, 'cycle-favorites')

export {
    Cycle,
    CycleFavorite
}
