import { getSpaceByIdentifier, daleteSpace, getWorkspaceProfile } from "../../services/lib/workspace.service.js"
import { createTeam, getAllTeam, updateTeam } from "../../services/lib/team.service.js";
import { CreateTeamPayload, UpdateTeamPayload } from "../../payloads/lib/team.payload.js";
import { linearQueue } from "../../loaders/bullmq.loader.js";
import { tryCatch } from "bullmq";

export const createTeamController = async (req, res, next) => {
    try {
        const workspace = res.locals.workspace;
        const createdBy = res.locals.user.id;
        const { error, value } = CreateTeamPayload.validate(req.body);

        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const teamData = {
            ...value,
            workspace: workspace._id,
            createdBy
        };

        const team = await createTeam(teamData, workspace);

        await linearQueue.add(
            "linearQueue",
            {
                accessToken: workspace.integration.linear.accessToken,
                linearTeamId: workspace.integration.linear.teamId,
                teamId: team._id,
                userId: createdBy
            },
            {
                attempts: 3,
                backoff: 1000,
                timeout: 30000
            }
        );


        res.json({
            status: 200,
            response: team
        });
    } catch (err) {
        next(err);
    }
};

export const getAllTeamsController = async (req, res, next) => {
    try {
        const workspace = res.locals.workspace;
        const teams = await getAllTeam(workspace);
        res.json({
            status: 200,
            response: teams
        });
    } catch (err) {
        next(err);
    }
};

const getSpaceByIdentifierController = async (req, res, next) => {
    try {
        const { workspace: slug, space: identifier } = req.params;
        const space = await getSpaceByIdentifier(slug, identifier);
        res.json({
            status: 200,
            response: space
        });
    } catch (err) {
        next(err);
    }
};

const getSpaceByNameController = async (req, res, next) => {
    try {
        const space = res.locals.space;
        res.json({
            status: 200,
            response: space
        });
    } catch (err) {
        next(err);
    }
};

export const updateTeamController = async (req, res, next) => {
    try {
        console.log("hey")
        const { team: name } = req.params;
        const updatedData = req.body;

        const workspace = res.locals.workspace;
        const updatedSpace = await updateTeam(name, workspace, updatedData);
        res.json({
            status: 200,
            message: "Space updated successfully",
            response: updatedSpace
        });
    } catch (err) {
        next(err);
    }
};

export const deleteTeamController = async (req, res, next) => {
    try {
        
        await deleteTeam(team);
        res.json({
            status: 200,
            message: "Team deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

export const getAllPublicTeamsController = async ( req, res, next ) => {
    const { workspace: slug } = req.params;
        try{

            const workspace = await getWorkspaceProfile(slug)

            res.json({
                status: 200,
                response: workspace.teams
            });

        } catch(err){
            next(err)
        }

}

const daleteSpaceController = async (req, res, next) => {
    try {
        const workspace = res.locals.workspace;
        const space = res.locals.space
        await daleteSpace(space, workspace);
        res.json({
            status: 200,
            message: "Space deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

export {
    getSpaceByIdentifierController,
    getSpaceByNameController,
    daleteSpaceController
};
