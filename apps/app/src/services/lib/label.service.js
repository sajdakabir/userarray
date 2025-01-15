import { Label } from "../../models/lib/label.model.js"

const createLabel = async (labelData, space) => {
    const label = new Label({
        ...labelData,
        space: space._id,
        workspace: space.workspace
    });

    await label.save();
    if (!label) {
        const error = new Error("Failed to create the label")
        error.statusCode = 500
        throw error
    }
    return label;
}

const createLabels = async (labelsData, workspace) => {
    const labels = labelsData.map(labelData => ({
        ...labelData,
        workspace
    }));

    const createdLabels = await Label.insertMany(labels);

    if (!createdLabels) {
        const error = new Error("Failed to create the labels")
        error.statusCode = 500
        throw error
    }

    return createdLabels;
}

const getLabels = async (workspace) => {
    const labels = await Label.find({
        workspace: workspace._id
    })
        .sort({ name: 1 })
        .exec();

    return labels;
}

const getLabel = async (id, workspace) => {
    const label = await Label.findOne({
        uuid: id,
        workspace: workspace._id
    });
    if (!label) {
        const error = new Error("Label not found")
        error.statusCode = 404
        throw error
    }
    return label;
}

const updateLabel = async (id, space, updatedData) => {
    const updatedLabel = await Label.findOneAndUpdate({
        uuid: id,
        space
    },
    { $set: updatedData },
    { new: true }
    )
    if (!updatedLabel) {
        const error = new Error("Failed to update Label");
        error.statusCode = 500;
        throw error;
    }
    return updatedLabel;
}

const deleteLabel = async (id, space) => {
    await Label.findOneAndDelete({
        uuid: id
    });
}

const getWorkSpaceLabels = async (workspace) => {
    const labels = await Label.find({
        workspace: workspace._id,
        isDeleted: false
    })
    return labels;
}

export {
    createLabel,
    createLabels,
    getLabels,
    getLabel,
    updateLabel,
    deleteLabel,
    getWorkSpaceLabels
};
