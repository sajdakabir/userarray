import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const TeamSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    key: {
        type: String,
        required: true
    },
    linearTeamId: {
        type: String
    },
    workspace: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    cycleView: {
        type: Boolean,
        default: true
    },
    roadmapView: {
        type: Boolean,
        default: true
    },
    backlogView: {
        type: Boolean,
        default: true
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

TeamSchema.pre("save", async function (next) {
    const team = this;

    const existingTeam = await Team.findOne({
        $or: [
            { name: team.name },
            { key: team.key }
        ],
        workspace: team.workspace
    });

    if (existingTeam) {
        if (existingTeam.name === team.name) {
            const error = new Error("The Team name is already taken.");
            error.statusCode = 400;
            return next(error);
        }
        if (existingTeam.key === team.key) {
            const error = new Error("The Team key is already taken.");
            error.statusCode = 400;
            return next(error);
        }
    }

    next();
});

const Team = db.model('Team', TeamSchema, 'teams')

export {
    Team
};
