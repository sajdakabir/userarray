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
    description: {
        type: String,
        default: ''
    },
    sequenceId: {
        type: Number,
        required: true,
        default: 1
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    // items: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Item'
    // }],
    space: {
        type: Schema.Types.ObjectId,
        ref: 'Space'
        // required: true
    },
    workspace: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace'
        // required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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

// const CycleItemSchema = new Schema({
//     subItemsCount: {
//         type: Number
//     },
//     space: {
//         type: Schema.Types.ObjectId,
//         ref: 'Space'
//     },
//     workspace: {
//         type: Schema.Types.ObjectId,
//         ref: 'Workspace'
//     },
//     cycle: {
//         type: Schema.Types.ObjectId,
//         ref: 'Cycle',
//         required: true
//     },
//     item: {
//         type: Schema.Types.ObjectId,
//         ref: 'Item',
//         required: true
//     }
// }, {
//     timestamps: true
// });

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
