import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const RoadmapSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: Schema.Types.Mixed,
        default: {}
    },
    sequenceId: {
        type: Number,
        required: true,
        default: 1
    },
    targetDate: {
        type: Date,
        default: null
    },
    horizon: {
        type: String,
        enum: ["now", "next", "draft"]
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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
    assignees: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    labels: [{
        type: Schema.Types.ObjectId,
        ref: 'Label'
    }],
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

RoadmapSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            // Get the maximum sequenceId value from the database specific to space
            const lastRoadmap = await Roadmap.findOne({ space: this.space }).sort({ sequenceId: -1 }).limit(1);

            this.sequenceId = lastRoadmap ? lastRoadmap.sequenceId + 1 : 1;
        } catch (error) {
            console.error(error);
        }
    }

    next();
});

const Roadmap = db.model('Roadmap', RoadmapSchema, 'roadmaps')

export {
    Roadmap
};
