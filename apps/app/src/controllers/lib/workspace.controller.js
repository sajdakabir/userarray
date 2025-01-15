import { WorkSpaceAvailabilityCheck, createWorkspace, getUserWorkspaces, updateWorkspace, deleteWorkspace, userWorkSpaces } from "../../services/lib/workspace.service.js";
import { createWorkspaceMember, getWorkspaceMemberByUser, getWorkspaceMember, createInvitation, getWorkspaceInvitations, getWorkspaceInvitationByUuid, deleteWorkspaceInvitationByUuid, validateInvitation, getAllWorkspaceMembers, getWorkspaceInvitation, countAdminRoleWorkspaceMember, leaveWorkspace, getUserWorkspaceInvitations } from "../../services/lib/workspaceMember.service.js";
import { createEmailUser, getUserByEmail, getUserById } from "../../services/core/user.service.js";
import { generateRandomPassword, sendEmail, readTemplateFile } from "../../utils/helper.service.js";
import { environment } from "../../loaders/environment.loader.js";
import { getLabels, createLabels } from "../../services/lib/label.service.js";


import { CreateWorkspacePayload, UpdateWorkspacePayload } from "../../payloads/lib/workspace.payload.js";
import { getWorkspaceProfile } from "../../services/lib/workspace.service.js";

const WorkSpaceAvailabilityCheckController = async (req, res, next) => {
    try {
        const { slug } = req.query;
        if (!slug || slug === "") {
            return res.status(400).json({ error: "Workspace Slug is required" });
        }
        const isAvailable = await WorkSpaceAvailabilityCheck(slug);
        res.json({
            status: 200,
            response: isAvailable
        });
    } catch (err) {
        next(err);
    }
};

const createWorkspaceController = async (req, res, next) => {
    try {
        const { error, value } = CreateWorkspacePayload.validate(req.body);

        if (error) {
            const err = error.details[0].message;
            err.statusCode = 400;
            throw err;
        }
        const { slug, name } = value;
        const createdBy = req.user.id
        const workspace = await createWorkspace(slug, name, createdBy);
        await createWorkspaceMember(workspace._id, createdBy, {
            member: createdBy,
            role: "admin",
            status: "accepted"
        })

        const labelsData = [
            { "name": "Bugs", "color": "#dc2626" },
            { "name": "Features", "color": "#7c3aed" },
            { "name": "Improvement", "color": "#3b82f6" },
            { "name": "UI/UX", "color": "#7057ff" }
        ];
        await createLabels(labelsData, workspace._id);

        res.json({
            status: 200,
            response: workspace,
        });
    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyValue) {
            return res.json({
                status: 410,
                response: "The workspace with the slug already exists"
            });
        }
        next(err);
    }
};

const getUserWorkspacesController = async (req, res, next) => {
    try {
        const user = req.user.id;
        const workspaces = await getUserWorkspaces(user);
        res.json({
            status: 200,
            response: workspaces
        });
    } catch (err) {
        next(err);
    }
};

const getWorkspaceProfileController = async (req, res, next) => {
    
    try {
        const workspace = res.locals.workspace;
        res.json({
            status: 200,
            response: workspace
        });
    } catch (err) {
        next(err);
    }
};

const getAllWorkspaceMembersController = async (req, res, next) => {
    try {
        const workspace = res.locals.workspace;
        const workspaceMembers = await getAllWorkspaceMembers(workspace._id);
        res.json({
            status: 200,
            response: workspaceMembers
        });
    } catch (err) {
        next(err);
    }
};

const getWorkspaceMemberController = async (req, res, next) => {
    try {
        const { member: id } = req.params;
        const workspace = res.locals.workspace;
        const workspaceMember = await getWorkspaceMember(workspace._id, id);
        res.json({
            status: 200,
            response: workspaceMember
        });
    } catch (err) {
        next(err);
    }
};

const updateWorkspaceController = async (req, res, next) => {
    try {
        const { error, value } = UpdateWorkspacePayload.validate(req.body);

        if (error) {
            const err = error.details[0].message;
            err.statusCode = 400;
            throw err;
        }
        const { name } = value;
        const workspace = res.locals.workspace;
        const updatedWorkspace = await updateWorkspace(workspace, name);
        res.json({
            status: 200,
            message: "Workspace updated successfully",
            response: updatedWorkspace
        });
    } catch (err) {
        next(err);
    }
};

