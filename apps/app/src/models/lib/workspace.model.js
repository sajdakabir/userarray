import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";
// import { SpaceSchema } from "../lib/space.model.js"

const WorkspaceSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    // spaces: [
    //     SpaceSchema
    // ],
    spaces: [{
        type: Schema.Types.ObjectId,
        ref: 'Space'
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

WorkspaceSchema.index({
    name: "text"
})

// WorkspaceSchema.pre("save", async function (next) {
//     const workspace = this;

//     // Check uniqueness of spaces within the workspace
//     const uniqueNames = new Set();
//     const uniqueIdentifiers = new Set();

//     workspace.spaces.some((space) => {
//         const nameKey = `${space.name}`;
//         const identifierKey = `${space.identifier}`;
//         // Check for duplicate identifier
//         if (uniqueIdentifiers.has(identifierKey)) {
//             const error = new Error("The Space identifier is already taken.");
//             error.statusCode = 400;
//             throw error;
//         }
//         uniqueIdentifiers.add(identifierKey);

//         // Check for duplicate name
//         if (uniqueNames.has(nameKey)) {
//             const error = new Error("The Space name is already taken.");
//             error.statusCode = 400;
//             throw error;
//         }
//         uniqueNames.add(nameKey);
//         return false;
//     });

//     next();
// });

const Workspace = db.model('Workspace', WorkspaceSchema, 'workspaces')
// Workspace.syncIndexes();
export {
    Workspace
};
