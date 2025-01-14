import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const effortChoices = ["none", "large", "medium", "small"];
const statusChoices = ["inbox", "todo", "in progress", "done"];

const ItemSchema = new Schema({
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
    status: {
        type: String,
        enum: statusChoices,
        default: "inbox"
    },
    effort: {
        type: String,
        enum: effortChoices
    },
    dueDate: {
        type: Date,
        default: null
    },
    sequenceId: {
        type: Number,
        required: true,
        default: 1
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
    },
    workspace: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace'
    },
    roadmaps: [{
        type: Schema.Types.ObjectId,
        ref: 'Roadmap'
    }],
    cycles: [{
        type: Schema.Types.ObjectId,
        ref: 'Cycle'
    }],
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Item'
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

ItemSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            // Get the maximum sequenceId value from the database specific to space
            const lastIssue = await Item.findOne({ space: this.space }).sort({ sequenceId: -1 }).limit(1);

            this.sequenceId = lastIssue ? lastIssue.sequenceId + 1 : 1;
        } catch (error) {
            console.error(error);
        }
    }

    next();
});

const ItemCommentSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    comment: {
        type: String,
        default: ''
    },
    attachments: {
        type: [String],
        default: []
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
    actor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// TODO: need to take a look
// ItemCommentSchema.pre('save', function (next) {
//     this.commentStripped = this.comment_html !== '' ? stripTags(this.comment_html) : '';
//     next();
// });

const Item = db.model('Item', ItemSchema, 'items')
const ItemComment = db.model('ItemComment', ItemCommentSchema, 'item-comments');

export {
    Item,
    ItemComment
};
