import { Team } from "../../models/lib/team.model.js";

export const createTeam = async (teamData, workspace) => {
    const { linearTeamId } = teamData;
    const existingTeam = await Team.findOne({ linearTeamId, workspace: workspace._id });
    if (existingTeam) {
        return existingTeam;
    }
    const team = await Team.create(teamData);
    if (!team) {
        const error = new Error("Failed to create the team");
        error.statusCode = 500;
        throw error;
    }
    workspace.teams.push(team._id);
    workspace.integration.linear.teamId = linearTeamId;
    workspace.integration.linear.team = team._id;
    await workspace.save();
    return team;
};
export const getAllTeam = async (workspace) => {
    const teams = await Team.find({
        'workspace': workspace._id
    });
    return teams;
};

export const updateTeam = async (name, workspace, updatedData) => {
    const updatedTeam = await Space.findOneAndUpdate({
        name,
        workspace: workspace._id
    },
    { $set: updatedData },
    { new: true }
    );

    if (!updateTeam) {
        const error = new Error("Failed to update team");
        error.statusCode = 500;
        throw error;
    }
    return updateTeam;
};

export const findTeamByLinearId = async (linearTeamId, userId) => {
    const team = await Team.findOne({ linearTeamId , createdBy: userId});
    return team;
};