import { Space } from "../../models/lib/space.model.js";

const createSpace = async (spaceData, workspace) => {
    const space = await Space.create(spaceData);
    if (!space) {
        const error = new Error("Failed to create the space");
        error.statusCode = 500;
        throw error;
    }
    workspace.spaces.push(space._id);
    await workspace.save();
    return space;
};

export { createSpace };
