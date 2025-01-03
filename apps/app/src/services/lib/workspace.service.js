import { Space } from "../../models/lib/space.model.js";
import { Workspace } from "../../models/lib/workspace.model.js";
import { WorkspaceMember } from "../../models/lib/workspaceMember.model.js";
import { Cycle } from "../../models/lib/cycle.model.js";
import { Item } from "../../models/lib/item.model.js";
import { Label } from "../../models/lib/label.model.js";

const getWorkspaceProfile = async (slug) => {
    const workspace = await Workspace.findOne({
        slug,
        isDeleted: false
    })
        .populate('spaces')
    if (!workspace) {
        const error = new Error("Workspace not found")
        error.statusCode = 404
        throw error
    }
    return workspace
}

const validateUserWithWorkspace = async (user, workspace) => {
    console.log("hmm: ", user, workspace)
    const authorization = await WorkspaceMember.findOne({
        member: user,
        workspace: workspace._id,
        isDeleted: false
    })
    if (!authorization) {
        const error = new Error("User not authorised")
        error.statusCode = 403
        throw error
    }
    return authorization;
}

const WorkSpaceAvailabilityCheck = async (slug) => {
    const workspace = await Workspace.exists({ slug });
    return !workspace;
}

const createWorkspace = async (slug, name, createdBy, website) => {
    const workspace = await Workspace.create({
        slug,
        name,
        website,
        createdBy
    });
    if (!workspace) {
        const error = new Error("Failed to create the workspace")
        error.statusCode = 500
        throw error
    }
    return workspace;
}

const getUserWorkspaces = async (user) => {
    try {
        const memberWorkspaces = await WorkspaceMember.find({
            member: user,
            status: "accepted",
            isDeleted: false
        })
            .populate({
                path: 'workspace',
                populate: {
                    path: 'spaces',
                    select: 'name identifier workspace _id'
                }
            })

            .select('workspace')
            .exec();

        const allWorkspaces = memberWorkspaces.map(member => member.workspace);

        // allWorkspaces.forEach(workspace => {
        //     workspace.spaces = workspace.spaces.filter(space => !space.isDeleted);
        // });

        return allWorkspaces;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const updateWorkspace = async (workspace, name) => {
    workspace.name = name;
    await workspace.save();
    return workspace;
}

const deleteWorkspace = async (workspace) => {
    await Workspace.findOneAndDelete({
        uuid: workspace.uuid
    });
    return workspace;
}

const userWorkSpaces = async (user) => {
    const workspaces = await Workspace.find({
        'createdBy': user,
        'isDeleted': false
    })
        .populate({
            path: 'createdBy',
            select: 'userName fullName avatar'
        })
        .exec();
    const memberCount = await WorkspaceMember.aggregate([
        { $match: { member: user } },
        { $group: { _id: '$workspace', count: { $sum: 1 } } }
    ]);
    const workspacesWithMembers = workspaces.map((workspace) => {
        const totalMembers = memberCount.find((item) => item._id.equals(workspace._id))?.count || 0;
        return {
            ...workspace.toObject(),
            total_members: totalMembers
        };
    });
    return { workspaces: workspacesWithMembers };
};

const getWorkspaceBySlug = async (slug) => {
    const workspace = await Workspace.findOne({ slug }).populate("spaces");
    if (!workspace) {
        const error = new Error("Workspace not found")
        error.statusCode = 404
        throw error
    }
    return workspace;
};

const getAllSpaces = async (workspace) => {
    // const spaces = workspace.spaces.filter(space => !space.isDeleted);
    // return spaces;
    const spaces = await Space.find({
        'workspace': workspace._id
    });
    return spaces;
};

const getSpaceByIdentifier = async (slug, identifier) => {
    const workspace = await getWorkspaceBySlug(slug);
    const space = workspace.spaces.find((s) => s.identifier === identifier && !s.isDeleted);
    if (!space) {
        const error = new Error("Space not found")
        error.statusCode = 404
        throw error
    }

    return space;
};

const getSpaceByName = async (workspace, name) => {
    const space = await Space.findOne({
        name,
        workspace: workspace._id
    });
    if (!space) {
        const error = new Error("Space not found")
        error.statusCode = 404
        throw error
    }

    return space;
};

const updateSpace = async (name, workspace, updatedData) => {
    const updatedSpace = await Space.findOneAndUpdate({
        name,
        workspace: workspace._id
    },
    { $set: updatedData },
    { new: true }
    );

    if (!updatedSpace) {
        const error = new Error("Failed to update space");
        error.statusCode = 500;
        throw error;
    }
    return updatedSpace;
};

const daleteSpace = async (space, workspace) => {
    workspace.spaces.pull(space._id);
    await workspace.save();
    await Space.findOneAndDelete({
        uuid: space.uuid
    });
    await Cycle.deleteMany({ space: space._id });
    await Item.deleteMany({ space: space._id });
    await Label.deleteMany({ space: space._id });
    return 'OK';
}

export {
    getWorkspaceProfile,
    getWorkspaceBySlug,
    validateUserWithWorkspace,
    WorkSpaceAvailabilityCheck,
    createWorkspace,
    getUserWorkspaces,
    updateWorkspace,
    deleteWorkspace,
    userWorkSpaces,
    getAllSpaces,
    getSpaceByIdentifier,
    getSpaceByName,
    updateSpace,
    daleteSpace
};
