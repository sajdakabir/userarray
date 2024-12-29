import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const LabelSchema = new Schema({
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
    color: {
        type: String
    },
    counter: {
        type: Number,
        default: 0
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
    }
}, { timestamps: true });

LabelSchema.pre('save', async function (next) {
    if (!this.isNew) {
        return next();
    }

    const existingLabel = await this.constructor.findOneAndUpdate(
        { name: this.name, space: this.space },
        { $inc: { counter: 1 } },
        { new: true }
    );

    if (existingLabel) {
        this.name = `${this.name}${existingLabel.counter}`;
    }

    next();
});

const Label = db.model('Label', LabelSchema, 'labels')

export {
    Label
}
