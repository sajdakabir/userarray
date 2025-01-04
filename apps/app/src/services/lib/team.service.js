import { Team } from "../../models/lib/team.model.js";

export const createTeam = async (teamData, workspace) => {
    const { linearTeamId } = teamData;
    const team = await Team.create(teamData);
    if (!team) {
        const error = new Error("Failed to create the team");
        error.statusCode = 500;
        throw error;
    }
    workspace.teams.push(team._id);
    workspace.integration.linear.teamId = linearTeamId;
    await workspace.save();
    return team;
};
export const getAllTeam = async (workspace) => {
    const teams = await Team.find({
        'workspace': workspace._id
    });
    return teams;
};