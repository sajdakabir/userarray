import { WorkspaceMember } from "../../models/lib/workspaceMember.model.js";
import { WorkspaceMemberInvite } from "../../models/lib/invitation.model.js";

const createWorkspaceMember = async (workspace, createdBy, {
    member,
    role,
    status
}) => {
    const workspaceMember = await WorkspaceMember.create({
        workspace,
        member,
        createdBy,
        role,
        status
    });
    if (!workspaceMember) {
        const error = new Error("Failed to create the workspace member");
        error.statusCode = 500;
        throw error;
    }
    return workspaceMember;
};

const getWorkspaceMemberByUser = async (workspace, user) => {
    const workspaceMember = await WorkspaceMember.findOne({
        workspace,
        member: user,
        isDeleted: false
    });
    return workspaceMember;
};

const getWorkspaceMember = async (workspace, id) => {
    const workspaceMember = await WorkspaceMember.findOne({
        workspace,
        uuid: id,
        isDeleted: false
    });
    if (!workspaceMember) {
        const error = new Error("Member not found");
        error.statusCode = 500;
        throw error;
    }
    return workspaceMember;
};

const createInvitation = async (workspace, createdBy, { user, email, role, message }) => {
    const workspaceMember = await WorkspaceMemberInvite.create({
        workspace,
        user,
        createdBy,
        email,
        role,
        message,
        status: "pending"
    });
    return workspaceMember;
};

const getUserWorkspaceInvitations = async (user) => {
    const email = user.accounts.local.email || user.accounts.google.email;
    const invitations = await WorkspaceMemberInvite.find({
        email,
        status: "pending",
        isDeleted: false,
        isRevoked: false
    }).populate({
        path: 'createdBy',
        select: 'userName fullName avatar'
    }).populate({
        path: 'workspace',
        select: 'name slug'
    });

    if (!invitations) {
        const error = new Error("No invitations found for this user");
        error.statusCode = 404;
        throw error;
    }
    return invitations;
};

const getWorkspaceInvitation = async (workspace, user) => {
    const invitations = await WorkspaceMemberInvite.find({
        workspace,
        user,
        isDeleted: false
    });
    if (!invitations) {
        const error = new Error("No invitations found for this workspace slug");
        error.statusCode = 404;
        throw error;
    }
    return invitations;
};

const getWorkspaceInvitations = async (workspace) => {
    const invitations = await WorkspaceMemberInvite.find({
        workspace: workspace._id,
        isDeleted: false
    });
    if (!invitations) {
        const error = new Error("No invitations found for this workspace slug");
        error.statusCode = 404;
        throw error;
    }
    return invitations;
};

const validateInvitation = async (id, user, workspace) => {
    const invitation = await WorkspaceMemberInvite.findOne({
        uuid: id,
        workspace,
        user,
        isDeleted: false,
        isRevoked: false
    });
    return invitation;
};

const getWorkspaceInvitationByUuid = async (workspace, id) => {
    const invitation = await WorkspaceMemberInvite.findOne({
        workspace: workspace._id,
        uuid: id,
        isDeleted: false
    });
    if (!invitation) {
        const error = new Error("Invitation not found");
        error.statusCode = 404;
        throw error;
    }
    return invitation;
};

const deleteWorkspaceInvitationByUuid = async (workspace, id) => {
    const invitation = await WorkspaceMemberInvite.findOneAndDelete({
        workspace: workspace._id,
        uuid: id
    });
    if (!invitation) {
        const error = new Error("Invitation not found");
        error.statusCode = 404;
        throw error;
    }
    return invitation;
};

const revokeMemberInvitation = async (id, workspace) => {
    const invitation = await validateInvitation(id, workspace);
    await invitation.updateOne(
        {
            $set: {
                isDeleted: true
            }
        },
        {
            new: true
        }
    );
    return invitation;
};

const getAllWorkspaceMembers = async (id) => {
    const workspaceMembers = await WorkspaceMember.find({
        workspace: id,
        isDeleted: false
    })
        .populate({
            path: 'member',
            select: {
                'accounts.local.password': 0,
                updatedAt: 0,
                __v: 0
            }
        })
        .exec();

    return workspaceMembers;
};

const countAdminRoleWorkspaceMember = async (id) => {
    const adminCount = await WorkspaceMember.countDocuments({
        workspace: id,
        'role': 'admin',
        isDeleted: false
    })
    return adminCount;
};

const leaveWorkspace = async (id) => {
    const workspaceMember = await WorkspaceMember.findOne({
        _id: id,
        isDeleted: false
    })
    await WorkspaceMember.updateOne({
        $set: {
            isDeleted: true
        }
    })
    return workspaceMember;
};

export {
    createWorkspaceMember,
    getWorkspaceMemberByUser,
    createInvitation,
    getWorkspaceInvitations,
    getWorkspaceInvitationByUuid,
    deleteWorkspaceInvitationByUuid,
    validateInvitation,
    revokeMemberInvitation,
    getAllWorkspaceMembers,
    getWorkspaceMember,
    countAdminRoleWorkspaceMember,
    getWorkspaceInvitation,
    leaveWorkspace,
    getUserWorkspaceInvitations
};
