import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const IssueSchema = new Schema(
  {
    uuid: {
        type: String,
        default: () => uuid()
    },
    linearId: { type: String},
    title: { type: String, required: true },
    description: { type: String },
    // number: { type: Number },
    state: {
      id: { type: String },
      name: { type: String },
    },
    labels: [
      {
        id: { type: String },
        name: { type: String },
      },
    ],
    dueDate: { type: Date },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    priority: { type: Number },
    project: {
      id: { type: String },
      name: { type: String },
    },
    assignee: {
      id: { type: String },
      name: { type: String },
    },
    url: { type: String},
    linearTeamId: { type: String},
    space: { type: Schema.Types.ObjectId, ref: 'Space' },
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
  },
  { timestamps: true }
);

export const Issue = mongoose.model('Issue', IssueSchema);
