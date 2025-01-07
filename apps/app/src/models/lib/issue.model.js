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
    number: { type: Number },
    state: {
      id: { type: String },
      name: { type: String },
    },
    labels: [
      {
        id: { type: String },
        name: { type: String },
        color: { type: String },
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
    cycle: {
        id: { type: String },
        name: { type: String },
        startsAt: { type: Date },
        endsAt: { type: Date },
      },
    url: { type: String},
    linearTeamId: { type: String},
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    isArchived: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
  },
  { timestamps: true }
);


const Issue = db.model('Issue', IssueSchema, 'issues')

export {
    Issue
}