const deleteWorkspaceController = async (req, res, next) => {
    
    
    try {
        const workspace = res.locals.workspace;
        await deleteWorkspace(workspace);
        res.json({
            status: 200,
            message: "Workspace deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

export const getWorkspacePublicProfileController = async (req, res, next) => {
    try {
        const { slug } = req.query;

        const workspace = await getWorkspaceProfile(slug);

        // Remove the integration field from the workspace object
        const { integration, ...publicWorkspace } = workspace.toObject();

        res.json({
            status: 200,
            response: publicWorkspace
        });
    } catch (err) {
        next(err);
    }
}

const archiveWorkspaceController = async () => {};

const inviteMemberToWorkspaceController = async (req, res, next) => {
    try {
        const { email, role, redirectUrl, message } = req.body;
        const workspace = res.locals.workspace;

        const requestingUserData = res.locals.user;
        // Check for role level
        const requestingUser = await getWorkspaceMemberByUser(
            workspace._id,
            requestingUserData._id
        );
        if (requestingUser.role !== "admin") {
            const error = new Error(
                "Member cannot invite new members to the Workspace"
            );
            error.statusCode = 400;
            throw error;
        }
        let user = await getUserByEmail(req.body.email);
        if (!user) {
            const userName = email.split('@')[0];
            user = await createEmailUser({ fullName: email.split('@')[0], userName, email, password: generateRandomPassword() })
        }

        const workspaceMember = await getWorkspaceMemberByUser(
            workspace._id,
            user._id
        );
        if (workspaceMember) {
            const error = new Error("Invitation already sent");
            error.statusCode = 400;
            throw error;
        }

        // TODO: check if the invitation already present in the db or not and also add the expires
        const invitation = await createInvitation(workspace._id, requestingUserData._id, {
            user: user._id,
            role,
            email
        });
        await createWorkspaceMember(workspace._id, requestingUserData._id, {
            member: user._id,
            role,
            status: "pending"
        })
        // const token = await generateJWTToken(
        //     {
        //         "email": email.toLowerCase(),
        //         "invitation": invitation.uuid,
        //         "type": "invitation",
        //         role,
        //         workspace: workspace.uuid
        //     }, '2d'
        // );
        res.json({
            status: 200,
            message: "Invitation sent"
        });
        if (invitation) {
            sendEmail({
                from: {
                    name: "Marchbot",
                    address: "hello@trymarch.dev"
                },
                to: {
                    name: email.split('@')[0],
                    address: email
                },
                subject: `[march] Invitation`,
                content: await readTemplateFile("invite-link", {
                    inviterName: requestingUserData.userName || requestingUserData.fullName,
                    name: user.userName || user.fullName,
                    invitationId: invitation.uuid,
                    slug: workspace.slug,
                    workspaceName: workspace.name,
                    redirectUrl,
                    message,
                    host: environment.WEB_HOST
                })
            });
        }
    } catch (err) {
        next(err);
    }
};
// TODO: need to look
const reinviteWorkspaceMembersController = async (req, res, next) => {
    try {
        const { member: id } = req.params;
        const workspace = res.locals.workspace;
        // const workspaceMember = await getWorkspaceMember(workspace._id, id);
        const invitations = await getWorkspaceInvitation(workspace._id, id);
        const invitation = invitations[0];
        console.log(invitation);
        res.json({
            status: 200,
            message: "Invitation sent"
        });
        // if (invitation) {
        //     await sendEmail({
        //         from: {
        //             name: "Notifications | March",
        //             address: "hello@trymarch.dev"
        //         },
        //         to: {
        //             name: invitation.email.split('@')[0],
        //             address: invitation.email
        //         },
        //         subject: `${requestingUserData?.fullName} has invited you to join ${workspace?.name}`,
        //         content: await readTemplateFile("invite-link", {
        //             name: user.userName || user.fullName,
        //             token,
        //             redirectUrl,
        //             host: environment.WEB_HOST
        //         })
        //     });
        // }
    } catch (err) {
        next(err);
    }
}
const deleteWorkspaceInvitationByUuidController = async (req, res, next) => {
    try {
        const workspace = res.locals.workspace;
        await deleteWorkspaceInvitationByUuid(workspace._id, req.params.invitation);
        res.json({
            status: 200,
            message: "Invitation deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

const getWorkspaceInvitationsController = async (req, res, next) => {
    try {
        const workspace = res.locals.workspace;
        const invitations = await getWorkspaceInvitations(workspace._id);
        res.json({
            status: 200,
            response: invitations
        });
    } catch (err) {
        next(err);
    }
};

const getWorkspaceInvitationByUuidController = async (req, res, next) => {
    try {
        const workspace = res.locals.workspace;
        const invitation = await getWorkspaceInvitationByUuid(
            workspace._id,
            req.params.invitation
        );
        res.json({
            status: 200,
            response: invitation
        });
    } catch (err) {
        next(err);
    }
};

const userWorkSpacesController = async (req, res, next) => {
    try {
        const user = req.user;
        const workspaces = await userWorkSpaces(user.id);
        res.json({
            status: 200,
            response: workspaces
        });
    } catch (err) {
        next(err);
    }
};

const getUserWorkspaceInvitationsController = async (req, res, next) => {
    try {
        const user = await getUserById(req.user.uuid);
        const invitations = await getUserWorkspaceInvitations(user);
        res.json({
            status: 200,
            response: invitations
        });
    } catch (err) {
        next(err);
    }
};

const joinWorkspaceController = async (req, res, next) => {
    try {
        const { invitation: invitationId } = req.params;
        const workspace = res.locals.workspace;
        const user = res.locals.user;

        const invitation = await validateInvitation(invitationId, user._id, workspace._id)
        if (!invitation) {
            const error = new Error("Invalid invitation")
            error.statusCode = 403
            throw error;
        }
        await invitation.updateOne(
            {
                $set: {
                    status: "accepted",
                    isDeleted: true
                }
            },
            {
                new: true
            }
        );
        const workspaceMember = await getWorkspaceMemberByUser(
            workspace._id,
            user._id
        );
        await workspaceMember.updateOne({
            role: invitation.role,
            $set: {
                status: "accepted"
            }
        })
        user.lastWorkspace = workspace._id;
        await user.save()

        res.json({
            status: 200,
            message: 'Joined workspace successfully'
        });
    } catch (err) {
        next(err);
    }
};

const leaveWorkspaceController = async (req, res, next) => {
    try {
        const workspace = res.locals.workspace;
        const user = res.locals.user;
        const workspaceMember = await getWorkspaceMemberByUser(
            workspace._id,
            user._id
        );
        // Only Admin case
        if (workspaceMember.role === 'admin' && await countAdminRoleWorkspaceMember(workspace._id) === 1) {
            return res.status(400).json({
                error: 'You cannot leave the workspace since you are the only admin of the workspace. You should delete the workspace.'
            });
        }
        await leaveWorkspace(workspaceMember._id);
        res.json({
            status: 200,
            message: "leave the workspace successfully"
        });
    } catch (err) {
        next(err);
    }
};

const getEverything = async (req, res, next) => {
    try {
        const workspace = res.locals.workspace;
        const user = res.locals.user;
        const members = await getAllWorkspaceMembers(workspace._id);
        const response = {
            status: 200,
            response: {
                members,
                inbox,
                spacesData: []
            }
        };

        for (const team of workspace.teams) {
            const teamData = {};
            teamData.uuid = team.uuid;
            teamData.name = team.name;
            teamData.identifier = team.identifier;

            const teamLabels = await getLabels(workspace._id, team._id);
            const teamItems = await getItems(workspace._id, team._id);

            teamData.labels = teamLabels;
            teamData.items = teamItems;
            teamData.archived = teamArchivedItems;
            teamData.cycles = teamCycle;
            teamData.roadmaps = teamRoadmap;

            response.response.spacesData.push(teamData);
        }

        res.json(response);
    } catch (err) {
        next(err);
    }
};

export {
    WorkSpaceAvailabilityCheckController,
    createWorkspaceController,
    updateWorkspaceController,
    deleteWorkspaceController,
    archiveWorkspaceController,
    getUserWorkspacesController,
    getWorkspaceProfileController,
    inviteMemberToWorkspaceController,
    reinviteWorkspaceMembersController,
    getWorkspaceInvitationsController,
    getWorkspaceInvitationByUuidController,
    deleteWorkspaceInvitationByUuidController,
    userWorkSpacesController,
    joinWorkspaceController,
    getAllWorkspaceMembersController,
    getWorkspaceMemberController,
    leaveWorkspaceController,
    getEverything,
    getUserWorkspaceInvitationsController
};
